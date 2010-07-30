(function(){var i, k = this;
function l(a, b, c) {
  a = a.split(".");
  c = c || k;
  !(a[0] in c) && c.execScript && c.execScript("var " + a[0]);
  for(var d;a.length && (d = a.shift());) {
    if(!a.length && b !== undefined) {
      c[d] = b
    }else {
      c = c[d] ? c[d] : (c[d] = {})
    }
  }
}
Math.floor(Math.random() * 2147483648).toString(36);/*
 http://google-maps-utility-library-v3.googlecode.com
*/
var m = Math.PI / 180, n = 0, p = google.maps, r, s, t, u = {proxyUrl:null, alwaysUseProxy:false}, v = {}, w = {};
function x(a) {
  return a && typeof a === "string"
}
function y(a, b, c) {
  if(a && b) {
    var d;
    for(d in a) {
      if(c || !(d in b)) {
        b[d] = a[d]
      }
    }
  }
  return b
}
function z(a) {
  p.event.trigger.apply(a, arguments)
}
function A(a, b) {
  var c = "";
  if(a) {
    c += a.getTime() - a.getTimezoneOffset() * 6E4
  }
  if(b) {
    c += ", " + (b.getTime() - b.getTimezoneOffset() * 6E4)
  }
  return c
}
function B(a, b) {
  b = Math.min(Math.max(b, 0), 1);
  if(a) {
    var c = a.style;
    if(typeof c.opacity !== "undefined") {
      c.opacity = b
    }
    if(typeof c.filters !== "undefined") {
      c.filters.alpha.opacity = Math.floor(100 * b)
    }
    if(typeof c.filter !== "undefined") {
      c.filter = "alpha(opacity:" + Math.floor(b * 100) + ")"
    }
  }
}
function C(a) {
  var b = "";
  for(var c in a) {
    if(a.hasOwnProperty(c)) {
      if(b.length > 0) {
        b += ";"
      }
      b += c + ":" + a[c]
    }
  }
  return b
}
function D() {
  if(typeof XMLHttpRequest === "undefined") {
    try {
      return new ActiveXObject("Msxml2.XMLHTTP.6.0")
    }catch(a) {
    }
    try {
      return new ActiveXObject("Msxml2.XMLHTTP.3.0")
    }catch(b) {
    }
    try {
      return new ActiveXObject("Msxml2.XMLHTTP")
    }catch(c) {
    }
    throw new Error("This browser does not support XMLHttpRequest.");
  }else {
    return new XMLHttpRequest
  }
}
function E(a) {
  var b = a;
  if(a && a.splice && a.length > 0) {
    b = a[0]
  }
  if(b instanceof p.LatLng || b instanceof p.Marker) {
    return a && a.splice && a.length > 1 ? "esriGeometryMultipoint" : "esriGeometryPoint"
  }else {
    if(b instanceof p.Polyline) {
      return"esriGeometryPolyline"
    }else {
      if(b instanceof p.Polygon) {
        return"esriGeometryPolygon"
      }else {
        if(b instanceof p.LatLngBounds) {
          return"esriGeometryEnvelope"
        }else {
          if(b.x !== undefined && b.y !== undefined) {
            return"esriGeometryPoint"
          }else {
            if(b.Ba) {
              return"esriGeometryMultipoint"
            }else {
              if(b.paths) {
                return"esriGeometryPolyline"
              }else {
                if(b.Da) {
                  return"esriGeometryPolygon"
                }
              }
            }
          }
        }
      }
    }
  }
  return null
}
function F(a) {
  var b = a;
  if(a && a.splice && a.length > 0) {
    b = a[0]
  }
  if(b && b.splice && b.length > 0) {
    b = b[0]
  }
  if(b instanceof p.LatLng || b instanceof p.Marker || b instanceof p.Polyline || b instanceof p.Polygon || b instanceof p.LatLngBounds) {
    return true
  }
  return false
}
function G(a, b) {
  for(var c = [], d, e = 0, f = a.getLength();e < f;e++) {
    d = a.getAt(e);
    c.push("[" + d.lng() + "," + d.lat() + "]")
  }
  b && c.length > 0 && c.push("[" + a.getAt(0).lng() + "," + a.getAt(0).lat() + "]");
  return c.join(",")
}
function H(a) {
  var b;
  if(typeof a === "object") {
    if(a && a.splice) {
      b = [];
      for(var c = 0, d = a.length;c < d;c++) {
        b.push(H(a[c]))
      }
      return"[" + b.join(",") + "]"
    }else {
      if(F(a)) {
        var e;
        d = "{";
        switch(E(a)) {
          case "esriGeometryPoint":
            e = a && a.splice ? a[0] : a;
            if(e instanceof p.Marker) {
              e = e.getPosition()
            }
            d += "x:" + e.lng() + ",y:" + e.lat();
            break;
          case "esriGeometryMultipoint":
            c = [];
            for(b = 0;b < a.length;b++) {
              e = a[b] instanceof p.Marker ? a[b].getPosition() : a[b];
              c.push("[" + e.lng() + "," + e.lat() + "]")
            }
            d += "points: [" + c.join(",") + "]";
            break;
          case "esriGeometryPolyline":
            c = [];
            a = a && a.splice ? a : [a];
            for(b = 0;b < a.length;b++) {
              c.push("[" + G(a[b].getPath()) + "]")
            }
            d += "paths:[" + c.join(",") + "]";
            break;
          case "esriGeometryPolygon":
            c = [];
            e = a && a.splice ? a[0] : a;
            a = e.getPaths();
            for(b = 0;b < a.getLength();b++) {
              c.push("[" + G(a.getAt(b), true) + "]")
            }
            d += "rings:[" + c.join(",") + "]";
            break;
          case "esriGeometryEnvelope":
            e = a && a.splice ? a[0] : a;
            d += "xmin:" + e.getSouthWest().lng() + ",ymin:" + e.getSouthWest().lat() + ",xmax:" + e.getNorthEast().lng() + ",ymax:" + e.getNorthEast().lat();
            break
        }
        d += ", spatialReference:{wkid:4326}";
        d += "}";
        return d
      }else {
        if(a.toJSON) {
          return a.toJSON()
        }else {
          b = "";
          for(c in a) {
            if(a.hasOwnProperty(c)) {
              if(b.length > 0) {
                b += ", "
              }
              b += c + ":" + H(a[c])
            }
          }
          return"{" + b + "}"
        }
      }
    }
  }
  return a.toString()
}
function I(a) {
  var b = "";
  if(a) {
    a.f = a.f || "json";
    for(var c in a) {
      if(a.hasOwnProperty(c) && a[c] !== null && a[c] !== undefined) {
        var d = H(a[c]);
        b += c + "=" + (escape ? escape(d) : encodeURIComponent(d)) + "&"
      }
    }
  }
  return b
}
w.p = function(a, b, c, d) {
  var e = "ags_jsonp_" + n++ + "_" + Math.floor(Math.random() * 1E6), f = null;
  b = b || {};
  b[c || "callback"] = e + " && " + e;
  b = I(b);
  var j = document.getElementsByTagName("head")[0];
  if(!j) {
    throw new Error("document must have header tag");
  }
  window[e] = function() {
    delete window[e];
    f && j.removeChild(f);
    f = null;
    d.apply(null, arguments)
  };
  if((b + a).length < 2E3 && !u.alwaysUseProxy) {
    f = document.createElement("script");
    f.src = a + (a.indexOf("?") === -1 ? "?" : "&") + b;
    f.id = e;
    j.appendChild(f)
  }else {
    c = window.location;
    c = c.protocol + "//" + c.hostname + (!c.port || c.port === 80 ? "" : ":" + c.port + "/");
    var h = true;
    if(a.toLowerCase().indexOf(c.toLowerCase()) !== -1) {
      h = false
    }
    if(u.alwaysUseProxy) {
      h = true
    }
    if(h && !u.proxyUrl) {
      throw new Error("No proxyUrl property in Config is defined");
    }
    var g = D();
    g.onreadystatechange = function() {
      if(g.readyState === 4) {
        if(g.status === 200) {
          eval(g.responseText)
        }else {
          throw new Error("Error code " + g.status);
        }
      }
    };
    g.open("POST", h ? u.proxyUrl + "?" + a : a, true);
    g.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    g.send(b)
  }
  return e
};
w.N = function(a, b) {
  if(b && b.splice) {
    for(var c, d = 0, e = b.length;d < e;d++) {
      if((c = b[d]) && c.splice) {
        w.N(a, c)
      }else {
        F(c) && c.setMap(a)
      }
    }
  }
};
w.na = function(a, b) {
  w.N(null, a);
  if(b) {
    a.length = 0
  }
};
function J(a) {
  a = a || {};
  this.wkid = a.wkid;
  this.wkt = a.wkt
}
J.prototype.forward = function(a) {
  return a
};
J.prototype.q = function(a) {
  return a
};
J.prototype.A = function() {
  return 360
};
J.prototype.toJSON = function() {
  return"{" + (this.wkid ? " wkid:" + this.wkid : "wkt: '" + this.wkt + "'") + "}"
};
function K(a) {
  a = a || {};
  J.call(this, a)
}
K.prototype = new J;
function L(a) {
  a = a || {};
  J.call(this, a);
  var b = a.Y, c = a.oa * m, d = a.pa * m, e = a.Z * m;
  this.a = a.B / a.D;
  this.h = a.z * m;
  this.l = a.V;
  this.m = a.W;
  a = 1 / b;
  b = 2 * a - a * a;
  this.g = Math.sqrt(b);
  a = this.n(c, b);
  b = this.n(d, b);
  e = M(this, e, this.g);
  c = M(this, c, this.g);
  d = M(this, d, this.g);
  this.b = Math.log(a / b) / Math.log(c / d);
  this.M = a / (this.b * Math.pow(c, this.b));
  this.j = this.w(this.a, this.M, e, this.b)
}
L.prototype = new J;
L.prototype.n = function(a, b) {
  var c = Math.sin(a);
  return Math.cos(a) / Math.sqrt(1 - b * c * c)
};
function M(a, b, c) {
  a = c * Math.sin(b);
  return Math.tan(Math.PI / 4 - b / 2) / Math.pow((1 - a) / (1 + a), c / 2)
}
i = L.prototype;
i.w = function(a, b, c, d) {
  return a * b * Math.pow(c, d)
};
i.v = function(a, b, c) {
  c = b * Math.sin(c);
  return Math.PI / 2 - 2 * Math.atan(a * Math.pow((1 - c) / (1 + c), b / 2))
};
i.S = function(a, b, c) {
  var d = 0;
  c = c;
  for(var e = this.v(a, b, c);Math.abs(e - c) > 1.0E-9 && d < 10;) {
    d++;
    c = e;
    e = this.v(a, b, c)
  }
  return e
};
i.forward = function(a) {
  var b = a[0] * m;
  a = this.w(this.a, this.M, M(this, a[1] * m, this.g), this.b);
  b = this.b * (b - this.h);
  return[this.l + a * Math.sin(b), this.m + this.j - a * Math.cos(b)]
};
i.q = function(a) {
  var b = a[0] - this.l, c = a[1] - this.m;
  a = Math.atan(b / (this.j - c));
  b = Math.pow((this.b > 0 ? 1 : -1) * Math.sqrt(b * b + (this.j - c) * (this.j - c)) / (this.a * this.M), 1 / this.b);
  return[(a / this.b + this.h) / m, this.S(b, this.g, Math.PI / 2 - 2 * Math.atan(b)) / m]
};
i.A = function() {
  return Math.PI * 2 * this.a
};
function N(a) {
  a = a || {};
  J.call(this, a);
  this.a = a.B / a.D;
  var b = a.Y;
  this.G = a.Ea;
  var c = a.Z * m;
  this.h = a.z * m;
  this.l = a.V;
  this.m = a.W;
  a = 1 / b;
  this.c = 2 * a - a * a;
  this.F = this.c * this.c;
  this.P = this.F * this.c;
  this.s = this.c / (1 - this.c);
  this.T = this.n(c, this.a, this.c, this.F, this.P)
}
N.prototype = new J;
N.prototype.n = function(a, b, c, d, e) {
  return b * ((1 - c / 4 - 3 * d / 64 - 5 * e / 256) * a - (3 * c / 8 + 3 * d / 32 + 45 * e / 1024) * Math.sin(2 * a) + (15 * d / 256 + 45 * e / 1024) * Math.sin(4 * a) - 35 * e / 3072 * Math.sin(6 * a))
};
N.prototype.forward = function(a) {
  var b = a[1] * m, c = a[0] * m;
  a = this.a / Math.sqrt(1 - this.c * Math.pow(Math.sin(b), 2));
  var d = Math.pow(Math.tan(b), 2), e = this.s * Math.pow(Math.cos(b), 2);
  c = (c - this.h) * Math.cos(b);
  var f = this.n(b, this.a, this.c, this.F, this.P);
  return[this.l + this.G * a * (c + (1 - d + e) * Math.pow(c, 3) / 6 + (5 - 18 * d + d * d + 72 * e - 58 * this.s) * Math.pow(c, 5) / 120), this.m + this.G * (f - this.T) + a * Math.tan(b) * (c * c / 2 + (5 - d + 9 * e + 4 * e * e) * Math.pow(c, 4) / 120 + (61 - 58 * d + d * d + 600 * e - 330 * this.s) * Math.pow(c, 6) / 720)]
};
N.prototype.q = function(a) {
  var b = a[0], c = a[1];
  a = (1 - Math.sqrt(1 - this.c)) / (1 + Math.sqrt(1 - this.c));
  c = (this.T + (c - this.m) / this.G) / (this.a * (1 - this.c / 4 - 3 * this.F / 64 - 5 * this.P / 256));
  a = c + (3 * a / 2 - 27 * Math.pow(a, 3) / 32) * Math.sin(2 * c) + (21 * a * a / 16 - 55 * Math.pow(a, 4) / 32) * Math.sin(4 * c) + 151 * Math.pow(a, 3) / 6 * Math.sin(6 * c) + 1097 * Math.pow(a, 4) / 512 * Math.sin(8 * c);
  c = this.s * Math.pow(Math.cos(a), 2);
  var d = Math.pow(Math.tan(a), 2), e = this.a / Math.sqrt(1 - this.c * Math.pow(Math.sin(a), 2)), f = this.a * (1 - this.c) / Math.pow(1 - this.c * Math.pow(Math.sin(a), 2), 1.5);
  b = (b - this.l) / (e * this.G);
  e = a - e * Math.tan(a) / f * (b * b / 2 - (5 + 3 * d + 10 * c - 4 * c * c - 9 * this.s) * Math.pow(b, 4) / 24 + (61 + 90 * d + 28 * c + 45 * d * d - 252 * this.s - 3 * c * c) * Math.pow(b, 6) / 720);
  return[(this.h + (b - (1 + 2 * d + c) * Math.pow(b, 3) / 6 + (5 - 2 * c + 28 * d - 3 * c * c + 8 * this.s + 24 * d * d) * Math.pow(b, 5) / 120) / Math.cos(a)) / m, e / m]
};
N.prototype.A = function() {
  return Math.PI * 2 * this.a
};
function O(a) {
  a = a || {};
  J.call(this, a);
  this.a = (a.B || 6378137) / (a.D || 1);
  this.h = (a.z || 0) * m
}
O.prototype = new J;
O.prototype.forward = function(a) {
  var b = a[1] * m;
  return[this.a * (a[0] * m - this.h), this.a / 2 * Math.log((1 + Math.sin(b)) / (1 - Math.sin(b)))]
};
O.prototype.q = function(a) {
  return[(a[0] / this.a + this.h) / m, (Math.PI / 2 - 2 * Math.atan(Math.exp(-a[1] / this.a))) / m]
};
function P(a) {
  a = a || {};
  J.call(this, a);
  var b = a.Y, c = a.oa * m, d = a.pa * m, e = a.Z * m;
  this.a = a.B / a.D;
  this.h = a.z * m;
  this.l = a.V;
  this.m = a.W;
  a = 1 / b;
  b = 2 * a - a * a;
  this.g = Math.sqrt(b);
  a = this.n(c, b);
  b = this.n(d, b);
  c = Q(this, c, this.g);
  d = Q(this, d, this.g);
  e = Q(this, e, this.g);
  this.b = (a * a - b * b) / (d - c);
  this.L = a * a + this.b * c;
  this.j = this.w(this.a, this.L, this.b, e)
}
P.prototype = new J;
P.prototype.n = function(a, b) {
  var c = Math.sin(a);
  return Math.cos(a) / Math.sqrt(1 - b * c * c)
};
function Q(a, b, c) {
  a = c * Math.sin(b);
  return(1 - c * c) * (Math.sin(b) / (1 - a * a) - 1 / (2 * c) * Math.log((1 - a) / (1 + a)))
}
i = P.prototype;
i.w = function(a, b, c, d) {
  return a * Math.sqrt(b - c * d) / c
};
i.v = function(a, b, c) {
  var d = b * Math.sin(c);
  return c + (1 - d * d) * (1 - d * d) / (2 * Math.cos(c)) * (a / (1 - b * b) - Math.sin(c) / (1 - d * d) + Math.log((1 - d) / (1 + d)) / (2 * b))
};
i.S = function(a, b, c) {
  var d = 0;
  c = c;
  for(var e = this.v(a, b, c);Math.abs(e - c) > 1.0E-8 && d < 10;) {
    d++;
    c = e;
    e = this.v(a, b, c)
  }
  return e
};
i.forward = function(a) {
  var b = a[0] * m;
  a = this.w(this.a, this.L, this.b, Q(this, a[1] * m, this.g));
  b = this.b * (b - this.h);
  return[this.l + a * Math.sin(b), this.m + this.j - a * Math.cos(b)]
};
i.q = function(a) {
  var b = a[0] - this.l;
  a = a[1] - this.m;
  var c = Math.sqrt(b * b + (this.j - a) * (this.j - a)), d = this.b > 0 ? 1 : -1;
  c = (this.L - c * c * this.b * this.b / (this.a * this.a)) / this.b;
  return[(Math.atan(d * b / (d * this.j - d * a)) / this.b + this.h) / m, this.S(c, this.g, Math.asin(c / 2)) / m]
};
i.A = function() {
  return Math.PI * 2 * this.a
};
i.A = function() {
  return Math.PI * 2 * this.a
};
r = new K({wkid:4326});
s = new K({wkid:4269});
t = new O({wkid:102113, B:6378137, z:0, D:1});
v = {"4326":r, "4269":s, "102113":t, "102100":new O({wkid:102100, B:6378137, z:0, D:1})};
function R(a) {
  this.url = a;
  this.definition = null
}
R.prototype.load = function() {
  var a = this;
  this.H || w.p(this.url, {}, "", function(b) {
    y(b, a);
    a.H = true;
    z(a, "load")
  })
};
function S(a, b) {
  this.url = a;
  this.H = false;
  var c = a.split("/");
  this.name = c[c.length - 2].replace(/_/g, " ");
  b = b || {};
  b.ta || this.load()
}
S.prototype.load = function() {
  var a = this;
  w.p(this.url, {}, "", function(b) {
    a.u(b)
  })
};
S.prototype.u = function(a) {
  var b = this;
  y(a, this);
  this.spatialReference = a.spatialReference.wkt ? SpatialReference.Ca(a.spatialReference.wkt) : v[a.spatialReference.wkid];
  a.J !== undefined ? w.p(this.url + "/layers", {}, "", function(c) {
    T(b, c)
  }) : T(b, a)
};
function T(a, b) {
  var c = [], d = [];
  a.i = c;
  if(b.J) {
    a.Fa = d
  }
  var e, f, j, h;
  f = 0;
  for(j = b.layers.length;f < j;f++) {
    h = b.layers[f];
    e = new Layer(a.url + "/" + h.id);
    y(h, e);
    e.visible = e.defaultVisibility;
    c.push(e)
  }
  if(b.J) {
    f = 0;
    for(j = b.J.length;f < j;f++) {
      h = b.J[f];
      e = new Layer(a.url + "/" + h.id);
      y(h, e);
      d.push(e)
    }
  }
  f = 0;
  for(j = c.length;f < j;f++) {
    e = c[f];
    if(e.subLayerIds) {
      e.I = [];
      d = 0;
      for(h = e.subLayerIds.length;d < h;d++) {
        var g;
        a: {
          g = e.subLayerIds[d];
          var o = a.i;
          if(o) {
            for(var q = 0, aa = o.length;q < aa;q++) {
              if(g === o[q].id) {
                g = o[q];
                break a
              }
              if(x(g) && o[q].name.toLowerCase() === g.toLowerCase()) {
                g = o[q];
                break a
              }
            }
          }
          g = null
        }
        e.I.push(g);
        g.Aa = e
      }
    }
  }
  a.H = true;
  z(a, "load")
}
function ba(a) {
  var b = {};
  if(a.i) {
    for(var c = 0, d = a.i.length;c < d;c++) {
      var e = a.i[c];
      if(e.definition) {
        b[String(e.id)] = e.definition
      }
    }
  }
  return b
}
function ca(a) {
  var b = [];
  if(a.i) {
    var c, d, e;
    d = 0;
    for(e = a.i.length;d < e;d++) {
      c = a.i[d];
      if(c.I) {
        for(var f = 0, j = c.I.length;f < j;f++) {
          if(c.I[f].visible === false) {
            c.visible = false;
            break
          }
        }
      }
    }
    d = 0;
    for(e = a.i.length;d < e;d++) {
      c = a.i[d];
      c.visible === true && b.push(c.id)
    }
  }
  return b
}
function U(a, b, c, d) {
  if(b && b.bounds) {
    var e = {};
    e.f = b.f;
    var f = b.bounds;
    e.ra = "" + f.getSouthWest().lng() + "," + f.getSouthWest().lat() + "," + f.getNorthEast().lng() + "," + f.getNorthEast().lat();
    e.size = "" + b.width + "," + b.height;
    e.dpi = b.dpi;
    if(b.t) {
      e.t = b.t.wkid ? b.t.wkid : "{wkt:" + b.t.wkt + "}"
    }
    e.sa = "4326";
    e.format = b.format;
    f = b.wa;
    if(f === undefined) {
      f = ba(a)
    }
    e.xa = C(f);
    f = b.ya;
    var j = b.za || "show";
    if(f === undefined) {
      f = ca(a)
    }
    if(f.length > 0) {
      e.layers = j + ":" + f.join(",")
    }else {
      if(a.H && c) {
        c({href:null});
        return
      }
    }
    e.qa = b.qa === false ? false : true;
    if(b.ea) {
      e.ea = A(b.ea, b.ua)
    }
    e.ja = b.ja;
    if(e.f === "image") {
      return a.url + "/export?" + I(e)
    }else {
      w.p(a.url + "/export", e, "", function(h) {
        if(h.U) {
          var g, o = h.U, q = v[o.spatialReference.wkid || o.spatialReference.wkt];
          q = q || r;
          g = q.q([o.xmin, o.ymin]);
          o = q.q([o.xmax, o.ymax]);
          g = new p.LatLngBounds(new p.LatLng(g[1], g[0]), new p.LatLng(o[1], o[0]));
          h.bounds = g;
          delete h.U;
          c(h)
        }else {
          h = h.error;
          d && h && h.error && d(h.error)
        }
      })
    }
  }
}
function V(a) {
  this.url = a;
  this.loaded = false;
  var b = this;
  w.p(a, {}, "", function(c) {
    b.u(c)
  })
}
V.prototype.u = function(a) {
  y(a, this);
  if(a.spatialReference) {
    this.spatialReference = v[a.spatialReference.wkid || a.spatialReference.wkt] || r
  }
  this.loaded = true;
  z(this, "load")
};
function W(a) {
  this.ka = a ? a.lods : null;
  this.C = a ? v[a.spatialReference.wkid || a.spatialReference.wkt] : t;
  if(!this.C) {
    throw new Error("unsupported Spatial Reference");
  }
  this.ba = a ? a.lods[0].resolution : 156543.033928;
  this.minZoom = Math.floor(Math.log(this.C.A() / this.ba / 256) / Math.LN2 + 0.5);
  this.maxZoom = a ? this.minZoom + this.ka.length - 1 : 20;
  if(p.Size) {
    this.da = a ? new p.Size(a.cols, a.rows) : new p.Size(256, 256)
  }
  this.ca = Math.pow(2, this.minZoom) * this.ba;
  this.la = a ? a.origin.x : -2.0037508342787E7;
  this.ma = a ? a.origin.y : 2.0037508342787E7;
  if(a) {
    for(var b, c = 0;c < a.lods.length - 1;c++) {
      b = a.lods[c].resolution / a.lods[c + 1].resolution;
      if(b > 2.001 || b < 1.999) {
        throw new Error("This type of map cache is not supported in V3. \nScale ratio between zoom levels must be 2");
      }
    }
  }
}
W.prototype.fromPointToLatLng = function(a) {
  if(a === null) {
    return null
  }
  a = this.C.q([a.x * this.ca + this.la, this.ma - a.y * this.ca]);
  return new p.LatLng(a[1], a[0])
};
new W;
function X(a, b) {
  b = b || {};
  if(b.opacity) {
    this.e = b.opacity;
    delete b.opacity
  }
  y(b, this);
  this.d = a instanceof MapService ? a : new MapService(a);
  if(b.X) {
    var c = extractString_(this.d.url, "", "://"), d = extractString_(this.d.url, "://", "/");
    d = extractString_(this.d.url, c + "://" + d, "");
    this.fa = c + "://" + b.X + d;
    this.aa = parseInt(extractString_(b.X, "[", "]"), 10)
  }
  this.name = this.name || this.d.name;
  this.maxZoom = this.maxZoom || 19;
  this.minZoom = this.minZoom || 0;
  if(this.d.loaded) {
    this.u(b)
  }else {
    var e = this;
    p.event.addListenerOnce(this.d, "load", function() {
      e.u(b)
    })
  }
  this.k = {};
  this.$ = b.map
}
X.prototype.u = function(a) {
  if(this.d.tileInfo) {
    this.r = new Projection(this.d.tileInfo);
    this.minZoom = a.minZoom || this.r.minZoom;
    this.maxZoom = a.maxZoom || this.r.maxZoom
  }
};
X.prototype.getTileUrl = function(a, b) {
  var c = b - (this.r ? this.r.minZoom : this.minZoom), d = "";
  if(!isNaN(a.x) && !isNaN(a.y) && c >= 0 && a.x >= 0 && a.y >= 0) {
    d = this.d.url;
    if(this.fa) {
      d = this.fa.replace("[" + this.aa + "]", "" + (a.y + a.x) % this.aa)
    }
    if(this.d.singleFusedMapCache === false) {
      c = this.r || this.$ ? this.$.getProjection() : Projection.ga;
      if(!c instanceof Projection) {
        c = Projection.ga
      }
      d = c.da;
      var e = 1 << b, f = new p.Point(a.x * d.width / e, (a.y + 1) * d.height / e);
      e = new p.Point((a.x + 1) * d.width / e, a.y * d.height / e);
      f = new p.LatLngBounds(c.fromPointToLatLng(f), c.fromPointToLatLng(e));
      e = {f:"image"};
      e.bounds = f;
      e.width = d.width;
      e.height = d.height;
      e.t = c.C;
      d = U(this.d, e)
    }else {
      d = d + "/tile/" + c + "/" + a.y + "/" + a.x
    }
  }
  return d
};
X.prototype.R = function(a) {
  this.e = a;
  var b = this.k;
  for(var c in b) {
    b.hasOwnProperty(c) && B(b[c], a)
  }
};
function Y(a, b) {
  b = b || {};
  var c;
  if(b.opacity) {
    this.e = b.opacity;
    delete b.opacity
  }
  y(b, this);
  var d = a;
  if(x(a)) {
    d = [new TileLayer(a, b)]
  }else {
    if(a instanceof MapService) {
      d = [new TileLayer(a, b)]
    }else {
      if(a instanceof TileLayer) {
        d = [a]
      }else {
        if(a.length > 0 && x(a[0])) {
          d = [];
          for(c = 0;c < a.length;c++) {
            d[c] = new TileLayer(a[c], b)
          }
        }
      }
    }
  }
  this.K = d;
  this.k = {};
  if(b.maxZoom !== undefined) {
    this.maxZoom = b.maxZoom
  }else {
    var e = 0;
    for(c = 0;c < d.length;c++) {
      e = Math.max(e, d[c].maxZoom)
    }
    this.maxZoom = e
  }
  if(d[0].r) {
    this.tileSize = d[0].r.da;
    this.projection = d[0].r
  }else {
    this.tileSize = new p.Size(256, 256)
  }
  if(!this.name) {
    this.name = d[0].name
  }
}
Y.prototype.getTile = function(a, b, c) {
  for(var d = c.createElement("div"), e = "_" + a.x + "_" + a.y + "_" + b, f = 0;f < this.K.length;f++) {
    var j = this.K[f];
    if(b <= j.maxZoom && b >= j.minZoom) {
      var h = j.getTileUrl(a, b);
      if(h) {
        var g = c.createElement(document.all ? "img" : "div");
        g.style.border = "0px none";
        g.style.margin = "0px";
        g.style.padding = "0px";
        g.style.overflow = "hidden";
        g.style.position = "absolute";
        g.style.top = "0px";
        g.style.left = "0px";
        g.style.width = "" + this.tileSize.width + "px";
        g.style.height = "" + this.tileSize.height + "px";
        if(document.all) {
          g.src = h
        }else {
          g.style.backgroundImage = "url(" + h + ")"
        }
        d.appendChild(g);
        j.k[e] = g;
        if(j.e !== undefined) {
          B(g, j.e)
        }else {
          this.e !== undefined && B(g, this.e)
        }
      }
    }
  }
  this.k[e] = d;
  d.setAttribute("tid", e);
  return d
};
Y.prototype.getTile = Y.prototype.getTile;
Y.prototype.releaseTile = function(a) {
  if(a.getAttribute("tid")) {
    a = a.getAttribute("tid");
    this.k[a] && delete this.k[a];
    for(var b = 0;b < this.K.length;b++) {
      var c = this.K[b];
      c.k[a] && delete c.k[a]
    }
  }
};
Y.prototype.releaseTile = Y.prototype.releaseTile;
Y.prototype.R = function(a) {
  this.e = a;
  var b = this.k;
  for(var c in b) {
    if(b.hasOwnProperty(c)) {
      for(var d = b[c].childNodes, e = 0;e < d.length;e++) {
        B(d[e], a)
      }
    }
  }
};
function Z(a, b) {
  b = b || {};
  this.d = a instanceof MapService ? a : new MapService(a);
  this.e = b.opacity || 1;
  this.ia = b.va || {};
  this.Q = this.O = false;
  this.o = null;
  b.map && this.setMap(b.map)
}
Z.prototype = new p.OverlayView;
Z.prototype.onAdd = function() {
  var a = document.createElement("div");
  a.style.position = "absolute";
  a.style.border = "none";
  a.style.position = "absolute";
  this.o = a;
  this.getPanes().overlayLayer.appendChild(a);
  this.e && B(a, this.e);
  var b = this;
  this.ha = p.event.addListener(this.getMap(), "bounds_changed", function() {
    $(b)
  })
};
Z.prototype.onAdd = Z.prototype.onAdd;
Z.prototype.onRemove = function() {
  p.event.removeListener(this.ha);
  this.o.parentNode.removeChild(this.o);
  this.o = null
};
Z.prototype.onRemove = Z.prototype.onRemove;
Z.prototype.draw = Z.prototype.draw;
Z.prototype.R = function(a) {
  this.e = a = Math.min(Math.max(a, 0), 1);
  setNodeOpacity_(this.o, a)
};
function $(a) {
  if(a.O === true) {
    a.Q = true
  }else {
    var b = a.getMap(), c = b ? b.getBounds() : null;
    if(c) {
      var d = a.ia;
      d.bounds = c;
      c = t;
      var e = b.getDiv();
      d.width = e.offsetWidth;
      d.height = e.offsetHeight;
      if((b = b.getProjection()) && b instanceof Projection) {
        c = b.C
      }
      d.t = c;
      triggerEvent(a, "drawstart");
      a.O = true;
      a.o.style.backgroundImage = "";
      U(a.d, d, function(f) {
        a.O = false;
        if(a.Q === true) {
          a.Q = false;
          $(a)
        }else {
          if(f.href) {
            var j = a.getProjection(), h = f.bounds, g = j.fromLatLngToDivPixel(h.getSouthWest());
            j = j.fromLatLngToDivPixel(h.getNorthEast());
            h = a.o;
            h.style.left = g.x + "px";
            h.style.top = j.y + "px";
            h.style.width = j.x - g.x + "px";
            h.style.height = g.y - j.y + "px";
            a.o.style.backgroundImage = "url(" + f.href + ")";
            a.R(a.e)
          }
          triggerEvent(a, "drawend")
        }
      })
    }
  }
}
;l("gmaps.ags.Util", w, void 0);
w.getJSON = w.p;
w.addToMap = w.N;
w.removeFromMap = w.na;
l("gmaps.ags.Config", u, void 0);
l("gmaps.ags.SpatialReference", J, void 0);
J.prototype.forward = J.prototype.forward;
J.prototype.inverse = J.prototype.q;
l("gmaps.ags.Albers", P, void 0);
l("gmaps.ags.LambertConformalConic", L, void 0);
l("gmaps.ags.SphereMercator", O, void 0);
l("gmaps.ags.TransverseMercator", N, void 0);
l("gmaps.ags.GeometryType", {POINT:"esriGeometryPoint", MULTIPOINT:"esriGeometryMultipoint", POLYLINE:"esriGeometryPolyline", POLYGON:"esriGeometryPolygon", ENVELOPE:"esriGeometryEnvelope"}, void 0);
l("gmaps.ags.Catalog", function(a) {
  this.url = a;
  var b = this;
  getJSON_(a, {}, "", function(c) {
    y(c, b);
    z(b, "load")
  })
}, void 0);
l("gmaps.ags.Layer", R, void 0);
R.prototype.load = R.load;
l("gmaps.ags.MapService", S, void 0);
l("gmaps.ags.GeocodeService", V, void 0);
l("gmaps.ags.GeometryService", function(a) {
  this.url = a
}, void 0);
l("gmaps.ags.GeocodeService", V, void 0);
l("gmaps.ags.GPService", function(a) {
  this.url = a;
  this.loaded = false;
  var b = this;
  w.p(a, {}, "", function(c) {
    y(c, b);
    b.loaded = true;
    z(b, "load")
  })
}, void 0);
l("gmaps.ags.GPTask", function(a) {
  this.url = a;
  this.loaded = false;
  var b = this;
  w.p(a, {}, "", function(c) {
    y(c, b);
    b.loaded = true;
    z(b, "load")
  })
}, void 0);
l("gmaps.ags.RouteTask", function(a) {
  this.url = a
}, void 0);
l("gmaps.ags.RouteTask", V, void 0);
l("gmaps.ags.Projection", W, void 0);
l("gmaps.ags.TileLayer", X, void 0);
l("gmaps.ags.MapOverlay", Z, void 0);
l("gmaps.ags.MapType", Y, void 0);})()
