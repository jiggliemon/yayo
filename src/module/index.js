
var ModuleMixin = require('./mixin')
var TemplateMixin = require('yate/mixin')
var BlockMixin = require('blocks/block/mixin')
var EventsMixin = require('yeah/mixin')
var typeOf = require('yaul/typeOf')
var hasOwn = require('yaul/hasOwn')
var extend = require('yaul/extend')

function implement (key, value, retain, undef){
  var k
  if (key === undef) {
    return
  }

  if (typeOf(key,'object')) {
    for ( k in key ) {
      if (hasOwn(key,k)) {    
        implement.call(this,k, key[k])
      }
    }  
    return;
  }

  this[key] = typeOf( value, 'function') ? (retain) ? value : wrap(this, key, value) : value
  
  return this
}

function wrap (self, key, method){
  function wrapper () {
    var caller = this.caller 
    var current = this.$caller
    var result

    this.caller = current 
    this.$caller = wrapper
    result = method.apply(this, arguments)
    this.$caller = current
    this.caller = caller
    
    return result
  }

  wrapper.$parent = self[key]
  wrapper.$name = key
    
  return wrapper
}


/** @constructor */
function Mod (methods) {
  methods = methods || {}
  function Module () {
    implement.call(this,methods)
    // console.log(methods)
    this.initialize && this.initialize.apply(this, arguments)
  }

  Module.prototype = extend({
    defaults: {
      onReady: ['template:ready', function blockReady () {
        var self = this
        self.ready = true
        self.setContext(self.options.context)
        self.bindTemplate()
        self.fillContainer()
      }]
    }

    /**
     *
     *
     */
    ,initialize: function (options) {
      var self = this
      options = self.options = extend(self.defaults,options)
      self.readyReady()
    
      if (options.attachEvents) {
        self.attachEvents = options.attachEvents
      }

      self.setChildren( options.children )
      self.setContainer( options.container )
      self.setTemplate( options.template )
    }
    /**
     *
     *
     */
    ,parent: function (){
      var name = this.$caller.$name
      var parent = this.$caller.$parent
      if (!parent) {
        throw new Error('The method "' + name + '" has no parent.')
      }
      
      return parent.apply(this, arguments)
    }
  }, methods, ModuleMixin, BlockMixin, TemplateMixin, EventsMixin )

  return Module
}

module.exports = Mod

