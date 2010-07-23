(function(){var a = a || {}, b = {};
b.b = "defaultValue";
window.k = a;
a.c = function() {
  this.a = "myProp_Default"
};
a.e = {i:1, f:2, j:3};
a.d = b;window.onload = function() {
  var c = new a.c;
  alert(c.a);
  c.a = "newProp";
  a.d.b = "newValue";
  alert("msg is " + ("myConfig:" + b.b + " json  " + {h:{g:"myVeryLongJSONProperty.anotherJSONProperty"}}.h.g + "  myProp:" + c.a));
  alert(a.e.f)
};})()
