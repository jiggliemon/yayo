var express = require('express')
  , http = require('http')
  , yayo = require('./lib/yayo')

var app = express();
var heyo = new yayo(__dirname)
var routes = heyo.getRoutes()
var modules = heyo.getModules()

// app.use(heyo)

app.configure(function(){
  app.set('port', process.env.PORT || 3000)
})

app.configure('development', function(){
  app.use(express.errorHandler())
})

// app.configure('production', function () {

// })

for (var method in routes ) {
  var routeMethods = routes[method]
  for (var route in routeMethods) {

    var module = heyo.getModule(routeMethods[route].controller)
    var mod = require([module.location, 'controllers', routeMethods[route].controller].join('/') )

    app[method.toLowerCase()](route, function (req, res) {
      mod[routeMethods[route].action].call(this, req, res, heyo)
    })
  }
}


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'))
})
