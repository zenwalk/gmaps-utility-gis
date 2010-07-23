(function(){var a = a || {}, b = {};
b.configKey = "defaultValue";
function c() {
  this.myProp = "myProp_Default"
}
c.prototype.a = function(e) {
  alert("msg is " + ("myConfig:" + b.configKey + " json  " + e.myVeryLongJSONProperty.anotherJSONProperty + "  myProp:" + this.myProp))
};
c.prototype.b = function() {
  alert("msg is unused method")
};
var MyEnum = {ONE:1, TWO:2, THREE:3};
window.f = a;
a.c = c;
a.e = MyEnum;
a.d = b;
window.myns = a;
a.MyClass = c;
var d = c.prototype;
d.myMethod = d.a;
d.myUnusedMethod = d.b;
a.MyEnum = MyEnum;
a.MyConfig = b;})()
