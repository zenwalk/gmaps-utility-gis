(function(){var a = a || {};
function b() {
  this.myProp = "myProp_Default"
}
b.prototype.myMethod = function(c) {
  alert("json  " + c.myVeryLongJSONProperty.anotherJSONProperty + "  myProp:" + this.myProp)
};
b.prototype.myUnusedMethod = function() {
  alert("unused method")
};
window.myns = a;
a.MyClass = b;
a.MyEnum = {ONE:1, TWO:2, THREE:3};})()
