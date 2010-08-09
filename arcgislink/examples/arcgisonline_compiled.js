(function(){/*
 http://google-maps-utility-library-v3.googlecode.com
*/
var i = Math.PI / 180, k = 0, l = google.maps, n, p, q, r = {V:null, P:false}, s = {}, t = {};
function u(a, b, c) {
  var d = b === "" ? 0 : a.indexOf(b);
  return a.substring(d + b.length, c === "" ? a.length : a.indexOf(c, d + b.length))
}
function v(a) {
  return a && typeof a === "string"
}
function w(a, b, c) {
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
function x() {
  l.event.trigger.apply(this, arguments)
}
function y(a, b) {
  var c = "";
  if(a) {
    c += a.getTime() - a.getTimezoneOffset() * 6E4
  }
  if(b) {
    c += ", " + (b.getTime() - b.getTimezoneOffset() * 6E4)
  }
  return c
}
function z(a, b) {
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
function A(a) {
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
function B() {
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
var C = "esriGeometryPoint", D = "esriGeometryMultipoint", E = "esriGeometryPolyline", F = "esriGeometryPolygon", G = "esriGeometryEnvelope";
function aa(a) {
  var b = a;
  if(a && a.splice && a.length > 0) {
    b = a[0]
  }
  if(b instanceof l.LatLng || b instanceof l.Marker) {
    return a && a.splice && a.length > 1 ? D : C
  }else {
    if(b instanceof l.Polyline) {
      return E
    }else {
      if(b instanceof l.Polygon) {
        return F
      }else {
        if(b instanceof l.LatLngBounds) {
          return G
        }else {
          if(b.x !== undefined && b.y !== undefined) {
            return C
          }else {
            if(b.points) {
              return D
            }else {
              if(b.paths) {
                return E
              }else {
                if(b.rings) {
                  return F
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
function H(a) {
  var b = a;
  if(a && a.splice && a.length > 0) {
    b = a[0]
  }
  if(b && b.splice && b.length > 0) {
    b = b[0]
  }
  if(b instanceof l.LatLng || b instanceof l.Marker || b instanceof l.Polyline || b instanceof l.Polygon || b instanceof l.LatLngBounds) {
    return true
  }
  return false
}
function I(a, b) {
  for(var c = [], d, e = 0, f = a.getLength();e < f;e++) {
    d = a.getAt(e);
    c.push("[" + d.lng() + "," + d.lat() + "]")
  }
  b && c.length > 0 && c.push("[" + a.getAt(0).lng() + "," + a.getAt(0).lat() + "]");
  return c.join(",")
}
function J(a) {
  var b;
  if(typeof a === "object") {
    if(a && a.splice) {
      b = [];
      for(var c = 0, d = a.length;c < d;c++) {
        b.push(J(a[c]))
      }
      return"[" + b.join(",") + "]"
    }else {
      if(H(a)) {
        var e;
        d = "{";
        switch(aa(a)) {
          case C:
            e = a && a.splice ? a[0] : a;
            if(e instanceof l.Marker) {
              e = e.getPosition()
            }
            d += "x:" + e.lng() + ",y:" + e.lat();
            break;
          case D:
            c = [];
            for(b = 0;b < a.length;b++) {
              e = a[b] instanceof l.Marker ? a[b].getPosition() : a[b];
              c.push("[" + e.lng() + "," + e.lat() + "]")
            }
            d += "points: [" + c.join(",") + "]";
            break;
          case E:
            c = [];
            a = a && a.splice ? a : [a];
            for(b = 0;b < a.length;b++) {
              c.push("[" + I(a[b].getPath()) + "]")
            }
            d += "paths:[" + c.join(",") + "]";
            break;
          case F:
            c = [];
            e = a && a.splice ? a[0] : a;
            a = e.getPaths();
            for(b = 0;b < a.getLength();b++) {
              c.push("[" + I(a.getAt(b), true) + "]")
            }
            d += "rings:[" + c.join(",") + "]";
            break;
          case G:
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
function K(a) {
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
function L(a, b, c, d) {
  var e = "ags_jsonp_" + k++ + "_" + Math.floor(Math.random() * 1E6), f = null;
  b = b || {};
  b[c || "callback"] = e + " && " + e;
  b = K(b);
  var j = document.getElementsByTagName("head")[0];
  if(!j) {
    throw new Error("document must have header tag");
  }
  window[e] = function() {
    delete window[e];
    f && j.removeChild(f);
    f = null;
    d.apply(null, arguments);
    x(t, "jsonpend", e)
  };
  if((b + a).length < 2E3 && !r.P) {
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
    if(r.P) {
      h = true
    }
    if(h && !r.V) {
      throw new Error("No proxyUrl property in Config is defined");
    }
    var g = B();
    g.onreadystatechange = function() {
      if(g.readyState === 4) {
        if(g.status === 200) {
          eval(g.responseText)
        }else {
          throw new Error("Error code " + g.status);
        }
      }
    };
    g.open("POST", h ? r.V + "?" + a : a, true);
    g.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    g.send(b)
  }
  x(t, "jsonpstart", e);
  return e
}
t.ha = function(a, b, c, d) {
  L(a, b, c, d)
};
t.O = function(a, b) {
  if(b && b.splice) {
    for(var c, d = 0, e = b.length;d < e;d++) {
      if((c = b[d]) && c.splice) {
        t.O(a, c)
      }else {
        H(c) && c.setMap(a)
      }
    }
  }
};
t.ja = function(a, b) {
  t.O(null, a);
  if(b) {
    a.length = 0
  }
};
function M(a) {
  a = a || {};
  this.wkid = a.wkid;
  this.wkt = a.wkt
}
M.prototype.i = function(a) {
  return a
};
M.prototype.m = function() {
  return 360
};
M.prototype.toJSON = function() {
  return"{" + (this.wkid ? " wkid:" + this.wkid : "wkt: '" + this.wkt + "'") + "}"
};
function N(a) {
  a = a || {};
  M.call(this, a)
}
N.prototype = new M;
function O(a) {
  a = a || {};
  M.call(this, a);
  var b = a.H, c = a.K * i, d = a.L * i, e = a.I * i;
  this.a = a.v / a.B;
  this.j = a.s * i;
  this.n = a.F;
  this.o = a.G;
  a = 1 / b;
  b = 2 * a - a * a;
  this.e = Math.sqrt(b);
  a = this.h(c, b);
  b = this.h(d, b);
  e = P(this, e, this.e);
  c = P(this, c, this.e);
  d = P(this, d, this.e);
  this.b = Math.log(a / b) / Math.log(c / d);
  this.N = a / (this.b * Math.pow(c, this.b));
  this.k = this.C(this.a, this.N, e, this.b)
}
O.prototype = new M;
O.prototype.h = function(a, b) {
  var c = Math.sin(a);
  return Math.cos(a) / Math.sqrt(1 - b * c * c)
};
function P(a, b, c) {
  a = c * Math.sin(b);
  return Math.tan(Math.PI / 4 - b / 2) / Math.pow((1 - a) / (1 + a), c / 2)
}
O.prototype.C = function(a, b, c, d) {
  return a * b * Math.pow(c, d)
};
O.prototype.p = function(a, b, c) {
  c = b * Math.sin(c);
  return Math.PI / 2 - 2 * Math.atan(a * Math.pow((1 - c) / (1 + c), b / 2))
};
O.prototype.J = function(a, b, c) {
  var d = 0;
  c = c;
  for(var e = this.p(a, b, c);Math.abs(e - c) > 1.0E-9 && d < 10;) {
    d++;
    c = e;
    e = this.p(a, b, c)
  }
  return e
};
O.prototype.i = function(a) {
  var b = a[0] - this.n, c = a[1] - this.o;
  a = Math.atan(b / (this.k - c));
  b = Math.pow((this.b > 0 ? 1 : -1) * Math.sqrt(b * b + (this.k - c) * (this.k - c)) / (this.a * this.N), 1 / this.b);
  return[(a / this.b + this.j) / i, this.J(b, this.e, Math.PI / 2 - 2 * Math.atan(b)) / i]
};
O.prototype.m = function() {
  return Math.PI * 2 * this.a
};
function Q(a) {
  a = a || {};
  M.call(this, a);
  this.a = a.v / a.B;
  var b = a.H;
  this.S = a.ea;
  var c = a.I * i;
  this.j = a.s * i;
  this.n = a.F;
  this.o = a.G;
  a = 1 / b;
  this.c = 2 * a - a * a;
  this.D = this.c * this.c;
  this.Q = this.D * this.c;
  this.t = this.c / (1 - this.c);
  this.$ = this.h(c, this.a, this.c, this.D, this.Q)
}
Q.prototype = new M;
Q.prototype.h = function(a, b, c, d, e) {
  return b * ((1 - c / 4 - 3 * d / 64 - 5 * e / 256) * a - (3 * c / 8 + 3 * d / 32 + 45 * e / 1024) * Math.sin(2 * a) + (15 * d / 256 + 45 * e / 1024) * Math.sin(4 * a) - 35 * e / 3072 * Math.sin(6 * a))
};
Q.prototype.i = function(a) {
  var b = a[0], c = a[1];
  a = (1 - Math.sqrt(1 - this.c)) / (1 + Math.sqrt(1 - this.c));
  c = (this.$ + (c - this.o) / this.S) / (this.a * (1 - this.c / 4 - 3 * this.D / 64 - 5 * this.Q / 256));
  a = c + (3 * a / 2 - 27 * Math.pow(a, 3) / 32) * Math.sin(2 * c) + (21 * a * a / 16 - 55 * Math.pow(a, 4) / 32) * Math.sin(4 * c) + 151 * Math.pow(a, 3) / 6 * Math.sin(6 * c) + 1097 * Math.pow(a, 4) / 512 * Math.sin(8 * c);
  c = this.t * Math.pow(Math.cos(a), 2);
  var d = Math.pow(Math.tan(a), 2), e = this.a / Math.sqrt(1 - this.c * Math.pow(Math.sin(a), 2)), f = this.a * (1 - this.c) / Math.pow(1 - this.c * Math.pow(Math.sin(a), 2), 1.5);
  b = (b - this.n) / (e * this.S);
  e = a - e * Math.tan(a) / f * (b * b / 2 - (5 + 3 * d + 10 * c - 4 * c * c - 9 * this.t) * Math.pow(b, 4) / 24 + (61 + 90 * d + 28 * c + 45 * d * d - 252 * this.t - 3 * c * c) * Math.pow(b, 6) / 720);
  return[(this.j + (b - (1 + 2 * d + c) * Math.pow(b, 3) / 6 + (5 - 2 * c + 28 * d - 3 * c * c + 8 * this.t + 24 * d * d) * Math.pow(b, 5) / 120) / Math.cos(a)) / i, e / i]
};
Q.prototype.m = function() {
  return Math.PI * 2 * this.a
};
function R(a) {
  a = a || {};
  M.call(this, a);
  this.a = (a.v || 6378137) / (a.B || 1);
  this.j = (a.s || 0) * i
}
R.prototype = new M;
R.prototype.i = function(a) {
  return[(a[0] / this.a + this.j) / i, (Math.PI / 2 - 2 * Math.atan(Math.exp(-a[1] / this.a))) / i]
};
R.prototype.m = function() {
  return Math.PI * 2 * this.a
};
function S(a) {
  a = a || {};
  M.call(this, a);
  var b = a.H, c = a.K * i, d = a.L * i, e = a.I * i;
  this.a = a.v / a.B;
  this.j = a.s * i;
  this.n = a.F;
  this.o = a.G;
  a = 1 / b;
  b = 2 * a - a * a;
  this.e = Math.sqrt(b);
  a = this.h(c, b);
  b = this.h(d, b);
  c = T(this, c, this.e);
  d = T(this, d, this.e);
  e = T(this, e, this.e);
  this.b = (a * a - b * b) / (d - c);
  this.M = a * a + this.b * c;
  this.k = this.C(this.a, this.M, this.b, e)
}
S.prototype = new M;
S.prototype.h = function(a, b) {
  var c = Math.sin(a);
  return Math.cos(a) / Math.sqrt(1 - b * c * c)
};
function T(a, b, c) {
  a = c * Math.sin(b);
  return(1 - c * c) * (Math.sin(b) / (1 - a * a) - 1 / (2 * c) * Math.log((1 - a) / (1 + a)))
}
S.prototype.C = function(a, b, c, d) {
  return a * Math.sqrt(b - c * d) / c
};
S.prototype.p = function(a, b, c) {
  var d = b * Math.sin(c);
  return c + (1 - d * d) * (1 - d * d) / (2 * Math.cos(c)) * (a / (1 - b * b) - Math.sin(c) / (1 - d * d) + Math.log((1 - d) / (1 + d)) / (2 * b))
};
S.prototype.J = function(a, b, c) {
  var d = 0;
  c = c;
  for(var e = this.p(a, b, c);Math.abs(e - c) > 1.0E-8 && d < 10;) {
    d++;
    c = e;
    e = this.p(a, b, c)
  }
  return e
};
S.prototype.i = function(a) {
  var b = a[0] - this.n;
  a = a[1] - this.o;
  var c = Math.sqrt(b * b + (this.k - a) * (this.k - a)), d = this.b > 0 ? 1 : -1;
  c = (this.M - c * c * this.b * this.b / (this.a * this.a)) / this.b;
  return[(Math.atan(d * b / (d * this.k - d * a)) / this.b + this.j) / i, this.J(c, this.e, Math.asin(c / 2)) / i]
};
S.prototype.m = function() {
  return Math.PI * 2 * this.a
};
S.prototype.m = function() {
  return Math.PI * 2 * this.a
};
n = new N({wkid:4326});
p = new N({wkid:4269});
q = new R({wkid:102113, semi_major:6378137, central_meridian:0, unit:1});
s = {"4326":n, "4269":p, "102113":q, "102100":new R({wkid:102100, semi_major:6378137, central_meridian:0, unit:1})};
function ba(a, b) {
  var c = s["" + a];
  if(c) {
    return c
  }
  if(b instanceof M) {
    c = s["" + a] = b
  }else {
    c = b || a;
    var d = {wkt:a};
    if(a === parseInt(a, 10)) {
      d = {wkid:a}
    }
    var e = u(c, 'PROJECTION["', '"]'), f = u(c, "SPHEROID[", "]").split(",");
    if(e !== "") {
      d.B = parseFloat(u(u(c, "PROJECTION", ""), "UNIT[", "]").split(",")[1]);
      d.v = parseFloat(f[1]);
      d.H = parseFloat(f[2]);
      d.I = parseFloat(u(c, '"Latitude_Of_Origin",', "]"));
      d.s = parseFloat(u(c, '"Central_Meridian",', "]"));
      d.F = parseFloat(u(c, '"False_Easting",', "]"));
      d.G = parseFloat(u(c, '"False_Northing",', "]"))
    }
    switch(e) {
      case "":
        c = new M(d);
        break;
      case "Lambert_Conformal_Conic":
        d.K = parseFloat(u(c, '"Standard_Parallel_1",', "]"));
        d.L = parseFloat(u(c, '"Standard_Parallel_2",', "]"));
        c = new O(d);
        break;
      case "Transverse_Mercator":
        d.ea = parseFloat(u(c, '"Scale_Factor",', "]"));
        c = new Q(d);
        break;
      case "Albers":
        d.K = parseFloat(u(c, '"Standard_Parallel_1",', "]"));
        d.L = parseFloat(u(c, '"Standard_Parallel_2",', "]"));
        c = new S(d);
        break;
      default:
        throw new Error(e + "  not supported");
    }
    if(c) {
      s["" + a] = c
    }
  }
  return c
}
function U(a) {
  this.url = a;
  this.definition = null
}
U.prototype.load = function() {
  var a = this;
  this.q || L(this.url, {}, "", function(b) {
    w(b, a);
    a.q = true;
    x(a, "load")
  })
};
function V(a, b) {
  this.url = a;
  this.q = false;
  var c = a.split("/");
  this.name = c[c.length - 2].replace(/_/g, " ");
  b = b || {};
  b.fa || this.load()
}
V.prototype.load = function() {
  var a = this;
  L(this.url, {}, "", function(b) {
    a.u(b)
  })
};
V.prototype.u = function(a) {
  var b = this;
  w(a, this);
  this.spatialReference = a.spatialReference.wkt ? ba(a.spatialReference.wkt) : s[a.spatialReference.wkid];
  a.tables !== undefined ? L(this.url + "/layers", {}, "", function(c) {
    W(b, c)
  }) : W(b, a)
};
function W(a, b) {
  var c = [], d = [];
  a.layers = c;
  if(b.tables) {
    a.tables = d
  }
  var e, f, j, h;
  f = 0;
  for(j = b.layers.length;f < j;f++) {
    h = b.layers[f];
    e = new U(a.url + "/" + h.id);
    w(h, e);
    e.visible = e.defaultVisibility;
    c.push(e)
  }
  if(b.tables) {
    f = 0;
    for(j = b.tables.length;f < j;f++) {
      h = b.tables[f];
      e = new U(a.url + "/" + h.id);
      w(h, e);
      d.push(e)
    }
  }
  f = 0;
  for(j = c.length;f < j;f++) {
    e = c[f];
    if(e.subLayerIds) {
      e.z = [];
      d = 0;
      for(h = e.subLayerIds.length;d < h;d++) {
        var g;
        a: {
          g = e.subLayerIds[d];
          var m = a.layers;
          if(m) {
            for(var o = 0, ca = m.length;o < ca;o++) {
              if(g === m[o].id) {
                g = m[o];
                break a
              }
              if(v(g) && m[o].name.toLowerCase() === g.toLowerCase()) {
                g = m[o];
                break a
              }
            }
          }
          g = null
        }
        e.z.push(g);
        g.ia = e
      }
    }
  }
  a.q = true;
  x(a, "load")
}
function da(a) {
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
function ea(a) {
  var b = [];
  if(a.layers) {
    var c, d, e;
    d = 0;
    for(e = a.layers.length;d < e;d++) {
      c = a.layers[d];
      if(c.z) {
        for(var f = 0, j = c.z.length;f < j;f++) {
          if(c.z[f].visible === false) {
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
function fa(a, b, c, d) {
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
      f = da(a)
    }
    e.layerDefs = A(f);
    f = b.layerIds;
    var j = b.layerOption || "show";
    if(f === undefined) {
      f = ea(a)
    }
    if(f.length > 0) {
      e.layers = j + ":" + f.join(",")
    }else {
      if(a.q && c) {
        c({href:null});
        return
      }
    }
    e.transparent = b.transparent === false ? false : true;
    if(b.time) {
      e.time = y(b.time, b.ga)
    }
    e.aa = b.aa;
    if(e.f === "image") {
      return a.url + "/export?" + K(e)
    }else {
      L(a.url + "/export", e, "", function(h) {
        if(h.extent) {
          var g, m = h.extent, o = s[m.spatialReference.wkid || m.spatialReference.wkt];
          o = o || n;
          g = o.i([m.xmin, m.ymin]);
          m = o.i([m.xmax, m.ymax]);
          g = new l.LatLngBounds(new l.LatLng(g[1], g[0]), new l.LatLng(m[1], m[0]));
          h.bounds = g;
          delete h.extent;
          c(h)
        }else {
          h = h.error;
          d && h && h.error && d(h.error)
        }
      })
    }
  }
}
function X(a) {
  this.ba = a ? a.lods : null;
  this.w = a ? s[a.spatialReference.wkid || a.spatialReference.wkt] : q;
  if(!this.w) {
    throw new Error("unsupported Spatial Reference");
  }
  this.W = a ? a.lods[0].resolution : 156543.033928;
  this.minZoom = Math.floor(Math.log(this.w.m() / this.W / 256) / Math.LN2 + 0.5);
  this.maxZoom = a ? this.minZoom + this.ba.length - 1 : 20;
  if(l.Size) {
    this.Y = a ? new l.Size(a.cols, a.rows) : new l.Size(256, 256)
  }
  this.X = Math.pow(2, this.minZoom) * this.W;
  this.ca = a ? a.origin.x : -2.0037508342787E7;
  this.da = a ? a.origin.y : 2.0037508342787E7;
  if(a) {
    for(var b, c = 0;c < a.lods.length - 1;c++) {
      b = a.lods[c].resolution / a.lods[c + 1].resolution;
      if(b > 2.001 || b < 1.999) {
        throw new Error("This type of map cache is not supported in V3. \nScale ratio between zoom levels must be 2");
      }
    }
  }
}
X.prototype.fromPointToLatLng = function(a) {
  if(a === null) {
    return null
  }
  a = this.w.i([a.x * this.X + this.ca, this.da - a.y * this.X]);
  return new l.LatLng(a[1], a[0])
};
var Y = new X;
function Z(a, b) {
  b = b || {};
  if(b.opacity) {
    this.r = b.opacity;
    delete b.opacity
  }
  w(b, this);
  this.d = a instanceof V ? a : new V(a);
  if(b.R) {
    var c = u(this.d.url, "", "://");
    this.Z = c + "://" + b.R + u(this.d.url, c + "://" + u(this.d.url, "://", "/"), "");
    this.U = parseInt(u(b.R, "[", "]"), 10)
  }
  this.name = this.name || this.d.name;
  this.maxZoom = this.maxZoom || 19;
  this.minZoom = this.minZoom || 0;
  if(this.d.q) {
    this.u(b)
  }else {
    var d = this;
    l.event.addListenerOnce(this.d, "load", function() {
      d.u(b)
    })
  }
  this.l = {};
  this.T = b.map
}
Z.prototype.u = function(a) {
  if(this.d.tileInfo) {
    this.g = new X(this.d.tileInfo);
    this.minZoom = a.minZoom || this.g.minZoom;
    this.maxZoom = a.maxZoom || this.g.maxZoom
  }
};
Z.prototype.getTileUrl = function(a, b) {
  var c = b - (this.g ? this.g.minZoom : this.minZoom), d = "";
  if(!isNaN(a.x) && !isNaN(a.y) && c >= 0 && a.x >= 0 && a.y >= 0) {
    d = this.d.url;
    if(this.Z) {
      d = this.Z.replace("[" + this.U + "]", "" + (a.y + a.x) % this.U)
    }
    if(this.d.singleFusedMapCache === false) {
      c = this.g || this.T ? this.T.getProjection() : Y;
      if(!c instanceof X) {
        c = Y
      }
      d = c.Y;
      var e = 1 << b, f = new l.Point(a.x * d.width / e, (a.y + 1) * d.height / e);
      e = new l.Point((a.x + 1) * d.width / e, a.y * d.height / e);
      f = new l.LatLngBounds(c.fromPointToLatLng(f), c.fromPointToLatLng(e));
      e = {f:"image"};
      e.bounds = f;
      e.width = d.width;
      e.height = d.height;
      e.imageSR = c.w;
      d = fa(this.d, e)
    }else {
      d = d + "/tile/" + c + "/" + a.y + "/" + a.x
    }
  }
  return d
};
function $(a, b) {
  b = b || {};
  var c;
  if(b.opacity) {
    this.r = b.opacity;
    delete b.opacity
  }
  w(b, this);
  var d = a;
  if(v(a)) {
    d = [new Z(a, b)]
  }else {
    if(a instanceof V) {
      d = [new Z(a, b)]
    }else {
      if(a instanceof Z) {
        d = [a]
      }else {
        if(a.length > 0 && v(a[0])) {
          d = [];
          for(c = 0;c < a.length;c++) {
            d[c] = new Z(a[c], b)
          }
        }
      }
    }
  }
  this.A = d;
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
  if(d[0].g) {
    this.tileSize = d[0].g.Y;
    this.projection = d[0].g
  }else {
    this.tileSize = new l.Size(256, 256)
  }
  if(!this.name) {
    this.name = d[0].name
  }
}
$.prototype.getTile = function(a, b, c) {
  for(var d = c.createElement("div"), e = "_" + a.x + "_" + a.y + "_" + b, f = 0;f < this.A.length;f++) {
    var j = this.A[f];
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
        j.l[e] = g;
        if(j.r !== undefined) {
          z(g, j.r)
        }else {
          this.r !== undefined && z(g, this.r)
        }
      }
    }
  }
  this.l[e] = d;
  d.setAttribute("tid", e);
  return d
};
$.prototype.getTile = $.prototype.getTile;
$.prototype.releaseTile = function(a) {
  if(a.getAttribute("tid")) {
    a = a.getAttribute("tid");
    this.l[a] && delete this.l[a];
    for(var b = 0;b < this.A.length;b++) {
      var c = this.A[b];
      c.l[a] && delete c.l[a]
    }
  }
};
$.prototype.releaseTile = $.prototype.releaseTile;
new l.OverlayView;window.onload = function() {
  var a = {"USA Topo":["USA_Topo_Maps"], Streets:["World_Street_Map"], "World Topo":["World_Topo_Map"], Imagery:["World_Imagery"], "Labeled Imagery":["World_Imagery", "Reference/World_Boundaries_and_Places"], Terrain:["World_Terrain_Base"], "Labeled Terrain":["World_Terrain_Base", "Reference/World_Reference_Overlay"]}, b = [], c = [];
  for(var d in a) {
    if(a.hasOwnProperty(d)) {
      b.push(d);
      for(var e = a[d], f = 0;f < e.length;f++) {
        e[f] = "http://services.arcgisonline.com/ArcGIS/rest/services/" + e[f] + "/MapServer"
      }
      c.push(new $(e, {name:d}))
    }
  }
  f = {zoom:13, center:new google.maps.LatLng(35.227, -80.84), mapTypeId:google.maps.MapTypeId.ROADMAP, mapTypeControlOptions:{mapTypeIds:b}};
  a = new google.maps.Map(document.getElementById("map_canvas"), f);
  for(f = 0;f < b.length;f++) {
    a.mapTypes.set(b[f], c[f])
  }
  a.setMapTypeId("World Topo")
};})()
