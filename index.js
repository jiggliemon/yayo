var Router = require('./router')
var Layout = require('./layout')
var lodash = require('lodash')
var fs = require('fs')

// utils
var extend = lodash.extend


 
function Yayo (root, options) {
  this.root(root)
  //this.router = new Router
  this.options({
     activeFile: "app/etc/modules"
    ,modulesDir: "app/modules" 
  }, options)
  this.router = new Router(this)

  //this.initializeModules()
  this.initializeRoutes()
  
}

Yayo.prototype = {
   process: function ( req, res ) {
  }

  ,root: function ( path ) {
    if ( path ) {
      this.setDir('root', path)
    }
    return this.dirs.root
  }

  ,getDir: function ( key ) {
    this.dirs = this.dirs || {}
    return this.dirs[key]
  }

  ,setDir: function ( key, path ) {
    this.dirs = this.dirs || {}
    this.dirs[key] = path
  }

  /**
   *
   *
   */
  ,initializeModules: function () {
  }
  
  /**
   *
   *
   */
  ,initializeRoutes: function (routes) {
    // 1. Find the route files from their respective module directories
    // 2. Decypher the route statement 
        // ex: `module::controller#method` => {
        //   module: 'module', 
        //   controller: 'the controller',
        //   method: 'method name'
        //   fn: 'method reference'
        // }
    // 3. Apply

    var modules = this.fetchModules()
    console.log(modules)
    // var modules = this.getModules()
    // var self = this
    // var routes = this.getRoutes(modules)
    // console.log(routes)
    // if ( routes ) {
    //   for (var method in routes ) {
    //     var routeMethods = routes[method]
    //     for (var route in routeMethods) {

    //       var module = heyo.getModule(routeMethods[route].controller)
    //       var mod = require([module.location, 'controllers', routeMethods[route].controller].join('/') )

    //       self.router[method.toLowerCase()](route, function (req, res) {
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
      this.setModule()

    return key? activeModules[key] : activeModules
  }

  /**
   *
   *
   */
  ,fetchModules: function () {
    var args = Array.prototype.slice.call(arguments,0)
    var modules
    var self = this

    if ( !this.modules ) {
      var ledgerFile = [this.root(), this.opt('activeFile')].join('/')
      //var stats = fs.lstatSync(ledgerFile)
      //if (stats.isDirectory()) {
        var allModules = require(ledgerFile)
      //} else if ( stats.isFile() ) {
      //  var allModules = require()
      //}
      var activeModules = Object.keys(allModules)
        .filter(function ( module ) {
          return allModules[module]
        }).map(function ( module ) {
          var ret = {dir: '', controllers: [] }
          var type = typeof allModules[module]

          switch (type) {
            case 'boolean':
              return buildModuleFromKey(module, [self.root(), self.opt('modulesDir'), module ].join('/'))
              break
          }
        })
      modules = this.modules = activeModules
    } 

    return modules
  }
  
  /**
   *
   *
   */
  ,loadModuleRoutes: function () {

  }

  /**
   *
   *
   */
  ,setModule:  function (key, value, root) {
    var self = this
    var activeModules = this.activeModules = this.activeModules || {}

    if (typeof key == 'string' && value) {

      
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

function buildModuleFromKey ( key, location ) {
  var module,stat,stats,routes,dirs
  
  function getLocation (dir) {
    return [location,dir].join('/')
  }

  try {
    stat = fs.statSync(location)
    if ( stat.isDirectory() ) {

      dirs = {
        controllers: getLocation('controllers'),
        models: getLocation('models'),
        views: getLocation('views'),
        blocks: getLocation('blocks')
      }

      var routeStats = fs.statSync(getLocation('routes.json'))

      if ( routeStats.isFile() ) {
        routes = require(getLocation('routes.json'))
      }

      module = {
         name: key
        ,dir: location
        ,controllers: getDirContents(getLocation('controllers'))
        ,views: {}
        ,models: getDirContents(getLocation('models'))
        ,routes: routes
      }
      console.log(module)
    }
  } catch (e) {
    console.log(e)
  }
  return module
}

function getDirContents ( dir ) {
  var isDir = fs.existsSync(dir)
  var files = {}
  if ( isDir ) {
    var fileList = fs.readdirSync(dir)
    fileList.forEach(function ( fileOrDir ) {
      var file = [dir,fileOrDir].join('/')
      var exists = fs.existsSync(file)

      // Make sure we're dealing with JavaScript
      if (exists && ['js','json'].indexOf(getExtension(file)) !== -1 ) {
        files[fileOrDir] = require(file)
      }
    })
  }
  return files
}

function getExtension (path) {
  return (path.indexOf('.') !== -1)? String(path).split('.').pop(): ''
}

/* alias */
Yayo.prototype.option = Yayo.prototype.opt = Yayo.prototype.options

module.exports = Yayo
