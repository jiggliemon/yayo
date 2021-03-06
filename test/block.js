var block = require('../block')


var assert = require('assert')

describe ('block', function () {
  
  var Construct, constructInstance 
  beforeEach(function () {
    Construct = block.create('Constructor', {
      "template": "<h1>Hello</h1>"
    })
    constructInstance = new Construct
  })


  describe('block.create', function () {

    it('should return a function that constructs a block instance', function () {
      assert.equal('function', typeof Construct)
    })

    it('the returned function should return a block instance when initialized', function () {
      var keys = Object.keys(block.prototype)
      assert.ok(keys.every(function (thing) {
        return constructInstance[thing] !== undefined
      }))
    })

  })

  // Curious if this should be a lodash instance or native array.
  // I lean towards a native array. Perhaps we extend this with
  // only the array methods?
  // describe('block#chidren', function () {
  // })

  describe('block#reference', function () {
    it('should reference a child block by name when present.', function () {
      var SomeBlock = block.create('SomeBlock')
      var parent = new Construct
      var child = new SomeBlock({ name: 'kid' })

      parent.setBlock(child)

      assert.equal(child, parent.reference('kid'))
    })
  })

  describe('block#setBlock', function () {
    it('should add a block to the `children` property', function () {
      constructInstance.setBlock(new block({
        name: 'yeah bro'
      }))
      assert.equal(constructInstance.children.length, 1)
    })

    it('should add a reference in the block map if the block passed contains a `name` property', function () {
      var blerk = new block({name: 'hello'})
      constructInstance.setBlock(blerk)
      assert.ok(constructInstance.reference('hello') == blerk)
    })
  })

  describe('block#getBlock', function () {

  })



  describe('block#toString', function () {
    it('should render `"No Template" if no template provided.', function () {
      var instance = new block
      assert.equal(instance.toString(), 'No Template')
    })

    it('should render "Hello There"', function () {
      var instance = new block({
        template: "Hello <%=this.getBlock('kid') %>"
      }).setBlock(new block({
        name:'kid',
        template: "There"
      }))

      assert.equal("Hello There", instance.toString())
    })
  })



})