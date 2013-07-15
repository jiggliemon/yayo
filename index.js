var Router = require('./router')
var fs = require('fs')
 
function Yayo (root, options) {
  this.root(root)
  //this.router = new Router
  this.options({
     activeFile: "/app/etc/modules"
    ,modulesDir: "/app/modules" 
  }, options)

  //this.initializeModules()
  this.initializeRoutes()
  
}

Yayo.prototype = {
   process: function (req, res) {
    console.log(this.activeModules)
  }

  ,root: function (path) {
    if (path) {
      this.setDir('root', path)
    }
    return this.dirs.root
  }

  ,getDir: function (key) {
    this.dirs = this.dirs || {}
    return this.dirs[key]
  }

  ,setDir: function (key, path) {
    this.dirs = this.dirs || {}
    this.dirs[key] = path
  }

  /**
   *
   *
   */
  ,initializeModules: function () {
    //console.log(this.getModules())  
  }
  
  /**
   *
   *
   */
  ,initializeRoutes: function (routes) {
    var modules = this.getModules()
    
    //console.log(modules)
    // if (routes) {
    //   for (var method in routes ) {
    //     var routeMethods = routes[method]
    //     for (var route in routeMethods) {

    //       var module = heyo.getModule(routeMethods[route].controller)
    //       var mod = require([module.location, 'controllers', routeMethods[route].controller].join('/') )

    //       app[method.toLowerCase()](route, function (req, res) {
    //         mod[routeMethods[route].action].call(this, req, res, heyo)
    //       })
    //     }
    //   }
    // }
  }
  
  /**
   *
   *
   */
  ,getModule: function (key) {

    var activeModules = this.activeModules = this.activeModules ? 
      this.activeModules : 
      this.setModule(require(this.root() + this.options('activeFile')))

    return key? activeModules[key] : activeModules
  }

  /**
   *
   *
   */
  ,getModules: function () {
    var args = Array.prototype.slice.call(arguments,0)
    var modules

    if (args.length) {
      modules = {}
      args.forEach(function(module) {
        modules[module] = this.getModule(module)
      })
    }

    
    return modules || this.activeModules || this.getModule()
  }
  
  /**
   *
   *
   */
  ,setModule:  function (key, value, root) {
    var self = this
    var activeModules = this.activeModules = this.activeModules || {}

    if (typeof key == 'string' && value) {

      var location = this.root() + this.options('modulesDir') + '/' + key
      var stat = fs.statSync(location)

      if ( stat.isDirectory() ) {
        var routes = require(location+'/routes')
        var module = {
           name: key
          ,location: location
          ,controllers: {}
          ,views: {}
          ,models:{}
          ,routes:routes
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
    var i = 0
    var arg = arguments[0]
    var k

    if ( typeof key == 'string') {
      return opts[key]
    }

    if ( !key ) {
      return opts
    }

    for (; i < arguments.length; i++) {
      if (arg !== undefined) {
        for (k in arg) {
          if (arg.hasOwnProperty(k)) {
            opts[k] = arg[k]
          }
        }
      }
    }

  }

  /**
   *
   *
   */
  ,load: function (what) {
    var controller, handler

    var module = this.getModule(what.module)
    if (module && module.controllers[what.controller]) {
      var controller = module.controllers[what.controller]
    }
  }

}

/* alias */
Yayo.prototype.option = Yayo.prototype.options

module.exports = Yayo
