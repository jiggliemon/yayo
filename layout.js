var block = require('./block')
var create = require('./create')

function Layout () {
  var root = this.root = new block({name:'root'})
  this.map =  {
    root: root
  }
}

Layout.prototype = {

  /**
   *
   *
   */
  removeChild: function ( reference, block ) {

  },

  /**
   *
   *
   */
  addChild: function ( reference, block ) {
    var parent = this.reference(reference)
    parent && parent.setBlock(block)

    if (block.name) {
      this.map[block.name] = block
    }

    return this
  },

  /**
   *
   *
   */
  hasChild: function ( name ) {
    var child = this.reference(name)
    
  },

  /**
   *
   *
   */
  reference: function ( name ) {
    return this.map[name]
  }
}

Layout.create = create

module.exports = Layout