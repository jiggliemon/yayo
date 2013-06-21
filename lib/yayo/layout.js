function layout(root) {
    this._map = {
        "root": root || new block('root')
    }
}

layout.prototype = {

    /**
     *
     */
    reference: function (key) {
        return this._map[key]
    },

    /**
     *
     */
    addBlock: function (parent, child, where) {
        if (typeof parent == 'string') {
            parent = this.reference(parent)
            if (!parent) {
                throw new Error(ErrorMsgs["parent_no_existy"])
            }
        }
        if (child.name) {
            if (!this._map[child.name]) {
                this._map[child.name] = child
            } else {
                throw new Error(ErrorMsgs['duplicate_name'] + child.name)
            }
        }
        child.parent = parent
        parent.setBlock(child, where)
    },
    
    /**
     *
     */
    removeBlock: function (key) {
        this._map
    }
}

module.exports = layout