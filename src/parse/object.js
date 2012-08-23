var request = require('yaul/request')
var extend = require('yaul/extend')



var config = {
   base:"https://api.parse.com"
  ,version: 1
  ,appId: "4ZNjp3YLgS3atSEMRSPo0n2VVyTUFrHL0tzjcpuF"
  ,jsKey: "MpYTqte6XuxDpmYF2CHlfnh6iBX8i7xXL0Lhn3ZK"
}

function parseRequest (method, name, data, callback) {
  method = ( typeof method === 'string' )? method.toUpperCase(): 'GET'

  if ( typeof callback !== 'function' && 
       typeof arguments[arguments.length -1] === 'function' ) {
    callback = arguments[arguments.length -1]
  }

  data = ( typeof data !== 'object' ) ? data: {}

  var payload = extend({
     _ApplicationId: config.appId
    ,_JavaScriptKey: config.jsKey
    ,_method: method
  }, data)

  request('POST', [config.base,config.version,'classes',name].join('/'),JSON.stringify(payload), callback)
}

var ParseObjProto = {
   __data: {}

  ,set: function ( key, value ) {
    if (typeof key !== 'string' ) {
      throw new Error('ParseObj#set must be provided a string for the first argument') 
    }
  }

  ,setData: function (data) {
    switch (typeof data) {
      case 'string':
        this.set(data, arguments[1])
        break;
      default:
      case 'object':
        for ( var key in data ) {
          if ( data.hasOwnProperty( key ) ) {
            this.set(key, data[key])
          }
        }
        break;
    }
  }

  ,retrieve: function () {

  }

  ,save: function ( callback ) {
    if (this.getData('id') !== undefined) {
      return this.update(callback)
    }

  }

  ,update: function ( callback ) {

  }
}

function ParseObject ( key, methods ) {

  function ParseObj ( data ) {
    var self = this

    self.key = key
    self.uri = [config.base, config.version, 'classes',key].join('/')

    extend(self, methods)
    self.initialize && self.initialize.apply(self, arguments)
  }

  ParseObj.prototype = ParseObjProto

  return ParseObj
}

ParseObject.request = parseRequest
module.exports = ParseObject