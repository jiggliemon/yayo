var fs = require('fs')
//console.log(connect())
function yayo (root, options) {
  this.__dir = root

  this.options({
     activeFile: 'app/etc/modules'
    ,modulesDir: "app/modules" 
  }, options)
  var activeModules = require(this.__dir +'/'+ this.options('activeFile'))
  this.setActiveModules(activeModules)

  console.log(this)
}


yayo.prototype = {
  
   getLayout: function () {

  }

  ,getModule: function (key) {
    this.activeModules = this.activeModules || {}
    return key? this.activeModules[key] : this.activeModules
  }

  ,setActiveModules:  function (key, value) {
    var self = this
      , activeModules = this.getModule()

    if (typeof key == 'string' && value) {
      var location = this.options('modulesDir') + '/' + key
      var stat = fs.statSync(location)
      if ( stat.isDirectory() ) {
        var module = {
          name: key, 
          location: location,
          stat: fs.statSync(location)
        }
        activeModules[key] = module
      }
    } else {
      for (var k in key) {
        if (key.hasOwnProperty(k) && key[k]) {
          self.setActiveModules(k, true)
        }
      }
    }
  }

  ,options: function (key) {
    var opts = this.opts = this.opts || {}
    if (typeof key == 'string') return opts[key]
    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[0]
      if (arg !== undefined) {
        for (var k in arg) {
          if (arg.hasOwnProperty(k)) {
            opts[k] = arg[k]
          }
        }
      }
    }
  }
}


module.exports = yayo