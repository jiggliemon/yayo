var assert = require('assert')
var Router = require('../router')
var server = require('./support/server')
var http = require('http')

describe('Router', function () {
  var router = new Router()
  before(function () {
    server.start(router, 3333)
  })

  after(function () {
    server.stop()
  })

  it ('should construct, and return an instance of the router', function () {
    var router = new Router()
    assert.ok(router instanceof Router)
  })

  describe('#route', function () {
    it('should route a request', function (done) {
      router.get('/something/:name', function (req, res) {
        console.log(req.params.name)
        res.end(req.params.name)
      })

      http.get('http://localhost:3333/something/hello', function (res) {
        done()
      })
    })

  })
})