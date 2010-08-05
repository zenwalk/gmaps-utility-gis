(function(){/*
 http://google-maps-utility-library-v3.googlecode.com
*/
var f = Math.PI / 180, h = 0, j = google.maps, k, m, n, o = {proxyUrl:null, alwaysUseProxy:false}, p = {}, q = {};
function r() {
  j.event.trigger.apply(this, arguments)
}
function s() {
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
var u = "esriGeometryPoint", v = "esriGeometryMultipoint", w = "esriGeometryPolyline", x = "esriGeometryPolygon", y = "esriGeometryEnvelope";
function z(a) {
  var b = a;
  if(a && a.splice && a.length > 0) {
    b = a[0]
  }
  if(b instanceof j.LatLng || b instanceof j.Marker) {
    return a && a.splice && a.length > 1 ? v : u
  }else {
    if(b instanceof j.Polyline) {
      return w
    }else {
      if(b instanceof j.Polygon) {
        return x
      }else {
        if(b instanceof j.LatLngBounds) {
          return y
        }else {
          if(b.x !== undefined && b.y !== undefined) {
            return u
          }else {
            if(b.points) {
              return v
            }else {
              if(b.paths) {
                return w
              }else {
                if(b.rings) {
                  return x
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
function A(a) {
  var b = a;
  if(a && a.splice && a.length > 0) {
    b = a[0]
  }
  if(b && b.splice && b.length > 0) {
    b = b[0]
  }
  if(b instanceof j.LatLng || b instanceof j.Marker || b instanceof j.Polyline || b instanceof j.Polygon || b instanceof j.LatLngBounds) {
    return true
  }
  return false
}
function B(a, b) {
  for(var c = [], e, d = 0, g = a.getLength();d < g;d++) {
    e = a.getAt(d);
    c.push("[" + e.lng() + "," + e.lat() + "]")
  }
  b && c.length > 0 && c.push("[" + a.getAt(0).lng() + "," + a.getAt(0).lat() + "]");
  return c.join(",")
}
function C(a) {
  var b;
  if(typeof a === "object") {
    if(a && a.splice) {
      b = [];
      for(var c = 0, e = a.length;c < e;c++) {
        b.push(C(a[c]))
      }
      return"[" + b.join(",") + "]"
    }else {
      if(A(a)) {
        var d;
        e = "{";
        switch(z(a)) {
          case u:
            d = a && a.splice ? a[0] : a;
            if(d instanceof j.Marker) {
              d = d.getPosition()
            }
            e += "x:" + d.lng() + ",y:" + d.lat();
            break;
          case v:
            c = [];
            for(b = 0;b < a.length;b++) {
              d = a[b] instanceof j.Marker ? a[b].getPosition() : a[b];
              c.push("[" + d.lng() + "," + d.lat() + "]")
            }
            e += "points: [" + c.join(",") + "]";
            break;
          case w:
            c = [];
            a = a && a.splice ? a : [a];
            for(b = 0;b < a.length;b++) {
              c.push("[" + B(a[b].getPath()) + "]")
            }
            e += "paths:[" + c.join(",") + "]";
            break;
          case x:
            c = [];
            d = a && a.splice ? a[0] : a;
            a = d.getPaths();
            for(b = 0;b < a.getLength();b++) {
              c.push("[" + B(a.getAt(b), true) + "]")
            }
            e += "rings:[" + c.join(",") + "]";
            break;
          case y:
            d = a && a.splice ? a[0] : a;
            e += "xmin:" + d.getSouthWest().lng() + ",ymin:" + d.getSouthWest().lat() + ",xmax:" + d.getNorthEast().lng() + ",ymax:" + d.getNorthEast().lat();
            break
        }
        e += ", spatialReference:{wkid:4326}";
        e += "}";
        return e
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
              b += c + ":" + C(a[c])
            }
          }
          return"{" + b + "}"
        }
      }
    }
  }
  return a.toString()
}
function D(a) {
  var b = "";
  if(a) {
    a.f = a.f || "json";
    for(var c in a) {
      if(a.hasOwnProperty(c) && a[c] !== null && a[c] !== undefined) {
        var e = C(a[c]);
        b += c + "=" + (escape ? escape(e) : encodeURIComponent(e)) + "&"
      }
    }
  }
  return b
}
function E(a, b, c, e) {
  var d = "ags_jsonp_" + h++ + "_" + Math.floor(Math.random() * 1E6), g = null;
  b = b || {};
  b[c || "callback"] = d + " && " + d;
  b = D(b);
  var t = document.getElementsByTagName("head")[0];
  if(!t) {
    throw new Error("document must have header tag");
  }
  window[d] = function() {
    delete window[d];
    g && t.removeChild(g);
    g = null;
    e.apply(null, arguments);
    r(q, "jsonpend", d)
  };
  if((b + a).length < 2E3 && !o.g) {
    g = document.createElement("script");
    g.src = a + (a.indexOf("?") === -1 ? "?" : "&") + b;
    g.id = d;
    t.appendChild(g)
  }else {
    c = window.location;
    c = c.protocol + "//" + c.hostname + (!c.port || c.port === 80 ? "" : ":" + c.port + "/");
    var l = true;
    if(a.toLowerCase().indexOf(c.toLowerCase()) !== -1) {
      l = false
    }
    if(o.g) {
      l = true
    }
    if(l && !o.j) {
      throw new Error("No proxyUrl property in Config is defined");
    }
    var i = s();
    i.onreadystatechange = function() {
      if(i.readyState === 4) {
        if(i.status === 200) {
          eval(i.responseText)
        }else {
          throw new Error("Error code " + i.status);
        }
      }
    };
    i.open("POST", l ? o.j + "?" + a : a, true);
    i.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    i.send(b)
  }
  r(q, "jsonpstart", d);
  return d
}
q.h = function(a, b, c, e) {
  E(a, b, c, e)
};
q.a = function(a, b) {
  if(b && b.splice) {
    for(var c, e = 0, d = b.length;e < d;e++) {
      if((c = b[e]) && c.splice) {
        q.a(a, c)
      }else {
        A(c) && c.setMap(a)
      }
    }
  }
};
q.o = function(a, b) {
  q.a(null, a);
  if(b) {
    a.length = 0
  }
};
function F(a) {
  a = a || {};
  this.wkid = a.wkid;
  this.wkt = a.wkt
}
F.prototype.b = function() {
  return 360
};
F.prototype.toJSON = function() {
  return"{" + (this.wkid ? " wkid:" + this.wkid : "wkt: '" + this.wkt + "'") + "}"
};
function G(a) {
  a = a || {};
  F.call(this, a)
}
G.prototype = new F;
function H(a) {
  a = a || {};
  F.call(this, a);
  this.e = (a.q || 6378137) / (a.s || 1);
  this.l = (a.k || 0) * f
}
H.prototype = new F;
H.prototype.b = function() {
  return Math.PI * 2 * this.e
};
k = new G({wkid:4326});
m = new G({wkid:4269});
n = new H({wkid:102113, semi_major:6378137, central_meridian:0, unit:1});
p = {"4326":k, "4269":m, "102113":n, "102100":new H({wkid:102100, semi_major:6378137, central_meridian:0, unit:1})};
new (function(a) {
  this.i = a ? a.lods : null;
  this.d = a ? p[a.spatialReference.wkid || a.spatialReference.wkt] : n;
  if(!this.d) {
    throw new Error("unsupported Spatial Reference");
  }
  this.c = a ? a.lods[0].resolution : 156543.033928;
  this.minZoom = Math.floor(Math.log(this.d.b() / this.c / 256) / Math.LN2 + 0.5);
  this.maxZoom = a ? this.minZoom + this.i.length - 1 : 20;
  if(j.Size) {
    this.r = a ? new j.Size(a.cols, a.rows) : new j.Size(256, 256)
  }
  this.p = Math.pow(2, this.minZoom) * this.c;
  this.m = a ? a.origin.x : -2.0037508342787E7;
  this.n = a ? a.origin.y : 2.0037508342787E7;
  if(a) {
    for(var b, c = 0;c < a.lods.length - 1;c++) {
      b = a.lods[c].resolution / a.lods[c + 1].resolution;
      if(b > 2.001 || b < 1.999) {
        throw new Error("This type of map cache is not supported in V3. \nScale ratio between zoom levels must be 2");
      }
    }
  }
});
j.OverlayView && new j.OverlayView;
var I = q;window.onload = function() {
  I.h("http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/BloomfieldHillsMichigan/Parcels/MapServer", {}, "callback", function(a) {
    a = "layerdesc:" + a.serviceDescription;
    var b = document.getElementById("log");
    b.innerHTML = b.innerHTML + a + "</br>"
  })
};})()
