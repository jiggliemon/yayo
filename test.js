var http = require('http')
var connect = require('connect')

var app = connect()

app.use('/', function (req, res, next) {
  console.log(req.params)
  next()
})
http.createServer(app).listen(3000, function () {
  console.log('created a server at 3000')
})