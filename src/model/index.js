var ModelMixin = require('./mixin')

var Model = function (key, data) {
  if ( typeof key === 'string') {
    this.key = key
  } else 
  if ( typeof data === 'object' ) {
    re
  }

}

Model.prototype = extend({
  initialize: function (data) {
    this.setData(data)
  }
},ModelMixin)
