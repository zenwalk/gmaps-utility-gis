(function(){var a = a || {}, b = {};
b.configKey = "defaultValue";
function c() {
  this.myProp = "myProp_Default"
}
c.prototype.myMethod = function(d) {
  alert("msg is " + ("myConfig:" + b.configKey + " json  " + d.myVeryLongJSONProperty.anotherJSONProperty + "  myProp:" + this.myProp))
};
c.prototype.myUnusedMethod = function() {
  alert("msg is unused method")
};
window.myns = a;
a.MyClass = c;
a.MyEnum = {ONE:1, TWO:2, THREE:3};
a.MyConfig = b;})()
