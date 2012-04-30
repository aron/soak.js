var inherit = require('soak').inherit,
    create  = require('soak').create,
    mixin   = require('soak').mixin,
    assert  = require('assert'),
    vows    = require('vows');

function MyObject() {
  this.property = 'property';
}
MyObject.static1 = function () { return 'static1'; };
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
    'it should allow any number of levels of inheritance': function () {
      var FirstSubObject  = inherit(MyObject),
          SecondSubObject = inherit(FirstSubObject),
          ThirdSubObject  = inherit(SecondSubObject),
          subInstance = new ThirdSubObject();

      assert.instanceOf(subInstance, MyObject);
      assert.instanceOf(subInstance, FirstSubObject);
      assert.instanceOf(subInstance, SecondSubObject);
      assert.instanceOf(subInstance, ThirdSubObject);
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
    'it should copy over (static) properties from the parent': function () {
      var SubObject = inherit(MyObject);
      assert.isFunction(SubObject.static1);
    },
    'it should provide a static __super__ property to point to its parent': function () {
      var SubObject = inherit(MyObject, {
        constructor: function MyConstructor() {
          SubObject.__super__.constructor.call(this, arguments);
        },
        method1: function () {
          return 'mixined: ' + SubObject.__super__.method1.call(this, arguments);
        }
      }), subInstance = new SubObject();

      assert.equal(subInstance.method1(), 'mixined: method1');
    }
  },
  'Base()': {
    'it should have an extend method': function () {
      var Base = inherit.constructor(Object);
      assert.isFunction(Base.extend);
    },
    'it should have an extend method that creates a child constructor': function () {
      var Base = inherit.constructor(Object),
          Child = Base.extend();

      assert.instanceOf(new Child(), Base);
    }
  },
  'create()': {
    'it should create an an object with the first argument as it\'s prototype': function () {
      var parent = {a: 1, b: 2, c: 3},
          instance = create(parent);

      assert.equal(instance.a, parent.a);
      assert.equal(instance.b, parent.b);
      assert.equal(instance.c, parent.c);
    },
    'it should support browsers without Object.create()': function () {
      Object.create = undefined;

      var parent = {a: 1, b: 2, c: 3},
          instance = create(parent);

      assert.equal(instance.a, parent.a);
      assert.equal(instance.b, parent.b);
      assert.equal(instance.c, parent.c);
    },
    'it should return a plain object if non object is passed': function () {
      assert.deepEqual(create(), {});
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
    },
    'it should only modify the first argument': function () {
      var a = {a: 1},
          b = {b: 2},
          c = {c: 3};

      mixin(a, b, c);
      assert.deepEqual(a, {a: 1, b: 2, c: 3});
      assert.deepEqual(b, {b: 2});
      assert.deepEqual(c, {c: 3});
    }
  }
}).export(module);
