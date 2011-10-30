Inheritance.js
==============

Provides two simple methods for working with inheritance and objects. This
library is heavily influenced by the simplistic prototypal inheritance
provided in both [CoffeeScript][] and [Backbone][] and simply exists so that
it can be included in other libraries.

[CoffeeScript]: http://jashkenas.github.com/coffee-script/
[Backbone]: http://documentcloud.github.com/backbone/

inherit(Parent, methods, properties)
------------------------------------

Creates a new constructor function that inherits from a parent constructor.
Instance and static methods can also be provided as additional arguments, if the
`methods` argument has a property called __constructor__ this will be
used as the constructor function.

### Arguments

 - `parent`: A constructor Function to inherit from.
 - `methods`: An Object literal of instance methods that are added to the
    constructors prototype (optional).
 - `properties` - An Object literal of static/class methods to add to the
   constructor itself (optional).

### Examples

```javascript
// Original function to inherit from.
function MyObject() {};

var SubClass = inherit(MyObject, {
  instanceMethod: function () {}
}, {
  staticProp: 'some-string',
  staticMethod: function () {}
});

var instance = new SubClass();
instance instanceof MyObject   //=> true
typeof instance.instanceMethod //=> "function"
typeof SubClass.staticMethod   //=> "function"
```

A `__super__` property is made available to all child classes that points to
the parent `prototype` object. This can be used in methods to call the parent.

```javascript
// Original function to inherit from.
function MyObject() {};
MyObject.prototype.say = function () { return 'Hello'; }

var SubClass = inherit(MyObject, {
  constructor: function SubClass() {
    SubClass.apply(this, arguments);
    // Set up other properties.
  },
  say: function () {
    return SubClass.__super__.say.apply(this, arguments) + ' World';
    // Same as:
    // return MyObject.prototype.say.apply(this, arguments) + ' World';
  }
});

(new SubClass()).say(); //=> 'Hello World'
```

mixin(target [ , arguments... ])
--------------------------------

Extends an object with the properties on successive arguments. Returns the
first argument. Properties will be copied from right to left with the right
overriding the left.

### Arguments

 - `target`: The object that is to be extended.
 - `arguments*`: Properties from all successive arguments will be copied to the target.

### Examples

```javascript
mixin({type: 'person'}, {name: 'bill', age: 20}, {age: 21});
//=> {type: 'person', name: 'bill', age: 21}
```

create(parent)
--------------

Creates a new object instance and sets it's internal prototype to the parent
argument provided. This is based on [Crockford's Object.create()][#create] but
will use the native `Object.create()` if present. Unlike Object.create() this
function will always return a new object even if a non object is provided as an
argument.

[#create]: http://javascript.crockford.com/prototypal.html

### Arguments

 - `parent`: An object to use for the new objects internal prototype.

### Examples

```javascript
var appleObject = {color: 'green'}
var appleInstance = create(appleObject);

appleInstance.hasOwnProperty('color'); //=> false
appleInstance.color === appleObject.color; //=> true
```

Development
-----------

Tests require [Node][] and [Vows][] to run. To install Vows
using [npm][] run:

    $ npm install vows

Then to run the tests simply enter:

    $ vows inheritance-test.js

[Node]: http://nodejs.org/
[Vows]: http://vowsjs.org/
[npm]:  http://npmjs.org/

License
-------

Released under the MIT license
