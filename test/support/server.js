var http = require('http')

exports.start = function ( router, port ) {
	this.server = http.createServer( function (req, res ) {
		res.end(router.route.apply(router, arguments))
	})
	this.server.listen(port || 3333)
	return this.server
}

exports.stop = function () {
	this.server.close()
}