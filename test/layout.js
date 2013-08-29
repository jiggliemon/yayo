// Local modules
var Layout = require("../Layout")
var block = require("../block")

// Native
var assert = require('assert')

describe('Layout', function () {

	var layout
	beforeEach(function () {
		layout = new Layout
	})

	describe('Layout#constructor', function () {
		
		it ('should return a `Layout` instance', function () {
			assert.ok(layout instanceof Layout)
		})

	})

	describe('Layout#create', function () {
		var Constructor = Layout.create()
		it('should return a function that constructs into a Layout instance', function () {
			assert.ok(new Constructor instanceof Layout)
		})
	})

	describe('#addChild', function () {
		
		it('should add a child block to a referenced parent', function () {
			var zeeBlock = new block({name: 'some.child'})
			layout.addChild('root', zeeBlock)
			assert.equal(layout.reference('some.child'), zeeBlock)
		})

		it('should add a block to the root if no reference is passed', function () {
			var blockYo = new block({name:"blurg"})
			layout.addChild(blockYo)
			assert.equal(layout.root.children.length, 1)
		})

	})

	describe('#removeChild', function () {

		it('', function () {

		})

	})

	describe('#reference', function () {

			it('should return a block using a the blocks `name` property for a reference', function () {
				var thing = new block({name: 'thing'})
				layout.addChild('root', thing)
				assert.equal(layout.reference('thing'), thing)
			})

	})

})