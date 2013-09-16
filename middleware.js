var yayo = require('./index.js')

module.exports = function (root, options) {
  var instance = new yayo(root,options)
  
  return function (req, res, next) {
    instance.process(req, res)
    next()
  }
}