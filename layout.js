var block = require('./block')
var yeah = require('yeah')
var util = require('./util')


/**
 *
 *  A block can only be assigned to 1-layout
 *  A a block name must be unique
 *
 */
function Layout () {
  var root = this.root = new block({name:'root'})
  this.map =  {
    root: root
  }
}

Layout.prototype = util.protoify({

  /**
   *
   *
   */
  removeChild: function ( reference, block ) {

  },

  /**
   *
   *
   */
  addChild: function ( reference, block ) {
    // Little safety here
    if (arguments.length == 1) {
      block = reference
      reference = "root"
    }

    var parent = this.reference(reference)
    parent && parent.setBlock(block)
    
    block.parent = parent
    block.layout = this

    if (block.name) {
      this.map[block.name] = block
    }

    return this
  },

  /**
   *
   * todo: Should be queryable. 
   */
  hasChild: function ( name ) {
    return Boolean(this.reference(name))
  },

  /**
   *
   *
   */
  reference: function ( name ) {
    return this.map[name]
  }
}, yeah.prototype)

Layout.create = util.create

module.exports = Layout
