(function(){var c = this;
function e(a, d, b) {
  a = a.split(".");
  b = b || c;
  !(a[0] in b) && b.execScript && b.execScript("var " + a[0]);
  for(var h;a.length && (h = a.shift());) {
    if(!a.length && d !== undefined) {
      b[h] = d
    }else {
      b = b[h] ? b[h] : (b[h] = {})
    }
  }
}
;var f = {};
f.a = function(a) {
  g("inside MyUtil.usedPublicMethod;" + a)
};
f.f = function() {
  g("MyUtil.privateMethod")
};
f.b = function() {
  g(" MyUtil.unuseMethod")
};
function g(a) {
  var d = document.getElementById("map_canvas");
  if(d) {
    d.innerHTML += "<br/>" + a
  }
}
var i = {configKey:"defaultConfigValue"};
function j() {
  this.myPublicProperty = "MyClass.myPublicProperty_Default";
  this.d = "MyClass.myPrivateProperty_Default"
}
j.prototype.a = function(a) {
  g("MyClass.prototype.usedPublicMethod");
  k(this, a)
};
function k(a, d) {
  g("inside MyClass.prototype.myPrivateMethod_");
  f.a("myConfig:" + i.configKey + " json  " + d.e.c + "  myProp:" + a.myPublicProperty)
}
j.prototype.b = function(a) {
  g("inside MyClass.prototype.unusedPublicMethod");
  k(this, a)
};e("myns.MyClass", j, void 0);
j.prototype.usedPublicMethod = j.prototype.a;
j.prototype.unusedPublicMethod = j.prototype.b;
e("myns.MyUtil", f, void 0);
f.usedPublicMethod = f.a;
f.unusedPublicMethod = f.b;
e("myns.MyUnusedClass", function() {
  this.myPublicProperty = "MyUnusedClass.myPublicProperty_default"
}, void 0);
e("myns.MyEnum", {ONE:1, TWO:2, THREE:3}, void 0);
e("myns.MyConfig", i, void 0);})()
