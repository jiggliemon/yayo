var hasLocalStorage = ("localStorage" in window)
var make = require('yaul/make')

var ModelMixin = {

   get: function () {
    var data = make(this, '__data', {})
  }
  
  ,set: function () {
    var data = make(this, '__data', {})
  }

  ,getData: function () {
    var data = make(this, '__data', {})
  }
  
  ,setData: function () {
    var data = make(this, '__data', {})
  }
}