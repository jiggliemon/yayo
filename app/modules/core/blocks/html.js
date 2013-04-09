
var block = require('blocks/block')
var html = block.create({
  template: "<%= this.blocks.join('') %>"
})

module.exports = html