(function(){/*
 http://google-maps-utility-library-v3.googlecode.com
*/
var h, i = Math.PI / 180, l = 0, m = google.maps, n, o, q, r = {S:null, R:false}, s = {}, t = {};
function u(a, b, c) {
  var d = b === "" ? 0 : a.indexOf(b);
  return a.substring(d + b.length, c === "" ? a.length : a.indexOf(c, d + b.length))
}
function v(a, b, c) {
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
function w() {
  m.event.trigger.apply(this, arguments)
}
function aa(a, b) {
  var c = "";
  if(a) {
    c += a.getTime() - a.getTimezoneOffset() * 6E4
  }
  if(b) {
    c += ", " + (b.getTime() - b.getTimezoneOffset() * 6E4)
  }
  return c
}
function x(a, b) {
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
function ba(a) {
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
function ca() {
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
var y = "esriGeometryPoint", z = "esriGeometryMultipoint", A = "esriGeometryPolyline", B = "esriGeometryPolygon", C = "esriGeometryEnvelope";
function da(a) {
  var b = a;
  if(a && a.splice && a.length > 0) {
    b = a[0]
  }
  if(b instanceof m.LatLng || b instanceof m.Marker) {
    return a && a.splice && a.length > 1 ? z : y
  }else {
    if(b instanceof m.Polyline) {
      return A
    }else {
      if(b instanceof m.Polygon) {
        return B
      }else {
        if(b instanceof m.LatLngBounds) {
          return C
        }else {
          if(b.x !== undefined && b.y !== undefined) {
            return y
          }else {
            if(b.points) {
              return z
            }else {
              if(b.paths) {
                return A
              }else {
                if(b.rings) {
                  return B
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
function D(a) {
  var b = a;
  if(a && a.splice && a.length > 0) {
    b = a[0]
  }
  if(b && b.splice && b.length > 0) {
    b = b[0]
  }
  if(b instanceof m.LatLng || b instanceof m.Marker || b instanceof m.Polyline || b instanceof m.Polygon || b instanceof m.LatLngBounds) {
    return true
  }
  return false
}
function E(a, b) {
  for(var c = [], d, e = 0, f = a.getLength();e < f;e++) {
    d = a.getAt(e);
    c.push("[" + d.lng() + "," + d.lat() + "]")
  }
  b && c.length > 0 && c.push("[" + a.getAt(0).lng() + "," + a.getAt(0).lat() + "]");
  return c.join(",")
}
function G(a) {
  var b;
  if(typeof a === "object") {
    if(a && a.splice) {
      b = [];
      for(var c = 0, d = a.length;c < d;c++) {
        b.push(G(a[c]))
      }
      return"[" + b.join(",") + "]"
    }else {
      if(D(a)) {
        var e;
        d = "{";
        switch(da(a)) {
          case y:
            e = a && a.splice ? a[0] : a;
            if(e instanceof m.Marker) {
              e = e.getPosition()
            }
            d += "x:" + e.lng() + ",y:" + e.lat();
            break;
          case z:
            c = [];
            for(b = 0;b < a.length;b++) {
              e = a[b] instanceof m.Marker ? a[b].getPosition() : a[b];
              c.push("[" + e.lng() + "," + e.lat() + "]")
            }
            d += "points: [" + c.join(",") + "]";
            break;
          case A:
            c = [];
            a = a && a.splice ? a : [a];
            for(b = 0;b < a.length;b++) {
              c.push("[" + E(a[b].getPath()) + "]")
            }
            d += "paths:[" + c.join(",") + "]";
            break;
          case B:
            c = [];
            e = a && a.splice ? a[0] : a;
            a = e.getPaths();
            for(b = 0;b < a.getLength();b++) {
              c.push("[" + E(a.getAt(b), true) + "]")
            }
            d += "rings:[" + c.join(",") + "]";
            break;
          case C:
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
              b += c + ":" + G(a[c])
            }
          }
          return"{" + b + "}"
        }
      }
    }
  }
  return a.toString()
}
function H(a) {
  var b = "";
  if(a) {
    a.f = a.f || "json";
    for(var c in a) {
      if(a.hasOwnProperty(c) && a[c] !== null && a[c] !== undefined) {
        var d = G(a[c]);
        b += c + "=" + (escape ? escape(d) : encodeURIComponent(d)) + "&"
      }
    }
  }
  return b
}
function I(a, b, c, d) {
  var e = "ags_jsonp_" + l++ + "_" + Math.floor(Math.random() * 1E6), f = null;
  b = b || {};
  b[c || "callback"] = e + " && " + e;
  b = H(b);
  var j = document.getElementsByTagName("head")[0];
  if(!j) {
    throw new Error("document must have header tag");
  }
  window[e] = function() {
    delete window[e];
    f && j.removeChild(f);
    f = null;
    d.apply(null, arguments);
    w(t, "jsonpend", e)
  };
  if((b + a).length < 2E3 && !r.R) {
    f = document.createElement("script");
    f.src = a + (a.indexOf("?") === -1 ? "?" : "&") + b;
    f.id = e;
    j.appendChild(f)
  }else {
    c = window.location;
    c = c.protocol + "//" + c.hostname + (!c.port || c.port === 80 ? "" : ":" + c.port + "/");
    var g = true;
    if(a.toLowerCase().indexOf(c.toLowerCase()) !== -1) {
      g = false
    }
    if(r.R) {
      g = true
    }
    if(g && !r.S) {
      throw new Error("No proxyUrl property in Config is defined");
    }
    var k = ca();
    k.onreadystatechange = function() {
      if(k.readyState === 4) {
        if(k.status === 200) {
          eval(k.responseText)
        }else {
          throw new Error("Error code " + k.status);
        }
      }
    };
    k.open("POST", g ? r.S + "?" + a : a, true);
    k.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    k.send(b)
  }
  w(t, "jsonpstart", e);
  return e
}
t.ea = function(a, b, c, d) {
  I(a, b, c, d)
};
t.Q = function(a, b) {
  if(b && b.splice) {
    for(var c, d = 0, e = b.length;d < e;d++) {
      if((c = b[d]) && c.splice) {
        t.Q(a, c)
      }else {
        D(c) && c.setMap(a)
      }
    }
  }
};
t.ia = function(a, b) {
  t.Q(null, a);
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
J.prototype.n = function(a) {
  return a
};
J.prototype.m = function() {
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
  var b = a.J, c = a.N * i, d = a.O * i, e = a.K * i;
  this.a = a.z / a.C;
  this.e = a.q * i;
  this.h = a.H;
  this.i = a.I;
  a = 1 / b;
  b = 2 * a - a * a;
  this.d = Math.sqrt(b);
  a = this.j(c, b);
  b = this.j(d, b);
  e = M(this, e, this.d);
  c = M(this, c, this.d);
  d = M(this, d, this.d);
  this.b = Math.log(a / b) / Math.log(c / d);
  this.F = a / (this.b * Math.pow(c, this.b));
  this.g = this.p(this.a, this.F, e, this.b)
}
L.prototype = new J;
L.prototype.j = function(a, b) {
  var c = Math.sin(a);
  return Math.cos(a) / Math.sqrt(1 - b * c * c)
};
function M(a, b, c) {
  a = c * Math.sin(b);
  return Math.tan(Math.PI / 4 - b / 2) / Math.pow((1 - a) / (1 + a), c / 2)
}
h = L.prototype;
h.p = function(a, b, c, d) {
  return a * b * Math.pow(c, d)
};
h.o = function(a, b, c) {
  c = b * Math.sin(c);
  return Math.PI / 2 - 2 * Math.atan(a * Math.pow((1 - c) / (1 + c), b / 2))
};
h.M = function(a, b, c) {
  var d = 0;
  c = c;
  for(var e = this.o(a, b, c);Math.abs(e - c) > 1.0E-9 && d < 10;) {
    d++;
    c = e;
    e = this.o(a, b, c)
  }
  return e
};
h.forward = function(a) {
  var b = a[0] * i;
  a = this.p(this.a, this.F, M(this, a[1] * i, this.d), this.b);
  b = this.b * (b - this.e);
  return[this.h + a * Math.sin(b), this.i + this.g - a * Math.cos(b)]
};
h.n = function(a) {
  var b = a[0] - this.h, c = a[1] - this.i;
  a = Math.atan(b / (this.g - c));
  b = Math.pow((this.b > 0 ? 1 : -1) * Math.sqrt(b * b + (this.g - c) * (this.g - c)) / (this.a * this.F), 1 / this.b);
  return[(a / this.b + this.e) / i, this.M(b, this.d, Math.PI / 2 - 2 * Math.atan(b)) / i]
};
h.m = function() {
  return Math.PI * 2 * this.a
};
function N(a) {
  a = a || {};
  J.call(this, a);
  this.a = a.z / a.C;
  var b = a.J;
  this.t = a.ba;
  var c = a.K * i;
  this.e = a.q * i;
  this.h = a.H;
  this.i = a.I;
  a = 1 / b;
  this.c = 2 * a - a * a;
  this.s = this.c * this.c;
  this.G = this.s * this.c;
  this.l = this.c / (1 - this.c);
  this.P = this.j(c, this.a, this.c, this.s, this.G)
}
N.prototype = new J;
N.prototype.j = function(a, b, c, d, e) {
  return b * ((1 - c / 4 - 3 * d / 64 - 5 * e / 256) * a - (3 * c / 8 + 3 * d / 32 + 45 * e / 1024) * Math.sin(2 * a) + (15 * d / 256 + 45 * e / 1024) * Math.sin(4 * a) - 35 * e / 3072 * Math.sin(6 * a))
};
N.prototype.forward = function(a) {
  var b = a[1] * i, c = a[0] * i;
  a = this.a / Math.sqrt(1 - this.c * Math.pow(Math.sin(b), 2));
  var d = Math.pow(Math.tan(b), 2), e = this.l * Math.pow(Math.cos(b), 2);
  c = (c - this.e) * Math.cos(b);
  var f = this.j(b, this.a, this.c, this.s, this.G);
  return[this.h + this.t * a * (c + (1 - d + e) * Math.pow(c, 3) / 6 + (5 - 18 * d + d * d + 72 * e - 58 * this.l) * Math.pow(c, 5) / 120), this.i + this.t * (f - this.P) + a * Math.tan(b) * (c * c / 2 + (5 - d + 9 * e + 4 * e * e) * Math.pow(c, 4) / 120 + (61 - 58 * d + d * d + 600 * e - 330 * this.l) * Math.pow(c, 6) / 720)]
};
N.prototype.n = function(a) {
  var b = a[0], c = a[1];
  a = (1 - Math.sqrt(1 - this.c)) / (1 + Math.sqrt(1 - this.c));
  c = (this.P + (c - this.i) / this.t) / (this.a * (1 - this.c / 4 - 3 * this.s / 64 - 5 * this.G / 256));
  a = c + (3 * a / 2 - 27 * Math.pow(a, 3) / 32) * Math.sin(2 * c) + (21 * a * a / 16 - 55 * Math.pow(a, 4) / 32) * Math.sin(4 * c) + 151 * Math.pow(a, 3) / 6 * Math.sin(6 * c) + 1097 * Math.pow(a, 4) / 512 * Math.sin(8 * c);
  c = this.l * Math.pow(Math.cos(a), 2);
  var d = Math.pow(Math.tan(a), 2), e = this.a / Math.sqrt(1 - this.c * Math.pow(Math.sin(a), 2)), f = this.a * (1 - this.c) / Math.pow(1 - this.c * Math.pow(Math.sin(a), 2), 1.5);
  b = (b - this.h) / (e * this.t);
  e = a - e * Math.tan(a) / f * (b * b / 2 - (5 + 3 * d + 10 * c - 4 * c * c - 9 * this.l) * Math.pow(b, 4) / 24 + (61 + 90 * d + 28 * c + 45 * d * d - 252 * this.l - 3 * c * c) * Math.pow(b, 6) / 720);
  return[(this.e + (b - (1 + 2 * d + c) * Math.pow(b, 3) / 6 + (5 - 2 * c + 28 * d - 3 * c * c + 8 * this.l + 24 * d * d) * Math.pow(b, 5) / 120) / Math.cos(a)) / i, e / i]
};
N.prototype.m = function() {
  return Math.PI * 2 * this.a
};
function O(a) {
  a = a || {};
  J.call(this, a);
  this.a = (a.z || 6378137) / (a.C || 1);
  this.e = (a.q || 0) * i
}
O.prototype = new J;
O.prototype.forward = function(a) {
  var b = a[1] * i;
  return[this.a * (a[0] * i - this.e), this.a / 2 * Math.log((1 + Math.sin(b)) / (1 - Math.sin(b)))]
};
O.prototype.n = function(a) {
  return[(a[0] / this.a + this.e) / i, (Math.PI / 2 - 2 * Math.atan(Math.exp(-a[1] / this.a))) / i]
};
O.prototype.m = function() {
  return Math.PI * 2 * this.a
};
function P(a) {
  a = a || {};
  J.call(this, a);
  var b = a.J, c = a.N * i, d = a.O * i, e = a.K * i;
  this.a = a.z / a.C;
  this.e = a.q * i;
  this.h = a.H;
  this.i = a.I;
  a = 1 / b;
  b = 2 * a - a * a;
  this.d = Math.sqrt(b);
  a = this.j(c, b);
  b = this.j(d, b);
  c = Q(this, c, this.d);
  d = Q(this, d, this.d);
  e = Q(this, e, this.d);
  this.b = (a * a - b * b) / (d - c);
  this.D = a * a + this.b * c;
  this.g = this.p(this.a, this.D, this.b, e)
}
P.prototype = new J;
P.prototype.j = function(a, b) {
  var c = Math.sin(a);
  return Math.cos(a) / Math.sqrt(1 - b * c * c)
};
function Q(a, b, c) {
  a = c * Math.sin(b);
  return(1 - c * c) * (Math.sin(b) / (1 - a * a) - 1 / (2 * c) * Math.log((1 - a) / (1 + a)))
}
h = P.prototype;
h.p = function(a, b, c, d) {
  return a * Math.sqrt(b - c * d) / c
};
h.o = function(a, b, c) {
  var d = b * Math.sin(c);
  return c + (1 - d * d) * (1 - d * d) / (2 * Math.cos(c)) * (a / (1 - b * b) - Math.sin(c) / (1 - d * d) + Math.log((1 - d) / (1 + d)) / (2 * b))
};
h.M = function(a, b, c) {
  var d = 0;
  c = c;
  for(var e = this.o(a, b, c);Math.abs(e - c) > 1.0E-8 && d < 10;) {
    d++;
    c = e;
    e = this.o(a, b, c)
  }
  return e
};
h.forward = function(a) {
  var b = a[0] * i;
  a = this.p(this.a, this.D, this.b, Q(this, a[1] * i, this.d));
  b = this.b * (b - this.e);
  return[this.h + a * Math.sin(b), this.i + this.g - a * Math.cos(b)]
};
h.n = function(a) {
  var b = a[0] - this.h;
  a = a[1] - this.i;
  var c = Math.sqrt(b * b + (this.g - a) * (this.g - a)), d = this.b > 0 ? 1 : -1;
  c = (this.D - c * c * this.b * this.b / (this.a * this.a)) / this.b;
  return[(Math.atan(d * b / (d * this.g - d * a)) / this.b + this.e) / i, this.M(c, this.d, Math.asin(c / 2)) / i]
};
h.m = function() {
  return Math.PI * 2 * this.a
};
h.m = function() {
  return Math.PI * 2 * this.a
};
n = new K({wkid:4326});
o = new K({wkid:4269});
q = new O({wkid:102113, semi_major:6378137, central_meridian:0, unit:1});
s = {"4326":n, "4269":o, "102113":q, "102100":new O({wkid:102100, semi_major:6378137, central_meridian:0, unit:1})};
t.ha = function(a, b) {
  var c = s["" + a];
  if(c) {
    return c
  }
  if(b instanceof J) {
    c = s["" + a] = b
  }else {
    c = b || a;
    var d = {wkt:a};
    if(a === parseInt(a, 10)) {
      d = {wkid:a}
    }
    var e = u(c, 'PROJECTION["', '"]'), f = u(c, "SPHEROID[", "]").split(",");
    if(e !== "") {
      d.C = parseFloat(u(u(c, "PROJECTION", ""), "UNIT[", "]").split(",")[1]);
      d.z = parseFloat(f[1]);
      d.J = parseFloat(f[2]);
      d.K = parseFloat(u(c, '"Latitude_Of_Origin",', "]"));
      d.q = parseFloat(u(c, '"Central_Meridian",', "]"));
      d.H = parseFloat(u(c, '"False_Easting",', "]"));
      d.I = parseFloat(u(c, '"False_Northing",', "]"))
    }
    switch(e) {
      case "":
        c = new J(d);
        break;
      case "Lambert_Conformal_Conic":
        d.N = parseFloat(u(c, '"Standard_Parallel_1",', "]"));
        d.O = parseFloat(u(c, '"Standard_Parallel_2",', "]"));
        c = new L(d);
        break;
      case "Transverse_Mercator":
        d.ba = parseFloat(u(c, '"Scale_Factor",', "]"));
        c = new N(d);
        break;
      case "Albers":
        d.N = parseFloat(u(c, '"Standard_Parallel_1",', "]"));
        d.O = parseFloat(u(c, '"Standard_Parallel_2",', "]"));
        c = new P(d);
        break;
      default:
        throw new Error(e + "  not supported");
    }
    if(c) {
      s["" + a] = c
    }
  }
  return c
};
function R(a) {
  this.url = a;
  this.definition = null
}
R.prototype.load = function() {
  var a = this;
  this.u || I(this.url, {}, "", function(b) {
    v(b, a);
    a.u = true;
    w(a, "load")
  })
};
function S(a, b) {
  this.url = a;
  this.u = false;
  var c = a.split("/");
  this.name = c[c.length - 2].replace(/_/g, " ");
  b = b || {};
  b.ca || this.load()
}
S.prototype.load = function() {
  var a = this;
  I(this.url, {}, "", function(b) {
    ea(a, b)
  })
};
function ea(a, b) {
  v(b, a);
  a.spatialReference = b.spatialReference.wkt ? J.ga(b.spatialReference.wkt) : s[b.spatialReference.wkid];
  b.tables !== undefined ? I(a.url + "/layers", {}, "", function(c) {
    T(a, c)
  }) : T(a, b)
}
function T(a, b) {
  var c = [], d = [];
  a.layers = c;
  if(b.tables) {
    a.tables = d
  }
  var e, f, j, g;
  f = 0;
  for(j = b.layers.length;f < j;f++) {
    g = b.layers[f];
    e = new R(a.url + "/" + g.id);
    v(g, e);
    e.visible = e.defaultVisibility;
    c.push(e)
  }
  if(b.tables) {
    f = 0;
    for(j = b.tables.length;f < j;f++) {
      g = b.tables[f];
      e = new R(a.url + "/" + g.id);
      v(g, e);
      d.push(e)
    }
  }
  f = 0;
  for(j = c.length;f < j;f++) {
    e = c[f];
    if(e.subLayerIds) {
      e.B = [];
      d = 0;
      for(g = e.subLayerIds.length;d < g;d++) {
        var k = U(a, e.subLayerIds[d]);
        e.B.push(k);
        k.fa = e
      }
    }
  }
  a.u = true;
  w(a, "load")
}
function U(a, b) {
  var c = a.layers;
  if(c) {
    for(var d = 0, e = c.length;d < e;d++) {
      if(b === c[d].id) {
        return c[d]
      }
      if(b && typeof b === "string" && c[d].name.toLowerCase() === b.toLowerCase()) {
        return c[d]
      }
    }
  }
  return null
}
function fa(a) {
  var b = {};
  if(a.layers) {
    for(var c = 0, d = a.layers.length;c < d;c++) {
      var e = a.layers[c];
      if(e.definition) {
        b[String(e.id)] = e.definition
      }
    }
  }
  return b
}
function ga(a) {
  var b = [];
  if(a.layers) {
    var c, d, e;
    d = 0;
    for(e = a.layers.length;d < e;d++) {
      c = a.layers[d];
      if(c.B) {
        for(var f = 0, j = c.B.length;f < j;f++) {
          if(c.B[f].visible === false) {
            c.visible = false;
            break
          }
        }
      }
    }
    d = 0;
    for(e = a.layers.length;d < e;d++) {
      c = a.layers[d];
      c.visible === true && b.push(c.id)
    }
  }
  return b
}
function ha(a, b, c, d) {
  if(b && b.bounds) {
    var e = {};
    e.f = b.f;
    var f = b.bounds;
    e.bbox = "" + f.getSouthWest().lng() + "," + f.getSouthWest().lat() + "," + f.getNorthEast().lng() + "," + f.getNorthEast().lat();
    e.size = "" + b.width + "," + b.height;
    e.dpi = b.dpi;
    if(b.imageSR) {
      e.imageSR = b.imageSR.wkid ? b.imageSR.wkid : "{wkt:" + b.imageSR.wkt + "}"
    }
    e.bboxSR = "4326";
    e.format = b.format;
    f = b.layerDefinitions;
    if(f === undefined) {
      f = fa(a)
    }
    e.layerDefs = ba(f);
    f = b.layerIds;
    var j = b.layerOption || "show";
    if(f === undefined) {
      f = ga(a)
    }
    if(f.length > 0) {
      e.layers = j + ":" + f.join(",")
    }else {
      if(a.u && c) {
        c({href:null});
        return
      }
    }
    e.transparent = b.transparent === false ? false : true;
    if(b.time) {
      e.time = aa(b.time, b.da)
    }
    e.Y = b.Y;
    if(e.f === "image") {
      return a.url + "/export?" + H(e)
    }else {
      I(a.url + "/export", e, "", function(g) {
        if(g.extent) {
          var k, p = g.extent, F = s[p.spatialReference.wkid || p.spatialReference.wkt];
          F = F || n;
          k = F.n([p.xmin, p.ymin]);
          p = F.n([p.xmax, p.ymax]);
          k = new m.LatLngBounds(new m.LatLng(k[1], k[0]), new m.LatLng(p[1], p[0]));
          g.bounds = k;
          delete g.extent;
          c(g)
        }else {
          g = g.error;
          d && g && g.error && d(g.error)
        }
      })
    }
  }
}
function V(a) {
  this.Z = a ? a.lods : null;
  this.A = a ? s[a.spatialReference.wkid || a.spatialReference.wkt] : q;
  if(!this.A) {
    throw new Error("unsupported Spatial Reference");
  }
  this.T = a ? a.lods[0].resolution : 156543.033928;
  this.minZoom = Math.floor(Math.log(this.A.m() / this.T / 256) / Math.LN2 + 0.5);
  this.maxZoom = a ? this.minZoom + this.Z.length - 1 : 20;
  if(m.Size) {
    this.ja = a ? new m.Size(a.cols, a.rows) : new m.Size(256, 256)
  }
  this.U = Math.pow(2, this.minZoom) * this.T;
  this.$ = a ? a.origin.x : -2.0037508342787E7;
  this.aa = a ? a.origin.y : 2.0037508342787E7;
  if(a) {
    for(var b, c = 0;c < a.lods.length - 1;c++) {
      b = a.lods[c].resolution / a.lods[c + 1].resolution;
      if(b > 2.001 || b < 1.999) {
        throw new Error("This type of map cache is not supported in V3. \nScale ratio between zoom levels must be 2");
      }
    }
  }
}
V.prototype.fromLatLngToPoint = function(a, b) {
  if(!a || isNaN(a.lat()) || isNaN(a.lng())) {
    return null
  }
  var c = this.A.forward([a.lng(), a.lat()]), d = b || new m.Point(0, 0);
  d.x = (c[0] - this.$) / this.U;
  d.y = (this.aa - c[1]) / this.U;
  return d
};
V.prototype.fromLatLngToPoint = V.prototype.fromLatLngToPoint;
new V;
function W(a, b) {
  b = b || {};
  this.L = a instanceof S ? a : new S(a);
  this.w = b.opacity || 1;
  this.X = b.W || {};
  this.v = this.r = false;
  this.k = null;
  b.map && this.setMap(b.map)
}
W.prototype = new m.OverlayView;
W.prototype.onAdd = function() {
  var a = document.createElement("div");
  a.style.position = "absolute";
  a.style.border = "none";
  this.k = a;
  this.getPanes().overlayLayer.appendChild(a);
  this.w && x(a, this.w);
  var b = this;
  this.V = m.event.addListener(this.getMap(), "bounds_changed", function() {
    X(b)
  })
};
W.prototype.onAdd = W.prototype.onAdd;
W.prototype.onRemove = function() {
  m.event.removeListener(this.V);
  this.k.parentNode.removeChild(this.k);
  this.k = null
};
W.prototype.onRemove = W.prototype.onRemove;
W.prototype.draw = function() {
  if(!this.r || this.v === true) {
    X(this)
  }
};
W.prototype.draw = W.prototype.draw;
function X(a) {
  if(a.r === true) {
    a.v = true
  }else {
    var b = a.getMap(), c = b ? b.getBounds() : null;
    if(c) {
      var d = a.X;
      d.bounds = c;
      c = q;
      var e = b.getDiv();
      d.width = e.offsetWidth;
      d.height = e.offsetHeight;
      if((b = b.getProjection()) && b instanceof V) {
        c = b.A
      }
      d.imageSR = c;
      w(a, "drawstart");
      a.r = true;
      a.k.style.backgroundImage = "";
      ha(a.L, d, function(f) {
        a.r = false;
        if(a.v === true) {
          a.v = false;
          X(a)
        }else {
          if(f.href) {
            var j = a.getProjection(), g = f.bounds, k = j.fromLatLngToDivPixel(g.getSouthWest());
            j = j.fromLatLngToDivPixel(g.getNorthEast());
            g = a.k;
            g.style.left = k.x + "px";
            g.style.top = j.y + "px";
            g.style.width = j.x - k.x + "px";
            g.style.height = k.y - j.y + "px";
            a.k.style.backgroundImage = "url(" + f.href + ")";
            f = Math.min(Math.max(a.w, 0), 1);
            a.w = f;
            x(a.k, f)
          }
          w(a, "drawend")
        }
      })
    }
  }
}
;var Y, Z, $;
window.onload = function() {
  var a = {zoom:6, center:new google.maps.LatLng(38, -98), mapTypeId:google.maps.MapTypeId.ROADMAP, streetViewControl:true};
  $ = new google.maps.Map(document.getElementById("map_canvas"), a);
  Y = new W("http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer");
  google.maps.event.addListenerOnce(Y.L, "load", function() {
    var b = Y.L;
    U(b, "Coarse Counties").definition = "STATE_NAME='Kansas' and POP2007>25000";
    U(b, "Detailed Counties").definition = "STATE_NAME='Kansas' and POP2007>25000";
    U(b, "states").definition = "STATE_NAME='Kansas'";
    Y.setMap($)
  });
  Z = new W("http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer", {W:{layerIds:[5, 4, 3], layerOption:"show", layerDefinitions:{"5":"STATE_NAME='New Mexico'", "4":"STATE_NAME='New Mexico' and POP2007>25000", "3":"STATE_NAME='New Mexico' and POP2007>25000"}}});
  Z.setMap($)
};})()
