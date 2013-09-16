"use strict"
var parse = require('url').parse
var Route = require('./route')

var methods = ["get","post","put","delete","patch"]

var Router = function ( app ) {
  var routes = this.routes = {}
  methods.forEach(function ( method ) {
    routes[method.toUpperCase()] = []
  })
  this.app = app
}

Router.prototype.route = function ( req, res, next ) {
  var self = this
  var route = match(req, this.routes)

  req.params = route.params
  route( req, res, this.app )
}


/**
 * Generates the `method` methods. routerInstance.get('/path', fn);
 * 
 *
 * @return Route
 * @api public
 */
methods.forEach(function (method) {
  var METHOD = method.toUpperCase()
  method = method.toLowerCase()
  Router.prototype[method] = function (path, fn) {
    var routes = this.routes[METHOD] = this.routes[METHOD] || []
    var route = new Route(METHOD, path, fn)
    routes.push(route)
    return route
  }
})

/**
 * Attempt to match the given request to
 * one of the routes. When successful
 * a route function is returned.
 *
 * @param  {ServerRequest} req
 * @param  {Object} routes
 * @return {Function}
 * @api private
 */
function match ( req, routes, i ) {
  var method = req.method
  var captures,route,fn,path,keys,j,len,key,val

  i = i || 0

  if ( 'HEAD' == method ) {
    method = 'GET'
  }

  routes = routes[method]

  if ( routes ) {
    var url = parse( req.url ) 
    var pathname = url.pathname

    for (; i < routes.length; ++i) {
      route = routes[i]
      fn = route.fn
      path = route.path
      keys = fn.keys = route.keys

      captures = path.exec(pathname)
      if ( captures ) {
        fn.method = method
        fn.params = []
        for (j = 1, len = captures.length; j < len; ++j) {
          key = keys[j-1];
          val = (typeof captures[j] === 'string') ? decodeURIComponent(captures[j]) : captures[j];
          if ( key ) {
            fn.params[key] = val;
          } else {
            fn.params.push(val);
          }
        }
        req._route_index = i;
        return fn;
      }
    }
  }
}



module.exports = Router

