(function(){/*
 http://google-maps-utility-library-v3.googlecode.com
*/
var f = Math.PI / 180, i = 0, j = google.maps, k, n, o, p = {};
function q() {
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
function r(a) {
  var b = a;
  if(a && a.splice && a.length > 0) {
    b = a[0]
  }
  if(b instanceof j.LatLng || b instanceof j.Marker) {
    return a && a.splice && a.length > 1 ? "esriGeometryMultipoint" : "esriGeometryPoint"
  }else {
    if(b instanceof j.Polyline) {
      return"esriGeometryPolyline"
    }else {
      if(b instanceof j.Polygon) {
        return"esriGeometryPolygon"
      }else {
        if(b instanceof j.LatLngBounds) {
          return"esriGeometryEnvelope"
        }else {
          if(b.x !== undefined && b.y !== undefined) {
            return"esriGeometryPoint"
          }else {
            if(b.l) {
              return"esriGeometryMultipoint"
            }else {
              if(b.paths) {
                return"esriGeometryPolyline"
              }else {
                if(b.m) {
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
function s(a, b) {
  for(var c = [], e, d = 0, g = a.getLength();d < g;d++) {
    e = a.getAt(d);
    c.push("[" + e.lng() + "," + e.lat() + "]")
  }
  b && c.length > 0 && c.push("[" + a.getAt(0).lng() + "," + a.getAt(0).lat() + "]");
  return c.join(",")
}
function t(a) {
  var b;
  if(typeof a === "object") {
    if(a && a.splice) {
      b = [];
      for(var c = 0, e = a.length;c < e;c++) {
        b.push(t(a[c]))
      }
      return"[" + b.join(",") + "]"
    }else {
      if((b = a) && a.splice && a.length > 0) {
        b = a[0]
      }
      if(b && b.splice && b.length > 0) {
        b = b[0]
      }
      b = b instanceof j.LatLng || b instanceof j.Marker || b instanceof j.Polyline || b instanceof j.Polygon || b instanceof j.LatLngBounds ? true : false;
      if(b) {
        var d;
        e = "{";
        switch(r(a)) {
          case "esriGeometryPoint":
            d = a && a.splice ? a[0] : a;
            if(d instanceof j.Marker) {
              d = d.getPosition()
            }
            e += "x:" + d.lng() + ",y:" + d.lat();
            break;
          case "esriGeometryMultipoint":
            c = [];
            for(b = 0;b < a.length;b++) {
              d = a[b] instanceof j.Marker ? a[b].getPosition() : a[b];
              c.push("[" + d.lng() + "," + d.lat() + "]")
            }
            e += "points: [" + c.join(",") + "]";
            break;
          case "esriGeometryPolyline":
            c = [];
            a = a && a.splice ? a : [a];
            for(b = 0;b < a.length;b++) {
              c.push("[" + s(a[b].getPath()) + "]")
            }
            e += "paths:[" + c.join(",") + "]";
            break;
          case "esriGeometryPolygon":
            c = [];
            d = a && a.splice ? a[0] : a;
            a = d.getPaths();
            for(b = 0;b < a.getLength();b++) {
              c.push("[" + s(a.getAt(b), true) + "]")
            }
            e += "rings:[" + c.join(",") + "]";
            break;
          case "esriGeometryEnvelope":
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
              b += c + ":" + t(a[c])
            }
          }
          return"{" + b + "}"
        }
      }
    }
  }
  return a.toString()
}
function u(a) {
  var b = "";
  if(a) {
    a.f = a.f || "json";
    for(var c in a) {
      if(a.hasOwnProperty(c) && a[c] !== null && a[c] !== undefined) {
        var e = t(a[c]);
        b += c + "=" + (escape ? escape(e) : encodeURIComponent(e)) + "&"
      }
    }
  }
  return b
}
function v(a, b, c, e) {
  var d = "ags_jsonp_" + i++ + "_" + Math.floor(Math.random() * 1E6), g = null;
  b = b || {};
  b[c || "callback"] = d + " && " + d;
  b = u(b);
  var l = document.getElementsByTagName("head")[0];
  if(!l) {
    throw new Error("document must have header tag");
  }
  window[d] = function() {
    delete window[d];
    g && l.removeChild(g);
    g = null;
    e.apply(null, arguments)
  };
  if((b + a).length < 2E3) {
    g = document.createElement("script");
    g.src = a + (a.indexOf("?") === -1 ? "?" : "&") + b;
    g.id = d;
    l.appendChild(g)
  }else {
    c = window.location;
    c = c.protocol + "//" + c.hostname + (!c.port || c.port === 80 ? "" : ":" + c.port + "/");
    var m = true;
    if(a.toLowerCase().indexOf(c.toLowerCase()) !== -1) {
      m = false
    }
    if(m) {
      throw new Error("No proxyUrl property in Config is defined");
    }
    var h = q();
    h.onreadystatechange = function() {
      if(h.readyState === 4) {
        if(h.status === 200) {
          eval(h.responseText)
        }else {
          throw new Error("Error code " + h.status);
        }
      }
    };
    h.open("POST", m ? "null?" + a : a, true);
    h.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    h.send(b)
  }
  return d
}
function w(a) {
  a = a || {};
  this.wkid = a.wkid;
  this.wkt = a.wkt
}
w.prototype.toJSON = function() {
  return"{" + (this.wkid ? " wkid:" + this.wkid : "wkt: '" + this.wkt + "'") + "}"
};
function x(a) {
  a = a || {};
  w.call(this, a)
}
x.prototype = new w;
function y(a) {
  a = a || {};
  w.call(this, a);
  this.h = (a.c || 6378137) / (a.d || 1);
  this.i = (a.a || 0) * f
}
y.prototype = new w;
k = new x({wkid:4326});
n = new x({wkid:4269});
o = new y({wkid:102113, c:6378137, a:0, d:1});
p = {"4326":k, "4269":n, "102113":o, "102100":new y({wkid:102100, c:6378137, a:0, d:1})};
new (function(a) {
  this.e = a ? a.lods : null;
  this.g = a ? p[a.spatialReference.wkid || a.spatialReference.wkt] : o;
  if(!this.g) {
    throw new Error("unsupported Spatial Reference");
  }
  this.b = a ? a.lods[0].resolution : 156543.033928;
  this.minZoom = Math.floor(Math.log(360 / this.b / 256) / Math.LN2 + 0.5);
  this.maxZoom = a ? this.minZoom + this.e.length - 1 : 20;
  if(j.Size) {
    this.o = a ? new j.Size(a.cols, a.rows) : new j.Size(256, 256)
  }
  this.n = Math.pow(2, this.minZoom) * this.b;
  this.j = a ? a.origin.x : -2.0037508342787E7;
  this.k = a ? a.origin.y : 2.0037508342787E7;
  if(a) {
    for(var b, c = 0;c < a.lods.length - 1;c++) {
      b = a.lods[c].resolution / a.lods[c + 1].resolution;
      if(b > 2.001 || b < 1.999) {
        throw new Error("This type of map cache is not supported in V3. \nScale ratio between zoom levels must be 2");
      }
    }
  }
});
new j.OverlayView;window.onload = function() {
  v("http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/BloomfieldHillsMichigan/Parcels/MapServer", {}, "callback", function(a) {
    alert(a.serviceDescription)
  })
};})()
