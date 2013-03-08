
var legalPlacements = {'top':1,'bottom':1,'before':1,'after':1}

function block (name,options) {
  var blocks = this._blocks = this._blocks || []
  var blockMap = this._map = this._map || {}
  var data = this._data = this._data || {}
}

block.prototype = {
   get: function (key) {

  }

  ,set: function (key, value) {

  }

  ,addModel: function (model) {
    this.model = model
  }

  /**
   * Returns the block instance with a name property that matches
   * the argument provided
   * @param name {string} A reference to child block
   * @returns block
   */
  ,reference: function (name) {
    var blocks = this._map
    if (typeof name == 'string') {
      var block = blocks[name]
      if (!block) {
        throw new Error('The block reference `'+name+'` wasn\'t found')
      }
      return blocks[name]
    } else {
      throw new Error('block#reference requires a string argument.' )
    }
  }



  /**
   *
   */
  ,getBlock: function (name) {
    var blocks = this._blocks
    return blocks[name]
  }

  /**
   * Adds a block to it's children.
   *
   * @param block {block} An instance of a block
   * @param where {string} Where to position: 'top' | 'bottom' | 'before' | 'after'
   * @param reference {block | string} This will refrence another child for `before` or `after`
   * @returns this
   */
  ,setBlock: function ( block, where, reference ) {
    var blocks = this._blocks
    
    if (typeof reference == 'string') {
      reference = this.reference(reference)
    }

    // this will speedup lookups by key
    if (block.name) {
      this.map[block.name] = block
    }

    // Maybe break this out to several 
    // convenience methods?
    // before, after, and top are pretty damn similar
    switch (where) {
      case 'before': 
        var index = blocks.indexOf(reference)
        blocks.splice(index, 0, block)
        break

      case 'after':
        var index = blocks.indexOf(reference)
        blocks.splice(index+1, 0, block)
        break

      case 'top': 
        blocks.splice(0,0,block)
        break

      default:
      case: 'bottom':
        blocks.push(block)
    }
  }

  ,removeBlock: function () {
    
  }
}

block.prototype.addBlock = block.prototype.setBlock

block.create = function () {}

module.exports = block