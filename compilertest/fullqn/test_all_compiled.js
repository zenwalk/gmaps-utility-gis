function b(a) {
  c("inside MyUtil.usedPublicMethod;" + a)
}
function c(a) {
  var d = document.getElementById("map_canvas");
  if(d) {
    d.innerHTML += "<br/>" + a
  }
}
var e = "defaultConfigValue";
function f() {
  this.myPublicProperty = "MyClass.myPublicProperty_Default";
  this.a = "MyClass.myPrivateProperty_Default"
}
;window.onload = function() {
  var a = new f;
  alert("expected myPublicProperty_Default:" + a.myPublicProperty);
  a.myPublicProperty = "newProp";
  e = "newValue";
  c("MyClass.prototype.usedPublicMethod");
  c("inside MyClass.prototype.myPrivateMethod_");
  b("myConfig:" + e + " json  " + {myVeryLongJSONProperty:{anotherJSONProperty:"myVeryLongJSONProperty -- anotherJSONProperty"}}.myVeryLongJSONProperty.anotherJSONProperty + "  myProp:" + a.myPublicProperty);
  alert("expected myns.MyEnum.TWO=2:2");
  b("app calling myns.MyUtil.usedPublicMethod")
};
