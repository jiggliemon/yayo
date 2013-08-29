"use strict";
// `ctor` and `inherits` are from Backbone (with some modifications):
// http://documentcloud.github.com/backbone/
function extend ( parent ) {
  var args = Array.prototype.slice.call(arguments, 1)
  args.forEach(function ( thing ) {
    for ( var k in thing ) {
      if ( thing.hasOwnProperty(k) ) {
        parent[k] = thing[k]
      }
    }
  })
  return parent
}

// Shared empty constructor function to aid in prototype-chain creation.
var ctor = function () {};

// Helper function to correctly set up the prototype chain, for subclasses.
// Similar to `goog.inherits`, but uses a hash of prototype properties and
// class properties to be extended.
var inherits = function (parent, protoProps, staticProps) {
    var child;
    
    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call `super()`.
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
        child = protoProps.constructor;
    } else {
        child = function () { return parent.apply(this, arguments); };
    }
    
    // Inherit class (static) properties from parent.
    extend(child, parent);
    
    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    
    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) extend(child.prototype, protoProps);
    
    // Add static properties to the constructor function, if supplied.
    if (staticProps) extend(child, staticProps);
    
    // Correctly set child's `prototype.constructor`.
    child.prototype.constructor = child;
    
    // Set a convenience property in case the parent's prototype is needed later.
    child.__super__ = parent.prototype;
    
    return child;
};

// Self-propagating extend function.
// Create a new class that inherits from the class found in the `this` context object.
// This function is meant to be called in the context of a constructor function.
module.exports = function create (protoProps, staticProps) {
    var child = inherits(this, protoProps, staticProps);
    child.create = create
    return child;
}
