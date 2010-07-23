(function(){var a = a || {};
function b() {
  this.myProp = "myProp_Default"
}
b.prototype.a = function(d) {
  alert("json  " + d.myVeryLongJSONProperty.anotherJSONProperty + "  myProp:" + this.myProp)
};
b.prototype.b = function() {
  alert("unused method")
};
var MyEnum = {ONE:1, TWO:2, THREE:3};
window.e = a;
a.c = b;
a.d = MyEnum;
window.myns = a;
a.MyClass = b;
var c = b.prototype;
c.myMethod = c.a;
c.myUnusedMethod = c.b;
a.MyEnum = MyEnum;})()
