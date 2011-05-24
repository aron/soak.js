var inherit = require('inheritance').inherit,
    mixin   = require('inheritance').mixin,
    assert  = require('assert'),
    vows    = require('vows');

function MyObject() {
  this.property = 'property';
}
MyObject.prototype.method1 = function () { return 'method1'; };
MyObject.prototype.method2 = function () { return 'method2'; };

vows.describe('inheritance').addBatch({
  'inherit()': {
    'it should create a new constructor with the parent': function () {
      var SubObject = inherit(MyObject),
          subInstance = new SubObject();

      assert.instanceOf(subInstance, MyObject);
      assert.equal(subInstance.property, 'property');
      assert.isFunction(subInstance.method1);
    },
    'it should mixin the constructor with instance methods': function () {
      var SubObject = inherit(MyObject, {
        method3: function () {}
      }), subInstance = new SubObject();

      assert.isFunction(subInstance.method3);
    },
    'it should allow a constructor function to be provided': function () {
      var SubObject = inherit(MyObject, {
        constructor: function MyConstructor() {
          MyObject.call(this, arguments);
          this.property2 = 'property2';
        },
        method3: function () {}
      }), subInstance = new SubObject();

      assert.equal(subInstance.property2, 'property2');
      assert.isFunction(subInstance.method3);
    },
    'it should provide a __super__ property to point to its parent': function () {
      var SubObject = inherit(MyObject, {
        constructor: function MyConstructor() {
          this.__super__.constructor.call(this, arguments);
        },
        method1: function () {
           return 'mixined: ' + this.__super__.method1.call(this, arguments);
        }
      }), subInstance = new SubObject();

      assert.equal(subInstance.method1(), 'mixined: method1');
    }
  },
  'mixin()': {
    'it should mixin the first object with the second': function () {
      assert.deepEqual(mixin({a: 1}, {b: 2}), {a: 1, b: 2});
    },
    'it should accept n arguments': function () {
      assert.deepEqual(mixin(
        {a: 1}, {b: 2, c: 3}, {d: 4}, {e: 5}),
        {a: 1, b: 2, c: 3, d: 4, e: 5}
      );
    },
    'it should return the first argument': function () {
      var first = {};
      assert.strictEqual(mixin(first, {b: 2}), first);
    }
  }
}).export(module);
