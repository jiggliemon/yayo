var template = require('text!tmpl/simple.tmpl')

var template = require(['text!tmpl/simple.tmpl'],function (template) {
  console.log(template)
})
var Tmpl = require('yate')

//console.log(new Template(template))
