var Module = require('yayo/module')
var template = require('text!../tmpl/simple.tmpl')
console.log(template)
var Simple = new Module({
  template: template

})

module.exports = Simple