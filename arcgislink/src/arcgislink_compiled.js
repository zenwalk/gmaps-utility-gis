(function(){var j, ba = this;
function k(a, b, c) {
  a = a.split(".");
  c = c || ba;
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
var l = Math.PI / 180, ca = 0, m = google.maps, n, o, p, q = {proxyUrl:null, alwaysUseProxy:false}, r = {}, s = {};
function t(a, b, c) {
  var d = b === "" ? 0 : a.indexOf(b);
  return a.substring(d + b.length, c === "" ? a.length : a.indexOf(c, d + b.length))
}
function u(a) {
  return a && typeof a === "string"
}
function v(a) {
  return a && a.splice
}
function x(a, b, c) {
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
function y(a) {
  m.event.trigger.apply(a, arguments)
}
function z(a, b) {
  a && b && b.error && a(b.error)
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
function da() {
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
function D(a) {
  var b = a;
  if(v(a) && a.length > 0) {
    b = a[0]
  }
  if(b instanceof m.LatLng || b instanceof m.Marker) {
    return v(a) && a.length > 1 ? "esriGeometryMultipoint" : "esriGeometryPoint"
  }else {
    if(b instanceof m.Polyline) {
      return"esriGeometryPolyline"
    }else {
      if(b instanceof m.Polygon) {
        return"esriGeometryPolygon"
      }else {
        if(b instanceof m.LatLngBounds) {
          return"esriGeometryEnvelope"
        }else {
          if(b.x !== undefined && b.y !== undefined) {
            return"esriGeometryPoint"
          }else {
            if(b.points) {
              return"esriGeometryMultipoint"
            }else {
              if(b.paths) {
                return"esriGeometryPolyline"
              }else {
                if(b.rings) {
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
function E(a) {
  var b = a;
  if(v(a) && a.length > 0) {
    b = a[0]
  }
  if(v(b) && b.length > 0) {
    b = b[0]
  }
  if(b instanceof m.LatLng || b instanceof m.Marker || b instanceof m.Polyline || b instanceof m.Polygon || b instanceof m.LatLngBounds) {
    return true
  }
  return false
}
function F(a, b) {
  for(var c = [], d, e = 0, f = a.getLength();e < f;e++) {
    d = a.getAt(e);
    c.push("[" + d.lng() + "," + d.lat() + "]")
  }
  b && c.length > 0 && c.push("[" + a.getAt(0).lng() + "," + a.getAt(0).lat() + "]");
  return c.join(",")
}
function G(a) {
  var b, c, d, e = "{";
  switch(D(a)) {
    case "esriGeometryPoint":
      b = v(a) ? a[0] : a;
      if(b instanceof m.Marker) {
        b = b.getPosition()
      }
      e += "x:" + b.lng() + ",y:" + b.lat();
      break;
    case "esriGeometryMultipoint":
      d = [];
      for(c = 0;c < a.length;c++) {
        b = a[c] instanceof m.Marker ? a[c].getPosition() : a[c];
        d.push("[" + b.lng() + "," + b.lat() + "]")
      }
      e += "points: [" + d.join(",") + "]";
      break;
    case "esriGeometryPolyline":
      d = [];
      a = v(a) ? a : [a];
      for(c = 0;c < a.length;c++) {
        d.push("[" + F(a[c].getPath()) + "]")
      }
      e += "paths:[" + d.join(",") + "]";
      break;
    case "esriGeometryPolygon":
      d = [];
      b = v(a) ? a[0] : a;
      a = b.getPaths();
      for(c = 0;c < a.getLength();c++) {
        d.push("[" + F(a.getAt(c), true) + "]")
      }
      e += "rings:[" + d.join(",") + "]";
      break;
    case "esriGeometryEnvelope":
      b = v(a) ? a[0] : a;
      e += "xmin:" + b.getSouthWest().lng() + ",ymin:" + b.getSouthWest().lat() + ",xmax:" + b.getNorthEast().lng() + ",ymax:" + b.getNorthEast().lat();
      break
  }
  e += ", spatialReference:{wkid:4326}";
  e += "}";
  return e
}
function H(a) {
  var b = r[a.spatialReference.wkid || a.spatialReference.wkt];
  b = b || n;
  var c = b.q([a.xmin, a.ymin]);
  a = b.q([a.xmax, a.ymax]);
  return new m.LatLngBounds(new m.LatLng(c[1], c[0]), new m.LatLng(a[1], a[0]))
}
function I(a, b) {
  var c = null, d, e, f, g, h, i, w, M;
  b = b || {};
  if(a) {
    c = [];
    if(a.x) {
      d = new m.Marker(x(b.markerOptions || b, {position:new m.LatLng(a.y, a.x)}));
      c.push(d)
    }else {
      h = a.points || a.paths || a.rings;
      if(!h) {
        return c
      }
      var aa = [];
      e = 0;
      for(f = h.length;e < f;e++) {
        i = h[e];
        if(a.points) {
          d = new m.Marker(x(b.markerOptions || b, {position:new m.LatLng(i[1], i[0])}));
          c.push(d)
        }else {
          M = [];
          d = 0;
          for(g = i.length;d < g;d++) {
            w = i[d];
            M.push(new m.LatLng(w[1], w[0]))
          }
          if(a.paths) {
            d = new m.Polyline(x(b.polylineOptions || b, {path:M}));
            c.push(d)
          }else {
            a.rings && aa.push(M)
          }
        }
      }
      if(a.rings) {
        d = new m.Polygon(x(b.Ba || b, {paths:aa}));
        c.push(d)
      }
    }
  }
  return c
}
function J(a) {
  var b;
  if(typeof a === "object") {
    if(v(a)) {
      b = [];
      for(var c = 0, d = a.length;c < d;c++) {
        b.push(J(a[c]))
      }
      return"[" + b.join(",") + "]"
    }else {
      if(E(a)) {
        return G(a)
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
              b += c + ":" + J(a[c])
            }
          }
          return"{" + b + "}"
        }
      }
    }
  }
  return a.toString()
}
function ea(a) {
  var b = "";
  if(a) {
    a.f = a.f || "json";
    for(var c in a) {
      if(a.hasOwnProperty(c) && a[c] !== null && a[c] !== undefined) {
        var d = J(a[c]);
        b += c + "=" + (escape ? escape(d) : encodeURIComponent(d)) + "&"
      }
    }
  }
  return b
}
s.h = function(a, b, c, d) {
  var e = "ags_jsonp_" + ca++ + "_" + Math.floor(Math.random() * 1E6), f = null;
  b = b || {};
  b[c || "callback"] = e + " && " + e;
  b = ea(b);
  var g = document.getElementsByTagName("head")[0];
  if(!g) {
    throw new Error("document must have header tag");
  }
  window[e] = function() {
    delete window[e];
    f && g.removeChild(f);
    f = null;
    d.apply(null, arguments)
  };
  if((b + a).length < 2E3 && !q.alwaysUseProxy) {
    f = document.createElement("script");
    f.src = a + (a.indexOf("?") === -1 ? "?" : "&") + b;
    f.id = e;
    g.appendChild(f)
  }else {
    c = window.location;
    c = c.protocol + "//" + c.hostname + (!c.port || c.port === 80 ? "" : ":" + c.port + "/");
    var h = true;
    if(a.toLowerCase().indexOf(c.toLowerCase()) !== -1) {
      h = false
    }
    if(q.alwaysUseProxy) {
      h = true
    }
    if(h && !q.proxyUrl) {
      throw new Error("No proxyUrl property in Config is defined");
    }
    var i = da();
    i.onreadystatechange = function() {
      if(i.readyState === 4) {
        if(i.status === 200) {
          eval(i.responseText)
        }else {
          throw new Error("Error code " + i.status);
        }
      }
    };
    i.open("POST", h ? q.proxyUrl + "?" + a : a, true);
    i.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    i.send(b)
  }
  return e
};
s.L = function(a, b) {
  if(v(b)) {
    for(var c, d = 0, e = b.length;d < e;d++) {
      c = b[d];
      if(v(c)) {
        s.L(a, c)
      }else {
        E(c) && c.setMap(a)
      }
    }
  }
};
s.qa = function(a, b) {
  s.L(null, a);
  if(b) {
    a.length = 0
  }
};
function K(a) {
  a = a || {};
  this.wkid = a.wkid;
  this.wkt = a.wkt
}
K.prototype.forward = function(a) {
  return a
};
K.prototype.q = function(a) {
  return a
};
K.prototype.A = function() {
  return 360
};
K.prototype.toJSON = function() {
  return"{" + (this.wkid ? " wkid:" + this.wkid : "wkt: '" + this.wkt + "'") + "}"
};
function L(a) {
  a = a || {};
  K.call(this, a)
}
L.prototype = new K;
function N(a) {
  a = a || {};
  K.call(this, a);
  var b = a.inverse_flattening, c = a.standard_parallel_1 * l, d = a.standard_parallel_2 * l, e = a.latitude_of_origin * l;
  this.a = a.semi_major / a.unit;
  this.i = a.central_meridian * l;
  this.m = a.false_easting;
  this.n = a.false_northing;
  a = 1 / b;
  b = 2 * a - a * a;
  this.g = Math.sqrt(b);
  a = this.o(c, b);
  b = this.o(d, b);
  e = O(this, e, this.g);
  c = O(this, c, this.g);
  d = O(this, d, this.g);
  this.b = Math.log(a / b) / Math.log(c / d);
  this.K = a / (this.b * Math.pow(c, this.b));
  this.k = this.z(this.a, this.K, e, this.b)
}
N.prototype = new K;
N.prototype.o = function(a, b) {
  var c = Math.sin(a);
  return Math.cos(a) / Math.sqrt(1 - b * c * c)
};
function O(a, b, c) {
  a = c * Math.sin(b);
  return Math.tan(Math.PI / 4 - b / 2) / Math.pow((1 - a) / (1 + a), c / 2)
}
j = N.prototype;
j.z = function(a, b, c, d) {
  return a * b * Math.pow(c, d)
};
j.w = function(a, b, c) {
  c = b * Math.sin(c);
  return Math.PI / 2 - 2 * Math.atan(a * Math.pow((1 - c) / (1 + c), b / 2))
};
j.Q = function(a, b, c) {
  var d = 0;
  c = c;
  for(var e = this.w(a, b, c);Math.abs(e - c) > 1.0E-9 && d < 10;) {
    d++;
    c = e;
    e = this.w(a, b, c)
  }
  return e
};
j.forward = function(a) {
  var b = a[0] * l;
  a = this.z(this.a, this.K, O(this, a[1] * l, this.g), this.b);
  b = this.b * (b - this.i);
  return[this.m + a * Math.sin(b), this.n + this.k - a * Math.cos(b)]
};
j.q = function(a) {
  var b = a[0] - this.m, c = a[1] - this.n;
  a = Math.atan(b / (this.k - c));
  b = Math.pow((this.b > 0 ? 1 : -1) * Math.sqrt(b * b + (this.k - c) * (this.k - c)) / (this.a * this.K), 1 / this.b);
  return[(a / this.b + this.i) / l, this.Q(b, this.g, Math.PI / 2 - 2 * Math.atan(b)) / l]
};
j.A = function() {
  return Math.PI * 2 * this.a
};
function P(a) {
  a = a || {};
  K.call(this, a);
  this.a = a.semi_major / a.unit;
  var b = a.inverse_flattening;
  this.G = a.scale_factor;
  var c = a.latitude_of_origin * l;
  this.i = a.central_meridian * l;
  this.m = a.false_easting;
  this.n = a.false_northing;
  a = 1 / b;
  this.c = 2 * a - a * a;
  this.F = this.c * this.c;
  this.M = this.F * this.c;
  this.s = this.c / (1 - this.c);
  this.R = this.o(c, this.a, this.c, this.F, this.M)
}
P.prototype = new K;
P.prototype.o = function(a, b, c, d, e) {
  return b * ((1 - c / 4 - 3 * d / 64 - 5 * e / 256) * a - (3 * c / 8 + 3 * d / 32 + 45 * e / 1024) * Math.sin(2 * a) + (15 * d / 256 + 45 * e / 1024) * Math.sin(4 * a) - 35 * e / 3072 * Math.sin(6 * a))
};
P.prototype.forward = function(a) {
  var b = a[1] * l, c = a[0] * l;
  a = this.a / Math.sqrt(1 - this.c * Math.pow(Math.sin(b), 2));
  var d = Math.pow(Math.tan(b), 2), e = this.s * Math.pow(Math.cos(b), 2);
  c = (c - this.i) * Math.cos(b);
  var f = this.o(b, this.a, this.c, this.F, this.M);
  return[this.m + this.G * a * (c + (1 - d + e) * Math.pow(c, 3) / 6 + (5 - 18 * d + d * d + 72 * e - 58 * this.s) * Math.pow(c, 5) / 120), this.n + this.G * (f - this.R) + a * Math.tan(b) * (c * c / 2 + (5 - d + 9 * e + 4 * e * e) * Math.pow(c, 4) / 120 + (61 - 58 * d + d * d + 600 * e - 330 * this.s) * Math.pow(c, 6) / 720)]
};
P.prototype.q = function(a) {
  var b = a[0], c = a[1];
  a = (1 - Math.sqrt(1 - this.c)) / (1 + Math.sqrt(1 - this.c));
  c = (this.R + (c - this.n) / this.G) / (this.a * (1 - this.c / 4 - 3 * this.F / 64 - 5 * this.M / 256));
  a = c + (3 * a / 2 - 27 * Math.pow(a, 3) / 32) * Math.sin(2 * c) + (21 * a * a / 16 - 55 * Math.pow(a, 4) / 32) * Math.sin(4 * c) + 151 * Math.pow(a, 3) / 6 * Math.sin(6 * c) + 1097 * Math.pow(a, 4) / 512 * Math.sin(8 * c);
  c = this.s * Math.pow(Math.cos(a), 2);
  var d = Math.pow(Math.tan(a), 2), e = this.a / Math.sqrt(1 - this.c * Math.pow(Math.sin(a), 2)), f = this.a * (1 - this.c) / Math.pow(1 - this.c * Math.pow(Math.sin(a), 2), 1.5);
  b = (b - this.m) / (e * this.G);
  e = a - e * Math.tan(a) / f * (b * b / 2 - (5 + 3 * d + 10 * c - 4 * c * c - 9 * this.s) * Math.pow(b, 4) / 24 + (61 + 90 * d + 28 * c + 45 * d * d - 252 * this.s - 3 * c * c) * Math.pow(b, 6) / 720);
  return[(this.i + (b - (1 + 2 * d + c) * Math.pow(b, 3) / 6 + (5 - 2 * c + 28 * d - 3 * c * c + 8 * this.s + 24 * d * d) * Math.pow(b, 5) / 120) / Math.cos(a)) / l, e / l]
};
P.prototype.A = function() {
  return Math.PI * 2 * this.a
};
function Q(a) {
  a = a || {};
  K.call(this, a);
  this.a = (a.semi_major || 6378137) / (a.unit || 1);
  this.i = (a.central_meridian || 0) * l
}
Q.prototype = new K;
Q.prototype.forward = function(a) {
  var b = a[1] * l;
  return[this.a * (a[0] * l - this.i), this.a / 2 * Math.log((1 + Math.sin(b)) / (1 - Math.sin(b)))]
};
Q.prototype.q = function(a) {
  return[(a[0] / this.a + this.i) / l, (Math.PI / 2 - 2 * Math.atan(Math.exp(-a[1] / this.a))) / l]
};
function R(a) {
  a = a || {};
  K.call(this, a);
  var b = a.inverse_flattening, c = a.standard_parallel_1 * l, d = a.standard_parallel_2 * l, e = a.latitude_of_origin * l;
  this.a = a.semi_major / a.unit;
  this.i = a.central_meridian * l;
  this.m = a.false_easting;
  this.n = a.false_northing;
  a = 1 / b;
  b = 2 * a - a * a;
  this.g = Math.sqrt(b);
  a = this.o(c, b);
  b = this.o(d, b);
  c = S(this, c, this.g);
  d = S(this, d, this.g);
  e = S(this, e, this.g);
  this.b = (a * a - b * b) / (d - c);
  this.J = a * a + this.b * c;
  this.k = this.z(this.a, this.J, this.b, e)
}
R.prototype = new K;
R.prototype.o = function(a, b) {
  var c = Math.sin(a);
  return Math.cos(a) / Math.sqrt(1 - b * c * c)
};
function S(a, b, c) {
  a = c * Math.sin(b);
  return(1 - c * c) * (Math.sin(b) / (1 - a * a) - 1 / (2 * c) * Math.log((1 - a) / (1 + a)))
}
j = R.prototype;
j.z = function(a, b, c, d) {
  return a * Math.sqrt(b - c * d) / c
};
j.w = function(a, b, c) {
  var d = b * Math.sin(c);
  return c + (1 - d * d) * (1 - d * d) / (2 * Math.cos(c)) * (a / (1 - b * b) - Math.sin(c) / (1 - d * d) + Math.log((1 - d) / (1 + d)) / (2 * b))
};
j.Q = function(a, b, c) {
  var d = 0;
  c = c;
  for(var e = this.w(a, b, c);Math.abs(e - c) > 1.0E-8 && d < 10;) {
    d++;
    c = e;
    e = this.w(a, b, c)
  }
  return e
};
j.forward = function(a) {
  var b = a[0] * l;
  a = this.z(this.a, this.J, this.b, S(this, a[1] * l, this.g));
  b = this.b * (b - this.i);
  return[this.m + a * Math.sin(b), this.n + this.k - a * Math.cos(b)]
};
j.q = function(a) {
  var b = a[0] - this.m;
  a = a[1] - this.n;
  var c = Math.sqrt(b * b + (this.k - a) * (this.k - a)), d = this.b > 0 ? 1 : -1;
  c = (this.J - c * c * this.b * this.b / (this.a * this.a)) / this.b;
  return[(Math.atan(d * b / (d * this.k - d * a)) / this.b + this.i) / l, this.Q(c, this.g, Math.asin(c / 2)) / l]
};
j.A = function() {
  return Math.PI * 2 * this.a
};
j.A = function() {
  return Math.PI * 2 * this.a
};
n = new L({wkid:4326});
o = new L({wkid:4269});
p = new Q({wkid:102113, semi_major:6378137, central_meridian:0, unit:1});
r = {"4326":n, "4269":o, "102113":p, "102100":new Q({wkid:102100, semi_major:6378137, central_meridian:0, unit:1})};
function T(a) {
  this.url = a;
  this.definition = null
}
T.prototype.load = function() {
  var a = this;
  this.B || s.h(this.url, {}, "", function(b) {
    x(b, a);
    a.B = true;
    y(a, "load")
  })
};
T.prototype.query = function(a, b, c) {
  if(a) {
    var d = x(a, {});
    if(a.geometry && !u(a.geometry)) {
      d.geometry = G(a.geometry);
      d.geometryType = D(a.geometry);
      d.inSR = 4326
    }
    if(a.spatialRelationship) {
      d.spatialRel = a.spatialRelationship;
      delete d.spatialRelationship
    }
    if(a.outFields && !v(a.outFields)) {
      d.outFields = a.outFields.join(",")
    }
    if(a.objectIds) {
      d.objectIds = a.objectIds.join(",")
    }
    if(a.time) {
      d.time = A(a.time, a.ca)
    }
    d.outSR = 4326;
    d.returnGeometry = a.returnGeometry === false ? false : true;
    d.returnIdsOnly = a.returnIdsOnly === true ? true : false;
    delete d.overlayOptions;
    s.h(this.url + "/query", d, "", function(e) {
      var f = e.wa, g = a.overlayOptions;
      if(f) {
        var h, i, w;
        h = 0;
        for(i = f.length;h < i;h++) {
          w = f[h];
          if(w.geometry) {
            w.geometry = I(w.geometry, g)
          }
        }
      }
      b(e, e.error);
      z(c, e)
    })
  }
};
function U(a, b) {
  this.url = a;
  this.B = false;
  var c = a.split("/");
  this.name = c[c.length - 2].replace(/_/g, " ");
  b = b || {};
  b.deferLoad || this.load()
}
U.prototype.load = function() {
  var a = this;
  s.h(this.url, {}, "", function(b) {
    a.u(b)
  })
};
U.prototype.u = function(a) {
  var b = this;
  x(a, this);
  this.v = a.spatialReference.wkt ? SpatialReference.Ca(a.spatialReference.wkt) : r[a.spatialReference.wkid];
  a.tables !== undefined ? s.h(this.url + "/layers", {}, "", function(c) {
    fa(b, c)
  }) : fa(b, a)
};
function fa(a, b) {
  var c = [], d = [];
  a.j = c;
  if(b.tables) {
    a.sa = d
  }
  var e, f, g, h;
  f = 0;
  for(g = b.layers.length;f < g;f++) {
    h = b.layers[f];
    e = new T(a.url + "/" + h.id);
    x(h, e);
    e.visible = e.defaultVisibility;
    c[f] = e
  }
  if(b.tables) {
    f = 0;
    for(g = b.tables.length;f < g;f++) {
      h = b.tables[f];
      e = new T(a.url + "/" + h.id);
      x(h, e);
      d[f] = e
    }
  }
  f = 0;
  for(g = c.length;f < g;f++) {
    e = c[f];
    if(e.subLayerIds) {
      e.subLayers = [];
      d = 0;
      for(h = e.subLayerIds.length;d < h;d++) {
        var i = a.O(e.subLayerIds[d]);
        e.subLayers.push(i);
        i.parentLayer = e
      }
    }
  }
  a.B = true;
  y(a, "load")
}
U.prototype.O = function(a) {
  var b = this.j;
  if(b) {
    for(var c = 0, d = b.length;c < d;c++) {
      if(a === b[c].id) {
        return b[c]
      }
      if(u(a) && b[c].name.toLowerCase() === a.toLowerCase()) {
        return b[c]
      }
    }
  }
  return null
};
function ga(a) {
  var b = {};
  if(a.j) {
    for(var c = 0, d = a.j.length;c < d;c++) {
      var e = a.j[c];
      if(e.definition) {
        b[String(e.id)] = e.definition
      }
    }
  }
  return b
}
U.prototype.ia = function() {
  return this.B
};
function ha(a) {
  var b = [];
  if(a.j) {
    var c, d, e;
    d = 0;
    for(e = a.j.length;d < e;d++) {
      c = a.j[d];
      if(c.subLayers) {
        for(var f = 0, g = c.subLayers.length;f < g;f++) {
          if(c.subLayers[f].visible === false) {
            c.visible = false;
            break
          }
        }
      }
    }
    d = 0;
    for(e = a.j.length;d < e;d++) {
      c = a.j[d];
      c.visible === true && b.push(c.id)
    }
  }
  return b
}
j = U.prototype;
j.fa = function() {
  if(this.initialExtent) {
    return H(this.initialExtent)
  }
  return null
};
j.ga = function() {
  return this.j
};
j.ha = function() {
  return this.sa
};
j.N = function(a, b, c) {
  if(a && a.bounds) {
    var d = {};
    d.f = a.f;
    var e = a.bounds;
    d.bbox = "" + e.getSouthWest().lng() + "," + e.getSouthWest().lat() + "," + e.getNorthEast().lng() + "," + e.getNorthEast().lat();
    d.size = "" + a.width + "," + a.height;
    d.dpi = a.dpi;
    if(a.imageSR) {
      d.imageSR = a.imageSR.wkid ? a.imageSR.wkid : "{wkt:" + a.imageSR.wkt + "}"
    }
    d.bboxSR = "4326";
    d.format = a.format;
    e = a.layerDefinitions;
    if(e === undefined) {
      e = ga(this)
    }
    d.layerDefs = C(e);
    e = a.layerIds;
    var f = a.layerOption || "show";
    if(e === undefined) {
      e = ha(this)
    }
    if(e.length > 0) {
      d.layers = f + ":" + e.join(",")
    }else {
      if(this.B && b) {
        b({href:null});
        return
      }
    }
    d.ua = a.ua === false ? false : true;
    if(a.time) {
      d.time = A(a.time, a.ca)
    }
    d.ka = a.ka;
    if(d.f === "image") {
      return this.url + "/export?" + ea(d)
    }else {
      s.h(this.url + "/export", d, "", function(g) {
        if(g.S) {
          g.bounds = H(g.S);
          delete g.S;
          b(g)
        }else {
          z(c, g.error)
        }
      })
    }
  }
};
j.ja = function(a, b, c) {
  if(a) {
    var d = {};
    d.geometry = G(a.geometry);
    d.geometryType = D(a.geometry);
    d.ya = G(a.bounds);
    d.ta = a.ta || 2;
    d.ra = 4326;
    d.xa = "" + a.width + "," + a.height + "," + (a.dpi || 96);
    d.layers = a.layerOption || "all";
    if(a.layerIds) {
      d.layers += ":" + a.layerIds.join(",")
    }
    if(a.layerDefs) {
      d.layerDefs = C(a.layerDefs)
    }
    d.ma = a.ma;
    d.returnGeometry = a.returnGeometry === false ? false : true;
    s.h(this.url + "/identify", d, "", function(e) {
      var f, g, h;
      if(e.C) {
        for(f = 0;f < e.C.length;f++) {
          g = e.C[f];
          h = I(g.geometry, a.overlayOptions);
          g.ea = {geometry:h, attributes:g.attributes};
          delete g.attributes
        }
      }
      b(e);
      z(c, e)
    })
  }
};
j.find = function(a, b, c) {
  if(a) {
    var d = x(a, {});
    if(a.layerIds) {
      d.layers = a.layerIds.join(",");
      delete d.layerIds
    }
    if(a.X) {
      d.X = a.X.join(",")
    }
    d.contains = a.contains === false ? false : true;
    if(a.layerDefinitions) {
      d.layerDefs = C(a.layerDefinitions);
      delete d.layerDefinitions
    }
    d.ra = 4326;
    d.returnGeometry = a.returnGeometry === false ? false : true;
    s.h(this.url + "/find", d, "", function(e) {
      var f, g, h;
      if(e.C) {
        for(f = 0;f < e.C.length;f++) {
          g = e.C[f];
          h = I(g.geometry, a.overlayOptions);
          g.ea = {geometry:h, attributes:g.attributes};
          delete g.attributes
        }
      }
      b(e);
      z(c, e)
    })
  }
};
j.pa = function(a, b, c, d) {
  (a = this.O(a)) && a.query(b, c, d)
};
function V(a) {
  this.url = a;
  this.loaded = false;
  var b = this;
  s.h(a, {}, "", function(c) {
    b.u(c)
  })
}
V.prototype.u = function(a) {
  x(a, this);
  if(a.spatialReference) {
    this.spatialReference = r[a.spatialReference.wkid || a.spatialReference.wkt] || n
  }
  this.loaded = true;
  y(this, "load")
};
function W(a) {
  this.la = a ? a.lods : null;
  this.v = a ? r[a.spatialReference.wkid || a.spatialReference.wkt] : p;
  if(!this.v) {
    throw new Error("unsupported Spatial Reference");
  }
  this.V = a ? a.lods[0].resolution : 156543.033928;
  this.minZoom = Math.floor(Math.log(this.v.A() / this.V / 256) / Math.LN2 + 0.5);
  this.maxZoom = a ? this.minZoom + this.la.length - 1 : 20;
  if(m.Size) {
    this.Y = a ? new m.Size(a.cols, a.rows) : new m.Size(256, 256)
  }
  this.W = Math.pow(2, this.minZoom) * this.V;
  this.na = a ? a.origin.x : -2.0037508342787E7;
  this.oa = a ? a.origin.y : 2.0037508342787E7;
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
  a = this.v.q([a.x * this.W + this.na, this.oa - a.y * this.W]);
  return new m.LatLng(a[1], a[0])
};
new W;
function X(a, b) {
  b = b || {};
  if(b.opacity) {
    this.e = b.opacity;
    delete b.opacity
  }
  x(b, this);
  this.d = a instanceof U ? a : new U(a);
  if(b.T) {
    var c = extractString_(this.d.url, "", "://"), d = extractString_(this.d.url, "://", "/");
    d = extractString_(this.d.url, c + "://" + d, "");
    this.Z = c + "://" + b.T + d;
    this.U = parseInt(extractString_(b.T, "[", "]"), 10)
  }
  this.name = this.name || this.d.name;
  this.maxZoom = this.maxZoom || 19;
  this.minZoom = this.minZoom || 0;
  if(this.d.loaded) {
    this.u(b)
  }else {
    var e = this;
    m.event.addListenerOnce(this.d, "load", function() {
      e.u(b)
    })
  }
  this.l = {};
  this.t = b.map
}
X.prototype.u = function(a) {
  if(this.d.tileInfo) {
    this.r = new W(this.d.tileInfo);
    this.minZoom = a.minZoom || this.r.minZoom;
    this.maxZoom = a.maxZoom || this.r.maxZoom
  }
};
X.prototype.getTileUrl = function(a, b) {
  var c = b - (this.r ? this.r.minZoom : this.minZoom), d = "";
  if(!isNaN(a.x) && !isNaN(a.y) && c >= 0 && a.x >= 0 && a.y >= 0) {
    d = this.d.url;
    if(this.Z) {
      d = this.Z.replace("[" + this.U + "]", "" + (a.y + a.x) % this.U)
    }
    if(this.d.singleFusedMapCache === false) {
      c = this.r || this.t ? this.t.getProjection() : Projection.$;
      if(!c instanceof W) {
        c = Projection.$
      }
      d = c.Y;
      var e = 1 << b, f = new m.Point(a.x * d.width / e, (a.y + 1) * d.height / e);
      e = new m.Point((a.x + 1) * d.width / e, a.y * d.height / e);
      f = new m.LatLngBounds(c.fromPointToLatLng(f), c.fromPointToLatLng(e));
      e = {f:"image"};
      e.bounds = f;
      e.width = d.width;
      e.height = d.height;
      e.imageSR = c.v;
      d = this.d.N(e)
    }else {
      d = d + "/tile/" + c + "/" + a.y + "/" + a.x
    }
  }
  return d
};
X.prototype.P = function(a) {
  this.e = a;
  var b = this.l;
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
  x(b, this);
  var d = a;
  if(u(a)) {
    d = [new X(a, b)]
  }else {
    if(a instanceof U) {
      d = [new X(a, b)]
    }else {
      if(a instanceof X) {
        d = [a]
      }else {
        if(a.length > 0 && u(a[0])) {
          d = [];
          for(c = 0;c < a.length;c++) {
            d[c] = new X(a[c], b)
          }
        }
      }
    }
  }
  this.I = d;
  this.l = {};
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
    this.tileSize = d[0].r.Y;
    this.projection = d[0].r
  }else {
    this.tileSize = new m.Size(256, 256)
  }
  if(!this.name) {
    this.name = d[0].name
  }
}
Y.prototype.getTile = function(a, b, c) {
  for(var d = c.createElement("div"), e = "_" + a.x + "_" + a.y + "_" + b, f = 0;f < this.I.length;f++) {
    var g = this.I[f];
    if(b <= g.maxZoom && b >= g.minZoom) {
      var h = g.getTileUrl(a, b);
      if(h) {
        var i = c.createElement(document.all ? "img" : "div");
        i.style.border = "0px none";
        i.style.margin = "0px";
        i.style.padding = "0px";
        i.style.overflow = "hidden";
        i.style.position = "absolute";
        i.style.top = "0px";
        i.style.left = "0px";
        i.style.width = "" + this.tileSize.width + "px";
        i.style.height = "" + this.tileSize.height + "px";
        if(document.all) {
          i.src = h
        }else {
          i.style.backgroundImage = "url(" + h + ")"
        }
        d.appendChild(i);
        g.l[e] = i;
        if(g.e !== undefined) {
          B(i, g.e)
        }else {
          this.e !== undefined && B(i, this.e)
        }
      }
    }
  }
  this.l[e] = d;
  d.setAttribute("tid", e);
  return d
};
Y.prototype.getTile = Y.prototype.getTile;
Y.prototype.releaseTile = function(a) {
  if(a.getAttribute("tid")) {
    a = a.getAttribute("tid");
    this.l[a] && delete this.l[a];
    for(var b = 0;b < this.I.length;b++) {
      var c = this.I[b];
      c.l[a] && delete c.l[a]
    }
  }
};
Y.prototype.releaseTile = Y.prototype.releaseTile;
Y.prototype.P = function(a) {
  this.e = a;
  var b = this.l;
  for(var c in b) {
    if(b.hasOwnProperty(c)) {
      for(var d = b[c].childNodes, e = 0;e < d.length;e++) {
        B(d[e], a)
      }
    }
  }
};
Y.prototype.setMap = function(a) {
  if(this.t) {
    this.t = a;
    var b = this;
    this.Aa = m.event.addListener(a, "maptypeid_changed", function() {
      if(b.t) {
        var c = b.t.aa;
        if(!c) {
          c = document.createElement("div");
          b.za.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(c);
          b.t.aa = c
        }
      }
    })
  }
};
function Z(a, b) {
  b = b || {};
  this.d = a instanceof U ? a : new U(a);
  this.e = b.opacity || 1;
  this.da = b.va || {};
  this.H = this.D = false;
  this.p = null;
  b.map && this.setMap(b.map)
}
Z.prototype = new m.OverlayView;
Z.prototype.onAdd = function() {
  var a = document.createElement("div");
  a.style.position = "absolute";
  a.style.border = "none";
  a.style.position = "absolute";
  this.p = a;
  this.getPanes().overlayLayer.appendChild(a);
  this.e && B(a, this.e);
  var b = this;
  this.ba = m.event.addListener(this.getMap(), "bounds_changed", function() {
    $(b)
  })
};
Z.prototype.onAdd = Z.prototype.onAdd;
Z.prototype.onRemove = function() {
  m.event.removeListener(this.ba);
  this.p.parentNode.removeChild(this.p);
  this.p = null
};
Z.prototype.onRemove = Z.prototype.onRemove;
Z.prototype.draw = function() {
  if(!this.D || this.H === true) {
    $(this)
  }
};
Z.prototype.draw = Z.prototype.draw;
Z.prototype.P = function(a) {
  this.e = a = Math.min(Math.max(a, 0), 1);
  setNodeOpacity_(this.p, a)
};
function $(a) {
  if(a.D === true) {
    a.H = true
  }else {
    var b = a.getMap(), c = b ? b.getBounds() : null;
    if(c) {
      var d = a.da;
      d.bounds = c;
      c = p;
      var e = b.getDiv();
      d.width = e.offsetWidth;
      d.height = e.offsetHeight;
      if((b = b.getProjection()) && b instanceof W) {
        c = b.v
      }
      d.imageSR = c;
      triggerEvent(a, "drawstart");
      a.D = true;
      a.p.style.backgroundImage = "";
      a.d.N(d, function(f) {
        a.D = false;
        if(a.H === true) {
          a.H = false;
          $(a)
        }else {
          if(f.href) {
            var g = a.getProjection(), h = f.bounds, i = g.fromLatLngToDivPixel(h.getSouthWest());
            g = g.fromLatLngToDivPixel(h.getNorthEast());
            h = a.p;
            h.style.left = i.x + "px";
            h.style.top = g.y + "px";
            h.style.width = g.x - i.x + "px";
            h.style.height = i.y - g.y + "px";
            a.p.style.backgroundImage = "url(" + f.href + ")";
            a.P(a.e)
          }
          triggerEvent(a, "drawend")
        }
      })
    }
  }
}
;k("gmaps.ags.Util", s, void 0);
s.getJSON = s.h;
s.addToMap = s.L;
s.removeFromMap = s.qa;
k("gmaps.ags.Config", q, void 0);
k("gmaps.ags.SpatialReference", K, void 0);
K.register = function(a, b) {
  var c = r["" + a];
  if(c) {
    return c
  }
  if(b instanceof K) {
    c = r["" + a] = b
  }else {
    c = b || a;
    var d = {wkt:a};
    if(a === parseInt(a, 10)) {
      d = {wkid:a}
    }
    var e = t(c, 'PROJECTION["', '"]'), f = t(c, "SPHEROID[", "]").split(",");
    if(e !== "") {
      d.unit = parseFloat(t(t(c, "PROJECTION", ""), "UNIT[", "]").split(",")[1]);
      d.semi_major = parseFloat(f[1]);
      d.inverse_flattening = parseFloat(f[2]);
      d.latitude_of_origin = parseFloat(t(c, '"Latitude_Of_Origin",', "]"));
      d.central_meridian = parseFloat(t(c, '"Central_Meridian",', "]"));
      d.false_easting = parseFloat(t(c, '"False_Easting",', "]"));
      d.false_northing = parseFloat(t(c, '"False_Northing",', "]"))
    }
    switch(e) {
      case "":
        c = new K(d);
        break;
      case "Lambert_Conformal_Conic":
        d.standard_parallel_1 = parseFloat(t(c, '"Standard_Parallel_1",', "]"));
        d.standard_parallel_2 = parseFloat(t(c, '"Standard_Parallel_2",', "]"));
        c = new N(d);
        break;
      case "Transverse_Mercator":
        d.scale_factor = parseFloat(t(c, '"Scale_Factor",', "]"));
        c = new P(d);
        break;
      case "Albers":
        d.standard_parallel_1 = parseFloat(t(c, '"Standard_Parallel_1",', "]"));
        d.standard_parallel_2 = parseFloat(extractString_(c, '"Standard_Parallel_2",', "]"));
        c = new R(d);
        break;
      default:
        throw new Error(e + "  not supported");
    }
    if(c) {
      r["" + a] = c
    }
  }
  return c
};
K.prototype.forward = K.prototype.forward;
K.prototype.inverse = K.prototype.q;
k("gmaps.ags.Albers", R, void 0);
k("gmaps.ags.LambertConformalConic", N, void 0);
k("gmaps.ags.SphereMercator", Q, void 0);
k("gmaps.ags.TransverseMercator", P, void 0);
k("gmaps.ags.GeometryType", {POINT:"esriGeometryPoint", MULTIPOINT:"esriGeometryMultipoint", POLYLINE:"esriGeometryPolyline", POLYGON:"esriGeometryPolygon", ENVELOPE:"esriGeometryEnvelope"}, void 0);
k("gmaps.ags.Catalog", function(a) {
  this.url = a;
  var b = this;
  getJSON_(a, {}, "", function(c) {
    x(c, b);
    y(b, "load")
  })
}, void 0);
k("gmaps.ags.Layer", T, void 0);
T.prototype.load = T.prototype.load;
k("gmaps.ags.MapService", U, void 0);
U.prototype.getLayer = U.prototype.O;
U.prototype.hasLoaded = U.prototype.ia;
U.prototype.getInitialBounds = U.prototype.fa;
U.prototype.getLayers = U.prototype.ga;
U.prototype.getTables = U.prototype.ha;
U.prototype.exportMap = U.prototype.N;
U.prototype.identify = U.prototype.ja;
U.prototype.find = U.prototype.find;
U.prototype.queryLayer = U.prototype.pa;
k("gmaps.ags.GeocodeService", V, void 0);
k("gmaps.ags.GeometryService", function(a) {
  this.url = a
}, void 0);
k("gmaps.ags.GeocodeService", V, void 0);
k("gmaps.ags.GPService", function(a) {
  this.url = a;
  this.loaded = false;
  var b = this;
  s.h(a, {}, "", function(c) {
    x(c, b);
    b.loaded = true;
    y(b, "load")
  })
}, void 0);
k("gmaps.ags.GPTask", function(a) {
  this.url = a;
  this.loaded = false;
  var b = this;
  s.h(a, {}, "", function(c) {
    x(c, b);
    b.loaded = true;
    y(b, "load")
  })
}, void 0);
k("gmaps.ags.RouteTask", function(a) {
  this.url = a
}, void 0);
k("gmaps.ags.RouteTask", V, void 0);
k("gmaps.ags.Projection", W, void 0);
k("gmaps.ags.TileLayer", X, void 0);
k("gmaps.ags.MapOverlay", Z, void 0);
k("gmaps.ags.MapType", Y, void 0);})()
