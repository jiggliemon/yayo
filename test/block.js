var block = require('../block')
var assert = require('assert')

describe ('block', function () {
  
  describe('block.create', function () {

    it('should return a function', function () {

      var Constructor = block.create('Constructor', {

      })
      assert.equal('function', typeof Constructor)
    })
  
  })

})