/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @name ArcGIS Server Link for Google Maps Javascript API
 * @version 1.0
 * @author: Nianwei Liu 
 * @fileoverview 
 *  <p><a href="concepts.html">Concepts</a>
 *  | <a href="examples.html">Examples</a>
 *   </p> 
 *  <p>This library lets you add map resources accessible via 
 *    <a  href = 'http://resources.esri.com/help/9.3/arcgisserver/apis/rest/'> 
 *    ESRI ArcGIS Server&#0153; REST API</a> into <a 
 *    href='http://code.google.com/apis/maps/documentation/reference.html'>
 *    Google Maps </a> and provide some additional support for map tiles created 
 *    with different spatial reference and tiling scheme.</p>
 *    <p style='background-color:#E5ECF9'>All classes are available under 
 *    namespace <code>google.maputils.arcgis.*</code>. 
 *    You can replace the normal <code>ArcGIS</code> prefix with the namespace.
 *    <br/>
 *    For example, the <code>ArcGISTileLayer</code> can also be defined
 *    as <code>google.maputils.arcgis.TileLayer</code>. <br/>
 *    If you choose to load namespace only without all any global 
 *    <code>G</code> symbols by passing file=googleapionly in script URL, 
 *    the <code>ArcGIS</code> prefix will not be exported to global scope either.
 *    You must use namespace for all classes in this library.
 *     </p>.
 *    <table style = 'border:0px'>
 *    <tr>
 *    <td colspan=2 style='border:0px;'>Google Maps API related classes</td>
 *    <td colspan=2 style='border:0px;'>REST API related classes</td>
 *    </tr>
 *    <tr>
 *    <td style = 'border:0px;width:200px'>
 *    {@link ArcGISTileLayer}<br/>
 *    {@link ArcGISTileLayerOptions}<br/>
 *    {@link ArcGISMapType}<br/>
 *    {@link ArcGISMapTypeOptions}<br/>
 *    {@link ArcGISTileLayerOverlay}<br/>
 *    {@link ArcGISMapOverlay}<br/>
 *    {@link ArcGISMapOverlayOptions}<br/>
 *    </td>
 *    <td style = 'border:0px;width:200px'>
 *    {@link ArcGISProjection}<br/>
 *    {@link ArcGISUtil} <br/> 
 *    {@link ArcGISConfig} <br/> 
 *    <i> {@link GMercatorProjection}</i>  <br/>
 *    <i> {@link GMap2} </i> <br/>
 *    <i> {@link GMapType}</i> <br/>
 *    </td>
 *    <td style = 'border:0px;width:200px'>
 *    {@link ArcGISMapService}<br/></b>
 *    {@link ArcGISLayer}<br/>
 *    {@link ArcGISGeocodeService}<br/>
 *    {@link ArcGISGeometryService}<br/>
 *     <br/></td>
 *     <td style = 'border:0px;width:200px'>
 *    {@link ArcGISSpatialReference}<br/>
 *    {@link ArcGISSpatialReferences}<br/>
 *    {@link ArcGISGeographic}<br/>
 *    {@link ArcGISLambertConformalConic}<br/>
 *    {@link ArcGISTransverseMercator}<br/>
 *    {@link ArcGISSphereMercator}<br/>
 *    {@link ArcGISFlatSpatialReference}<br/>
 *     </td>
 *    </tr></table>
 *    <p> There are many objects used in the REST API that do not require 
 *    a constructor and can be
 *    used just as object literal in the operation:<br/> 
 *    (note the name of the type does not matter for object literals)</p>
 *    <table style = 'border:0px'><tr>
 *    <td style = 'border:0px;width:200px'>
 *    {@link ArcGISField}<br/>
 *    {@link ArcGISTileInfo}<br/>
 *    {@link ArcGISLOD}<br/>
 *    {@link ArcGISExportMapParameters}<br/>
 *    {@link ArcGISMapImage}<br/>
 *    {@link ArcGISIdentifyParameters}<br/>
 *    {@link ArcGISIdentifyResults}<br/>
 *    {@link ArcGISIdentifyResult}<br/>
 *     <br/></td>
 *     <td style = 'border:0px;width:200px'>
 *    {@link ArcGISQueryParameters}<br/>
 *    {@link ArcGISResultSet}<br/>
 *    {@link ArcGISFeature}<br/>
 *    {@link ArcGISFindParameters}<br/>
 *    {@link ArcGISFindResults}<br/>
 *    {@link ArcGISFindResult}<br/>
 *     </td>
 *     <td style = 'border:0px;width:200px'>
 *    {@link ArcGISGeocodeParameters}<br/>
 *    {@link ArcGISGeocodeResults}<br/>
 *    {@link ArcGISGeocodeResult}<br/>
 *    {@link ArcGISReverseGeocodeParameters}<br/>
 *    {@link ArcGISReverseGeocodeResult}<br/>
 *    </td>
 *     <td style = 'border:0px;width:200px'>
 *    {@link ArcGISGeometry}<br/>
 *    {@link ArcGISPoint}<br/>
 *    {@link ArcGISPolyline}<br/>
 *    {@link ArcGISPolygon}<br/>
 *    {@link ArcGISEnvelope}<br/>
 *    {@link ArcGISMultipoint}<br/>
 *     </td>
 *    </tr></table>
 */
(function () {

  /*jslint browser:true */
  /*global escape */
  
  /**
   *  create a namespace by name such as a.b.c
   * @param {String} ns
   */
  var namespace = function (ns) {
    var i, c, n;
    var names = ns.split('.');
    n = window;
    for (i = 0, c = names.length; i < c; i ++) {
      n[names[i]] = n[names[i]] || {};
      n = n[names[i]];
    }
    return n;
  };
  // deal with the situation when user only loaded namespace.
  var W = window;
  var G = namespace('google.maps');
  var GEvent, GLatLng, GMap2, GProjection, GTileLayer, GCopyrightCollection, 
    GCopyright, GMapType, GMercatorProjection, G_MAP_OVERLAY_LAYER_PANE, 
    GTileLayerOverlay, GInfoWindowTab, GLatLngBounds, GPolygon, GPolyline, 
    GOverlay,  GMarker, GPoint;
  GMap2 = W.GMap2 || G.Map2;
  GEvent = W.GEvent || G.Event;
  GProjection = W.GProjection || G.Projection;
  GTileLayer = W.GTileLayer || G.TileLayer;
  GCopyrightCollection = W.CopyrightCollection || G.CopyrightCollection;
  GCopyright = W.GCopyright || G.Copyright; 
  GMapType = W.GMapType || G.MapType;
  GMercatorProjection = W.GMercatorProjection || G.MercatorProjection;
  G_MAP_OVERLAY_LAYER_PANE = W.G_MAP_OVERLAY_LAYER_PANE || 
    G.MAP_OVERLAY_LAYER_PANE; 
  GTileLayerOverlay = W.GTileLayerOverlay || G.TileLayerOverlay; 
  GInfoWindowTab = W.GInfoWindowTab || G.InfoWindowTab; 
  GLatLngBounds = W.GLatLngBounds || G.LatLngBounds; 
  GPolygon = W.GPolygon || G.Polygon; 
  GPolyline = W.GPolyline || G.Polyline;
  GOverlay = W.GOverlay || G.Overlay; 
  GLatLng = W.GLatLng || G.LatLng;
  GPoint = W.GPoint || G.Point;
  GMarker = W.GMarker || G.Marker;
  
  /**
 * @name ArcGISGeometry
 * @class This is the abstract class representing JSON geometry in the 
 * ArcGIS REST API. 
 * The following types are supported: points, polylines, polygons and envelopes.
 * for more information, see <a href = 
 * 'http://resources.esri.com/help/9.3/arcgisserver/apis/rest/geometry.html'>
 *  Geometry Objects</a>.
 *   <br/> There is no constructor for this class. See subclasses.
 * @property {SpatialReference} [spatialReference]  <b> wkid info only</b>.
 */	
/**
 * @name ArcGISPoint
 * @class A point contains x and y fields along with a spatialReference field.
 * <br/> There is no constructor for this class. Use javascript object literal.
 * Example:
 * <pre>
    {
    "x" : -118.15, "y" : 33.80, "spatialReference" : {"wkid" : 4326}
    }
 * </pre>
 * @property {Number} [x] value of x.
 * @property {Number} [y] value of y.
 * @property {SpatialReference} [spatialReference]  <b> wkid info only</b>.
 */	
/**
 * @name ArcGISPolyline
 * @class A polyline contains an array of paths and a spatialReference.
 * <br/> There is no constructor for this class. Use javascript object literal. 
 * Example:
 * <pre>
    {
    "paths" : [ 
     [ [-97.06138,32.837], [-97.06133,32.836], [-97.06124,32.834] ], 
     [ [-97.06326,32.759], [-97.06298,32.755] ]
    ],
    "spatialReference" : {"wkid" : 4326}
    }
 * </pre>
 * 
 * @property {Number[][][]} [paths] coords of the polyline.
 * @property {SpatialReference} [spatialReference]  <b> wkid info only</b>.
 */	
 /**
 * @name ArcGISPolygon
 * @class A polygon contains an array of rings and a spatialReference.
 * <br/> There is no constructor for this class. Use javascript object literal. 
 * Example:
 * <pre>
    {
    "rings" : [ 
     [ [-97.06138,32.837], [-97.06133,32.836], [-97.06124,32.834], 
     [-97.06127,32.832], [-97.06138,32.837] ], 
     [ [-97.06326,32.759], [-97.06298,32.755], [-97.06153,32.749], 
     [-97.06326,32.759] ]
    ],
    "spatialReference" : {"wkid" : 4326}
    }
 * </pre>
 * 
 * @property {Number[][][]} [rings] coords of the Polygon.
 * @property {SpatialReference} [spatialReference]  <b> wkid info only</b>.
 */	
 /**
 * @name ArcGISMultipoint
 * @class A multipoint contains an array of points and a spatialReference.
 * <br/> There is no constructor for this class. Use javascript object literal. 
 * Example:
 * <pre>
    {
    "points" : [ [-97.06138,32.837], [-97.06133,32.836], [-97.06124,32.834], 
     [-97.06127,32.832] ],
    "spatialReference" : {"wkid" : 4326}
    }
 * </pre>
 * 
 * @property {Number[][]} [points] coords of the Multipoint.
 * @property {SpatialReference} [spatialReference]  <b> wkid info only</b>.
 */	
 /**
 * @name ArcGISEnvelope
 * @class Instances of this class are used to represent an area with bounds.
 * It is similar to <a href='http://code.google.com/apis/maps/documentation/reference.html#GLatLngBounds'>GLatLngBounds</a>
 * but the coordinates are in map units. 
 * <br/> There is no constructor for this class. Use javascript object literal. 
 * Example:
 * <pre>
    {
    "xmin" : -109.55, "ymin" : 25.76, "xmax" : -86.39, "ymax" : 49.94,
    "spatialReference" : {"wkid" : 4326}
    }
 * </pre>
 * @property {Number} [xmin] minimal value of x.
 * @property {Number} [ymin] minimal value of y.
 * @property {Number} [xmax] maximal value of x.
 * @property {Number} [ymax] maximal value of y.
 * @property {SpatialReference} [spatialReference]  <b> wkid info only</b>.
 */	


 /** Radius Per Degree
 * @private
 */
  var RAD_DEG  =  Math.PI / 180;
  
  // The JSDOC tool not work with enums yet?
  /*
   * @name ArcGISESRIGeometryTypes
   * @private
   * @class This is actually a list of constants that represent geometry types. 
   * They should be used directly, e.g.:  
   * <code> var param = {geometryType:ESRI_GEOMETRY_POINT}</code>
   * 
   * @property {String} [ESRI_GEOMETRY_POINT] esriGeometryPoint
   * @property {String} [ESRI_GEOMETRY_POLYLINE] esriGeometryPolyline
   * @property {String} [ESRI_GEOMETRY_POLYGON] esriGeometryPolygon
   * @property {String} [ESRI_GEOMETRY_MULTIPOINT] esriGeometryMultipoint
   * @property {String} [ESRI_GEOMETRY_ENVELOPE] esriGeometryEnvelope
   */
  var ESRI_GEOMETRY_POINT  =  "esriGeometryPoint";
  var ESRI_GEOMETRY_POLYLINE  =  "esriGeometryPolyline";
  var ESRI_GEOMETRY_POLYGON  =  "esriGeometryPolygon";
  var ESRI_GEOMETRY_MULTIPOINT  =  "esriGeometryMultipoint";
  var ESRI_GEOMETRY_ENVELOPE  =  "esriGeometryEnvelope";

  /*
   * @name ArcGISESRISpatialRelTypes
   * @private
   * @class This is actually a list of constants that represent spatial 
   * relationship types. They should be used directly. e.g.:  
   * <code> var param = {spatialRel:ESRI_SPATIALREL_INTERSECTS}</code>
   * @property {String} [ESRI_SPATIALREL_INTERSECTS] esriSpatialRelIntersects 
   * @property {String} [ESRI_SPATIALREL_CONTAINS] esriSpatialRelContains
   * @property {String} [ESRI_SPATIALREL_CROSSES] esriSpatialRelCrosses
   * @property {String} [ESRI_SPATIALREL_ENVELOPEINTERSECTS] esriSpatialRelEnvelopeIntersects
   * @property {String} [ESRI_SPATIALREL_INDEXINTERSECTS] esriSpatialRelIndexIntersects
   * @property {String} [ESRI_SPATIALREL_OVERLAPS] esriSpatialRelOverlaps
   * @property {String} [ESRI_SPATIALREL_TOUCHES] esriSpatialRelTouches
   * @property {String} [ESRI_SPATIALREL_WITHIN] esriSpatialRelWithin
   */
  var ESRI_SPATIALREL_INTERSECTS  =  "esriSpatialRelIntersects";
  var ESRI_SPATIALREL_CONTAINS  =  "esriSpatialRelContains";
  var ESRI_SPATIALREL_CROSSES  =  "esriSpatialRelCrosses";
  var ESRI_SPATIALREL_ENVELOPEINTERSECTS  =  "esriSpatialRelEnvelopeIntersects";
  var ESRI_SPATIALREL_INDEXINTERSECTS  =  "esriSpatialRelIndexIntersects";
  var ESRI_SPATIALREL_OVERLAPS  =  "esriSpatialRelOverlaps";
  var ESRI_SPATIALREL_TOUCHES  =  "esriSpatialRelTouches";
  var ESRI_SPATIALREL_WITHIN  =  "esriSpatialRelWithin";
 
 
/**
 * Extract the substring from full string, between start string and end string
 * @param {Object} full
 * @param {Object} start
 * @param {Object} end
 */
  var extractString = function (full, start, end) {
    var i = (start === '') ? 0 : full.indexOf(start);
    var e = end === '' ? full.length : full.indexOf(end, i + start.length);
    return full.substring(i + start.length, e);
  };
  
  /**
   * Check if the object is String
   * @param {Object} o
   */
  var isString = function (o) {
    return typeof o === 'string';
  };
  
  /**
   * Check if the object is array
   * @param {Object} o
   */
  var isArray = function (o) {
    return o && o.splice;
  };
  
  /**
   * Add the property of the source object to destination object 
   * if not already exists.
   * @param {Object} dest
   * @param {Object} src
   * @param {Boolean} force
   * @return {Object}
   */
  var augmentObject = function (src, dest, force) {
    if (src && dest) {
      var p;
      for (p in src) {
        if (force || !(p in dest)) {
          dest[p] = src[p];
        }
      }
    }
    return dest;
  };
  
  /*
   * Wrapper around GEvent.trigger
   * @param {Object} src
   * @param {Object} evtName
   * @param {Object} args
   */
  var triggerEvent = function (src, evtName, args) {
    if (GEvent) {
      GEvent.trigger.apply(this, arguments);
    }
  };
  
  /**
   * Find out the index of obj in array
   * @param {Array} arr
   * @param {Object} obj
   * @param {Boolean} ignoreCase
   */
  var indexOf = function (arr, obj, ignoreCase) {
    if (arr && obj) {
      if (arr.indexOf && !ignoreCase) {
        return arr.indexOf(obj);
      } else {
        for (var i = 0, c = arr.length; i < c; i++) {
          if (arr[i] === obj || (ignoreCase === true && arr[i].toString().toLowerCase() === obj.toString().toLowerCase())) {
            return i;
          }
        }
      }
    }
    return -1;
  };
  
  var mergeArray = function (arr, sub) {
    for (var i = 0, c = sub.length; i < c; i++) {
      arr.push(sub[i]);
    }
    return arr;
  };
  
  /**
   * Remove element from array
   * @param {Array} arr
   * @param {Object} elm
   */
  var removeFromArray = function (arr, elm) {
    var i = indexOf(arr, elm);
    if (i !== -1) {
      arr.splice(i, 1);
    }
  };
 

  
 
  /**
   * A list of utilities ((<code>google.maputils.arcgis.Util</code>) 
   * for commonly used functions.
   * @name ArcGISUtil
   * @namespace
   */
  var ArcGISUtil = {};
  var jsonpID_ = 0;
  // cross domain function list. this namespace is what gmap is using
  window.ags_jsonp = window.ags_jsonp || {};
  var xdc = window.ags_jsonp;
  
  /**
   * Make Cross Domain Calls. This function returns the
   * script ID which can be used to track the requests. parameters:
   * <ul>
   * <li>url: url of server resource
   * <li>params: an object with name,value pairs. value must be string
   * <li>callbackName: Callback parameter name the server is expecting.e.g:'callback'
   * <li>callbackFn: the actual callback function.
   * </ul>
   * @param {String} url
   * @param {Object} params
   * @param {String} callbackName
   * @param {Function} callbackFn
   * @return {String} scriptID
   */
  ArcGISUtil.getJSON = function (url, params, callbackName, callbackFn) {
    var sid = 'ags_jsonp' + (jsonpID_++) + '_' + Math.floor(Math.random() * 1000000);
    var full = url + (url.indexOf('?') === -1 ? '?' : '&');
    if (params) {
      for (var x in params) {
        if (params.hasOwnProperty(x)) {
          //jslint complaint about escape cause NN does not support it.
          full += (x + '=' + (escape?escape(params[x]):encodeURIComponent(params[x])) + '&');
        }
      }
    }
    var head = document.getElementsByTagName("head")[0];
    if (!head) {
      throw new Error("document must have header tag");
    }
    var script = document.createElement("script");
    script.src = full + callbackName + '=ags_jsonp.' + sid;
    script.id = sid;
    var jsonpcallback = function () {
      delete xdc[sid];
      head.removeChild(script);
      script = null;
      callbackFn.apply(null, arguments);
      /**
       * This event is fired after a REST JSONP response was returned by server.
       * @name ArcGISUtil#jsonpend
       * @param {String} scriptID
       * @event
       */
      triggerEvent(ArcGISUtil, 'jsonpend', sid);
    };
    xdc[sid] = jsonpcallback;
    head.appendChild(script);
    /**
     * This event is fired before a REST request sent to server.
     * @name ArcGISUtil#jsonpstart
     * @param {String} scriptID
     * @event
     */
    triggerEvent(ArcGISUtil, 'jsonpstart', sid);
    return sid;
  };
  /**
   * @private for now.
   * Get the computed value of a property in an option Hierarchy: root, serviceOptions, layerOptions, etc.
   * passing default value, option object
   * @param {Object} defaultValue
   * @param {Object} options
   * @param {String} propName
   * @param {String} opt_serviceName
   * @param {String} opt_layerName
   * @return {Object}
   */
  ArcGISUtil.getOptionValue = function (defaultValue, options, propName, opt_serviceName, opt_layerName) {
    var val = augmentObject(defaultValue, {});
    if (options) {
      val = augmentObject(options[propName], val, true);
      if (opt_serviceName && options.serviceOptions && options.serviceOptions[opt_serviceName]) {
        var svcOpts = options.serviceOptions[opt_serviceName];
        val = augmentObject(svcOpts[propName], val, true);
        if (opt_layerName && svcOpts.layerOptions && svcOpts.layerOptions[opt_layerName]) {
          var layOpts = svcOpts.layerOptions[opt_layerName];
          val = augmentObject(layOpts[propName], val, true);
        }
      }
    }
    return val;
  };

  /**
   * @private for now
   * Get the attribute value, case insensitive
   * @param {Object} attrs object with name-value pair
   * @param {String} name attribue name
   * @return {Object}
   */
  ArcGISUtil.getAttributeValue = function (attrs, name) {
    if (typeof attrs[name] !== 'undefined') {
      return attrs[name];
    }
    for (var x in attrs) {
      if (attrs.hasOwnProperty(x)) {
        if (name.toLowerCase() === x.toString().toLowerCase()) {
          return attrs[x];
        }
      }
    }
    return null;
  };
  
  /**
   * convert Geometry to JSON String, optionally include ArcGISSpatialReference info.
   * @param {Geometry} geoms
   * @param {Boolean} opt_includeSR
   * @return {String}
   */
  ArcGISUtil.fromGeometryToJSON = function (geom, opt_includeSR) {
    function fromPointsToJSON(pts) {
      var arr = [];
      for (var i = 0, c = pts.length; i < c; i++) {
        arr.push('[' + pts[i][0] + ',' + pts[i][1] + ']');
      }
      return '[' + arr.join(',') + ']';
    }
    function fromLinesToJSON(lines) {
      var arr = [];
      for (var i = 0, c = lines.length; i < c; i++) {
        arr.push(fromPointsToJSON(lines[i]));
      }
      return '[' + arr.join(',') + ']';
    }
    
    var json = '{';
    if (geom.x) {
      json += 'x:' + geom.x + ',y:' + geom.y;
    } else if (geom.xmin) {
      json += 'xmin:' + geom.xmin + ',ymin:' + geom.ymin + ',xmax:' + geom.xmax + ',ymax:' + geom.ymax;
    } else if (geom.points) {
      json += 'points:' + fromPointsToJSON(geom.points);
    } else if (geom.paths) {
      json += 'paths:' + fromLinesToJSON(geom.paths);
    } else if (geom.rings) {
      json += 'rings:' + fromLinesToJSON(geom.rings);
    }
    if (opt_includeSR && geom.spatialReference) {
      json += ',spatialReference:{wkid:' + geom.spatialReference.wkid + '}';
    }
    json += '}';
    return json;
  };
  
  /**
   * Some operations such as identify and find are operated against multiple layers.
   * The results are in a flat list. This method will group the result by layer and
   * return an object with key as layer name, value as a {@link ArcGISResultSet}.
   * @param {IdentifyResults|FindResults} results
   * @return {Object}
   */
  ArcGISUtil.groupResultsByLayer = function (json) {
    var ret = {};
    var res, layerName;
    var results = json.results;
    if (results) {
      for (var i = 0, c = results.length; i < c; i++) {
        res = results[i];
        layerName = res.layerName;
        if (!ret[layerName]) {
          var fieldAliases = {};//[];
          for (var x in res.attributes) {
            if (res.attributes.hasOwnProperty(x)) {
             // fields.push(x);
              fieldAliases[x] = x;
            }
          }
          var set = {
            displayFieldName: res.displayFieldName,
            spatialReference: res.geometry ? res.geometry.spatialReference : null,
            geometryType: res.geometryType,
            fieldAliases: fieldAliases,
            features: []
          };
          ret[layerName] = set;
        }
        // more than we need but no need to remove them.
        ret[layerName].features.push(res);
      }
    }
    return ret;
  };
  /**
   * @private for now
   * Get html for a resultset
   * @param {Object} res
   * @param {Boolean} vertical
   */
  ArcGISUtil.getResultSetHtml = function (res, style) {
    var html = '<table class="ags-resultset">';
    var i, j, c, d;
    style = style || (res.features.length === 1? 'v' : 'h');
    var fields = [];
    for (var x in res.fieldAliases) {
      if (res.fieldAliases.hasOwnProperty(x)) {
        fields.push(x);
      }
    }
    if (style === 'h') {
      html += '<tr>';
      for (i = 0, c = fields.length; i < c; i++) {
        html += '<th class="ags-fieldname">' + res.fieldAliases[fields[i]] + '</th>';
      }
      html += '</tr>';
    }
    for (i = 0, c = res.features.length; i < c; i++) {
      var atts = res.features[i].attributes;
      if (style === 'h') {
        html += '<tr>';
      } else if (i > 0) {
        html += '<tr><td colspan="2"><hr/></td></tr>';
      }
      for (j = 0, d = fields.length; j < d; j++) {
        if (style === 'h') {
          html += '<td class="ags-fieldvalue">' + atts[fields[j]] + '</td>';
        } else {
          html += '<tr><td class="ags-fieldname">' + res.fieldAliases[fields[j]] + '</td><td class="ags-fieldvalue">' + atts[fields[j]] + '</td></tr>';
        }
      }
      if (style === 'h') {
        html += '</tr>';
      }
    }
    html += '</table>';
    return html;
  };
  /**
   * @name ArcGISConfig
   * @class This is an object literal that sets common configuration values used across the lib.
   * @property {Number} [maxPolyPoints  = 1000] max number of points allowed in polyline's path or polygon's ring. If exceed, no overlay will be created.(for now)
   * @property {StyleOptions} [style] The default style used for GOverlays.
   */
  var ArcGISConfig = {
    maxPolyPoints: 1000,
    style: {
      icon: null,
      strokeColor: "#FFFF00",
      strokeWeight: 8,
      strokeOpacity: 0.5,
      outlineColor: "#FF0000",
      outlineWeight: 2,
      outlineOpacity: 0.5,
      fillColor: "#FFFF00",
      fillOpacity: 0.5
    }
  };
  /**
   * ArcGISSpatialReferences has an internal collection of Spatial Refeneces supported in the application.
   * The key of the collection is the wkid, and value is an instance of
   * {@link ArcGISSpatialReference}.
   * The {@link ArcGISTileLayer}'s Spatial Refeneces <b>must be already added to collection
   * before it's constructor can be called</b>.
   * The following ArcGISSpatialReference are added by default:
   * <code>
   * <br/> 4326: WGS84 ArcGISGeographic Coordinate System;
   * <br/> 102113: Web-Mercator used by Google Maps, Virtual Earth etc.
   * </code>
   * <br/> The application can add a supported spatial references using static method
   * <code>ArcGISSpatialReferences.addSpatialReference(wkid,sr);</code>
   * @name ArcGISSpatialReferences
   * @name ArcGISspace
   */
  var ArcGISSpatialReferences = {};
  
  /**
   * Create A Generic Spatial Reference Object
   * The <code>params </code> passed in constructor is a javascript object literal and depends on
   * the type of Coordinate System to construct.
   * @name ArcGISSpatialReference
   * @class This  class (<code>google.maputils.arcgis.SpatialReference</code>) is for coordinate systems that converts value 
   * between geographic and real-world coordinates. The following classes extend this class:
   *    {@link ArcGISGeographic}, {@link ArcGISSphereMercator}, {@link ArcGISLambertConformalConic}, and {@link ArcGISTransverseMercator}.
   * @constructor
   * @property {Number} [wkid] well-known coodinate system id (EPSG code)
   * @param {Object} params
   */
  function ArcGISSpatialReference(params) {
    params  =  params || {};
    this.wkid  =  params.wkid;
  }

  /**
   * Convert Lat Lng to real-world coordinates.
   * Note both input and output are array of [x,y], although their values in different units.
   * @param {Number[]} lnglat
   * @return {Number[]}
   */
  ArcGISSpatialReference.prototype.forward  =  function (lnglat) {
    return lnglat;
  };
  /**
   * Convert real-world coordinates  to Lat Lng.
   * Note both input and output are are array of [x,y], although their values are different.
   * @param {Number[]}  coords
   * @return {Number[]}
   */
  ArcGISSpatialReference.prototype.reverse  =  function (coords) {
    return coords;
  };
  /**
   * Get the map the periodicity in x-direction, in map units NOT pixels
   * @return {Number} periodicity in x-direction
   */
  ArcGISSpatialReference.prototype.getCircumference  =  function () {
    return 360;
  };

/**
 * Transform an extent to this Spatial Reference and return 
 * a new instance of {@link ArcGISEnvelope} if the spatial references are different.
 * @param {Envelope} extent
 * @return {Envelope}
 */
  ArcGISSpatialReference.prototype.transform = function (extent) {
    if (extent.spatialReference.wkid !== this.wkid) {
      var sr = ArcGISSpatialReferences.getSpatialReference(extent.spatialReference.wkid);
      var sw = sr.reverse([extent.xmin, extent.ymin]);
      var ne = sr.reverse([extent.ymin, extent.ymax]);
      sw = this.forward(sw);
      ne = this.forward(ne);
      return {
        xmin: sw[0],
        ymin: sw[1],
        xmax: ne[0],
        ymax: ne[1],
        spatialReference: {
          wkid: this.wkid
        }
      };
    } else {
      return extent;
    }
  };

  /**
   * Creates a ArcGISGeographic Coordinate System. e.g.:<br/>
   * <code>var g  = new ArcGISGeographic({"wkid":4326});<br/>
   * var g2 = new google.maputils.arcgis.Geographic({"wkid":4326});
   * </code>
   * @name ArcGISGeographic
   * @class This class (<code>google.maputils.arcgis.Geographic</code>) will simply retuns same LatLng as Coordinates. 
   *   The <code>param</code> should have wkid property. Any Geographic Coordinate Systems (eg. WGS84(4326)) can 
   *   use this class As-Is. 
   *   <br/>Note:<b> This class does not support datum transformation</b>.
   * @extends ArcGISSpatialReference
   * @param {Object} params
   */
  function ArcGISGeographic(params) {
    params  = params || {};
    ArcGISSpatialReference.call(this, params);
  }
  ArcGISGeographic.prototype  = new ArcGISSpatialReference();


/**
 * Create a Lambert Conformal Conic Projection based Spatial Reference. The <code>params</code> passed in construction should
 * include the following properties:<code>
 * <br/>-wkid: well-known id
 * <br/>-semi_major:  ellipsoidal semi-major axis in meter
 * <br/>-unit: meters per unit
 * <br/>-inverse_flattening: inverse of flattening of the ellipsoid where 1/f  =  a/(a - b)
 * <br/>-standard_parallel_1: phi1, latitude of the first standard parallel
 * <br/>-standard_parallel_2: phi2, latitude of the second standard parallel
 * <br/>-latitude_of_origin: phiF, latitude of the false origin
 * <br/>-central_meridian: lamdaF, longitude of the false origin  (with respect to the prime meridian)
 * <br/>-false_easting: FE, false easting, the Eastings value assigned to the natural origin
 * <br/>-false_northing: FN, false northing, the Northings value assigned to the natural origin
 * </code>
 * <br/> e.g. North Carolina State Plane NAD83 Feet: <br/>
 * <code> var ncsp82  = new ArcGISLambertConformalConic({wkid:2264, semi_major: 6378137.0,inverse_flattening: 298.257222101,
 *   standard_parallel_1: 34.33333333333334, standard_parallel_2: 36.16666666666666,
 *   central_meridian: -79.0, latitude_of_origin: 33.75,'false_easting': 2000000.002616666,
 *   'false_northing': 0, unit: 0.3048006096012192 }); </code>
 * @name ArcGISLambertConformalConic
 * @class This class (<code>google.maputils.arcgis.LambertConformalConic</code>) represents a Spatial Reference System based on <a target  = wiki href  = 'http://en.wikipedia.org/wiki/Lambert_conformal_conic_projection'>Lambert Conformal Conic Projection</a>. 
 * @extends ArcGISSpatialReference
 * @constructor
 * @param {Object} params
 */
  function ArcGISLambertConformalConic(params) {
    //http://pubs.er.usgs.gov/djvu/PP/PP_1395.pdf
    // http://www.posc.org/Epicentre.2_2/DataModel/ExamplesofUsage/eu_cs34.html
    //for NCSP83: GLatLng(35.102363,-80.5666)<  === > GPoint(1531463.95, 495879.744);
    params = params || {};
    ArcGISSpatialReference.call(this, params);
    var f_i = params.inverse_flattening;
    var phi1 = params.standard_parallel_1 * RAD_DEG;
    var phi2 = params.standard_parallel_2 * RAD_DEG;
    var phiF = params.latitude_of_origin * RAD_DEG;
    this.a_ = params.semi_major / params.unit;
    this.lamdaF_ = params.central_meridian * RAD_DEG;
    this.FE_ = params.false_easting;
    this.FN_ = params.false_northing;
    
    var f = 1.0 / f_i; //e: eccentricity of the ellipsoid where e^2  =  2f - f^2 
    var es = 2 * f - f * f;
    this.e_ = Math.sqrt(es);
    var m1 = this.calc_m_(phi1, es);
    var m2 = this.calc_m_(phi2, es);
    var tF = this.calc_t_(phiF, this.e_);
    var t1 = this.calc_t_(phi1, this.e_);
    var t2 = this.calc_t_(phi2, this.e_);
    this.n_ = Math.log(m1 / m2) / Math.log(t1 / t2);
    this.F_ = m1 / (this.n_ * Math.pow(t1, this.n_));
    this.rF_ = this.calc_r_(this.a_, this.F_, tF, this.n_);
    
  }
  
  ArcGISLambertConformalConic.prototype = new ArcGISSpatialReference();
  /**
   * calc_m_
   * @param {Object} phi
   * @param {Object} es
   */
  ArcGISLambertConformalConic.prototype.calc_m_ = function (phi, es) {
    var sinphi = Math.sin(phi);
    return Math.cos(phi) / Math.sqrt(1 - es * sinphi * sinphi);
  };
  /**
   * calc_t_
   * @param {Object} phi
   * @param {Object} e
   */
  ArcGISLambertConformalConic.prototype.calc_t_ = function (phi, e) {
    var esinphi = e * Math.sin(phi);
    return Math.tan(Math.PI / 4 - phi / 2) / Math.pow((1 - esinphi) / (1 + esinphi), e / 2);
  };
  /**
   * calc_r_
   * @param {Object} a
   * @param {Object} F
   * @param {Object} t
   * @param {Object} n
   */
  ArcGISLambertConformalConic.prototype.calc_r_ = function (a, F, t, n) {
    return a * F * Math.pow(t, n);
  };
  /**
   * calc_phi_
   * @param {Object} t_i
   * @param {Object} e
   * @param {Object} phi
   */
  ArcGISLambertConformalConic.prototype.calc_phi_ = function (t_i, e, phi) {
    var esinphi = e * Math.sin(phi);
    return Math.PI / 2 - 2 * Math.atan(t_i * Math.pow((1 - esinphi) / (1 + esinphi), e / 2));
  };
  /**
   * solve phi iteratively.
   * @param {Object} t_i
   * @param {Object} e
   * @param {Object} init
   */
  ArcGISLambertConformalConic.prototype.solve_phi_ = function (t_i, e, init) {
    // iteration
    var i = 0;
    var phi = init;
    var newphi = this.calc_phi_(t_i, e, phi);//this.
    while (Math.abs(newphi - phi) > 0.000000001 && i < 10) {
      i++;
      phi = newphi;
      newphi = this.calc_phi_(t_i, e, phi);//this.
    }
    return newphi;
  };
  /** 
   * see {@link ArcGISSpatialReference}
   * @param {Number[]} lnglat
   * @return {Number[]}
   */
  ArcGISLambertConformalConic.prototype.forward = function (lnglat) {
    var phi = lnglat[1] * RAD_DEG;// (Math.PI / 180);
    var lamda = lnglat[0] * RAD_DEG;
    var t = this.calc_t_(phi, this.e_);
    var r = this.calc_r_(this.a_, this.F_, t, this.n_);
    var theta = this.n_ * (lamda - this.lamdaF_);
    var E = this.FE_ + r * Math.sin(theta);
    var N = this.FN_ + this.rF_ - r * Math.cos(theta);
    return [E, N];
  };
  /**
   * see {@link ArcGISSpatialReference}
   * @param {Number[]}  coords
   * @return {Number[]}
   */
  ArcGISLambertConformalConic.prototype.reverse = function (coords) {
    var E = coords[0];
    var N = coords[1];
    var theta_i = Math.atan((E - this.FE_) / (this.rF_ - (N - this.FN_)));
    var r_i = (this.n_ > 0 ? 1 : -1) * Math.sqrt((E - this.FE_) * (E - this.FE_) + (this.rF_ - (N - this.FN_)) * (this.rF_ - (N - this.FN_)));
    var t_i = Math.pow((r_i / (this.a_ * this.F_)), 1 / this.n_);
    var phi = this.solve_phi_(t_i, this.e_, 0);
    var lamda = theta_i / this.n_ + this.lamdaF_;
    return [lamda / RAD_DEG, phi / RAD_DEG];
    
  };
  /**
   *  see {@link ArcGISSpatialReference}
   *  @return {Number}
   */
  ArcGISLambertConformalConic.prototype.getCircumference = function () {
    return Math.PI * 2 * this.a_;
  };
		
		
/**
 * Create a Transverse Mercator Projection. The <code>params</code> passed in constructor should contain the 
 * following properties: <br/>
 * <code>
 * <br/>-wkid: well-known id
 * <br/>-semi_major:  ellipsoidal semi-major axis in meters
 * <br/>-unit: meters per unit
 * <br/>-inverse_flattening: inverse of flattening of the ellipsoid where 1/f  =  a/(a - b)
 * <br/>-Scale Factor: scale factor at origin
 * <br/>-latitude_of_origin: phiF, latitude of the false origin
 * <br/>-central_meridian: lamdaF, longitude of the false origin  (with respect to the prime meridian)
 * <br/>-false_easting: FE, false easting, the Eastings value assigned to the natural origin 
 * <br/>-false_northing: FN, false northing, the Northings value assigned to the natural origin 
 * </code>
 * <br/>e.g. Georgia West State Plane NAD83 Feet:  
 * <br/><code> var gawsp83  = new ArcGISTransverseMercator({wkid: 102667, semi_major:6378137.0,
 *  inverse_flattening:298.257222101,central_meridian:-84.16666666666667, latitude_of_origin: 30.0,
 *  scale_factor:0.9999,'false_easting':2296583.333333333, 'false_northing':0, unit: 0.3048006096012192});
 *  </code>
 * @param {Object} params 
 * @name ArcGISTransverseMercator
 * @class This class (<code>google.maputils.arcgis.TransverseMercator</code>) represents a Spatial Reference System based on 
 * <a target  = wiki href  = 'http://en.wikipedia.org/wiki/Transverse_Mercator_projection'>Transverse Mercator Projection</a>
 * @extends ArcGISSpatialReference
 */
  function ArcGISTransverseMercator(params) {
    params = params || {};
    ArcGISSpatialReference.call(this, params);
    //GLatLng(33.74561,-84.454308)<  === >  GPoint(2209149.07977075, 1362617.71496891);
    this.a_ = params.semi_major / params.unit;//this.
    var f_i = params.inverse_flattening;
    this.k0_ = params.scale_factor;
    var phiF = params.latitude_of_origin * RAD_DEG;//(Math.PI / 180);
    this.lamdaF_ = params.central_meridian * RAD_DEG;
    this.FE_ = params.false_easting;//this.
    this.FN_ = params.false_northing;//this.
    var f = 1.0 / f_i;//this.
    /*e: eccentricity of the ellipsoid where e^2  =  2f - f^2 */
    this.es_ = 2 * f - f * f;
    //var _e  =  Math.sqrt(this.es_);
    /* e^4 */
    this.ep4_ = this.es_ * this.es_;
    /* e^6 */
    this.ep6_ = this.ep4_ * this.es_;
    /* e'  second eccentricity where e'^2  =  e^2 / (1-e^2) */
    this.eas_ = this.es_ / (1 - this.es_);
    this.M0_ = this.calc_m_(phiF, this.a_, this.es_, this.ep4_, this.ep6_);
  }
  
  ArcGISTransverseMercator.prototype = new ArcGISSpatialReference();
  /**
   * calc_m_
   * @param {Object} phi
   * @param {Object} a
   * @param {Object} es
   * @param {Object} ep4
   * @param {Object} ep6
   */
  ArcGISTransverseMercator.prototype.calc_m_ = function (phi, a, es, ep4, ep6) {
    return a * ((1 - es / 4 - 3 * ep4 / 64 - 5 * ep6 / 256) * phi - (3 * es / 8 + 3 * ep4 / 32 + 45 * ep6 / 1024) * Math.sin(2 * phi) + (15 * ep4 / 256 + 45 * ep6 / 1024) * Math.sin(4 * phi) - (35 * ep6 / 3072) * Math.sin(6 * phi));
  };
  /**
   * see {@link ArcGISSpatialReference}
   * @param {Number[]} lnglat
   * @return {Number[]}
   */
  ArcGISTransverseMercator.prototype.forward = function (lnglat) {
    var phi = lnglat[1] * RAD_DEG;// (Math.PI / 180);
    var lamda = lnglat[0] * RAD_DEG;//(Math.PI / 180);
    var nu = this.a_ / Math.sqrt(1 - this.es_ * Math.pow(Math.sin(phi), 2));
    var T = Math.pow(Math.tan(phi), 2);
    var C = this.eas_ * Math.pow(Math.cos(phi), 2);
    var A = (lamda - this.lamdaF_) * Math.cos(phi);
    var M = this.calc_m_(phi, this.a_, this.es_, this.ep4_, this.ep6_);
    var E = this.FE_ + this.k0_ * nu * (A + (1 - T + C) * Math.pow(A, 3) / 6 + (5 - 18 * T + T * T + 72 * C - 58 * this.eas_) * Math.pow(A, 5) / 120);
    var N = this.FN_ + this.k0_ * (M - this.M0_) + nu * Math.tan(phi) * (A * A / 2 + (5 - T + 9 * C + 4 * C * C) * Math.pow(A, 4) / 120 + (61 - 58 * T + T * T + 600 * C - 330 * this.eas_) * Math.pow(A, 6) / 720);
    return [E, N];
  };
  /**
   * see {@link ArcGISSpatialReference}
   * @param {Number[]}  coords
   * @return {Number[]}
   */
  ArcGISTransverseMercator.prototype.reverse = function (coords) {
    var E = coords[0];
    var N = coords[1];
    var e1 = (1 - Math.sqrt(1 - this.es_)) / (1 + Math.sqrt(1 - this.es_));
    var M1 = this.M0_ + (N - this.FN_) / this.k0_;
    var mu1 = M1 / (this.a_ * (1 - this.es_ / 4 - 3 * this.ep4_ / 64 - 5 * this.ep6_ / 256));
    var phi1 = mu1 + (3 * e1 / 2 - 27 * Math.pow(e1, 3) / 32) * Math.sin(2 * mu1) + (21 * e1 * e1 / 16 - 55 * Math.pow(e1, 4) / 32) * Math.sin(4 * mu1) + (151 * Math.pow(e1, 3) / 6) * Math.sin(6 * mu1) + (1097 * Math.pow(e1, 4) / 512) * Math.sin(8 * mu1);
    var C1 = this.eas_ * Math.pow(Math.cos(phi1), 2);
    var T1 = Math.pow(Math.tan(phi1), 2);
    var N1 = this.a_ / Math.sqrt(1 - this.es_ * Math.pow(Math.sin(phi1), 2));
    var R1 = this.a_ * (1 - this.es_) / Math.pow((1 - this.es_ * Math.pow(Math.sin(phi1), 2)), 3 / 2);
    var D = (E - this.FE_) / (N1 * this.k0_);
    var phi = phi1 - (N1 * Math.tan(phi1) / R1) * (D * D / 2 - (5 + 3 * T1 + 10 * C1 - 4 * C1 * C1 - 9 * this.eas_) * Math.pow(D, 4) / 24 + (61 + 90 * T1 + 28 * C1 + 45 * T1 * T1 - 252 * this.eas_ - 3 * C1 * C1) * Math.pow(D, 6) / 720);
    var lamda = this.lamdaF_ + (D - (1 + 2 * T1 + C1) * Math.pow(D, 3) / 6 + (5 - 2 * C1 + 28 * T1 - 3 * C1 * C1 + 8 * this.eas_ + 24 * T1 * T1) * Math.pow(D, 5) / 120) / Math.cos(phi1);
    return [lamda / RAD_DEG, phi / RAD_DEG];
  };
  /**
   * see {@link ArcGISSpatialReference}
   * @return {Number}
   */
  ArcGISTransverseMercator.prototype.getCircumference = function () {
    return Math.PI * 2 * this.a_;
  };

/**
 * Creates a Spatial Reference based on Sphere Mercator Projection. 
 * The <code>params</code> passed in constructor should have the following properties:
 * <code><br/>-wkid: wkid
 * <br/>-semi_major:  ellipsoidal semi-major axis 
 * <br/>-unit: meters per unit
 * <br/>-central_meridian: lamdaF, longitude of the false origin  (with respect to the prime meridian)
 * </code>
 * <br/>e.g. The "Web Mercator" used in ArcGIS Server:<br/>
 * <code> var web_mercator  = new ArcGISSphereMercator({wkid: 102113,  semi_major:6378137.0,  central_meridian:0, unit: 1 });
 * </code>
 * @name ArcGISSphereMercator
 * @class This class (<code>google.maputils.arcgis.SphereMercator</code>) is the Projection Default Google Maps uses. It is a special form of Mercator.
 * @param {Object} params 
 * @extends ArcGISSpatialReference
 */
  function ArcGISSphereMercator(params) {
    /*  =========== parameters  =  ===================== */
    params = params ||
    {};
    ArcGISSpatialReference.call(this, params);
    this.a_ = (params.semi_major || 6378137.0) / (params.unit || 1);
    this.lamdaF_ = (params.central_meridian || 0.0) * RAD_DEG;//(Math.PI / 180);
  }
  
  ArcGISSphereMercator.prototype = new ArcGISSpatialReference();
  
  /**
   * See {@link ArcGISSpatialReference}
   * @param {Number[]} lnglat
   * @return {Number[]}
   */
  ArcGISSphereMercator.prototype.forward = function (lnglat) {
    var phi = lnglat[1] * RAD_DEG;//(Math.PI / 180);
    var lamda = lnglat[0] * RAD_DEG;
    var E = this.a_ * (lamda - this.lamdaF_);
    var N = (this.a_ / 2) * Math.log((1 + Math.sin(phi)) / (1 - Math.sin(phi)));
    return [E, N];
  };
  /**
   * See {@link ArcGISSpatialReference}
   * @param {Number[]}  coords
   * @return {Number[]}
   */
  ArcGISSphereMercator.prototype.reverse = function (coords) {
    var E = coords[0];
    var N = coords[1];
    var phi = Math.PI / 2 - 2 * Math.atan(Math.exp(-N / this.a_));
    var lamda = E / this.a_ + this.lamdaF_;
    return [lamda / RAD_DEG, phi / RAD_DEG];
  };
  /**
   * See {@link ArcGISSpatialReference}
   * @return {Number}
   */
  ArcGISSphereMercator.prototype.getCircumference = function () {
    return Math.PI * 2 * this.a_;
  };
  
  /**
   * Create a flat transform spatial reference. The <code>params</code> passed in constructor should have the following properties:
   * <li><code>wkid</code>: wkid
   * <li><code>latlng</code>:  {@link ArcGISEnvelope} in latlng unit;
   * <li><code>coords</code>: {@link ArcGISEnvelope} in coords unit
   * @class This class (<code>google.maputils.arcgis.FlatSpatialReference</code>) is a special type of coordinate reference assuming lat/lng will increase
   * evenly as if earth is flat. Approximate for small regions without implementing
   * a real projection.
   * @name ArcGISFlatSpatialReference
   * @param {Object} params
   * @extends ArcGISSpatialReference
   */
  function ArcGISFlatSpatialReference(params) {
    /*  =========== parameters  =  ===================== */
    params = params || {};
    ArcGISSpatialReference.call(this, params);
    this.lng_ = params.latlng.xmin;
    this.lat_ = params.latlng.ymin;
    this.x_ = params.coords.xmin;
    this.y_ = params.coords.ymin;
    this.xscale_ = (params.coords.xmax - params.coords.xmin) / (params.latlng.xmax - params.latlng.xmin);
    this.yscale_ = (params.coords.ymax - params.coords.ymin) / (params.latlng.ymax - params.latlng.ymin);
  }
  
  ArcGISFlatSpatialReference.prototype = new ArcGISSpatialReference();
  
  /**
   * See {@link ArcGISSpatialReference}
   * @param {Number[]} lnglat
   * @return {Number[]}
   */
  ArcGISFlatSpatialReference.prototype.forward = function (lnglat) {
    var E = this.x_ + (lnglat[0] - this.lng_) * this.xscale_;
    var N = this.y_ + (lnglat[1] - this.lat_) * this.yscale_;
    return [E, N];
  };
  /**
   * See {@link ArcGISSpatialReference}
   * @param {Number[]}  coords
   * @return {Number[]}
   */
  ArcGISFlatSpatialReference.prototype.reverse = function (coords) {
    var lng = this.lng_ + (coords[0] - this.x_) / this.xscale_;
    var lat = this.lat_ + (coords[1] - this.y_) / this.yscale_;
    return [lng, lat];
  };
  /**
   * See {@link ArcGISSpatialReference}
   * @return {Number}
   */
  ArcGISFlatSpatialReference.prototype.getCircumference = function () {
    return this.xscale_ * 360;
  };


  var WGS84 = new ArcGISGeographic({
    wkid: 4326
  });
  var NAD83 = new ArcGISGeographic({
    wkid: 4269
  });
  var WEB_MERCATOR = new ArcGISSphereMercator({
    wkid: 102113,
    semi_major: 6378137.0,
    central_meridian: 0,
    unit: 1
  });
  
  // declared early but assign here to avoid dependency error by jslint
  ArcGISSpatialReferences = {
    '4326': WGS84,
    '4269': NAD83,
    '102113': WEB_MERCATOR
  };
  /**
   * Add A Spatial Reference to the collection of Spatial References.
   * the {@link ArcGISwktOrSR} parameter can be String format of "well-known text" of the
   * Spatial Reference, or an instance of {@link ArcGISSpatialReference}.
   * <br/><li> If passes in String WKT format, to be consistent, it should use the same format as listed
   * in <a  href  = 'http://edndoc.esri.com/arcims/9.2/elements/pcs.htm'>
   * ESRI documentation</a>. For example, add NC State Plane NAD83 as String:
   * <br/><code>
   * ArcGISSpatialReferences.addSpatialReference('2264','PROJCS["NAD_1983_StatePlane_North_Carolina_FIPS_3200_Feet",
   * GEOGCS["GCS_North_American_1983",
   * DATUM["D_North_American_1983",
   * SPHEROID["GRS_1980",6378137.0,298.257222101]],
   * PRIMEM["Greenwich",0.0],
   * UNIT["Degree",0.0174532925199433]],
   * PROJECTION["Lambert_Conformal_Conic"],
   * PARAMETER["False_Easting",2000000.002616666],
   * PARAMETER["False_Northing",0.0],
   * PARAMETER["Central_Meridian",-79.0],
   * PARAMETER["Standard_Parallel_1",34.33333333333334],
   * PARAMETER["Standard_Parallel_2",36.16666666666666],
   * PARAMETER["Latitude_Of_Origin",33.75],
   * UNIT["Foot_US",0.3048006096012192]]');
   * <br/></code>
   * Note: only <b>Lambert Conformal Conic</b> and <b>Transverse Mercator</b> Projection
   * based Spatial References are supported if added via WKT String.
   * <br/><li> If passes in an instance of {@link ArcGISSpatialReference}, it can be one of the
   * built in classes, or a class that extends ArcGISSpatialReference. For example, add NC State Plane NAD83 as SR:
   * <br/><code>
   * ArcGISSpatialReferences.addSpatialReference('2264': new ArcGISLambertConformalConic({
   * wkid: 2264,
   * semi_major: 6378137.0,
   * inverse_flattening: 298.257222101,
   * standard_parallel_1: 34.33333333333334,
   * standard_parallel_2: 36.16666666666666,
   * central_meridian: -79.0,
   * latitude_of_origin: 33.75,
   * 'false_easting': 2000000.002616666,
   * 'false_northing': 0,
   * unit: 0.3048006096012192
   * });
   * <br/></code>
   * @param {Number} wkid
   * @param {Object} wktOrSR
   */
  ArcGISSpatialReferences.addSpatialReference = function (wkid, wktOrSR) {
    var sr = this['' + wkid];
    if (sr) {
      return sr;
    }
    if (wktOrSR instanceof ArcGISSpatialReference) {
      this['' + wkid] = wktOrSR;
      return wktOrSR;
    }
    var wkt = wktOrSR;
    var params = {
      wkid: wkid
    };
    var prj = extractString(wkt, "PROJECTION[\"", "\"]");
    var spheroid = extractString(wkt, "SPHEROID[", "]").split(",");
    if (prj !== "") {
      params.unit = parseFloat(extractString(extractString(wkt, "PROJECTION", ""), "UNIT[", "]").split(",")[1]);
      params.semi_major = parseFloat(spheroid[1]);
      params.inverse_flattening = parseFloat(spheroid[2]);
      params.latitude_of_origin = parseFloat(extractString(wkt, "\"Latitude_Of_Origin\",", "]"));
      params.central_meridian = parseFloat(extractString(wkt, "\"Central_Meridian\",", "]"));
      params.false_easting = parseFloat(extractString(wkt, "\"False_Easting\",", "]"));
      params.false_northing = parseFloat(extractString(wkt, "\"False_Northing\",", "]"));
    }
    switch (prj) {
    case "":
      sr = new ArcGISSpatialReference(params);
      break;
    case "Lambert_Conformal_Conic":
      params.standard_parallel_1 = parseFloat(extractString(wkt, "\"Standard_Parallel_1\",", "]"));
      params.standard_parallel_2 = parseFloat(extractString(wkt, "\"Standard_Parallel_2\",", "]"));
      sr = new ArcGISLambertConformalConic(params);
      break;
    case "Transverse_Mercator":
      params.scale_factor = parseFloat(extractString(wkt, "\"Scale_Factor\",", "]"));
      sr = new ArcGISTransverseMercator(params);
      break;
    // more implementations here.
    default:
      //throw new Error(prj + "  not supported";
    }
    if (sr) {
      this['' + wkid] = sr;
    }
    return sr;
  };
  /**
   * Gets the {@link ArcGISSpatialReference} from the internal colection by well-known id. Returns undefined if not added.
   * @param {Number} wkid
   * @return {ArcGISSpatialReference}
   */
  ArcGISSpatialReferences.getSpatialReference = function (wkid) {
    return this['' + wkid];
  };	
  //end of projection related code//

  /**
   * @name ArcGISField
   * @class This class represents a field in a {@link ArcGISLayer}. It is accessed from
   * the <code> fields</code> property. There is no constructor for this class,
   *  use Object Literal.
   * @property {String} [name] field Name
   * @property {String} [type] field type (esriFieldTypeOID|esriFieldTypeString|esriFieldTypeInteger|esriFieldTypeGeometry}.
   * @property {String} [alias] field alias.
   */
  /**
   * Create a ArcGIS map Layer using it's url ( 	http://[mapservice-url]/[layerId])
   * @name ArcGISLayer
   * @class This class (<code>google.maputils.arcgis.Layer</code>) represents a Map layer inside an {@link ArcGISMapService}. It carries
   *  information about a layer's name, id and other information such as scales etc.
   *  Due to the way REST API is implemented, each layers extra meta data must retrieved
   *  individually. However, most operations do not require those extra info and can be
   *  used directly.
   * @param {String} url
   * @property {Number} [id] layer ID
   * @property {String} [name] layer Name
   * @property {Number} [parentLayerId] parent LayerId
   * @property {Layer} [parentLayer] parent Layer {@link ArcGISLayer}
   * @property {Boolean} [defaultVisibility] defaultVisibility
   * @property {Number[]} [subLayerIds] sub LayerIds. null if no sub layers
   * @property {Layer[]} [subLayers] sub Layers. {@link ArcGISLayer}[].
   * @property {Boolean} [visibility] Visibility of this layer
   * @property {String} [definition] Layer definition.
   * @property {String} [type] layer type(Feature Layer|), only available after load.
   * @property {String} [geometryType] geometryType type(esriGeometryPoint|..), only available after load.
   * @property {String} [copyrightText] copyrightText, only available after load.
   * @property {Number} [minScale] minScale, only available after load.
   * @property {Number} [maxScale] maxScale, only available after load.
   * @property {Envelope} [extent] extent, only available after load.
   * @property {String} [displayField] displayField, only available after load.
   * @property {Field[]} [fields] fields, only available after load. See {@link ArcGISField}
   */
  function ArcGISLayer(url) {
    this.url = url;
    this.loaded_ = false;
    this.correct_ = false;
    this.definition = null;
  }
  /**
   * Load extra information such as it's fields from layer resource.
   * If opt_callback function will be called after it is loaded
   * @param {Function} opt_callback
   */
  ArcGISLayer.prototype.loadInfo = function (opt_callback) {
    var me = this;
    if (this.loaded_ && this.correct_) {
      return;
    }
    ArcGISUtil.getJSON(this.url, {
      f: 'json'
    }, 'callback', function (json) {
      if (json.error) {
        me.correct_ = false;
      } else {
        me.correct_ = true;
        augmentObject(json, me);
      }
      me.loaded_ = true;
      /**
       * This event is fired when the layer and it's extra info is loaded.
       * @name ArcGISLayer#load
       * @event
       */
      triggerEvent(me, "load");
      if (opt_callback) {
        opt_callback();
      }
    });
  };
  /**
   * If the extra layer info is loaded
   * @return {Boolean}
   */
  ArcGISLayer.prototype.hasLoaded = function () {
    return this.loaded_;
  };
   
  /**
   * Returns all field names
   * @return {String[]}
   */
  ArcGISLayer.prototype.getFieldNames = function () {
    var ret = [];
    if (this.hasLoaded()) {
      for (var i = 0; i < this.fields.length; i++) {
        ret.push(this.fields[i].name);
      }
    }
    return ret;
  };
  /**
   * Whether the layer is viewable at given scale
   * @param {Number} scale
   * @return {Boolean}
   */
  ArcGISLayer.prototype.isInScale = function (scale) {
    // note if the layer's extra info is not loaded, it will return true
    if (this.maxScale && this.maxScale > scale) {
      return false;
    }
    if (this.minScale && this.minScale < scale) {
      return false;
    }
    return true;
  };
 
  /**
   * @name ArcGISQueryParameters
   * @class This class represent the parameters needed in an query operation for a {@link ArcGISLayer}.
   *   There is no constructor, use JavaScript object literal.
   * <br/>For more info see <a  href  = 'http://resources.esri.com/help/9.3/arcgisserver/apis/rest/query.html'>Query Operation</a>.
   * @property {String} [f  = json] The response format. html | json | kmz .
   * @property {String} [text]  A literal search text. If the layer has a display field
   *   associated with it, the server searches for this text in this field.
   *   This parameter is a short hand for a where clause of:
   *   where [displayField]like '%[text]%'. The text is case sensitive.
   *   This parameter is ignored if the where parameter is specified.
   * @property {Geometry} [geometry] The geometry to apply as the spatial filter.
   * @property {String} [geometryType]  esriGeometryPoint | esriGeometryMultipoint | esriGeometryPolygon | esriGeometryPolyline
   * @property {Number} [inSR] The well-known ID of the spatial reference of the input geometries
   * @property {String} [spatialRel] The spatial relationship to be applied on the
   *    input geometry while performing the query. The supported spatial relationships
   *    include intersects, contains, envelope intersects, within, etc.
   *    The default spatial relationship is intersects (esriSpatialRelIntersects).
   *    esriSpatialRelIntersects | esriSpatialRelContains | esriSpatialRelCrosses
   | esriSpatialRelEnvelopeIntersects | esriSpatialRelIndexIntersects
   | esriSpatialRelOverlaps | esriSpatialRelTouches | esriSpatialRelWithin
   * @property {String} [where] A where clause for the query filter. Any legal SQL where clause operating on the fields in the layer is allowed.
   * @property {String|String[]} [outFields] The list of fields to be included in the returned resultset.
   * @property {Boolean} [returnGeometry  = true] If true, If true, the resultset will include the geometries associated with each result.
   * @property {Number} [outSR] The well-known ID of the spatial reference of the out geometries
   */
  /**
   * @name ArcGISResultSet
   * @class This class represent the results of an query operation for a {@link ArcGISLayer}.
   *   There is no constructor, use JavaScript object literal.
   * <br/>For more info see <a  href  = 'http://resources.esri.com/help/9.3/arcgisserver/apis/rest/query.html'>Query Operation</a>.
   * @property {String} [displayFieldName] display Field Name for layer
   * @property {Object} [fieldAliases] Field Name's Aliases. key is field name, value is alias.
   * @property {String} [geometryType] esriGeometryPoint | esriGeometryMultipoint | esriGeometryPolygon | esriGeometryPolyline
   * @property {Object} [spatialReference] spatial Reference <b>wkid info only</b>
   * @property {Features[]} [features] result as array of {@link ArcGISFeature}
   */
  /**
   * @name ArcGISFeature
   * @class This class represent one entry in the {@link ArcGISResultSet} of an query operation for a {@link ArcGISLayer}.
   *   There is no constructor, use JavaScript object literal.
   * <br/>For more info see <a  href  = 'http://resources.esri.com/help/9.3/arcgisserver/apis/rest/query.html'>Query Operation</a>.
   * @property {Geometry} [geometry] geometry
   * @property {Object} [attributes] attributes as name-value JSON object.
   */
  /**
   * The query operation is performed on a layer resource. The result of this operation is a resultset resource that will be
   * passed in the callback function. param is an instance of {@link ArcGISQueryParameters}
   * <br/>For more info see <a href  = 'http://resources.esri.com/help/9.3/arcgisserver/apis/rest/query.html'>Query Operation</a>.
   * @param {QueryParameters} params
   * @param {Function} callback
   */
  ArcGISLayer.prototype.query = function (qparams, callback) {
    if (!qparams) {
      return;
    } 
    var params = augmentObject(qparams, {});
    params.f = params.f || 'json';
    if (params.geometry && !isString(params.geometry)) {
      params.geometry = ArcGISUtil.fromGeometryToJSON(params.geometry);
    }
    if (params.geometry) {
      params.spatialRel = params.spatialRel || ESRI_SPATIALREL_INTERSECTS;
    }
    if (params.outFields && !isString(params.outFields)) {
      params.outFields = params.outFields.join(',');
    }
    params.returnGeometry = params.returnGeometry === false ? false : true;
    ArcGISUtil.getJSON(this.url + '/query', params, 'callback', callback);
  };

  /**
   * @name ArcGISTileInfo
   * @class This class contains information about map tile infornation for a cached map service.
   *    It is the type of {@link ArcGIStileInfo} property of {@link ArcGISArcGISTileReference}
   *    <br/>There is no constructor for this class.
   * @property {Number} [rows] tile row size,  e.g. 512, must be same as cols
   * @property {Number} [cols] tile cols size,  e.g. 512, must be same as rows
   * @property {Number} [dpi] dot per inch for map tiles.
   * @property {String} [format] PNG8 | PNG24 | PNG32 | GIF | JPEG
   * @property {Number} [compressionQuality] JPEG only.0-100.
   * @property {Point} [origin] origin of tile system of type {@link ArcGISPoint}
   * @property {ArcGISSpatialReference} [spatialReference] spatial reference.  <b>wkid info only</b>.
   * @property {LOD[]} [lods] Array of Level of Details. See {@link ArcGISLOD}
   */
  /**
   * @name ArcGISLOD
   * @class This class contains information about one "Level Of Detail" for a cached map service.
   *   It is the type of {@link ArcGISlods} property of {@link ArcGISTileInfo}
   *   <br/>There is no constructor for this class. Use as object literal.
   * @property {Number} [level] zoom level.
   * @property {Number} [resolution] map unit per pixel
   * @property {Number} [scale] actual map scale. e.g a value of 5000 means 1:5000 scale.
   */
  /**
   * @name ArcGISMapServiceOptions
   * @class This class is the optional parameter passed in the constructor of {@link ArcGISMapService}.
   *   <br/>There is no constructor for this class. Use as object literal.
   * @property {String} [name] name of the service. Default to the name published.
   */
  /**
   * Creates a ArcGISMapService objects that can be used by UI components.
   * <ul><li> <code> url</code> (required) is the URL of the map servive, e.g. <code>
   * http://server.arcgisonline.com/ArcGIS/rest/services/ESRI_StreetMap_World_2D/MapServer</code>.
   * <li> <code>opt_service</code> optional parameter of type {@link ArcGISMapServiceOptions }
   * <ul/> Note the spatial reference of the map service must already exists
   * in the {@link ArcGISSpatialReferences} if actual coordinates transformation is needed.
   * @name ArcGISMapService
   * @class This class (<code>google.maputils.arcgis.MapService</code>) is the core class for all map service operations.
   * It represents an ArcGIS Server map service and serve as the underline resource
   * represented by {@link ArcGISTileLayer} and {@link ArcGISMapOverlay}.
   * It is constructed asynchronously so it should be used <b>after</b>
   * it is loaded, either by handle its "load" event, or used in a callback function
   * passed in the constructor.
   * <br/>For more info see <a  href  = 'http://resources.esri.com/help/9.3/arcgisserver/apis/rest/mapserver.html'>Map Service</a>
   * @param {String} url
   * @param {ArcGISMapServiceOptions} opt_service
   * @property {String} [url] map service URL
   * @property {String} [name] map service Name, taken as part of URL.
   * @property {String} [serviceDescription] serviceDescription
   * @property {String} [mapName] map frame Name inside the map document
   * @property {String} [description] description
   * @property {String} [copyrightText] copyrightText
   * @property {Boolean} [singleFusedMapCache] if map cache is singleFused
   * @property {TileInfo} [tileInfo] See {@link ArcGISTileInfo}
   * @property {Envelope} [initialExtent] initialExtent, see {@link ArcGISEnvelope}
   * @property {Envelope} [fullExtent] fullExtent, see {@link ArcGISEnvelope}
   * @property {String} [units] unit
   * @property {Object} [documentInfo] Object with the folloing properties: <code>Title, Author,Comments,Subject,Category,Keywords</code>
   */
  function ArcGISMapService(url, opt_service) {
    opt_service = opt_service || {};
    this.url = url;
    var tks = url.split("/");
    this.name = opt_service.name || tks[tks.length - 2].replace(/_/g, ' ');
    var me = this;
    this.loaded_ = false;
    this.correct_ = false;
    ArcGISUtil.getJSON(url, {
      f: 'json'
    }, 'callback', function (json) {
      me.init_(json, opt_service);
    });
  }
  
  /**
   * initialize an ArcGIS Map Service from the meta data information.
   * The <code>json</code> parameter is the json object returned by Map Service.
   * @private
   * @param {Object} json
   * @param {ArcGISMapServiceOptions} opt_service
   */
  ArcGISMapService.prototype.init_ = function (json, opt_service) {
    var me = this;
    function doneLoad(json) {
      me.loaded_ = true;
      for (var i = 0, c = me.layers_.length; i < c; i++) {
        var layer = me.layers_[i];
        if (layer.subLayerIds) {
          layer.subLayers = [];
          for (var j = 0, jc = layer.subLayerIds.length; j < jc; j++) {
            var subLayer = me.getLayer(layer.subLayerIds[j]);
            layer.subLayers.push(subLayer);
            subLayer.parentLayer = layer;
          }
        }
      }
      // some  bad services will have an initial extent outside fullextent;
      me.initialExtent.xmin = Math.max(me.initialExtent.xmin, me.fullExtent.xmin);
      me.initialExtent.ymin = Math.max(me.initialExtent.ymin, me.fullExtent.ymin);
      me.initialExtent.xmax = Math.min(me.initialExtent.xmax, me.fullExtent.xmax);
      me.initialExtent.ymax = Math.min(me.initialExtent.ymax, me.fullExtent.ymax);
      
      /**
       * This event is fired when the service and it's service info is loaded.
       * @name ArcGISMapService#load
       * @param {ArcGISMapService} service
       * @event
       */
      triggerEvent(me, "load", me);
    }
    
    if (json.error) {
      this.correct_ = false;
    } else {
      this.correct_ = true;
      /*
       this.serviceDescription  =  json.serviceDescription;
       this.mapName  =  json.mapName;
       this.description  =  json.description;
       this.copyrightText  =  json.copyrightText;
       this.singleFusedMapCache  =  json.singleFusedMapCache;
       this.tileInfo  =  json.tileInfo;
       this.initialExtent  =  json.initialExtent;
       this.fullExtent  =  json.fullExtent;
       this.units  =  json.units;
       this.documentInfo  =  json.documentInfo;
       */
      augmentObject(json, this);
      var layers = [];
      var ids = [];
      for (var i = 0, c = json.layers.length; i < c; i++) {
        var info = json.layers[i];
        var layer = new ArcGISLayer(this.url + '/' + info.id);
        augmentObject(info, layer);
        layer.visible = info.defaultVisibility;
        layers.push(layer);
        ids.push(info.id);
      }
      this.layers_ = layers;
      delete this.layers;
      
      this.spatialReference_ = ArcGISSpatialReferences.getSpatialReference('' + json.spatialReference.wkid);
      if (!this.spatialReference_) {
        this.exportMap({
          bbox: json.fullExtent,
          bboxSR: json.spatialReference.wkid,
          size: '1,1',
          imageSR: 4326,
          layers: 'hide:' + ids.join(',')
        }, function (image) {
          var sr = new ArcGISFlatSpatialReference({
            wkid: json.spatialReference.wkid,
            latlng: image.extent,
            coords: json.fullExtent
          });
          ArcGISSpatialReferences.addSpatialReference(json.spatialReference.wkid, sr);
          me.spatialReference_ = sr;
          doneLoad(json);
        });
      } else {
        doneLoad(json);
      }
    }
  };
  /**
   * If this map service has finished loading from server.
   * @return {Boolean}
   */
  ArcGISMapService.prototype.hasLoaded = function () {
    return this.loaded_;
  };
  
  /**
   * @private too many methods?
   * If this map service has loaded from server correctly.
   * @return {Boolean}
   */
  ArcGISMapService.prototype.loadedCorrectly = function () {
    return this.loaded_ && this.correct_;
  };
  
  /**
   * Get the Spatial Reference of this map service that can convert between LatLng and Coordinates
   * Note, if the actual spatial reference is not aleady added via {@link ArcGISSpatialReferences}, it will return an object literal with <b>wkid info only</b>.
   * @return {ArcGISSpatialReference}
   */
  ArcGISMapService.prototype.getSpatialReference = function () {
    return this.spatialReference_;
  };
  /**
   * Get the Array of {@link ArcGISLayer}[] for this map service
   * @return {Layer[]}
   */
  ArcGISMapService.prototype.getLayers = function () {
    return this.layers_;
  };
  
  /**
   * Get a map layer by it's name(String) or id (Number), return {@link ArcGISLayer}.
   * @param {String|Number} nameOrId
   * @return {Layer}
   */
  ArcGISMapService.prototype.getLayer = function (nameOrId) {
    var layers = this.layers_;
    if (layers) {
      for (var i = 0, c = layers.length; i < c; i++) {
        if (nameOrId === layers[i].id) {
          return layers[i];
        }
        if (isString(nameOrId) && layers[i].name.toLowerCase() === nameOrId.toLowerCase()) {
          return layers[i];
        }
      }
    }
    return null;
  };
  /**
   * Get layer id or array of ids from a layer name or array of names.
   * @param {String|String[]} names
   * @return {Number|Number[]}
   */
  ArcGISMapService.prototype.getLayerIds = function (name) {
    var layer;
    if (isString(name)) {
      layer = this.getLayer(name);
      if (layer) {
        return layer.id;
      }
    } else if (isArray(name)) {
      var ids = [];
      for (var i = 0, c = name.length; i < c; i++) {
        layer = this.getLayer(name[i]);
        ids.push(layer ? layer.id : -1);
      }
      return ids;
    }
    return -1;
  };


/**
 * @name ArcGISExportMapParameters
 * @class This class represent the parameters needed in an exportMap operation for a {@link ArcGISMapService}.
 *   There is no constructor, use JavaScript object literal.
 * <br/>For more info see <a  href  = 'http://resources.esri.com/help/9.3/arcgisserver/apis/rest/export.html'>Export Operation</a>.
 * @property {String} [f  = html] The response format. html | json | image | kmz.
 * @property {Envelope} [bbox] The extent (bounding box) of the exported image. 
 * @property {String} [size] Syntax: &lt;width&gt;, &lt;height&gt;. You can also set <code>width</code> and <code>height</code>.
 * @property {Number} [width] width of image, ignored if <code>size</code> is specified;
 * @property {Number} [height] height of image, ignored if <code>size</code> is specified;
 * @property {Number} [imageSR] The well-known ID of the spatial reference of the exported image.
 * @property {Number} [bboxSR] The well-known ID of the spatial reference of the bbox
 * @property {String} [format  = png] The format of the exported image. png | png8 | png24 | jpg | pdf | bmp | gif | svg
 * @property {String} [layerDefs] Allows you to filter the features of individual layers in the exported map by specifying 
 *   definition expressions for those layers. Syntax: layerId1:layerDef1;layerId2:layerDef2
 *   Example: 0:POP2000 &gt; 1000000;5:AREA &gt; 100000
 * @property {String} [layers] Syntax: [show | hide | include | exclude]:layerId1,layerId2
 * @property {Boolean} [transparent  = true] If true, the image will be exported with 
 *  the background color of the map set as its transparent color. note the REST API default value is false.
 */

/**
 * @name ArcGISMapImage
 * @class This is the result of {@link ArcGISMapService}.exportMap operation.
 *   There is no constructor, use as JavaScript object literal.
 * @property {String} [href] URL of image
 * @property {Envelope} [extent] The {@link ArcGISEnvelope} (bounding box) of the exported image. 
 * @property {Number} [width] width of the exported image.
 * @property {Number} [height] height of the exported image.
 * @property {Number} [scale] scale of the exported image.
 */

  /**
   * Export an image with given parameters.
   * For more info see <a  href  = 'http://resources.esri.com/help/9.3/arcgisserver/apis/rest/export.html'>Export Operation</a>.
   * <br/> The <code>params</code> is an instance of {@link ArcGISExportMapParameters}.
   * The following properties will be set automatically if not specified:...
   * <br/> The <code>callback</code> is the callback function with argument of
   * an instance of {@link ArcGISMapImage}.
   * @param {ExportMapOptions} params
   * @param {Function} callback
   */
  ArcGISMapService.prototype.exportMap = function (eparams, callback) {
    if (!eparams) {
      return;
    }
    // note: dynamic map may overlay on top of maptypes with different projection
    var params = augmentObject(eparams, {});
    params.f = params.f || 'json';
    var bbox = params.bbox;
    if (bbox.xmin) {
      params.bbox = '' + bbox.xmin + ',' + bbox.ymin + ',' + bbox.xmax + ',' + bbox.ymax;
    }
    params.size = params.size || '' + params.width + ',' + params.height;
    params.transparent = (params.transparent === false ? false : true);
    var vlayers = [];
    var layerDefs = [];
    var changed = false;
    var layer;
    // a special behavior of REST: if partial group then parent must be off
    var i, c;
    for (i = 0, c = this.layers_.length; i < c; i++) {
      layer = this.layers_[i];
      if (layer.subLayers) {
        for (var j = 0, jc = layer.subLayers.length; j < jc; j++) {
          if (layer.subLayers[j].visible === false) {
            layer.visible = false;
            break;
          }
        }
      }
    }
    for (i = 0, c = this.layers_.length; i < c; i++) {
      layer = this.layers_[i];
      if (layer.visible !== layer.defaultVisibility) {
        changed = true;
      }
      if (layer.visible === true) {
        vlayers.push(layer.id);
      }
      if (layer.definition) {
        layerDefs.push(layer.id + ':' + layer.definition);
      }
    }
    if (changed === true) {
      if (!params.layers || !isString(params.layers)) {
        params.layers = 'show:' + vlayers.join(',');
      }
    }
    if (layerDefs.length > 0) {
      if (!params.layerDefs || !isString(params.layerDefs)) {
        params.layerDefs = layerDefs.join(';');
      }
    }
    if (vlayers.length === 0) {
      // avoid an error:{"error":{"code":400,"message":"","details":["Invalid layer ID specified."]}
      callback({});
    } else {
      ArcGISUtil.getJSON(this.url + '/export', params, 'callback', callback);
    }
  };
  /**
   * @name ArcGISIdentifyParameters
   * @class This class represent the parameters needed in an identify operation for a {@link ArcGISMapService}.
   *   There is no constructor, use JavaScript object literal.
   * <br/>For more info see <a  href  = 'http://resources.esri.com/help/9.3/arcgisserver/apis/rest/identify.html'>Identify Operation</a>.
   * @property {String} [f  = json] The response format. html | json .
   * @property {Geometry} [geometry] The geometry to identify on.
   * @property {String} [geometryType] esriGeometryPoint | esriGeometryPolyline | esriGeometryPolygon | esriGeometryEnvelope
   * @property {Number} [sr] The well-known ID of the spatial reference of the input and output geometries as well as the mapEnvelope
   * @property {String} [layers] The layers to perform the identify operation on. There are three ways to do so, check REST API docs.
   * @property {Number} [tolerance] The distance in screen pixels from the specified geometry within which the identify should be performed
   * @property {Envelope} [mapExtent] The extent or bounding box of the map currently being viewed.
   * @property {String} [imageDisplay] The screen image display parameters (width, height and DPI) of the map being currently viewed.
   *   You can also specifiy width, height, dip separately.
   * @property {Number} [width] width of image, ignored if <code>imageDisplay</code> is specified;
   * @property {Number} [height] height of image, ignored if <code>imageDisplay</code> is specified;
   * @property {Number} [dpi] dpi of image, ignored if <code>imageDisplay</code> is specified;
   * @property {Boolean} [returnGeometry  = true] If true, the resultset will include the geometries associated with each result.
   */
  /**
   * @name ArcGISIdentifyResults
   * @class This class represent the results of an identify operation for
   * a {@link ArcGISMapService}.
   *   There is no constructor, use JavaScript object literal.
   * <br/>For more info see <a  href  = 'http://resources.esri.com/help/9.3/arcgisserver/apis/rest/identify.html'>Identify Operation</a>.
   * @property {IdentifyResult[]} [results] The identify results as an array of {@link ArcGISIdentifyResult}
   */
  /**
   * @name ArcGISIdentifyResult
   * @class This class represent one entry in the results of an identify operation for a {@link ArcGISMapService}.
   *   There is no constructor, use JavaScript object literal.
   * <br/>For more info see <a  href  = 'http://resources.esri.com/help/9.3/arcgisserver/apis/rest/identify.html'>Identify Operation</a>.
   * @property {Number} [layerId] layerId
   * @property {String} [layerName] layerName
   * @property {String} [value] value of the display field
   * @property {String} [displayFieldName] displayFieldName
   * @property {String} [geometryType] esriGeometryPoint | esriGeometryPolyline | esriGeometryPolygon | esriGeometryEnvelope
   * @property {Geometry} [geometry] {@link ArcGISGeometry}
   * @property {Object} [attributes] attributes as name-value JSON object.
   */
  /**
   * Identify features on a particular ArcGISGeographic location, using {@link ArcGISIdenitfyParameters} and
   * process {@link ArcGISIdentifyResults} using the <code>callback</code> function.
   * For more info see <a
   * href  = 'http://resources.esri.com/help/9.3/arcgisserver/apis/rest/identify.html'>Identify Operation</a>.
   * @param {IdentifyParameters} params
   * @param {Function} callback
   */
  ArcGISMapService.prototype.identify = function (iparams, callback) {
    if (!iparams) {
      return;
    }
    var params = augmentObject(iparams, {});
    params.f = params.f || 'json';
    if (!isString(params.geometry)) {
      params.geometry = ArcGISUtil.fromGeometryToJSON(params.geometry);
    }
    var ext = params.mapExtent;// maybe Extent or String
    if (ext.xmin) {
      params.mapExtent = '' + ext.xmin + ',' + ext.ymin + ',' + ext.xmax + ',' + ext.ymax;
    } 
    if (!params.imageDisplay) {
      params.imageDisplay = '' + params.width + ',' + params.height + ',' + params.dpi;
    } 
    if (params.layers && !isString(params.layers)) {
      params.layers = 'all:' + this.getLayerIds(params.layers).join(',');
    }
    params.returnGeometry = (params.returnGeometry === false ? false : true);
    ArcGISUtil.getJSON(this.url + '/identify', params, 'callback', callback);
  };
  /**
   * @name ArcGISFindParameters
   * @class This class represent the parameters needed in an find operation for a {@link ArcGISMapService}.
   *   There is no constructor, use JavaScript object literal.
   * <br/>For more info see <a  href  = 'http://resources.esri.com/help/9.3/arcgisserver/apis/rest/find.html'>Find Operation</a>.
   * @property {String} [f  = json] The response format. html | json .
   * @property {String} [searchText] The search string. This is the text that is searched across the layers and the fields that the user specifies.
   * @property {Boolean} [contains  = true] If false, the operation searches for an exact match of
   *   the searchText string. An exact match is case sensitive.
   *   Otherwise, it searches for a value that contains the searchText provided.
   *    This search is not case sensitive. The default is true.
   * @property {String|String[]} [searchFields] The names of the fields to search. The fields are specified as a comma-separated list of field names.
   *    If this parameter is not specified, all fields are searched.
   *    <i>This can also be an array with field names </i>.
   * @property {Number} [sr] The well-known ID of the spatial reference of the output geometries.
   * @property {String} [layers] The layers to perform the find operation on. The layers to perform the find operation on.
   *   The layers are specified as a comma-separated list of layer ids. <i>It can also be an array of layer NAMEs</i>.
   * @property {Boolean} [returnGeometry  = true] If true, If true, the resultset will include the geometries associated with each result.
   */
  /**
   * @name ArcGISFindResults
   * @class This class represent the results of a find operation for a {@link ArcGISMapService}.
   *   There is no constructor, use JavaScript object literal.
   * <br/>For more info see <a  href  = 'http://resources.esri.com/help/9.3/arcgisserver/apis/rest/find.html'>Find Operation</a>.
   * @property {FindResult[]} [results] The find results as an array of {@link ArcGISFindResult}
   */
  /**
   * @name ArcGISFindResult
   * @class This class represent one entry in the results of a find operation for a {@link ArcGISMapService}.
   *   There is no constructor, use JavaScript object literal.
   * <br/>For more info see <a  href  = 'http://resources.esri.com/help/9.3/arcgisserver/apis/rest/find.html'>Find Operation</a>.
   * @property {Number} [layerId] layerId
   * @property {String} [layerName] layerName
   * @property {String} [value] value of the display field
   * @property {String} [displayFieldName] displayFieldName
   * @property {String} [foundFieldName] foundFieldName
   * @property {String} [geometryType] esriGeometryPoint | esriGeometryPolyline | esriGeometryPolygon | esriGeometryEnvelope
   * @property {Geometry} [geometry] {@link ArcGISGeometry}
   * @property {Object} [attributes] attributes as name-value JSON object.
   */
  /**
   * Find features using the {@link ArcGISFindParameters} and process {@link ArcGISFindResults}
   * using the <code>callback</code> function.
   * For more info see <a
   * href  = 'http://resources.esri.com/help/9.3/arcgisserver/apis/rest/find.html'>Find Operation</a>.
   * @param {FindParameters} params
   * @param {Function} callback
   */
  ArcGISMapService.prototype.find = function (fparams, callback) {
    if (!fparams) {
      return;
    }
    var params = augmentObject(fparams, {});
    params.f = params.f || 'json';
    if (params.layers && !isString(params.layers)) {
      params.layers = this.getLayerIds(params.layers).join(',');
    }
    if (params.searchFields && !isString(params.searchFields)) {
      params.searchFields = params.searchFields.join(',');
    }
    params.contains = (params.contains === false ? false : true);
    params.returnGeometry = (params.returnGeometry === false ? false : true);
    ArcGISUtil.getJSON(this.url + '/find', params, 'callback', callback);
  };
  /**
   * <b>To be implemented </b>
   * Generate {@link ArcGISGenerateKMLParameters} and a link to the KML file
   * For more info see <a
   * href  = 'http://resources.esri.com/help/9.3/arcgisserver/apis/rest/generatekml.html'>Generate KML Operation</a>.
   * @param {GenerateKMLParameters} params
   * @return {String} URL
   */
  ArcGISMapService.prototype.generateKML = function (params) {
    // TODO
  };
  /**
   * Query a layer with given id or name using the {@link ArcGISQueryParameters} and process {@link ArcGISResultSet}
   * using the <code>callback</code> function.
   * See {@link ArcGISLayer}.
   * For more info see <a  href  = 'http://resources.esri.com/help/9.3/arcgisserver/apis/rest/query.html'>Query Layer Operation</a>.
   * @param {Number|String} layerNameOrId
   * @param {QueryParameters} params
   * @param {Function} callback
   */
  ArcGISMapService.prototype.queryLayer = function (layerNameOrId, params, callback) {
    var layer = this.getLayer(layerNameOrId);
    if (layer) {
      layer.query(params, callback);
    }
  };



 /**
 * Creates an ArcGISGeometryService class.
 * Params:<li><code>url</code>: URL of service, syntax:<code>	http://{catalog-url}/{serviceName}/GeometryServer</code>
 * @name ArcGISGeometryService
 * @class This class (<code>google.maputils.arcgis.GeometryService</code>) represent an ArcGIS 
 * <a href="http://resources.esri.com/help/9.3/arcgisserver/apis/rest/geometryserver.html">Geometry</a>
 *  service.
 * @param {String} url
 */
  function ArcGISGeometryService(url) {
    this.url  = url;
  }
  /**
   * @name ArcGISProjectParameters
   * @class This class represent the parameters needed in an project operation
   *  for a {@link ArcGISGeometryService}.
   *   There is no constructor, use JavaScript object literal.
   * <br/>For more info see <a  href  = 'http://resources.esri.com/help/9.3/arcgisserver/apis/rest/project.html'>Project Operation</a>.
   * @property {String} [f  = json] The response format. html | json .
   * @property {Geometry[]} [geometries] Array of {@link ArcGISGeometry} to project. In the case of points, the following syntax also works:
   *   <code>geometries  = x1, y1, x2, y2, ..., xn, yn</code>
   * @property {String} [geometryType] esriGeometryPoint | esriGeometryPolyline | esriGeometryPolygon | esriGeometryEnvelope
   * @property {Number} [inSR] The well-known ID of the spatial reference of the input geometries
   * @property {Number} [outSR] The well-known ID of the spatial reference of the out geometries
   */
  /**
   * This resource projects an array of input geometries from an input spatial reference
   * to an output spatial reference
   * @param {ProjectParameters} params
   * @param {Function} callback
   */
  ArcGISGeometryService.prototype.project = function (params, callback) {
    if (!params) {
      return;
    }
    params.f = params.f || 'json';
    if (!isString(params.geometries)) {
      // problem: REST seems do not like esriGeometryEnvelope
      var gt = ESRI_GEOMETRY_POINT;
      var json = [];
      for (var i = 0, c = params.geometries.length; i < c; i++) {
        var g = params.geometries[i];
        if (i === 0) {
          if (g.points) {
            gt = ESRI_GEOMETRY_MULTIPOINT;
          } else if (g.paths) {
            gt = ESRI_GEOMETRY_POLYLINE;
          } else if (g.rings) {
            gt = ESRI_GEOMETRY_POLYGON;
          }
        }
        json.push(ArcGISUtil.fromGeometryToJSON(g, false));
      }
      params.geometries = '{ geometryType:' + gt + ', geometries:[' + json.join(',') + ']}';
    }
    ArcGISUtil.getJSON(this.url + '/project', params, "callback", callback);
  };

  /**
 * Creates an ArcGISGeocodeService class.
 * Params:<li><code>url</code>: URL of service, syntax:<code>	http://{catalog-url}/{serviceName}/GeocodeServer</code>
 * @name ArcGISGeocodeService
 * @class This class (<code>google.maputils.arcgis.GeocodeService</code>) represent an ArcGIS <a href="http://resources.esri.com/help/9.3/arcgisserver/apis/rest/geocodeserver.html">GeocodeServer</a>
 *  service.
 * @param {String} url
 * @property {String} [serviceDescription] serviceDescription
 * @property {Field[]} [addressFields] input fields. 
 *    Each entry is an object of type {@link ArcGISField}, plus <code>required(true|false)</code>
 * @property {Field[]} [candidateFields] candidate Fields. 
 *    Each entry is an object of type {@link ArcGISField}
 * @property {Field[]} [intersectionCandidateFields] intersectionCandidateFields
 *    Each entry is an object of type {@link ArcGISField}
 * @property {ArcGISSpatialReference} [spatialReference] spatialReference <b>wkid info only</b>
 * @property {Object} [locatorProperties] an object with key-value pair that is specific to Locator type.
 */
  function ArcGISGeocodeService(url) {
    this.url = url;
    var me = this;
    ArcGISUtil.getJSON(url, {
      f: 'json'
    }, 'callback', function (json) {
      me.init_(json);
    });
  }
  
  /**
   * init
   * @param {Object} json
   */
  ArcGISGeocodeService.prototype.init_ = function (json) {
    augmentObject(json, this);
    /**
     * This event is fired when the service and it's service info is loaded.
     * @name ArcGISGeocodeService#load
     * @event
     */
    triggerEvent(this, 'load');
  };
  /**
   * If this ArcGISGeocodeService meta data has loaded. useful to get the Spatial Reference information.
   * @return {Boolean}
   */
  ArcGISGeocodeService.prototype.hasLoaded = function () {
    return this.addressFields !== null;
  };

  
/**
 * @name ArcGISGeocodeParameters
 * @class This class represent the parameters needed in a find address candidate operation
 *  on a {@link ArcGISGeocodeService}.
 *   There is no constructor, use JavaScript object literal.
 * <br/>For more info see <a  href  = 'http://resources.esri.com/help/9.3/arcgisserver/apis/rest/candidates.html'>Find Adddress Candidates Operation</a>.
 * @property {String} [f  = json] The response format. html | json |kmz.
 * @property {Object} [inputs] an object literal with name-value pair of input values.
 * @property {String|String[]} [outFields] The list of fields to be included in the returned resultset. 
 *   This list can be a comma delimited String or an array of String.
 */
/**
 * @name ArcGISGeocodeResults
 * @class This class represent the results of an find address candidate operation for a 
 *  {@link ArcGISGeocodeService}.
 *   There is no constructor, use JavaScript object literal.
 * <br/>For more info see <a  href  = 'http://resources.esri.com/help/9.3/arcgisserver/apis/rest/candidates.html'>Find Adddress Candidates Operation</a>.
 * @property {GeocodeResult[]} [candidates] The find address results as 
 * an array of {@link ArcGISGeocodeResult}
 */
/**
 * @name ArcGISGeocodeResult
 * @class This class represent one entry in the results of a find address operation for a
 *  {@link ArcGISGeocodeService}.
 *   There is no constructor, use JavaScript object literal.
 * <br/>For more info see <a  href  = 'http://resources.esri.com/help/9.3/arcgisserver/apis/rest/candidates.html'>Find Adddress Candidates Operation</a>.
 * @property {String} [address] matched address
 * @property {Geometry} [location] matched location
 * @property {Number} [score] matching score
 * @property {Object} [attributes] attributes as name-value JSON object. 
 * e.g. <code>{"StreetName" : "MASON", "StreetType" : "ST"}</code>
 */
/**
 * The findAddressCandidates operation is performed on a geocode service
 *  resource. The result of this operation is a resource representing 
 *  the list of address candidates. This resource provides information 
 *  about candidates including the address, location, and score.
 *  param is an instance of {@link ArcGISGeocodeParameters}. An instance of
 *  {@link ArcGISGeocodeResults} will be passed into callback function.
 * @param {GeocodeParameters} params
 * @param {Function} callback
 */
  ArcGISGeocodeService.prototype.findAddressCandidates = function (gparams, callback) {
    var params = augmentObject(gparams, {});
    params.f = params.f || 'json';
    if (params.inputs) {
      augmentObject(params.inputs, params);
      delete params.inputs;
    }
    if (isArray(params.outFields)) {
      params.outFields = params.outFields.join(',');
    }
    ArcGISUtil.getJSON(this.url + '/findAddressCandidates', params, 'callback', callback);
  };
  /**
   * Alias of <code>ArcGISGeocodeService.findAddressCandidates</code>;
   * @param {GeocodeParameters} params
   * @param {Function} callback
   */
  ArcGISGeocodeService.prototype.geocode = function (params, callback) {
    this.findAddressCandidates(params, callback);
  };

/**
 * @name ArcGISReverseGeocodeParameters
 * @class This class represent the parameters needed in a reverseGeocode operation
 *  on a {@link ArcGISGeocodeService}.
 *   There is no constructor, use JavaScript object literal.
 * <br/>For more info see <a  href  = 'http://resources.esri.com/help/9.3/arcgisserver/apis/rest/reverse.html'>Reverse Geocode Operation</a>.
 * @property {String} [f  = json] The response format. html | json |kmz.
 * @property {Geometry|String} [location] an object literal of type {@link ArcGISPoint}. You can also use x,y string.
 * @property {Number} [distance] The distance in meters from the given location within which 
 *  a matching address should be searched.
 */

/**
 * @name ArcGISReverseGeocodeResult
 * @class This class represent one entry in the results of a find address operation for a
 *  {@link ArcGISGeocodeService}.
 *   There is no constructor, use JavaScript object literal.
 * <br/>For more info see <a  href  = 'http://resources.esri.com/help/9.3/arcgisserver/apis/rest/reverse.html'>Reverse Geocode Operation</a>.
 * @property {Object} [address] matched address, object literal with name-value address parts. 
 *  e.g.: <code>{  "Street" : "771 TUNNEL AVE",  "Zone" : "94005"  }</code>
 * @property {Geometry} [location] matched location
 */
/**
 * The reverseGeocode operation is The reverseGeocode operation is performed on a geocode service resource. 
 * The result of this operation is a reverse geocoded address resource.
 *  param is an instance of {@link ArcGISReverseGeocodeParameters}. An instance of
 *  {@link ArcGISReverseGeocodeResult} will be passed into callback function.
 * @param {ReverseGeocodeParameters} params
 * @param {Function} callback
 */
  ArcGISGeocodeService.prototype.reverseGeocode = function (params, callback) {
    params.f = params.f || 'json';
    if (!isString(params.location)) {
      params.location = ArcGISUtil.fromGeometryToJSON(params.location);
    }
    ArcGISUtil.getJSON(this.url + '/reverseGeocode', params, 'callback', callback);
  };
 
  

// end of REST API stuff
  
  /**
   * Creates an ArcGIS Map Tiling Reference System.
   * <ul>
   * <li><code>tileInfo</code> tiling information. An instance of {@link ArcGISTileInfo}
   * <li><code>opt_fullExtent</code> full extent of the tiles. An instance of {@link ArcGISEnvelope}
   * </ul>Applications normally do not create instances of this class directly.
   * If needed, it can be accessed by <code>GMap2.getCurrentMapType().getProjection()</code>
   * for customized <code>GMapType</code>s.
   * @name ArcGISProjection
   * @class This class (<code>google.maputils.arcgis.Projection</code>) implements a custom
   * <a href  = 'http://code.google.com/apis/maps/documentation/reference.html#GProjection'>GProjection</a> 
   * from the core Google Maps API.
   *   It carries a real {@link ArcGISSpatialReference} object to convert LatLng from/to
   *   map coordinates, and tiling scheme informations to convert
   *   map coordinates from/to pixel coordinates. <b>The tiles must be square, with same width and height</b>.
   * @param {TileInfo} tileInfo
   * @param {Envelope} fullExtent
   */
  function ArcGISProjection(tileInfo, opt_fullExtent) {
    if (!tileInfo) {
      throw new Error('map service is not tiled');
    }
    this.tileInfo_  =  tileInfo;
    this.spatialReference_  =  ArcGISSpatialReferences.getSpatialReference(tileInfo.spatialReference.wkid);
    if (!this.spatialReference_) {
      throw new Error('unsupported Spatial Reference'); 
    }
    this.zoomOffset_  =  Math.floor(Math.log(this.spatialReference_.getCircumference() / this.tileInfo_.lods[0].resolution / 256) / Math.LN2 + 0.5);
    this.fullExtent_  =  opt_fullExtent;
  }
  ArcGISProjection.prototype  =  new GProjection();
  
  /**
   * See <a href  = 'http://code.google.com/apis/maps/documentation/reference.html#GProjection'>GProjection</a>.
   * @param {GLatLng} gLatLng
   * @param {Number} zoom
   * @return {GPoint} pixel
   */
  ArcGISProjection.prototype.fromLatLngToPixel  =  function (gLatLng, zoom) {
    if (!gLatLng || isNaN(gLatLng.lat()) || isNaN(gLatLng.lng())) {
      return null;
    }
    var coords  =  this.spatialReference_.forward([gLatLng.lng(), gLatLng.lat()]);
    var zoomIdx  =  zoom - this.zoomOffset_;
    var res  = this.getUnitsPerPixel(zoom);
    var px  =  Math.round((coords[0] - this.tileInfo_.origin.x) / res);
    var py  =  Math.round((this.tileInfo_.origin.y - coords[1]) / res);
    return new GPoint(px, py);
  };
  /**
   * Get resolution (Units per Pixel) at given zoom level. 
   * @param {Number} zoom
   * @return Number
   */
  ArcGISProjection.prototype.getUnitsPerPixel  = function (zoom) {
    var zoomIdx  =  zoom - this.zoomOffset_;
    var res  = Number.MAX_VALUE;
    if (this.tileInfo_.lods[zoomIdx]) {
      res  = this.tileInfo_.lods[zoomIdx].resolution;
    } else {
      //this is a special case when the maxZoom is set larger than what's actually defined in the tiling scheme.
      // the goal is to allow map continue to zoom to extremely detail level by using ArcGISMapOverlay.
      var factor  = Math.pow(2, zoom - this.maxResolution());
      res  = this.tileInfo_.lods[this.tileInfo_.lods.length - 1].resolution / factor;
    }
    return res;
  };
  /**
   * Get the scale at given level;
   * @param {Number} zoom
   * @return {Number}
   */
  ArcGISProjection.prototype.getScale  =  function (zoom) {
    var zoomIdx  =  zoom - this.zoomOffset_;
    var res  = 0;
    if (this.tileInfo_.lods[zoomIdx]) {
      res  = this.tileInfo_.lods[zoomIdx].scale;
    } else {
      //this is a special case when the maxZoom is set larger than what's actually defined in the tiling scheme.
      // the goal is to allow map continue to zoom to extremely detail level by using ArcGISMapOverlay.
      var factor  = Math.pow(2, zoom - this.maxResolution());
      res  = this.tileInfo_.lods[this.tileInfo_.lods.length - 1].scale / factor;
    }
    return res;
  };
  /**
   * See <a href  = 'http://code.google.com/apis/maps/documentation/reference.html#GProjection'>GProjection</a>.
   * @param {GPoint} pixel
   * @param {Number} zoom
   * @param {Boolean} unbound
   * @return {GLatLng} gLatLng
   */
  ArcGISProjection.prototype.fromPixelToLatLng  =  function (pixel, zoom, unbound) {
    if (pixel === null) {
      return null;
    }
    var zoomIdx  =  zoom - this.zoomOffset_;
    var res  = this.getUnitsPerPixel(zoom);
    var x  =  pixel.x * res + this.tileInfo_.origin.x;
    var y  =  this.tileInfo_.origin.y - pixel.y * res;
    var ll  =  this.spatialReference_.reverse([x, y]);
    return new GLatLng(ll[1], ll[0]);
  };
  /**
   * See <a href  = 'http://code.google.com/apis/maps/documentation/reference.html#GProjection'>GProjection</a>.
   * @param {Object} tile
   * @param {Number} zoom
   * @param {Number} tilesize
   */
  ArcGISProjection.prototype.tileCheckRange  =  function (tile, zoom, tilesize) {
    var zoomIdx  =  zoom - this.zoomOffset_;
    if (this.tileInfo_.lods[zoomIdx]) {
      var b  =  this.fullExtent_;
      if (!b) {
        return true;
      }
      var minX  =  tile.x * tilesize * this.tileInfo_.lods[zoomIdx].resolution + this.tileInfo_.origin.x;
      var minY  =  this.tileInfo_.origin.y - (tile.y + 1) * tilesize * this.tileInfo_.lods[zoomIdx].resolution;
      var maxX  =  (tile.x + 1) * tilesize * this.tileInfo_.lods[zoomIdx].resolution + this.tileInfo_.origin.x;
      var maxY  =  this.tileInfo_.origin.y - tile.y * tilesize * this.tileInfo_.lods[zoomIdx].resolution;
      var ret = !(b.xmin > maxX || b.xmax < minX || b.ymax < minY || b.ymin > maxY);
      return ret;
    } else {
      return false;
    }
  };
  
  /**
   * See <a href  = 'http://code.google.com/apis/maps/documentation/reference.html#GProjection'>GProjection</a>.
   * @param {Number} zoom
   * @return {Number} numOfpixel
   */
  ArcGISProjection.prototype.getWrapWidth  =  function (zoom) {
    var zoomIdx  =  zoom - this.zoomOffset_;
    if (this.tileInfo_.lods[zoomIdx]) {
      return this.spatialReference_.getCircumference() / this.tileInfo_.lods[zoomIdx].resolution;
    } else {
      return Number.MAX_VALUE;
    }
  };
  /**
   * Get the tile size used by this Projection. Shortcut to tileInfo.rows;
   * @return {Number}
   */
  ArcGISProjection.prototype.getTileSize  =  function () {
    return this.tileInfo_.rows;
  };
  
  /**
   * Get min zoom level of actual tiles
   * @return {Number}
   */
  ArcGISProjection.prototype.minResolution  = function () {
    return this.zoomOffset_;
  };
  /**
   * Get max zoom level of actual tiles
   * @return {Number}
   */
  ArcGISProjection.prototype.maxResolution  = function () {
    return this.zoomOffset_ + this.tileInfo_.lods.length - 1;
  };
  
  /**
   * Get the underline {@link ArcGISSpatialReference}
   * @return {ArcGISSpatialReference}
   */
  ArcGISProjection.prototype.getSpatialReference  =  function () {
    return this.spatialReference_;
  };
  
  /**
   * @name ArcGISTileLayerOptions
   * @class Instances of this class are used in the {@link ArcGISopt_layerOpts} argument
   *   to the constructor of the {@link ArcGISTileLayer} class. In addition to
   *   the properties listed below, it can also have properties available in
   * <a href  = 'http://code.google.com/apis/maps/documentation/reference.html#GTileLayerOptions'>GTileLayerOptions</a>
   * such as <code>opacity,isPng,draggingCursor</code> etc. Note: <code>tileUrlTemplate</code> is ignored.
   * @property {String} [hosts] host pattern of tile servers if they are numbered. Most browser
   *   has default restrictions on how many concurrent connections can be made to
   *   a single host. One technique to workaround this is to create multiple hosts and rotate them when
   *   loading tiles.
   *   The syntax is <code>prefix[<i>numberOfHosts</i>]suffix</code>, for example, <code>"mt[4].google.com"</code> means
   *   rotate hosts in <code>mt0.google.com, mt1.google.com, mt2.google.com, mt3.google.com</code> (4 hosts).
   * @property {GCopyrights} [copyrights] copyrights.
   *   If not specified, will be calculated from map service.
   * @property {Number} [minResolution] minimal zoom level. 
   *   If not specified, will be calculated from map service.
   * @property {Number} [maxResolution] maximal zoom level.
   *   If not specified, will be calculated from map service.
   * @property {String} [name] optional. The name assigned to this layer 
   *    (it's underline service). This name can be used to identify this tile layer.
   * @property {ArcGISProjection} [projection] an instance of {@link ArcGISProjection}. If this option is 
   * specified, you do not have to wait the 'load' event to use the ArcGISTileLayer.
   */
  
  /** Creates a tile layer from a cached by ArcGIS map service. 
   * <br/> <code> service</code> (required) is the url of the underline {@link ArcGISMapService}, or the map service itself.
   * <br/> <code>opt_layerOpts</code> (optional) is an instance of {@link ArcGISTileLayerOptions}.
   * @name ArcGISTileLayer
   * @class This class (<code>google.maputils.arcgis.TileLayer</code>) extends
   * <a href  = 'http://code.google.com/apis/maps/documentation/reference.html#GTileLayer'>GTileLayer</a>
   *  from the core Google Maps API and provides access to a cached ArcGIS Server map service.<br/> This class can be used in {@link ArcGISMapType} or
   * {@link ArcGISTileLayerOverlay}.
   * @param {String|ArcGISMapService} service
   * @param {TileLayerOptions} opt_layerOpts
   */
  function ArcGISTileLayer(service, opt_layerOpts) {
    opt_layerOpts  =  opt_layerOpts || {};
    this.mapService_  =  (service instanceof ArcGISMapService)?service:new ArcGISMapService(service);
    if (opt_layerOpts.name) {
      this.mapService_.name = opt_layerOpts.name;
    }
    //In the format of mt[number].domain.com
    if (opt_layerOpts.hosts) {
      var pro  =  extractString(this.mapService_.url, '', '://');
      var host  =  extractString(this.mapService_.url, '://', '/');
      var path  =  extractString(this.mapService_.url, pro + '://' + host, '');
      this.urlTemplate_  =  pro + '://' + opt_layerOpts.hosts + path;
      this.numOfHosts_  =  parseInt(extractString(opt_layerOpts.hosts, '[', ']'), 10);
    }
    if (this.mapService_.hasLoaded()) {
      this.init_(opt_layerOpts);
    } else {
      var me  =  this;
      GEvent.addListener(this.mapService_, 'load', function () {
        me.init_(opt_layerOpts);
      });
      // avoid exception if used before loaded.
      var copy  =  opt_layerOpts.copyrights;
      this.projection_  = opt_layerOpts.projection;
      var minZoom  =  opt_layerOpts.minResolution || (this.projection_?this.projection_.minResolution():0);
      var maxZoom  =  opt_layerOpts.maxResolution || (this.projection_?this.projection_.maxResolution():19);
      GTileLayer.call(this, copy, minZoom, maxZoom, opt_layerOpts);
    }
  }
  
  /**
   * Create Prototype
   */
  ArcGISTileLayer.prototype  =  new GTileLayer();
  
  /**
   * Initialize the tile layer from a loaded map service
   * @param {ArcGISMapService} mapService
   * @param {Object} opt_layerOpts
   */
  ArcGISTileLayer.prototype.init_  =  function (opt_layerOpts) {
    this.projection_  =  new ArcGISProjection(this.mapService_.tileInfo, this.mapService_.fullExtent);
    var copy  =  opt_layerOpts.copyrights;
    if (!copy) {
      copy  =  new GCopyrightCollection('');
      copy.addCopyright(new GCopyright(1, ArcGISUtil.fromEnvelopeToLatLngBounds(this.mapService_.fullExtent), this.projection_.zoomOffset_, this.mapService_.copyrightText));
    }
    var minZoom  =  opt_layerOpts.minResolution || this.projection_.minResolution();
    var maxZoom  =  opt_layerOpts.maxResolution || this.projection_.maxResolution();
    if (opt_layerOpts.tileUrlTemplate) {
      delete opt_layerOpts.tileUrlTemplate;
    }
    GTileLayer.call(this, copy, minZoom, maxZoom, opt_layerOpts);
   /**
   * This event is fired when the layer's service is loaded. 
   * Passing {@link ArcGISTileLayer} as argument
   * @name ArcGISTileLayer#load
   * @param {ArcGISTileLayer} layer
   * @event
   */
    GEvent.trigger(this, "load", this);
  };
  /**
   * Gain access to the underline {@link ArcGISMapService}
   * @return {MapSerive}
   */
  ArcGISTileLayer.prototype.getMapService  =  function () {
    return this.mapService_;
  };
  /**
   * Get full bounds of the to the underline {@link ArcGISMapService}
   * @return {GLatLngBounds}
   */
  ArcGISTileLayer.prototype.getFullBounds  =  function () {
    this.fullBounds_  = this.fullBounds_ || ArcGISUtil.fromEnvelopeToLatLngBounds(this.mapService_.fullExtent);
    return this.fullBounds_;
  };
  /**
   * Get initial bounds of the to the underline {@link ArcGISMapService}
   * @return {GLatLngBounds}
   */
  ArcGISTileLayer.prototype.getInitialBounds  =  function () {
    this.initialBounds_  = this.initialBounds_ || ArcGISUtil.fromEnvelopeToLatLngBounds(this.mapService_.initialExtent);
    return this.initialBounds_;
  };
  
  /**
   * Get the tile layer's name (underline maps service's name)
   * @return {String}
   */
  ArcGISTileLayer.prototype.getName  =  function () {
    return this.mapService_.name;
  };
  /**
   * Returns the {@link ArcGISProjection}, a subclass of <code>GProjection</code>
   *  used by this ArcGISTileLayer.
   * @return {ArcGISProjection} 
   */
  ArcGISTileLayer.prototype.getProjection  =  function () {
    return this.projection_;
  };
  
  /**
   * See <a href  = http://code.google.com/apis/maps/documentation/reference.html#GTileLayer>GTileLayer</a>.
   * @private not meant to be called by client
   * @param {Object} tile
   * @param {Number} zoom
   * @return {String} url
   */
  ArcGISTileLayer.prototype.getTileUrl  =  function (tile, zoom) {
   // this.mapService_.hasLoaded() allow direct load of WebMercator
    var z  = zoom - (this.projection_?this.projection_.minResolution():this.minResolution());
    if (!isNaN(tile.x) && !isNaN(tile.y) && z >=  0) {
      var u  =  this.mapService_.url;
      if (this.urlTemplate_) {
        u  =  this.urlTemplate_.replace('[' + this.numOfHosts_ + ']', '' + ((tile.y + tile.x) % this.numOfHosts_));
      }
      // use this.minResolution instead of offset for ArcGISTileLayerOverlay add before loading.
      return u + '/tile/' + z + '/' + tile.y + '/' + tile.x;
    }
    return '';
  };
  
  /**
   * If the tile layer is loaded. Returns <code>true</code> if it's map service is loaded.
   * @return {Boolean}
   */
  ArcGISTileLayer.prototype.hasLoaded  =  function () {
    return this.mapService_.hasLoaded();
  };
  
  /**
   * @name ArcGISMapTypeOptions
   * @class Instance of this class are used in the {@link ArcGISopt_typeOpts} argument
   *  to the constructor of the {@link ArcGISMapType} class. In addition to the properties 
   *  listed below, it can also contain properties from 
   *  <a href  = http://code.google.com/apis/maps/documentation/reference.html#GMapTypeOptions>GMapTypeOptions</a>
   * except the <code>tileSize</code> property, in which case it will 
   * be overwritten by the first {@link ArcGISTileLayer}'s {@link ArcGISProjection}.
   * @property {String} [name] map type name
   * @property {ArcGISProjection} [projection] an instance of {@link ArcGISProjection}. If this option is 
   * specified, you do not have to wait the 'load' event to use the MapType.
   */
  /**
   * Creates a MapType, with the following parameters:
   * <li><code>tileLayers</code>: a array of {@link ArcGISTileLayer}s, 
   *  or a single URL as shortcut.
   * <li><code>opt_typeOpts</code>: optional. An instance of {@link ArcGISMapTypeOptions}
   * @name ArcGISMapType
   * @class This class (<code>google.maputils.arcgis.MapType</code>) extends the Google Maps API's
   * <a href  = http://code.google.com/apis/maps/documentation/reference.html#GMapType>GMapType</a>.
   * It holds a list of {@link ArcGISTileLayer}s.
   * <p> Because all tileLayers are loaded asynchronously, and currently the
   * core API does not have method to refresh tiles on demand, if you do not load the default
   * Google maps, you should either 1) add to
   * map after it "load" event is fired, or) trigger an map type change to force refresh.
   * See <a href  = http://code.google.com/p/gmaps-api-issues/issues/detail?id  = 279&can  = 1&q  = refresh&colspec  = ID%20Type%20Status%20Introduced%20Fixed%20Summary%20Stars%20ApiType%20Internal>Issue 279</a>
   * </p>
   * <p> Note: all tiled layer in the same map type must use same spatial reference and tile scheme.</p>
   * @param {String|ArcGISTileLayer[]} tileLayers
   * @param {MapTypeOptions} opt_typeOpts
   */
  function ArcGISMapType(tileLayers, opt_typeOpts) {
    var me  =  this;
    opt_typeOpts  =  opt_typeOpts || {};
    var layers  = tileLayers;
    if (isString(tileLayers)) {
      layers  = [new ArcGISTileLayer(tileLayers)];
    } 
    else if (tileLayers instanceof ArcGISTileLayer) {
      layers  = [tileLayers];
    }/*  else if (tileLayers.length>0 && isString(tileLayers[0])) {
      layers  = [];
      for (var i  = 0; i< tileLayers.length; i++) {
        layers[i]  = new ArcGISTileLayer(tileLayers[i]);
      }
    }*/
    var layersLoaded  =  0, i;
    //jslint complaints about making function in a loop so define here.
    function handleLayerLoad() {
      layersLoaded++;
      if (layersLoaded === layers.length) {
        me.init_(layers, opt_typeOpts);
      }
    }
    for (i  =  0; i < layers.length; i++) {
      var mapService  =  layers[i].getMapService();
      if (mapService.hasLoaded()  ===  false) {
        GEvent.addListener(mapService, 'load', handleLayerLoad);
      } else {
        layersLoaded++;
      }
    }
    if (layersLoaded  ===  layers.length) {
      this.init_(layers, opt_typeOpts);
    } else {
      var prj  = null;
      if (opt_typeOpts.projection) {
        prj  = opt_typeOpts.projection;
        for (i  = 0; i < layers.length; i++) {
          if (!layers[i].projection_) {
            layers[i].projection_ = prj;
          }
        }
      } else {
        prj  = layers[0].projection_;
      }
      if (prj) {
        opt_typeOpts.tileSize = prj.getTileSize();
      }
      GMapType.call(this, layers, prj || new GMercatorProjection(20), opt_typeOpts.name || layers[0].getMapService().name, opt_typeOpts);
    }
  }
  ArcGISMapType.prototype  =  new GMapType();
  /**
   * Initialize map type, called after each layer loaded.
   * @private
   * @param {ArcGISTileLayer[]} tileLayers
   * @param {String} name
   * @param {GMapTypeOptions} opt_typeOpts
   * @param {Function} opt_callback
   */
  ArcGISMapType.prototype.init_  =  function (tileLayers, opt_typeOpts) {
    opt_typeOpts.tileSize  =  tileLayers[0].getProjection().getTileSize();
    var name  = opt_typeOpts.name || tileLayers[0].getMapService().name;
    GMapType.call(this, tileLayers, tileLayers[0].getProjection(), name, opt_typeOpts);
   /**
   * This event is fired when all layer's services are loaded. 
   * Passing {@link ArcGISMapType} as argument
   * @name ArcGISMapType#load
   * @param {ArcGISMapType} mapType
   * @event
   */
    GEvent.trigger(this, "load", this);
  };
  
  /**
   * @name ArcGISMapOverlayOptions
   * @class Instance of this class are used in the {@link ArcGISopt_ovelayOpts} argument
   *  to the constructor of the {@link ArcGISMapOverlay} class.
   * @property {Number} [opacity  = 1.0] Opacity of map image from 0.0 (invisible) to 1.0 (opaque)
   * @property {ExportMapParameters} [exportParams] See {@link ArcGISExportMapParameters}
   * @property {String} [name] name assigned to this {@link ArcGISMapOverlay}
   * @property {Number} [minResolution] min zoom level.
   * @property {Number} [maxResolution] max zoom level.
   * 
   */
  
  /**
   * Creates an Map Overlay using <code>url</code> of the map service and optional {@link ArcGISMapOverlayOptions}.
   * <li/> <code> service</code> (required) is url of the underline {@link ArcGISMapService} or the ArcGISMapService itself.
   * <li/> <code>opt_overlayOpts</code> (optional) is an instance of {@link ArcGISMapOverlayOptions}.
   * @name ArcGISMapOverlay
   * @class This class (<code>google.maputils.arcgis.MapOverlay</code>) extends the Google Maps API's
   * <a href  = http://code.google.com/apis/maps/documentation/reference.html#GOverlay>GOverlay</a>
   * that draws map images from data source on the fly. It is also known as "<b>Dynamic Maps</b>".
   * It can be added to the map via <code>GMap2.addOverlay </code> method.
   * The similar class in the core GMap API is <a href  = http://code.google.com/apis/maps/documentation/reference.html#GGroundOverlay>GGroundOverlay</a>,
   * however, the instance of this class always cover the viewport exactly, and will redraw itself as map moves.
   * @constructor
   * @param {String|ArcGISMapService} service
   * @param {MapOverlayOptions} opt_overlayOpts
   */
  function ArcGISMapOverlay(service, opt_overlayOpts) {
    opt_overlayOpts  =  opt_overlayOpts || {};
    this.mapService_  = (service instanceof ArcGISMapService)?service:new ArcGISMapService(service);
    if (opt_overlayOpts.name) {
      this.mapService_.name = opt_overlayOpts.name;
    }
    this.minZoom_  = opt_overlayOpts.minResolution;
    this.maxZoom_  = opt_overlayOpts.maxResolution;
    if (this.mapService_.hasLoaded()) {
      this.init_(opt_overlayOpts);
    } else {
      var me  =  this;
      GEvent.addListener(this.mapService_, 'load', function () {
        me.init_(opt_overlayOpts);
      });
    }
  }
  
  ArcGISMapOverlay.prototype  =  new GOverlay();
  
  /**
   * Intialize the map layer info.
   * It is called before GOverlay.initialize which setups the UI elements.
   * @private
   * @param {ArcGISMapService} mapService
   * @param {MapOverlayOptions} opt_overlayOpts
   */
  ArcGISMapOverlay.prototype.init_  =  function (opt_overlayOpts) {
    this.opacity_  =  opt_overlayOpts.opacity || 1;
    this.exportParams_  = opt_overlayOpts.exportParams || {};
    
    // if the map imaging is been generated on server.
    this.drawing_  =  false;
    // if a follow up refresh is needed, normally cause by map view change before
    // the previous map has finished drawing.
    this.redraw_  =  false;
    // ?? may change
    if (this.img_  === null) {
      this.refresh();
    }
    if (this.map_) {
      this.setupMapType_();
    }
   /**
   * This event is fired when the layer's service is loaded. Passing {@link ArcGISMapOverlay} as argument
   * @name ArcGISMapOverlay#load
   * @param {ArcGISMapOverlay} overlay
   * @event
   */
    GEvent.trigger(this, "load", this);
  };
  /**
   * Attached this overlay to all gmaptypes. Mainly for copyrights .
   */
  ArcGISMapOverlay.prototype.setupMapType_  =  function (type) {
    if (type) {
      type.agsOvs_  =  type.agsOvs_ || [];
      if (indexOf(type.agsOvs_, this)  ===  -1) {
        type.agsOvs_.push(this);
      }
    } else if (this.map_) {
      var types = this.map_.getMapTypes();
      for (var i = 0; i < types.length; i++) {
        type  =  types[i];
        type.agsOvs_  =  type.agsOvs_ || [];
        if (indexOf(type.agsOvs_, this)  ===  -1) {
          type.agsOvs_.push(this);
        }
      }
    }
  };
  /**
   * Gain access to the underline {@link ArcGISMapService}
   * @return {MapSerive}
   */
  ArcGISMapOverlay.prototype.getMapService  =  function () {
    return this.mapService_;
  };
  /**
   * Get full bounds of the to the underline {@link ArcGISMapService}
   * @return {GLatLngBounds}
   */
  ArcGISMapOverlay.prototype.getFullBounds  =  function () {
    this.fullBounds_  = this.fullBounds_ || ArcGISUtil.fromEnvelopeToLatLngBounds(this.mapService_.fullExtent);
    return this.fullBounds_;
  };
  /**
   * Get initial bounds of the to the underline {@link ArcGISMapService}
   * @return {GLatLngBounds}
   */
  ArcGISMapOverlay.prototype.getInitialBounds  =  function () {
    this.initialBounds_  = this.initialBounds_ || ArcGISUtil.fromEnvelopeToLatLngBounds(this.mapService_.initialExtent);
    return this.initialBounds_;
  };
  /**
   * Get name of the underline {@link ArcGISMapService}
   * @return {String}
   */
  ArcGISMapOverlay.prototype.getName  =  function () {
    return this.mapService_.name;
  };
  /**
   * Sets Image Opacity. parameter <code>opacity</code> between 0-1.
   * @param {Number} opacity
   */
  ArcGISMapOverlay.prototype.setOpacity = function (opacity) {
    var op = Math.min(Math.max(opacity, 0), 1);
    this.opacity_ = op;
    var img = this.img_;
    if (img) {
      var st = img.style;
      if (typeof st.opacity !== 'undefined') {
        st.opacity = op;
      }
      if (typeof st.filters !== 'undefined') {
        st.filters.alpha.opacity = Math.floor(100 * op);
      }
      if (typeof st.filter !== 'undefined') {
        st.filter = "alpha(opacity:" + Math.floor(op * 100) + ")";
      }
    }
  };
  /**
   * Gets Image Opacity. return <code>opacity</code> between 0-1.
   * @return {Number} opacity
   */
  ArcGISMapOverlay.prototype.getOpacity  =  function () {
    return this.opacity_;
  };
  /**
   * If the layer is loaded. Returns <code>true</code> if it's map service is loaded.
   * @return {Boolean}
   */
  ArcGISMapOverlay.prototype.hasLoaded  =  function () {
    return this.mapService_.hasLoaded();
  };
  
  /**
   * Refresh the map image in current view port.
   */
  ArcGISMapOverlay.prototype.refresh  =  function () {
    if (!this.mapService_.hasLoaded() || this.map_ === null) {
      return;
    }
    if (this.drawing_  ===  true) {
      this.redraw_  =  true;
      return;
    }
    if (this.img_ !== null && this.moveend_) {
      this.div_.removeChild(this.img_);
      this.img_  =  null;
    }
    if (this.isHidden()) {
      return;
    }
    var bnds  = this.map_.getBounds();
    var sr  =  this.map_.getCurrentMapType().getProjection().getSpatialReference();
    var me  =  this;
    var params  =  this.exportParams_;
    params.size  =  '' + this.map_.getSize().width + ',' + this.map_.getSize().height;
    //note: if GMapType's maxzoom is larger than any GTileLayer's maxZoom, GMap2.getBounds return 0,0,0,0
    params.bbox  =  ArcGISUtil.fromLatLngBoundsToEnvelope(bnds, sr);
    params.bboxSR  =  sr.wkid;
    params.imageSR  =  sr.wkid;
    this.drawing_  =  true;
    /**
     * This event is fired before the the drawing request was sent to server.
     * @name ArcGISMapOverlay#drawstart
     * @event
     */
    GEvent.trigger(this, 'drawstart');
    this.mapService_.exportMap(params, function (json) {
      me.drawing_  =  false;
      if (me.redraw_  ===  true) {
        me.redraw_  =  false;
        me.refresh();
        return;
      }
      var div = me.div_;
      if (json.href) {
        var bnds = ArcGISUtil.fromEnvelopeToLatLngBounds(json.extent);
        var wrapWidth = me.map_.getCurrentMapType().getProjection().getWrapWidth(me.map_.getZoom());
        var swpx = me.map_.fromLatLngToDivPixel(bnds.getSouthWest());
        var nepx = me.map_.fromLatLngToDivPixel(bnds.getNorthEast());
        div.style.width = json.width + "px";
        div.style.height = json.height + "px";
        div.style.left = swpx.x % wrapWidth + "px";
        div.style.top = nepx.y + "px";
        if (me.img_ !== null) {
          me.img_.src = json.href;
        } else {
          var img = document.createElement('img');
          img.src = json.href;
          div.appendChild(img);
          me.img_ = img;
        }
        me.moveend_ = false;
        me.setOpacity(me.opacity_);
      } else {
        // if no layer visible, exportMap will return empty json
        if (me.img_ !== null) {
          div.removeChild(me.img_);
          me.img_ = null;
        }
      }
      /**
       * This event is fired after the the drawing request was returned by server.
       * @name ArcGISMapOverlay#drawend
       * @event
       * @param {MapImage} mapImage
       */
      GEvent.trigger(me, 'drawend', json);
    });
  };
  /**
   * See {@link ArcGISGOverlay.initialize}
   * @private
   */
  ArcGISMapOverlay.prototype.initialize  =  function (map) {
    var div  =  document.createElement("div");
    div.style.position  =  "absolute";
    map.getPane(G_MAP_OVERLAY_LAYER_PANE).appendChild(div);//
    this.map_  =  map;
    this.zoomLevel_  =  map.getZoom();
    this.div_  =  div;
    this.img_  =  null;
    this.moveEndListener_  =  GEvent.bind(this.map_, "moveend", this, function () {
      this.moveend_ = true;
      this.refresh();
    });
    this.mapTypeChangeListener_  =  GEvent.bind(this.map_, "maptypechanged", this, this.refresh);
    this.mapTypeAddListener_  =  GEvent.bind(this.map_, "addmaptype", this, this.setupMapType_);
    this.map_.getArcGISOverlays().push(this);
    if (this.hasLoaded()) {
      this.setupMapType_();
    }
    this.show();
  };
  
  /**
   * See {@link ArcGISGOverlay.remove}
   * @private
   */
  ArcGISMapOverlay.prototype.remove  =  function () {
    GEvent.removeListener(this.moveEndListener_);
    GEvent.removeListener(this.mapTypeChangeListener_);
    this.div_.parentNode.removeChild(this.div_);
    
    removeFromArray(this.map_.getArcGISOverlays(), this);
    var types  =  this.map_.getMapTypes();
    for (var i  =  0; i < types.length; i++) {
      var type  =  types[i];
      if (type.agsOvs_) {
        removeFromArray(type.agsOvs_, this);
      }
    }
    
  };
  /**
   * Get the copyright information for the underline {@link ArcGISMapService}.
   * @param {GLatLngBounds} bounds
   * @param {Number} zoom
   * @return {String}
   */
  ArcGISMapOverlay.prototype.getCopyright  = function (bounds, zoom) {
    if (!this.isHidden() && this.getFullBounds().intersects(bounds) && this.isInZoomRange_()) {
      return this.mapService_.copyrightText;
    }
  };
  /**
   * See {@link ArcGISGOverlay.copy}
   * @private
   */
  ArcGISMapOverlay.prototype.copy  =  function () {
    return new ArcGISMapOverlay(this.url);
  };
  /**
   * Check if the overlay is visible, and within zoomzoom range and current map bounds intersects with it's fullbounds.
   * @return {Boolean} visible
   */
  ArcGISMapOverlay.prototype.isHidden  =  function () {
    return !(this.visible_ && this.isInZoomRange_() && this.getFullBounds().intersects(this.map_.getBounds()));
  };
  /**
   * If this in zoom range
   * @return {Boolean}
   */
  ArcGISMapOverlay.prototype.isInZoomRange_  =  function () {
    var z  = this.map_.getZoom();
    if ((this.minZoom_ !== undefined && z < this.minZoom_) || 
     (this.maxZoom_ !== undefined && z > this.maxZoom_)) {
      return false; 
    } 
    return true;
  };
  
  /**
   * Makes the overlay visible.
   */
  ArcGISMapOverlay.prototype.show  =  function () {
    this.visible_  =  true;
    this.div_.style.visibility  =  'visible';
    this.refresh();
  };
  /**
   * Hide the overlay
   */
  ArcGISMapOverlay.prototype.hide  =  function () {
    this.visible_  =  false;
    this.div_.style.visibility  =  'hidden';
  };
  
  /**
   * See GOverlay.redraw.
   * @private
   * @param {Boolean} force
   */
  ArcGISMapOverlay.prototype.redraw  =  function (force) {
    // do nothing. defered to onmove handler because Gmaps api 
    // does not pass 'force' parameter consistently to meet the need for this class;
  };
  /**
   * Creates an ArcGISTileLayerOverlay. Params:
   * <li>tileLayer: {@link ArcGISTileLayer} or url to the service as shortcut.
   * <li>opt_tileOverlayOpts: {@link ArcGISGTileLayerOverlayOptions}
   * @name ArcGISTileLayerOverlay
   * @param {ArcGISTileLayer|String} tileLayer
   * @param {GTileLayerOverlayOptions} opt_tileOverlayOpts 
   * @class This class (<code>google.maputils.arcgis.TileLayerOverlay</code>) extends
   * <a href  = 'http://code.google.com/apis/maps/documentation/reference.html#GTileLayerOverlay'>GTileLayerOverlay</a>
   *  from the core Google Maps API. It tracks ArcGISTileLayerOverlay collections in 
   *  <code>GMap2</code> internally and make them available via <code>GMap2.getArcGISOverlays()</code>
   */
  function ArcGISTileLayerOverlay(tileLayer, opt_tileOverlayOpts) {
    var me  = this;
    opt_tileOverlayOpts  = opt_tileOverlayOpts || {};
    var layer  = tileLayer;
    if (isString(tileLayer)) {
      layer  = new ArcGISTileLayer(tileLayer);
    }
    var service  = layer.getMapService();
    if (service.hasLoaded()  === false) {
      GEvent.addListener(service, 'load', function () {
        me.init_(layer, opt_tileOverlayOpts);
      });
    } else {
      this.init_(layer, opt_tileOverlayOpts);
    }
    // just to get constructor through
    GTileLayerOverlay.call(this, layer, opt_tileOverlayOpts);
  }
  
  ArcGISTileLayerOverlay.prototype  = new GTileLayerOverlay();
  
  
  /**
   * 
   */
  ArcGISTileLayerOverlay.prototype.init_  = function (tileLayer, opt_tileOverlayOpts) {
    GTileLayerOverlay.call(this, tileLayer, opt_tileOverlayOpts);
  /**
   * This event is fired when the undeline tilelayer's services are loaded. 
   * @name ArcGISTileLayerOverlay#load
   * @event
   */
    GEvent.trigger(this, "load");
    // means the overlay is added before load.
    // see http://code.google.com/p/gmaps-api-issues/issues/detail?id  = 275
    if (this.map_) {
      this.refresh();
    }
  };
  /**
   * track itself in GMap2
   * @private should not be called by client directly
   * @param {Object} map
   */ 
  ArcGISTileLayerOverlay.prototype.initialize  =  function (map) {
    this.map_  = map;
    map.getArcGISOverlays().push(this);
    GTileLayerOverlay.prototype.initialize.call(this, map);
    this.mapTypeChangeHide_  = false;
    this.mapTypeChangeListener_  =  GEvent.bind(this.map_, "maptypechanged", this, this.onMapTypeChanged_);
  };
  
  ArcGISTileLayerOverlay.prototype.onMapTypeChanged_  =  function () {
    var ovSR  = this.getTileLayer().getProjection().getSpatialReference().wkid;
    var typeSR  = this.map_.getCurrentMapType().getProjection().getSpatialReference().wkid;
    if (ovSR !== typeSR) {
      this.mapTypeChangeHide_  = true;
      this.hide();
    } else {
      if (this.mapTypeChangeHide_  === true) {
        this.show();
        this.mapTypeChangeHide_  = false;
      }
    }
    
  };
  
  /**
   * remove itself in GMap2
   * @private should not be called by client directly
   * @param {Object} map
   */
  ArcGISTileLayerOverlay.prototype.remove  =  function () {
    removeFromArray(this.map_.getArcGISOverlays(), this);
    GEvent.removeListener(this.mapTypeChangeListener_);
    GTileLayerOverlay.prototype.remove.call(this);
  };
  /**
   * Get the name the Overlay (same as map service name)
   */
  ArcGISTileLayerOverlay.prototype.getName  = function () {
    return this.getTileLayer().getName();
  };
  //start of add-on classes
  /**
   * @name GMercatorProjection
   * @class This is new method added to Google Maps API's
   * <a href  = 'http://code.google.com/apis/maps/documentation/reference.html#GMercatorProjection'>GMercatorProjection</a>
   * class.
   */
  /**
   * Get the Spatial Reference used by GMercatorProjection.It's wkid  = 102113,
   * an instance of {@link ArcGISSphereMercator}.
   * @addon
   * @return {ArcGISSpatialReference}
   */
  GMercatorProjection.prototype.getSpatialReference  =  function () {
    return ArcGISSpatialReferences.getSpatialReference('102113');
  };
  /**
   * @name GMapType
   * @class This an overwritten method of Google Maps API's
   * <a href  = 'http://code.google.com/apis/maps/documentation/reference.html#GMapType'>GMapType</a>
   * class.
   */
  /**
   * overwrite default to allow dynamic overlay's copyrights. Get an array of 
   * copyrights string along with all {@link ArcGISMapOverlay}'s value;
   * @param {GLatLngBounds} bounds
   * @param {Number} zoom
   * @return {String[]}
   */
  GMapType.prototype.getCopyrights  =  function (bounds, zoom) {
    var cps  =  [], i, cp;
    var tiles  =  this.getTileLayers();
    for (i  =  0; i < tiles.length; i++) {
      cp  =  tiles[i].getCopyright(bounds, zoom);
      if (cp) {
        cps.push(cp);
      }
    }
    if (this.agsOvs_) {
      for (i  =  0; i < this.agsOvs_.length; i++) {
        cp  =  this.agsOvs_[i].getCopyright(bounds, zoom);
        if (cp && indexOf(cps, cp, true) === -1) {
          cps.push(cp);
        }
      }
    }
    return cps;
  };
  /**
   * @name GMap2
   * @class This is new method added to Google Maps API's
   * <a href  = 'http://code.google.com/apis/maps/documentation/reference.html#GMap2'>GMap2</a>
   * class.
   */
  /**
   * Sets the map view to the given bounds .
   * @param {GLatLngBounds} bnds
   */
  GMap2.prototype.setBounds  =  function (bnds) {
    var center  = bnds.getCenter();
    var z  = this.getBoundsZoomLevel(bnds) + 1;
    this.setCenter(center, z);
  };
  
  
  /**
   * Shortcut method to get the current map type's spatial reference
   * @return {ArcGISSpatialReference}
   */
  GMap2.prototype.getSpatialReference  = function () {
    return this.getCurrentMapType().getProjection().getSpatialReference();
  };

 /**
 * Get an array of the {@link ArcGISGOverlay}s. The entry in the array can be instance of
 * {@link ArcGISMapOverlay} (dynamic maps) or {@link ArcGISTileLayerOverlay}.
 * @return {GOverlay[]}
 */
  GMap2.prototype.getArcGISOverlays  =  function () {
    this.agsOvs_ = this.agsOvs_ || [];
    return  this.agsOvs_;
  };
  
  /**
   * @private for now. Should this be in Lib?
   * Get the overlays added as the result of an operation.
   * @return {GOverlay[]}
   */ 
  GMap2.prototype.getArcGISResults = function () {
    this.agsResults_ = this.agsResults_ || [];
    return this.agsResults_;
  };
  /**
  * @private for now. Should this be in Lib?
  * Clear the highlight results.
  */
  GMap2.prototype.clearArcGISResults = function () {
    if (this.agsResults_) {
      for (var i = 0, c = this.agsResults_.length; i < c; i++) {
        GEvent.clearInstanceListeners(this.agsResults_[i]);
        this.removeOverlay(this.agsResults_[i]);
        delete this.agsResults_[i];
      }
    }
    this.agsResults_ = [];
  };
  /**
  * Convenient method to remove array of GOverlays
  * @param {GOverlay[]..} ovs
  */
  GMap2.prototype.removeOverlays = function (ovs) {
    if (isArray(ovs)) {
      for (var i = 0, c = ovs.length; i < c; i++) {
        this.removeOverlays(ovs[i]);
      }
    } else if (ovs) {
      this.removeOverlay(ovs);
    }
  };
  /**
  * Convenient method to add array of GOverlays
  * @param {GOverlay[]..} ovs
  */
  GMap2.prototype.addOverlays = function (ovs) {
    if (isArray(ovs)) {
      for (var i = 0, c = ovs.length; i < c; i++) {
        this.addOverlays(ovs[i]);
      }
    } else if (ovs) {
      this.addOverlay(ovs);
    }
  };
  /**
   * This is a convienient method to add an ArcGIS map. Params:
   * <ul><li><code>url</code>: url of the map service.
   * <li><code>opt_callback</code>: optional callback function. The result is passed in as argument.
   * </ul>
   * Results:<ul><li>If the map service is tiled, a new {@link ArcGISMapType} will be created and added.
   * <li>If the map service is not tiled, a new {@link ArcGISMapOverlay} will be created and added.
   * </ul> 
   * 
   * @param {String} url
   * @param {Function} opt_callback
   */
  GMap2.prototype.addArcGISMap  =  function (url, opt_callback) {
    var me  =  this;
    var service  =  new ArcGISMapService(url);
    GEvent.addListener(service, 'load', function () {
      if (service.singleFusedMapCache) {
        var tile  =  new ArcGISTileLayer(service);
        var type  =  new ArcGISMapType([tile]);
        me.addMapType(type);
        if (opt_callback) {
          opt_callback(type);
        }
      } else {
        var ov  =  new ArcGISMapOverlay(service);
        me.addOverlay(ov);
        if (opt_callback) {
          opt_callback(ov);
        }
      }
    });
  };
  /**
   * @name ArcGISStyleOptions
   * @class Instance of this classes are used in the style property of 
   *   {@link ArcGISArcGISClickOptions}, {@link ArcGISArcGISClickServiceOptions}. It specify how
   *   the geometry features returned by ArcGIS server should be rendered in the browser.
   *   It's properties have same meaning as <a href  = http://code.google.com/apis/maps/documentation/reference.html#GPolyStyleOptions>GPolyStyleOptions</a> 
   *   in the core Google Maps API.
   * @property {GIcon} [icon] an instance of <a href  = http://code.google.com/apis/maps/documentation/reference.html#GIcon>GIcon</a>  in the core Google Maps API. This will be used as the icon
   *    for rendering of point features.
   * @property {String} [strokeColor] line features color in hex HTML color.
   * @property {Number} [strokeWeight] The width of the line in pixels
   * @property {Number} [strokeOpacity] This property specifies the opacity of the polyline as a fractional value between 0 (transparent) and 1 (opaque)
   * @property {String} [outlineColor] color of polygon outline.
   * @property {Number} [outlineWeight] weight of polygon outline
   * @property {Number} [outlineOpacity] opacity of polygon outline
   * @property {String} [fillColor] color of polygon fill.
   * @property {Number} [fillOpacity] opacity of the polygon fill.
   */

   /*
   * @private for now. Maybe better leave off API?
   * @name ArcGISClickOptions
   * @class Instance of this class are used in the {@link ArcGISopt_clickOpts} argument
   *  to the {@link ArcGISGMap2.enableArcGISClick} method. Some of the properties such as 
   *   <code>tolerance, returnGeometry</code> are used in  {@link ArcGISIdentifyParameters} in 
   *   request while other properties such as <code>styles</code> are used to control how results are processed. 
   *  @property {String[]} [excludes] Array of Map Service Names to exclude from click action.
   *   Some services do not support click action, or do you not need to click for information. 
   *   Each map service has a default name, but can be assigned by the <code>name</code> in the optional
   *   parameter passed in the constructor of {@link ArcGISTileLayer} or {@link ArcGISMapOverlay}.
   * @property {String[]} [services] Array of Map Service Names to include from click action, if they are visible.
   * @property {Boolean} [returnGeometry] whether to return geometry of the map feature clicked. If true, 
   *   the clicked feature will be highlighted as an overlay
   * @property {Boolean} [topOnly  = false] If true, only query the top map 
   *   service that returns one or more features. Otherwise all visible map services will be queried.
   *   Results of each service will dislay as a tab in the info window. 
   * @property {Number} [tolerance] number of pixels as click tolenrance.
   * @property {StyleOptions} [style] an instance of {@link ArcGISStyleOptions}. Specify how
   *   results should be drawn. This is used as default for all services. applicable only if 
   *   <code>returnGeometry  = true</code>
   * @property {Object} [serviceOptions] <b>The options for each individual map services</b>. 
   *   This options gives finer level of controls over the click action. This object is 
   *   an object with key as service name, value as an javascript object literal of 
   *   type {@link ArcGISArcGISClickServiceOptions}.
   * @property {Function} [onServiceCompleteCallback] This property specifies a callback function 
   *   to be invoked when the map service finishes querying and the query completes.
   *   It is passed the map service name (String) and {@link ArcGISIdentifyResults}. 
   *   This callback function is called after each service query completes, if specified, the default 
   *   result process function will NOT be called, so this function is basically a customize handler.
   */
  /*
   * @private for now. Maybe better leave off API?
   * @name ArcGISClickServiceOptions
   * @class Instance of this class are used in the {@link ArcGISserviceOptions} property of
   *   the {@link ArcGISArcGISClickOptions} class. The primary goal of this class is to provide finer
   *   control of click behavior at individual service level.       
   * @property {Boolean} [returnGeometry] whether to return geometry of the map feature clicked. If true, 
   *   the clicked feature will be highlighted as an overlay
   * @property {Number} [tolerance] number of pixels as click tolenrance.
   * @property {Object} [layerOptions] <b>The options for each individual map layer inside a map service</b>. 
   *   This options gives finer level of controls over the results. This is an object literal 
   *   with key as layer name, and value as an instance of {@link ArcGISArcGISClickLayerOptions}
   * @property {StyleOptions} [style] an instance of {@link ArcGISStyleOptions}. Specify how
   *   results should be drawn. This is used as default for all layers.
   */
  /*
   * @private for now. Maybe better leave off API?
   * @name ArcGISClickLayerOptions
   * @class Instance of this class are used in the {@link ArcGISlayerOptions} property of
   *   the {@link ArcGISArcGISClickServiceOptions} class. The primary goal of this class is to provide finer
   *   control of click behavior at individual layer level inside an map service.   
   * @property {StyleOptions} [styles] an instance of {@link ArcGISStyleOptions}. Specify how
   *   results should be drawn. Only the styles matching the feature class type will be used.
   */
  /**
   * Enable the Map Click operation for ArcGIS maps. The inforamtion about the
   * map feature will be displayed in a InfoWindow after a single click on the map.
   * The optional parameter <code>opt_clickOpts</code> is an instance of {@link ArcGISArcGISClickOptions}
   */
  GMap2.prototype.enableArcGISClick  =  function () {
    this.agsClickListener_  = this.agsClickListener_ || GEvent.addListener(this, 'click', this.doArcGISIdentify_);
  };
  /**
   * If identify operation onclick map is enabled.
   * @return {Boolean}
   */
  GMap2.prototype.arcgisClickEnabled  =  function () {
    return this.agsClickListener_ !== null;
  };
  
  /**
   * Disable click identify capability
   */
  GMap2.prototype.disableArcGISClick  =  function () {
    if (this.agsClickListener_) {
      GEvent.removeListener(this.agsClickListener_);
      this.agsClickListener_  =  null;
    }
  };
  /**
   * @private for now. Should this be in the API or left the application do these?
   * 
   */
  GMap2.prototype.setArcGISClickOptions  =  function (opts) {
    this.agsClickOpts_  = opts || {};
  };
  /**
   * Get the spatial data at the clicked location.
   * @param {Object} overlay
   * @param {Object} latlng
   * @param {Object} overlaylatlng
   */
  GMap2.prototype.doArcGISIdentify_  =  function (overlay, latlng, overlaylatlng) {
    var me  =  this;
    var opts  =  this.agsClickOpts_ || {};
    var services;
    var serviceIdx;
    var dpi  = 96;
    function processIdentifyResults(service, json) {
      var html  = '';
      if (json.results) {
        for (var i  =  0, c  =  json.results.length; i < c; i++) {
          var r  =  json.results[i];
          if (i > 0) {
            html += '<hr/>';
          }
          html +=  '<div><table>';
          html +=  '<tr><td class="ags-layername">' + r.layerName + '</td></tr>';
          html +=  '<tr><td><table>';
          var a  =  r.attributes;
          var odd  =  true;
          for (var x in a) {
            if (a.hasOwnProperty(x)) {
              //if (ignoreFields && indexOf(ignoreFields, x, true) !== -1) continue;
              odd  =  !odd;
              html +=  '<tr class="ags-row-' + (odd ? 'odd' : 'even') + '">';
              html +=  '<td class="ags-fieldname">' + x + '</td>';
              var val  =  a[x];
              val = (val === null || typeof val === 'undefined') ? '' : '' + val;
              html += '<td class="ags-fieldvalue">' + val + '</td></tr>';
            }
          }
          html +=  '</table></td></tr></table></div>';
          if (r.geometry) {
            var style  =  ArcGISUtil.getOptionValue(ArcGISConfig.defaultStyle, opts, 'style', service.name, r.layerName);
            var ovs  =  ArcGISUtil.fromFeatureToOverlays(r, null, style);
            for (var j  =  0; j < ovs.length; j++) {
              ovs[j].html  =  html;
              me.agsResults_.push(ovs[j]);
              me.addOverlay(ovs[j]);
            }
          }
        }
      } else if (json.error) {
        html  =  '<div class  =  "ags-error">' + 'error code: ' + json.error.code +
        ' <br/>message:' +
        json.error.message +
        '<br/>details:' +
        json.error.details.join(';') +
        '</div>';
      }
      if (html.length > 0) {
        var tabs  =  me.getInfoWindow().getTabs();
        var tab  =  new GInfoWindowTab(service.name, '<div class  =  "ags-infowindow">' + html + '</div>');
        tabs.push(tab);
        me.openInfoWindowTabsHtml(latlng, tabs);
      }
    }
    function identifyService(service) {
      var sid  =  me.agsSessionID_;
      var sr  =  service.getSpatialReference();
      var bnds  =  me.getBounds();
      var ext  = ArcGISUtil.fromLatLngBoundsToEnvelope(bnds, sr);
      var size  =  me.getSize();
      var pt  = ArcGISUtil.fromLatLngToPoint(latlng, sr);
      var idParams  =  {
        geometry: '' + pt.x + ',' + pt.y,
        geometryType: ESRI_GEOMETRY_POINT,
        sr: sr.wkid,
        layers: opts.layers || 'top',
        tolerance: opts.tolerance || 5,//pixel
        mapExtent: ext,
        imageDisplay: '' + size.width + ',' + size.height + ',' + dpi, 
        returnGeometry: opts.returnGeometry  ===  true
      };
      var params  =  idParams;
      if (opts.serviceOptions && opts.serviceOptions[service.name]) {
        params  =  augmentObject(opts.serviceOptions[service.name], idParams, true);
      }
      service.identify(params, function (json) {
        if (sid  ===  me.agsSessionID_) {
          processIdentifyResults(service, json);
        } else {
          //ignore. This means user clicked again before previous result is returned.
        }
      });
    }

    function getIdentifyServices() {
      var svc  =  null, i, tile;
      var svcs  =  [];
      var agsOvs  =  me.getArcGISOverlays();
      for (i  =  0; i < agsOvs.length; i++) {
        if (!agsOvs[i].isHidden()) {
          if (agsOvs[i] instanceof ArcGISMapOverlay) {
            if (agsOvs[i].getFullBounds().containsLatLng(latlng)) {
              svcs.push(agsOvs[i].getMapService());
            }
          } else if (agsOvs[i] instanceof ArcGISTileLayerOverlay) {
            tile  = agsOvs[i].getTileLayer();
            if (tile.getFullBounds().containsLatLng(latlng)) {
              svcs.push(tile.getMapService());
            }
          }
        }
      }
      var tp  =  me.getCurrentMapType();
      if (tp instanceof ArcGISMapType) {
        var layers  =  tp.getTileLayers();
        for (i  =  0; i < layers.length; i++) {
          tile  = layers[i];
          if (i === 0) {
            dpi = tile.getMapService().tileInfo.dpi;
          }
          if (tile.getFullBounds().containsLatLng(latlng)) {
            svcs.push(tile.getMapService());
          }
        }
      }
      return svcs;
    }
    
    if (overlay  ===  null && latlng) {
     
      this.getInfoWindow().getTabs().length  =  0;
      this.clearArcGISResults();
      this.agsSessionID_  =  Math.floor(Math.random() * 100000);
      services  =  getIdentifyServices();
      for (var i  =  0; i < services.length; i++) {
        identifyService(services[i]);
      }
    } else if (overlaylatlng && overlay.html) {
      this.openInfoWindowHtml(overlaylatlng, '<div class  = "ags-infowindow">' + overlay.html + '</div>');
    }
  };

  /**
   * Helper method to convert an {@link ArcGISEnvelope} object to <code>GLatLngBounds</code> 
   * @param {Envelope} extent
   * @return {GLatLngBounds} gLatLngBounds
   */
  ArcGISUtil.fromEnvelopeToLatLngBounds  =  function (extent) {
    var sr  =  ArcGISSpatialReferences.getSpatialReference(extent.spatialReference.wkid);
    sr  =  sr || WGS84;
    var sw  =  sr.reverse([extent.xmin, extent.ymin]);
    var ne  =  sr.reverse([extent.xmax, extent.ymax]);
    return new GLatLngBounds(new GLatLng(sw[1], sw[0]), new GLatLng(ne[1], ne[0]));
  };
  
  /**
   * Helper method to convert <code>GLatLngBounds</code> to an {@link ArcGISEnvelope} object
   *  with the given
   * {@link ArcGISSpatialReference}
   * @param {GLatLngBounds} gLatLngBounds
   * @param {ArcGISSpatialReference} spatialReference
   * @return {Envelope} extent
   */
  ArcGISUtil.fromLatLngBoundsToEnvelope  =  function (gLatLngBounds, spatialReference) {
    var sw  =  spatialReference.forward([gLatLngBounds.getSouthWest().lng(), gLatLngBounds.getSouthWest().lat()]);
    var ne  =  spatialReference.forward([gLatLngBounds.getNorthEast().lng(), gLatLngBounds.getNorthEast().lat()]);
    return {
      xmin: sw[0],
      ymin: sw[1],
      xmax: ne[0],
      ymax: ne[1],
      spatialReference: {
        wkid: spatialReference.wkid
      }
    };
  };
   /**
   * Helper method to convert an {@link ArcGISPoint} object to 
   * <code>GLatLng</code> .
   * <code>opt_sr</code> is required if the point itself does not carry SR info, such as
   * the case of geocode or query result. 
   * @param {Point} point
   * @param {ArcGISSpatialReference} opt_sr
   * @return {GLatLng} 
   */
  ArcGISUtil.fromPointToLatLng  =  function (point, opt_sr) {
    var srid  = point.spatialReference || opt_sr;
    var sr  =  srid?ArcGISSpatialReferences.getSpatialReference(srid.wkid):WGS84;
    sr  = sr || WGS84;
    if (isNaN(point.x) || isNaN(point.y)) {
      return null;
    }
    var p  =  sr.reverse([point.x, point.y]);
    return new GLatLng(p[1], p[0]);
  };
  
  /**
   * Helper method to convert <code>GLatLngBounds</code> to a {@link ArcGISPoint} 
   * object with the given {@link ArcGISSpatialReference}. If SR not specified,
   *  it will be converted to WGS84.
   * @param {GLatLng} gLatLng
   * @param {ArcGISSpatialReference} opt_sr
   * @return {Point} 
   */
  ArcGISUtil.fromLatLngToPoint  =  function (gLatLng, opt_sr) {
    var sr  = null;
    if (opt_sr) {
      sr  = (opt_sr instanceof ArcGISSpatialReference)?opt_sr:ArcGISSpatialReferences.getSpatialReference(opt_sr.wkid);
    } 
    sr  = sr || WGS84;
    var p  =  sr.forward([gLatLng.lng(), gLatLng.lat()]);
    return {
      x: p[0],
      y: p[1],
      spatialReference: {
        wkid: sr.wkid
      }
    };
  };
  /**
   * Create a circle using a given center and radius, and number of points.
   * All in map units.
   * @param {Point} center
   * @param {Number} radius
   * @param {Number} num
   */
  ArcGISUtil.createCircle = function (center, radius, num) {
    num = num || 72;
    var pts = [], t, x, y;
    for (var i = 0; i < num; i++) {
      t = i * RAD_DEG * 360 / num;
      x = center.x + radius * Math.cos(t);
      y = center.y + radius * Math.sin(t);
      pts.push([x, y]);
    }
    pts.push(pts[0]);
    return {rings: [pts], spatialReference: center.spatialReference};
  };
  /**
   * Convert a {@link ArcGISFeature} or {@link ArcGISIdentifyResult} or {@link ArcGISFindResult} to core Google Maps API 
   * overlays such as  {@link ArcGISGMarker}, 
   * {@link ArcGISGPolyline}, or {@link ArcGISGPolygon}s.
   * Note ArcGIS Geometry may have multiple parts, but the coresponding GOverlay 
   * does not  support multi-parts, so the result is an array.
   * <ul><li><code>feature</code>: an object returned by ArcGIS Server with at least <code>geometry</code> property of type {@link ArcGISGeometry}. 
   *  if it contains a name-value pair "attributes" property, it will be attached to the result overlays.
   * <li><code>opt_sr</code>: optional {@link ArcGISSpatialReference}. Can be object literal. 
   * <li><code>opt_agsStyle</code> {@link ArcGISStyleOptions}. default is {@link ArcGISConfig}.style.
   * <li><code>opt_displayName</code> optional field name used for title of feature. 
   * @param {Feature} feature
   * @param {ArcGISSpatialReference} opt_sr
   * @param {StyleOptions} opt_agsStyle
   * @param {String} opt_displayName
   * @return {GOverlay[]} 
   */
  ArcGISUtil.fromFeatureToOverlays  =  function (feature, opt_sr, opt_agsStyle, opt_displayName) {
    var ovs  =  [];
    var sr  =  null;
    var ov;
    var geom  =  feature.geometry;
    if (opt_sr) {
      if (opt_sr instanceof ArcGISSpatialReference) {
        sr  =  opt_sr;
      } else {
        sr  =  ArcGISSpatialReferences.getSpatialReference(opt_sr.wkid);
      }
    } else {
      sr  =  ArcGISSpatialReferences.getSpatialReference(geom.spatialReference.wkid);
    }
    if (sr === null) {
      return ovs;
    }
    var style  =  opt_agsStyle || ArcGISConfig.style;
    var x, i, ic, j, jc, parts, part, lnglat, glatlngs;
    var title = '';
    if (opt_displayName) {
      title = feature.attributes[opt_displayName];
    }
    var html = '<table>';
    for (x in feature.attributes) {
      if (feature.attributes.hasOwnProperty(x)) {
        html += '<tr><td class="ags-fieldname">' + x + '</td><td class="ags-fieldvalue">' + feature.attributes[x] + '</td></tr>';
      } 
    }
    html += '</table>';
    if (geom.x) {
      //point
      lnglat  =  sr.reverse([geom.x, geom.y]);
      ov  =  new GMarker(new GLatLng(lnglat[1], lnglat[0]), {
        icon: style.icon,
        title: title
      });
      ov.attributes  =  feature.attributes;
      ov.html = html;
      ovs.push(ov);
    } else {
      //mulpt, line and poly
      parts  =  geom.points || geom.paths || geom.rings;
      if (!parts) {
        return ovs;
      }
      for (i  =  0, ic  =  parts.length; i < ic; i++) {
        part  =  parts[i];
        if (geom.points) {
          // multipoint
          lnglat  =  sr.reverse(part);
          ov  = new GMarker(new GLatLng(lnglat[1], lnglat[0]), {
            icon: style.icon
          });
        } else {
          if (part.length > ArcGISConfig.maxPolyPoints) {
            // TODO: do a simple point reduction 
            continue;
          }
          glatlngs  =  [];
          for (j  =  0, jc  =  part.length; j < jc; j++) {
            lnglat  =  sr.reverse(part[j]);
            glatlngs.push(new GLatLng(lnglat[1], lnglat[0]));
          }
          if (geom.paths) {
            ov  =  new GPolyline(glatlngs, style.strokeColor, style.strokeWeight, style.strokeOpacity);
          } else if (geom.rings) {
            ov  = new GPolygon(glatlngs, style.outlineColor, style.outlineWeight, style.outlineOpacity, style.fillColor, style.fillOpacity);
          }
        }
        ov.attributes   =  feature.attributes;
        ov.html = html;
        ovs.push(ov);
      }
    }
    return ovs;
  };
  
  var arcgis = {
    'SpatialReference': ArcGISSpatialReference,
    'Geographic': ArcGISGeographic,
    'LambertConformalConic': ArcGISLambertConformalConic,
    'SphereMercator': ArcGISSphereMercator,
    'TransverseMercator': ArcGISTransverseMercator,
    'FlatSpatialReference': ArcGISFlatSpatialReference,
    'SpatialReferences': ArcGISSpatialReferences,
    'MapService': ArcGISMapService,
    'Layer': ArcGISLayer,
    'GeocodeService': ArcGISGeocodeService,
    'GeometryService': ArcGISGeometryService,
    'Util': ArcGISUtil,
    'Config': ArcGISConfig,
    'Projection': ArcGISProjection,
    'TileLayer': ArcGISTileLayer,
    'TileLayerOverlay': ArcGISTileLayerOverlay,
    'MapOverlay': ArcGISMapOverlay,
    'MapType': ArcGISMapType
  };
  var NS = namespace('google.maputils');
  NS.arcgis = arcgis;
  // if the user loaded global symbol, export all class with prefix ArcGIS to global.
  if (window.GMap2) {
    for (var x in arcgis) {
      if (arcgis.hasOwnProperty(x)) {
        window['ArcGIS' + x] = arcgis[x];
      }
    }
  }
})();



