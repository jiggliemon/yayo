var Module = require('yayo/module')
var template = require('text!./tmpl/simple.tmpl')

var Simple = new Module({
   template: template
  ,model: ''
})

module.exports = Simple