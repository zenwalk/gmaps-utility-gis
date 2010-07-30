(function(){var a = window.i || {}, b = {};
b.show = function(d) {
  alert("msg is " + d)
};
var c = {configKey:"defaultConfigValue"};
function e() {
  this.myPublicProperty = "myPublicProperty_Default";
  this.h = "myPrivateProperty_Default"
}
e.prototype.a = function(d) {
  b.show("myConfig:" + c.configKey + " json  " + d.myVeryLongJSONProperty.anotherJSONProperty + "  myProp:" + this.myPublicProperty);
  alert("privateFn")
};
e.prototype.b = function() {
  b.show("unused method")
};
var MyEnum = {ONE:1, TWO:2, THREE:3};
function f() {
  this.myPublicProperty = "MyUnusedClass.myPublicProperty_default"
}
a.c = e;
a.e = MyEnum;
a.d = c;
a.f = f;
nyns.g = b;window.myns = a;
a.MyClass = e;
e.prototype.myPublicMethod = e.prototype.a;
e.prototype.myUnusedMethod = e.prototype.b;
a.MyEnum = MyEnum;
a.MyConfig = c;
a.MyUnusedClass = f;})()
