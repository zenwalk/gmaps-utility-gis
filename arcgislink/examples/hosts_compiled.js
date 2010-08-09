(function(){/*
 http://google-maps-utility-library-v3.googlecode.com
*/
var i, j = Math.PI / 180, l = 0, m = google.maps, o, q, r, s = {Z:null, U:false}, t = {}, u = {};
function v(a, b, c) {
  var d = b === "" ? 0 : a.indexOf(b);
  return a.substring(d + b.length, c === "" ? a.length : a.indexOf(c, d + b.length))
}
function w(a) {
  return a && typeof a === "string"
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
function y() {
  m.event.trigger.apply(this, arguments)
}
function z(a, b) {
  var c = "";
  if(a) {
    c += a.getTime() - a.getTimezoneOffset() * 6E4
  }
  if(b) {
    c += ", " + (b.getTime() - b.getTimezoneOffset() * 6E4)
  }
  return c
}
function A(a, b) {
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
function B(a) {
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
function aa() {
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
function ba(a) {
  var b = a;
  if(a && a.splice && a.length > 0) {
    b = a[0]
  }
  if(b instanceof m.LatLng || b instanceof m.Marker) {
    return a && a.splice && a.length > 1 ? D : C
  }else {
    if(b instanceof m.Polyline) {
      return E
    }else {
      if(b instanceof m.Polygon) {
        return F
      }else {
        if(b instanceof m.LatLngBounds) {
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
  if(b instanceof m.LatLng || b instanceof m.Marker || b instanceof m.Polyline || b instanceof m.Polygon || b instanceof m.LatLngBounds) {
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
        switch(ba(a)) {
          case C:
            e = a && a.splice ? a[0] : a;
            if(e instanceof m.Marker) {
              e = e.getPosition()
            }
            d += "x:" + e.lng() + ",y:" + e.lat();
            break;
          case D:
            c = [];
            for(b = 0;b < a.length;b++) {
              e = a[b] instanceof m.Marker ? a[b].getPosition() : a[b];
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
  var e = "ags_jsonp_" + l++ + "_" + Math.floor(Math.random() * 1E6), f = null;
  b = b || {};
  b[c || "callback"] = e + " && " + e;
  b = K(b);
  var k = document.getElementsByTagName("head")[0];
  if(!k) {
    throw new Error("document must have header tag");
  }
  window[e] = function() {
    delete window[e];
    f && k.removeChild(f);
    f = null;
    d.apply(null, arguments);
    y(u, "jsonpend", e)
  };
  if((b + a).length < 2E3 && !s.U) {
    f = document.createElement("script");
    f.src = a + (a.indexOf("?") === -1 ? "?" : "&") + b;
    f.id = e;
    k.appendChild(f)
  }else {
    c = window.location;
    c = c.protocol + "//" + c.hostname + (!c.port || c.port === 80 ? "" : ":" + c.port + "/");
    var h = true;
    if(a.toLowerCase().indexOf(c.toLowerCase()) !== -1) {
      h = false
    }
    if(s.U) {
      h = true
    }
    if(h && !s.Z) {
      throw new Error("No proxyUrl property in Config is defined");
    }
    var g = aa();
    g.onreadystatechange = function() {
      if(g.readyState === 4) {
        if(g.status === 200) {
          eval(g.responseText)
        }else {
          throw new Error("Error code " + g.status);
        }
      }
    };
    g.open("POST", h ? s.Z + "?" + a : a, true);
    g.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    g.send(b)
  }
  y(u, "jsonpstart", e);
  return e
}
u.ha = function(a, b, c, d) {
  L(a, b, c, d)
};
u.T = function(a, b) {
  if(b && b.splice) {
    for(var c, d = 0, e = b.length;d < e;d++) {
      if((c = b[d]) && c.splice) {
        u.T(a, c)
      }else {
        H(c) && c.setMap(a)
      }
    }
  }
};
u.la = function(a, b) {
  u.T(null, a);
  if(b) {
    a.length = 0
  }
};
function M(a) {
  a = a || {};
  this.wkid = a.wkid;
  this.wkt = a.wkt
}
M.prototype.forward = function(a) {
  return a
};
M.prototype.n = function(a) {
  return a
};
M.prototype.p = function() {
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
  var b = a.N, c = a.Q * j, d = a.R * j, e = a.O * j;
  this.a = a.C / a.G;
  this.e = a.v * j;
  this.i = a.K;
  this.j = a.L;
  a = 1 / b;
  b = 2 * a - a * a;
  this.d = Math.sqrt(b);
  a = this.k(c, b);
  b = this.k(d, b);
  e = P(this, e, this.d);
  c = P(this, c, this.d);
  d = P(this, d, this.d);
  this.b = Math.log(a / b) / Math.log(c / d);
  this.I = a / (this.b * Math.pow(c, this.b));
  this.h = this.r(this.a, this.I, e, this.b)
}
O.prototype = new M;
O.prototype.k = function(a, b) {
  var c = Math.sin(a);
  return Math.cos(a) / Math.sqrt(1 - b * c * c)
};
function P(a, b, c) {
  a = c * Math.sin(b);
  return Math.tan(Math.PI / 4 - b / 2) / Math.pow((1 - a) / (1 + a), c / 2)
}
i = O.prototype;
i.r = function(a, b, c, d) {
  return a * b * Math.pow(c, d)
};
i.q = function(a, b, c) {
  c = b * Math.sin(c);
  return Math.PI / 2 - 2 * Math.atan(a * Math.pow((1 - c) / (1 + c), b / 2))
};
i.P = function(a, b, c) {
  var d = 0;
  c = c;
  for(var e = this.q(a, b, c);Math.abs(e - c) > 1.0E-9 && d < 10;) {
    d++;
    c = e;
    e = this.q(a, b, c)
  }
  return e
};
i.forward = function(a) {
  var b = a[0] * j;
  a = this.r(this.a, this.I, P(this, a[1] * j, this.d), this.b);
  b = this.b * (b - this.e);
  return[this.i + a * Math.sin(b), this.j + this.h - a * Math.cos(b)]
};
i.n = function(a) {
  var b = a[0] - this.i, c = a[1] - this.j;
  a = Math.atan(b / (this.h - c));
  b = Math.pow((this.b > 0 ? 1 : -1) * Math.sqrt(b * b + (this.h - c) * (this.h - c)) / (this.a * this.I), 1 / this.b);
  return[(a / this.b + this.e) / j, this.P(b, this.d, Math.PI / 2 - 2 * Math.atan(b)) / j]
};
i.p = function() {
  return Math.PI * 2 * this.a
};
function Q(a) {
  a = a || {};
  M.call(this, a);
  this.a = a.C / a.G;
  var b = a.N;
  this.A = a.ea;
  var c = a.O * j;
  this.e = a.v * j;
  this.i = a.K;
  this.j = a.L;
  a = 1 / b;
  this.c = 2 * a - a * a;
  this.w = this.c * this.c;
  this.J = this.w * this.c;
  this.m = this.c / (1 - this.c);
  this.S = this.k(c, this.a, this.c, this.w, this.J)
}
Q.prototype = new M;
Q.prototype.k = function(a, b, c, d, e) {
  return b * ((1 - c / 4 - 3 * d / 64 - 5 * e / 256) * a - (3 * c / 8 + 3 * d / 32 + 45 * e / 1024) * Math.sin(2 * a) + (15 * d / 256 + 45 * e / 1024) * Math.sin(4 * a) - 35 * e / 3072 * Math.sin(6 * a))
};
Q.prototype.forward = function(a) {
  var b = a[1] * j, c = a[0] * j;
  a = this.a / Math.sqrt(1 - this.c * Math.pow(Math.sin(b), 2));
  var d = Math.pow(Math.tan(b), 2), e = this.m * Math.pow(Math.cos(b), 2);
  c = (c - this.e) * Math.cos(b);
  var f = this.k(b, this.a, this.c, this.w, this.J);
  return[this.i + this.A * a * (c + (1 - d + e) * Math.pow(c, 3) / 6 + (5 - 18 * d + d * d + 72 * e - 58 * this.m) * Math.pow(c, 5) / 120), this.j + this.A * (f - this.S) + a * Math.tan(b) * (c * c / 2 + (5 - d + 9 * e + 4 * e * e) * Math.pow(c, 4) / 120 + (61 - 58 * d + d * d + 600 * e - 330 * this.m) * Math.pow(c, 6) / 720)]
};
Q.prototype.n = function(a) {
  var b = a[0], c = a[1];
  a = (1 - Math.sqrt(1 - this.c)) / (1 + Math.sqrt(1 - this.c));
  c = (this.S + (c - this.j) / this.A) / (this.a * (1 - this.c / 4 - 3 * this.w / 64 - 5 * this.J / 256));
  a = c + (3 * a / 2 - 27 * Math.pow(a, 3) / 32) * Math.sin(2 * c) + (21 * a * a / 16 - 55 * Math.pow(a, 4) / 32) * Math.sin(4 * c) + 151 * Math.pow(a, 3) / 6 * Math.sin(6 * c) + 1097 * Math.pow(a, 4) / 512 * Math.sin(8 * c);
  c = this.m * Math.pow(Math.cos(a), 2);
  var d = Math.pow(Math.tan(a), 2), e = this.a / Math.sqrt(1 - this.c * Math.pow(Math.sin(a), 2)), f = this.a * (1 - this.c) / Math.pow(1 - this.c * Math.pow(Math.sin(a), 2), 1.5);
  b = (b - this.i) / (e * this.A);
  e = a - e * Math.tan(a) / f * (b * b / 2 - (5 + 3 * d + 10 * c - 4 * c * c - 9 * this.m) * Math.pow(b, 4) / 24 + (61 + 90 * d + 28 * c + 45 * d * d - 252 * this.m - 3 * c * c) * Math.pow(b, 6) / 720);
  return[(this.e + (b - (1 + 2 * d + c) * Math.pow(b, 3) / 6 + (5 - 2 * c + 28 * d - 3 * c * c + 8 * this.m + 24 * d * d) * Math.pow(b, 5) / 120) / Math.cos(a)) / j, e / j]
};
Q.prototype.p = function() {
  return Math.PI * 2 * this.a
};
function R(a) {
  a = a || {};
  M.call(this, a);
  this.a = (a.C || 6378137) / (a.G || 1);
  this.e = (a.v || 0) * j
}
R.prototype = new M;
R.prototype.forward = function(a) {
  var b = a[1] * j;
  return[this.a * (a[0] * j - this.e), this.a / 2 * Math.log((1 + Math.sin(b)) / (1 - Math.sin(b)))]
};
R.prototype.n = function(a) {
  return[(a[0] / this.a + this.e) / j, (Math.PI / 2 - 2 * Math.atan(Math.exp(-a[1] / this.a))) / j]
};
R.prototype.p = function() {
  return Math.PI * 2 * this.a
};
function S(a) {
  a = a || {};
  M.call(this, a);
  var b = a.N, c = a.Q * j, d = a.R * j, e = a.O * j;
  this.a = a.C / a.G;
  this.e = a.v * j;
  this.i = a.K;
  this.j = a.L;
  a = 1 / b;
  b = 2 * a - a * a;
  this.d = Math.sqrt(b);
  a = this.k(c, b);
  b = this.k(d, b);
  c = T(this, c, this.d);
  d = T(this, d, this.d);
  e = T(this, e, this.d);
  this.b = (a * a - b * b) / (d - c);
  this.H = a * a + this.b * c;
  this.h = this.r(this.a, this.H, this.b, e)
}
S.prototype = new M;
S.prototype.k = function(a, b) {
  var c = Math.sin(a);
  return Math.cos(a) / Math.sqrt(1 - b * c * c)
};
function T(a, b, c) {
  a = c * Math.sin(b);
  return(1 - c * c) * (Math.sin(b) / (1 - a * a) - 1 / (2 * c) * Math.log((1 - a) / (1 + a)))
}
i = S.prototype;
i.r = function(a, b, c, d) {
  return a * Math.sqrt(b - c * d) / c
};
i.q = function(a, b, c) {
  var d = b * Math.sin(c);
  return c + (1 - d * d) * (1 - d * d) / (2 * Math.cos(c)) * (a / (1 - b * b) - Math.sin(c) / (1 - d * d) + Math.log((1 - d) / (1 + d)) / (2 * b))
};
i.P = function(a, b, c) {
  var d = 0;
  c = c;
  for(var e = this.q(a, b, c);Math.abs(e - c) > 1.0E-8 && d < 10;) {
    d++;
    c = e;
    e = this.q(a, b, c)
  }
  return e
};
i.forward = function(a) {
  var b = a[0] * j;
  a = this.r(this.a, this.H, this.b, T(this, a[1] * j, this.d));
  b = this.b * (b - this.e);
  return[this.i + a * Math.sin(b), this.j + this.h - a * Math.cos(b)]
};
i.n = function(a) {
  var b = a[0] - this.i;
  a = a[1] - this.j;
  var c = Math.sqrt(b * b + (this.h - a) * (this.h - a)), d = this.b > 0 ? 1 : -1;
  c = (this.H - c * c * this.b * this.b / (this.a * this.a)) / this.b;
  return[(Math.atan(d * b / (d * this.h - d * a)) / this.b + this.e) / j, this.P(c, this.d, Math.asin(c / 2)) / j]
};
i.p = function() {
  return Math.PI * 2 * this.a
};
i.p = function() {
  return Math.PI * 2 * this.a
};
o = new N({wkid:4326});
q = new N({wkid:4269});
r = new R({wkid:102113, semi_major:6378137, central_meridian:0, unit:1});
t = {"4326":o, "4269":q, "102113":r, "102100":new R({wkid:102100, semi_major:6378137, central_meridian:0, unit:1})};
u.ka = function(a, b) {
  var c = t["" + a];
  if(c) {
    return c
  }
  if(b instanceof M) {
    c = t["" + a] = b
  }else {
    c = b || a;
    var d = {wkt:a};
    if(a === parseInt(a, 10)) {
      d = {wkid:a}
    }
    var e = v(c, 'PROJECTION["', '"]'), f = v(c, "SPHEROID[", "]").split(",");
    if(e !== "") {
      d.G = parseFloat(v(v(c, "PROJECTION", ""), "UNIT[", "]").split(",")[1]);
      d.C = parseFloat(f[1]);
      d.N = parseFloat(f[2]);
      d.O = parseFloat(v(c, '"Latitude_Of_Origin",', "]"));
      d.v = parseFloat(v(c, '"Central_Meridian",', "]"));
      d.K = parseFloat(v(c, '"False_Easting",', "]"));
      d.L = parseFloat(v(c, '"False_Northing",', "]"))
    }
    switch(e) {
      case "":
        c = new M(d);
        break;
      case "Lambert_Conformal_Conic":
        d.Q = parseFloat(v(c, '"Standard_Parallel_1",', "]"));
        d.R = parseFloat(v(c, '"Standard_Parallel_2",', "]"));
        c = new O(d);
        break;
      case "Transverse_Mercator":
        d.ea = parseFloat(v(c, '"Scale_Factor",', "]"));
        c = new Q(d);
        break;
      case "Albers":
        d.Q = parseFloat(v(c, '"Standard_Parallel_1",', "]"));
        d.R = parseFloat(v(c, '"Standard_Parallel_2",', "]"));
        c = new S(d);
        break;
      default:
        throw new Error(e + "  not supported");
    }
    if(c) {
      t["" + a] = c
    }
  }
  return c
};
function U(a) {
  this.url = a;
  this.definition = null
}
U.prototype.load = function() {
  var a = this;
  this.s || L(this.url, {}, "", function(b) {
    x(b, a);
    a.s = true;
    y(a, "load")
  })
};
function V(a, b) {
  this.url = a;
  this.s = false;
  var c = a.split("/");
  this.name = c[c.length - 2].replace(/_/g, " ");
  b = b || {};
  b.fa || this.load()
}
V.prototype.load = function() {
  var a = this;
  L(this.url, {}, "", function(b) {
    a.z(b)
  })
};
V.prototype.z = function(a) {
  var b = this;
  x(a, this);
  this.spatialReference = a.spatialReference.wkt ? M.ja(a.spatialReference.wkt) : t[a.spatialReference.wkid];
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
  var e, f, k, h;
  f = 0;
  for(k = b.layers.length;f < k;f++) {
    h = b.layers[f];
    e = new U(a.url + "/" + h.id);
    x(h, e);
    e.visible = e.defaultVisibility;
    c.push(e)
  }
  if(b.tables) {
    f = 0;
    for(k = b.tables.length;f < k;f++) {
      h = b.tables[f];
      e = new U(a.url + "/" + h.id);
      x(h, e);
      d.push(e)
    }
  }
  f = 0;
  for(k = c.length;f < k;f++) {
    e = c[f];
    if(e.subLayerIds) {
      e.D = [];
      d = 0;
      for(h = e.subLayerIds.length;d < h;d++) {
        var g;
        a: {
          g = e.subLayerIds[d];
          var n = a.layers;
          if(n) {
            for(var p = 0, ca = n.length;p < ca;p++) {
              if(g === n[p].id) {
                g = n[p];
                break a
              }
              if(w(g) && n[p].name.toLowerCase() === g.toLowerCase()) {
                g = n[p];
                break a
              }
            }
          }
          g = null
        }
        e.D.push(g);
        g.ia = e
      }
    }
  }
  a.s = true;
  y(a, "load")
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
      if(c.D) {
        for(var f = 0, k = c.D.length;f < k;f++) {
          if(c.D[f].visible === false) {
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
    e.layerDefs = B(f);
    f = b.layerIds;
    var k = b.layerOption || "show";
    if(f === undefined) {
      f = ea(a)
    }
    if(f.length > 0) {
      e.layers = k + ":" + f.join(",")
    }else {
      if(a.s && c) {
        c({href:null});
        return
      }
    }
    e.transparent = b.transparent === false ? false : true;
    if(b.time) {
      e.time = z(b.time, b.ga)
    }
    e.ca = b.ca;
    if(e.f === "image") {
      return a.url + "/export?" + K(e)
    }else {
      L(a.url + "/export", e, "", function(h) {
        if(h.extent) {
          var g, n = h.extent, p = t[n.spatialReference.wkid || n.spatialReference.wkt];
          p = p || o;
          g = p.n([n.xmin, n.ymin]);
          n = p.n([n.xmax, n.ymax]);
          g = new m.LatLngBounds(new m.LatLng(g[1], g[0]), new m.LatLng(n[1], n[0]));
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
  this.da = a ? a.lods : null;
  this.u = a ? t[a.spatialReference.wkid || a.spatialReference.wkt] : r;
  if(!this.u) {
    throw new Error("unsupported Spatial Reference");
  }
  this.$ = a ? a.lods[0].resolution : 156543.033928;
  this.minZoom = Math.floor(Math.log(this.u.p() / this.$ / 256) / Math.LN2 + 0.5);
  this.maxZoom = a ? this.minZoom + this.da.length - 1 : 20;
  if(m.Size) {
    this.aa = a ? new m.Size(a.cols, a.rows) : new m.Size(256, 256)
  }
  this.B = Math.pow(2, this.minZoom) * this.$;
  this.X = a ? a.origin.x : -2.0037508342787E7;
  this.Y = a ? a.origin.y : 2.0037508342787E7;
  if(a) {
    for(var b, c = 0;c < a.lods.length - 1;c++) {
      b = a.lods[c].resolution / a.lods[c + 1].resolution;
      if(b > 2.001 || b < 1.999) {
        throw new Error("This type of map cache is not supported in V3. \nScale ratio between zoom levels must be 2");
      }
    }
  }
}
X.prototype.fromLatLngToPoint = function(a, b) {
  if(!a || isNaN(a.lat()) || isNaN(a.lng())) {
    return null
  }
  var c = this.u.forward([a.lng(), a.lat()]), d = b || new m.Point(0, 0);
  d.x = (c[0] - this.X) / this.B;
  d.y = (this.Y - c[1]) / this.B;
  return d
};
X.prototype.fromLatLngToPoint = X.prototype.fromLatLngToPoint;
X.prototype.fromPointToLatLng = function(a) {
  if(a === null) {
    return null
  }
  a = this.u.n([a.x * this.B + this.X, this.Y - a.y * this.B]);
  return new m.LatLng(a[1], a[0])
};
var Y = new X;
function Z(a, b) {
  b = b || {};
  if(b.opacity) {
    this.t = b.opacity;
    delete b.opacity
  }
  x(b, this);
  this.g = a instanceof V ? a : new V(a);
  if(b.M) {
    var c = v(this.g.url, "", "://");
    this.ba = c + "://" + b.M + v(this.g.url, c + "://" + v(this.g.url, "://", "/"), "");
    this.W = parseInt(v(b.M, "[", "]"), 10)
  }
  this.name = this.name || this.g.name;
  this.maxZoom = this.maxZoom || 19;
  this.minZoom = this.minZoom || 0;
  if(this.g.s) {
    this.z(b)
  }else {
    var d = this;
    m.event.addListenerOnce(this.g, "load", function() {
      d.z(b)
    })
  }
  this.o = {};
  this.V = b.map
}
Z.prototype.z = function(a) {
  if(this.g.tileInfo) {
    this.l = new X(this.g.tileInfo);
    this.minZoom = a.minZoom || this.l.minZoom;
    this.maxZoom = a.maxZoom || this.l.maxZoom
  }
};
Z.prototype.getTileUrl = function(a, b) {
  var c = b - (this.l ? this.l.minZoom : this.minZoom), d = "";
  if(!isNaN(a.x) && !isNaN(a.y) && c >= 0 && a.x >= 0 && a.y >= 0) {
    d = this.g.url;
    if(this.ba) {
      d = this.ba.replace("[" + this.W + "]", "" + (a.y + a.x) % this.W)
    }
    if(this.g.singleFusedMapCache === false) {
      c = this.l || this.V ? this.V.getProjection() : Y;
      if(!c instanceof X) {
        c = Y
      }
      d = c.aa;
      var e = 1 << b, f = new m.Point(a.x * d.width / e, (a.y + 1) * d.height / e);
      e = new m.Point((a.x + 1) * d.width / e, a.y * d.height / e);
      f = new m.LatLngBounds(c.fromPointToLatLng(f), c.fromPointToLatLng(e));
      e = {f:"image"};
      e.bounds = f;
      e.width = d.width;
      e.height = d.height;
      e.imageSR = c.u;
      d = fa(this.g, e)
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
    this.t = b.opacity;
    delete b.opacity
  }
  x(b, this);
  var d = a;
  if(w(a)) {
    d = [new Z(a, b)]
  }else {
    if(a instanceof V) {
      d = [new Z(a, b)]
    }else {
      if(a instanceof Z) {
        d = [a]
      }else {
        if(a.length > 0 && w(a[0])) {
          d = [];
          for(c = 0;c < a.length;c++) {
            d[c] = new Z(a[c], b)
          }
        }
      }
    }
  }
  this.F = d;
  this.o = {};
  if(b.maxZoom !== undefined) {
    this.maxZoom = b.maxZoom
  }else {
    var e = 0;
    for(c = 0;c < d.length;c++) {
      e = Math.max(e, d[c].maxZoom)
    }
    this.maxZoom = e
  }
  if(d[0].l) {
    this.tileSize = d[0].l.aa;
    this.projection = d[0].l
  }else {
    this.tileSize = new m.Size(256, 256)
  }
  if(!this.name) {
    this.name = d[0].name
  }
}
$.prototype.getTile = function(a, b, c) {
  for(var d = c.createElement("div"), e = "_" + a.x + "_" + a.y + "_" + b, f = 0;f < this.F.length;f++) {
    var k = this.F[f];
    if(b <= k.maxZoom && b >= k.minZoom) {
      var h = k.getTileUrl(a, b);
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
        k.o[e] = g;
        if(k.t !== undefined) {
          A(g, k.t)
        }else {
          this.t !== undefined && A(g, this.t)
        }
      }
    }
  }
  this.o[e] = d;
  d.setAttribute("tid", e);
  return d
};
$.prototype.getTile = $.prototype.getTile;
$.prototype.releaseTile = function(a) {
  if(a.getAttribute("tid")) {
    a = a.getAttribute("tid");
    this.o[a] && delete this.o[a];
    for(var b = 0;b < this.F.length;b++) {
      var c = this.F[b];
      c.o[a] && delete c.o[a]
    }
  }
};
$.prototype.releaseTile = $.prototype.releaseTile;
new m.OverlayView;
var ga = Z;window.onload = function() {
  var a = {zoom:14, center:new google.maps.LatLng(35.227, -80.84), mapTypeId:"arcgis", mapTypeControlOptions:{mapTypeIds:["arcgis"]}, streetViewControl:true};
  a = new google.maps.Map(document.getElementById("map_canvas"), a);
  var b = new ga("http://maps.ci.charlotte.nc.us/ArcGIS/rest/services/GET/BaseMapWM/MapServer", {M:"mt[4].ci.charlotte.nc.us"});
  b = new $([b], {name:"ArcGIS"});
  a.mapTypes.set("arcgis", b);
  a.setMapTypeId("arcgis")
};})()
