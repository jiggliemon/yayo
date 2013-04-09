var fs = require('fs')

function yayo (root, options) {

  // Ensure a yayo instance
  if (!(this instanceof yayo)) {
    return new yayo(root, options)
  }

  this.__dir = root+'/'

  this.options({
     activeFile: "app/etc/modules"
    ,modulesDir: "app/modules" 
  }, options)

  this.getModules()
  this.getRoutes()
}


yayo.prototype = {
  
  /**
   *
   *
   */
   getLayout: function () {

  }

  /**
   *
   *
   */
  ,getModule: function (key) {
    var activeModules = this.activeModules = this.activeModules ? 
      this.activeModules : 
      this.setModules(require(this.__dir + this.options('activeFile')))

    return key? activeModules[key] : activeModules
  }

  /**
   *
   *
   */
  ,setModule:  function (key, value, root) {
    var self = this
    var activeModules = this.activeModules = this.activeModules || {}

    if (typeof key == 'string' && value) {

      var location = this.options('modulesDir') + '/' + key
      var stat = fs.statSync(location)

      if ( stat.isDirectory() ) {
        var module = {
           name: key
          ,location: (root?root:this.__dir) + location
          //,stat: fs.statSync(location)
        }
        activeModules[key] = module
        
      }
    } else {
      for (var k in key) {
        if (key.hasOwnProperty(k) && key[k]) {
          self.setModule(k, true)
        }
      }
    }
    return activeModules
  }

  /**
   *
   *
   */
  ,getRoutes: function () {
    var activeModules = this.getModule()
    var routes = this.routes = this.routes || {}

    if (!this.routesLoaded) {
      for (var key in activeModules) {
        var moduleRoutesPath = activeModules[key].location + '/routes.json'
        
        // Check for existance of routes. dir or file
        var exists = ['.js','.json',''].some(function (el) {
          return fs.existsSync(moduleRoutesPath+el)
        })

        if (exists) {
          var stat = fs.statSync(moduleRoutesPath)
          
          if (stat.isFile()) {
            var moduleRoutes = require(moduleRoutesPath)

            // The Following will convert objects that look like:
            //     {'get /path/:id': {...}}
            // into:
            //     {GET: {
            //       '/path/:id':{...}
            //     }}
            // And will subsequently add them to the global routes
            // state property.
            for (var path in moduleRoutes) {
              var ogKey = path
              var method = 'GET'
              var moduleRoute = {}
              if (path.indexOf(' ') !== -1) {

                path = path.split(' ')
                method = path[0].toUpperCase()
                path = path[1].toLowerCase()
                moduleRoute[path] = moduleRoutes[ogKey]
              }
              routes[method] = routes[method] || {}
              extend(routes[method],moduleRoute)
            }
            
          } /* else if (stat.isDirectory()) {
            // Load the directory contents?
          } */
        }
      }
      this.routesLoaded = true
    }

    return routes
  }

  /**
   *
   *
   */
  ,options: function (key) {
    var opts = this.opts = this.opts || {}
      , i = 0
      , arg = arguments[0]
      , k

    if ( typeof key == 'string') {
      return opts[key]
    }

    if ( !key ) {
      return opts
    }

    for (; i < arguments.length; i++) {
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

yayo.prototype.setModules = yayo.prototype.setModule
yayo.prototype.getModules = yayo.prototype.getModule

function extend (root) {
  var others = Array.prototype.slice.call(arguments, 1)
  for (var i = 0; i < others.length; i++) {
    var other = others[i]
    for (var key in other) {
      root[key] = other[key]
    }
  }
}

module.exports = yayo