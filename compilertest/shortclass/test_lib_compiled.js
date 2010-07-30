(function(){var a = window.i || {}, b = {};
b.a = function(c) {
  d("inside MyUtil.usedPublicMethod;" + c)
};
b.j = function() {
  d("MyUtil.privateMethod")
};
b.b = function() {
  d("MyUtil.unuseMethod")
};
function d(c) {
  var f = document.getElementById("map_canvas");
  if(f) {
    f.innerHTML += "<br/>" + c
  }
}
var e = {configKey:"defaultConfigValue"};
function g() {
  this.myPublicProperty = "MyClass.myPublicProperty_Default";
  this.h = "MyClass.myPrivateProperty_Default"
}
g.prototype.a = function(c) {
  d("MyClass.prototype.usedPublicMethod");
  h(this, c)
};
function h(c, f) {
  d("inside MyClass.prototype.myPrivateMethod_");
  b.a("myConfig:" + e.configKey + " json  " + f.myVeryLongJSONProperty.anotherJSONProperty + "  myProp:" + c.myPublicProperty)
}
g.prototype.b = function(c) {
  d("inside MyClass.prototype.unusedPublicMethod");
  h(this, c)
};
var MyEnum = {ONE:1, TWO:2, THREE:3};
function j() {
  this.myPublicProperty = "MyUnusedClass.myPublicProperty_default"
}
a.c = g;
a.e = MyEnum;
a.d = e;
a.f = j;
a.g = b;window.myns = a;
a.MyClass = g;
g.prototype.usedPublicMethod = g.prototype.a;
g.prototype.unusedPublicMethod = g.prototype.b;
a.MyUtil = b;
b.usedPublicMethod = b.a;
b.unusedPublicMethod = b.b;
a.MyUnusedClass = j;
a.MyEnum = MyEnum;
a.MyConfig = e;})()
