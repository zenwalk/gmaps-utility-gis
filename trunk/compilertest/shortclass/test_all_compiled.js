var b = {};
b.a = function(a) {
  c("inside MyUtil.usedPublicMethod;" + a)
};
b.d = function() {
  c("MyUtil.privateMethod")
};
b.b = function() {
  c("MyUtil.unuseMethod")
};
function c(a) {
  var d = document.getElementById("map_canvas");
  if(d) {
    d.innerHTML += "<br/>" + a
  }
}
var e = {configKey:"defaultConfigValue"};
function f() {
  this.myPublicProperty = "MyClass.myPublicProperty_Default";
  this.c = "MyClass.myPrivateProperty_Default"
}
f.prototype.a = function(a) {
  c("MyClass.prototype.usedPublicMethod");
  g(this, a)
};
function g(a, d) {
  c("inside MyClass.prototype.myPrivateMethod_");
  b.a("myConfig:" + e.configKey + " json  " + d.myVeryLongJSONProperty.anotherJSONProperty + "  myProp:" + a.myPublicProperty)
}
f.prototype.b = function(a) {
  c("inside MyClass.prototype.unusedPublicMethod");
  g(this, a)
};
var h = {ONE:1, TWO:2, THREE:3};window.onload = function() {
  var a = new f;
  alert("expected myPublicProperty_Default:" + a.myPublicProperty);
  a.myPublicProperty = "newProp";
  e.configKey = "newValue";
  a.a({myVeryLongJSONProperty:{anotherJSONProperty:"myVeryLongJSONProperty -- anotherJSONProperty"}});
  alert("expected myns.MyEnum.TWO=2:" + h.TWO);
  b.a("app calling myns.MyUtil.usedPublicMethod")
};
