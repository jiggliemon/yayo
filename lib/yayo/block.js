
var legalPlacements = {'top':1,'bottom':1,'before':1,'after':1}

function block (name,options) {
  var blocks = this._blocks = this._blocks || []
  var blockMap = this._map = this._map || {}
  var data = this._data = this._data || {}
}

block.prototype = {

  initialize: function () {

  }

  ,get: function (key) {
    return this._data[key]
  }

  ,set: function (key, value) {
    this._data[key] = value
    return this
  }

  // Do we need this?  Should the block instance
  // be an extended model?
  ,setModel: function (model) {
    this.model = model
    return this
  }

  ,getModel: function () {
    return this.model
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
    }
  }

  /**
   *
   */
  ,getBlock: function (name) {
    return this._map[name]
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
    // before, after are pretty damn similar
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
        blocks.unshift(block)
        break

      default:
      case 'bottom':
        blocks.push(block)
    }
  }

  ,removeBlock: function () {
    
  }
}

// Because I always write addBlock.  Maybe this will have
// special magic behavior later. This way I can break 
// the API later and have something to argue about
block.prototype.addBlock = block.prototype.setBlock

// This will spawn a constructor.  Maybe not.
block.create = function (name, options, methods) {
  var b = function () {
    this.initialize.apply(this, arguments)
  }
  b.name = name
  b.prototype = extend(new block, methods)
  return b
}

module.exports = block
