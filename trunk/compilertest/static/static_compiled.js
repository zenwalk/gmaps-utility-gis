(function(){var d = this;
function e(b, f, a) {
  b = b.split(".");
  a = a || d;
  !(b[0] in a) && a.execScript && a.execScript("var " + b[0]);
  for(var c;b.length && (c = b.shift());) {
    if(!b.length && f !== undefined) {
      a[c] = f
    }else {
      a = a[c] ? a[c] : (a[c] = {})
    }
  }
}
;function g() {
  this.b = "mynamespace.subnamespace.MyClass.privateProp_"
}
g.prototype.a = function() {
  alert("class used method")
};
e("mynamespace.subnamespace.MyClass", g, void 0);
e("mynamespace.subnamespace.MyUtil.usedMethod", function() {
  alert("util used method")
}, void 0);
g.prototype.usedClassMethod = g.a;})()
