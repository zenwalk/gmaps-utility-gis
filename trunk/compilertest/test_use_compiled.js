(function(){var a = a || {};
window.i = a;
a.b = function() {
  this.a = "myProp_Default"
};
a.c = {g:1, d:2, h:3};window.onload = function() {
  var b = new a.b;
  alert(b.a);
  b.a = "newProp";
  alert("msg is " + ("json  " + {f:{e:"myVeryLongJSONProperty.anotherJSONProperty"}}.f.e + "  myProp:" + b.a));
  alert(a.c.d)
};})()
