var block = require('../block')
var assert = require('assert')

describe ('block', function () {
  
  var Construct;
  beforeEach(function () {
    Construct = block.create('Constructor', {
      "template": "<h1>Hello</h1>"
    })
  })

  describe('block.create', function () {
    
    it('should return a function', function () {
      assert.equal('function', typeof Construct)
    })
  
  })

  describe('block#chidren', function () {

  })

  describe('block#reference', function () {
    it('should reference a child block by name when present.', function () {
      var SomeBlock = block.create('SomeBlock')

      var parent = new Construct
      var child = new SomeBlock({name: 'kid'})

      parent.setBlock(child)

      assert.equal(child, parent.reference('kid'))
    })
  })

})