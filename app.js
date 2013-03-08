var express = require('express')
  , http = require('http')
  , yayo = require('./lib/yayo')

var app = express();
var y = new yayo(__dirname)

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
