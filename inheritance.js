/*  Inheritance.js - v0.1.x
 *  Copyright 2011, Aron Carroll
 *  Released under the MIT license
 *  More Information: http://github.com/aron/inheritance.js
 */
(function (exports) {

  var _inherit = exports.inherit,
      _create  = exports.create,
      _mixin   = exports.mixin;

  /* Public: Extends an object with the properties on successive arguments.
   *
   * target     - The Object that is to be extended.
   * arguments* - Objects to extend the target with.
   *
   * Examples
   *
   *   mixin({type: 'person'}, {name: 'bill', age: 20}, {age: 21});
   *   //=> {type: 'person', name: 'bill', age: 21}
   *
   * Returns the extended object.
   */
  function mixin() {
    var target  = arguments[0],
        objects = Array.prototype.slice.call(arguments, 1),
        count = objects.length,
        index = 0, object, property;

    for (; index < count; index += 1) {
      object = objects[index];
      for (property in object) {
        if (object.hasOwnProperty(property)) {
          target[property] = object[property];
        }
      }
    }

    return target;
  }
  exports.mixin = mixin;

  /* Removes the mixin function from the exports object and returns it. */
  exports.mixin.noConflict = function () {
    exports.mixin = _mixin;
    return this;
  };

  /* Used to create a new object in case calling the parent has side effects */
  function DummyObject() {}

  /* Public: Creates a new object that inherits from the proto argument.
   *
   * This function will use Object.create() if it exists otherwise falls back
   * to using a dummy constructor function to create a new object instance.
   * Unlike Object.create() this function will always return a new object even
   * if a non object is provided as an argument.
   *
   * proto - An object to use for the new objects internal prototype.
   *
   * Examples
   *
   *   var appleObject = {color: 'green'}
   *   var appleInstance = create(appleObject);
   *
   *   appleInstance.hasOwnProperty('color'); //=> false
   *   appleInstance.color === appleObject.color; //=> true
   *
   * Returns a newly created object.
   */
  function create(proto) {
    if (typeof proto !== 'object') {
      return {};
    }
    else if (Object.create) {
      return Object.create(proto);
    }
    DummyObject.prototype = proto;
    return new DummyObject();
  }
  exports.create = create;

  /* Removes the create function from the exports object and returns it. */
  exports.create.noConflict = function () {
    exports.create = _create;
    return create;
  };

  /* Public: Creates a new constructor function that inherits from a parent.
   * Instance and static methods can also be provided as additional arguments.
   * if the methods argument has a property called "constructor" this will be
   * used as the constructor function.
   *
   * parent     - A constructor Function to inherit from.
   * methods    - An Object literal of instance methods that are added to the
   *              constructors prototype.
   * properties - An Object literal of static/class methods to add to the
   *              constructor itself.
   *
   * Examples
   *
   *   function MyObject() {};
   *
   *   var SubClass = inherit(MyObject, {method: function () {}});
   *   var instance = new SubClass();
   *
   *   instance instanceof MyObject //=> true
   *
   * Returns the new constructor Function.
   */
  function inherit(parent, methods, properties) {
    methods = methods || {};

    var Child = methods.hasOwnProperty('constructor') ?
                methods.constructor : inherit.constructor(parent);

    Child.prototype = create(parent.prototype);
    Child.prototype.constructor = Child;

    delete methods.constructor;
    mixin(Child.prototype, methods, {__super__: parent.prototype});

    return mixin(Child, properties);
  }
  exports.inherit = inherit;

  /* Public: Creates a default constructor function that simply calls the
   * parent constructor on the current instance. This method can be overridden
   * to provide your own default constructor.
   *
   * parent - The parent constructor function.
   *
   * Returns a new default constructor function.
   */
  exports.inherit.constructor = function (parent) {
    return function Base() {
      parent.apply(this, arguments);
    };
  };

  /* Removes the inherit function from the exports object and returns it. */
  exports.inherit.noConflict = function () {
    exports.inherit = _inherit;
    return this;
  };

})(typeof exports !== 'undefined' ? exports : this);
