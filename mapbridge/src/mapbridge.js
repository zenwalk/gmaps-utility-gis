/**
 * @name MapBridge for Google Map API for Flash to JavaScript
 * @version 1.0
 * @fileoverview This library provides a JavaScript proxy to Google Maps ActionScript API (Flash and Flex)
 *              It requires Adobe's FABridge (http://labs.adobe.com/wiki/index.php/Flex_Framework:FABridge)
 *              and SWFObject (http://code.google.com/p/swfobject/).
 *
 */
/*!
 * Licensed under the Apache License, Version 2.0 (the "License");
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * @author: Nianwei Liu [nianwei at gmail dot com]
 */
(function() {
  /*jslint browser:true, evil: true */
  //jslint consider "document.write" evil. 
  /*global swfobject, FABridge */
  function loadScript(src) {
    document.write('<s' + 'cript type="text/javascript" src="' + src + '"></s' + 'cript>');
  }
  
  function parseScriptSrc(js) {
    var scripts = document.getElementsByTagName('script');
    var path, i;
    var params = {};
    for (i = 0; i < scripts.length; i++) {
      var src = scripts[i].src;
      var idx = src.toLowerCase().lastIndexOf((js + '.js').toLowerCase());
      if (idx === -1) {
        idx = src.toLowerCase().lastIndexOf((js + '_packed.js').toLowerCase());
      }
      if (idx > -1) {
        path = src.substring(0, idx);
        var q = src.indexOf('?');
        if (q > -1) {
          var pairs = src.substring(q + 1).split('&');
          for (i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split('=');
            params[pair[0]] = pair[1];
          }
        }
        break;
      }
    }
    return {
      path: path,
      params: params
    };
  }
  var bscript = parseScriptSrc('mapbridge');
  var scriptPath = bscript.path;
  var apikey = bscript.params.key || 'your_api_key';
  loadScript('http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js');
  loadScript(scriptPath + 'bridge/FABridge.js');
  
  var defaultBridge;
  var defaultMap;
  var packageRoot = 'com.google.maps.';
  
  /**
   * Static methods to create a flash map instance. After map instance is created,
   * refer to Google Maps ActionScript API for reference documentation.
   * @name MapBridge
   * @namespace
   */
  var MapBridge = {};
  /**
   * Create a map. This method must be called before any other methods. The created map instance
   * will be passed as the first parameter in the callback function.
   * The bridge itself will be the second parameter. Normally there is no need to use the bridge itself.
   * @param {Node} node HTML node as map container.
   * @param {Function} callback Callback function. The parameters passed back is Map and Bridge.
   * @param {opt_swfUrl} Optional. The customized swf file that may compiled with more classes.
   *                      Default value is the MapBridge.swf in the same folder as the JS.
   */
  MapBridge.createMap = function(node, callback, opt_swfUrl) {
    var bridgeName = '__MAPBRIDGE__' + node.id;
    var embedNode = document.createElement('div');
    embedNode.id = bridgeName;
    node.appendChild(embedNode);
    var flashvars = {
      bridgeName: bridgeName,
      key: apikey
    };
    var swfUrl = opt_swfUrl || scriptPath + 'MapBridge.swf';
    swfobject.embedSWF(swfUrl, embedNode.id, node.offsetWidth, node.offsetHeight, "9.0.0", false, flashvars);
    FABridge.addInitializationCallback(bridgeName, function() {
      var bridge = FABridge[bridgeName];
      var map = bridge.root();
      if (!defaultBridge) {
        defaultBridge = bridge;
        defaultMap = map;
      }
      callback(map, bridge);
    });
  };
  var mapClasses = {
    'MapBridge': MapBridge
  };
  /**
   * parse array of arguments. extract the map context.
   * @param {Array} args
   */
  function parseArgs(args) {
    var a = [];
    var map = defaultMap;
    if (args) {
      for (var i = 0; i < args.length; i++) {
        var ag = args[i];
        if (ag.typeName === 'MapBridge' && ag.bridge) {
          map = ag;
        } else {
          a.push(ag);
        }
      }
    }
    return {
      map: map,
      args: a
    };
  }
  /**
   * create an AS object. Since we need dynamically decide if a Map instance is passed in as part
   * of argument, we can not just send a empty args for classes like MapOptions.
   * @private
   * @param {Object} className
   * @param {Array} args arguments for constructor. May contain a map instance for multi map on one page case.
   */
  function createProxy(partName, args) {
    var proxy;
    var pa = parseArgs(args);
    var a = pa.args;
    if (a.length === 1 && (typeof a[0] === 'object' && !a[0].bridge && !a[0].typeName)) {
      // this is object literal, should not pass to constructor due to FABridge limitation
      // any AS3 object should have bridge property and typeName which is the actual AS type.
      proxy = pa.map.create(packageRoot + partName, []);
      var opts = a[0];
      for (var x in opts) {
        if (opts.hasOwnProperty(x)) {
          var method = 'set' + x.substring(0, 1).toUpperCase() + x.substring(1);
          proxy[method].call(proxy, opts[x]);
        }
      }
    } else {
      proxy = pa.map.create(packageRoot + partName, a);
    }
    return proxy;
  }
  
  /**
   * Retrieve a static/constant value from a class
   * @private
   * @param {String} partName patial name excluding com.google.maps.
   * @param {Array} args. array that contains a optional map instance, plus the static variable name
   */
  function getStaticVal(partName, args) {
    var val;
    var pa = parseArgs(args);
    if (pa.args.length > 0) {
      //staticVar
      return pa.map.staticVar(packageRoot + partName, pa.args[0]);
    }
    return undefined;
  }
  //callStaticFn('overlays.Polyline', 'fromEncoded', arguments);
  function callStaticFn(partName, fnName, args) {
    var val;
    var pa = parseArgs(args);
    val = pa.map.staticFn(packageRoot + partName, fnName, pa.args);
    return val;
  }
  function callStaticVal(partName, valName, args) {
    var val;
    var pa = parseArgs(args);
    val = pa.map.staticVal(packageRoot + partName, valName);
    return val;
  }
  /**
   * Create a class and insert into class collection.
   * @param {String} partial class name excluding com.google.maps., e.g  geom.Attitude.
   */
  function addClass(partName) {
    var key = partName.substring(partName.lastIndexOf('.') + 1);
    mapClasses[key] = function() {
      return createProxy(partName, arguments);
    };
    // it is not possible to assign static AS variable without a bridge, 
    //so we use a special function C here. call e.g. View.C('VIEWMODE_2D');
    mapClasses[key].S = function() {
      return getStaticVal(partName, arguments);
    };
  }
  
  function addClasses(partNames) {
    for (var i = 0; i < partNames.length; i++) {
      addClass(partNames[i]);
    }
  }
  
  function addStaticFn(partName, fnName) {
    var key = partName.substring(partName.lastIndexOf('.') + 1);
    mapClasses[key][fnName] = function() {
        return callStaticFn(partName, fnName, arguments);
    };
  }
  function addStaticVal(partName, varName) {
    var key = partName.substring(partName.lastIndexOf('.') + 1);
      mapClasses[key][varName] = function(map) {
        
        return (map || defaultMap).staticVar(packageRoot + partName, varName);
      };
    
    
  }
  
  function addStaticCls(isFn, partName, fnVals) {
    for (var i = 0; i < fnVals.length; i++) {
      // must use function closure here.
      if (isFn){
         addStaticFn(partName, fnVals[i]);
      } else {
        addStaticVal(partName, fnVals[i]);
      }
      
    }
  }
  /**
   * add static functions
   * @param {Object} cls: name = partClassName, value=Array of methods
   */
  function addStatics(isFn, cls) {
    for (var x in cls) {
      if (cls.hasOwnProperty(x)) {
        addStaticCls(isFn, x, cls[x]);
      }
    }
  }
  /*
   function Marker(latlng, opts) {
   return createProxy('overlays.Marker', arguments);
   }
   mapClasses["Marker"] = Marker;
   */
  addClasses(['Alpha', 'Color', 'Copyright', 'CopyrightCollection', 'CopyrightNotice', 'InfoWindowOptions', 'LatLng', 'LatLngBounds', 'Map', 'Map3D', 'MapAction', 'MapAttitudeEvent', 'MapEvent', 'MapMouseEvent', 'MapMoveEvent', 'MapOptions', 'MapType', 'MapTypeOptions', 'MapZoomEvent', 'PaneId', 'ProjectionBase', 'TileLayerBase', 'View', 'controls.ControlBase', 'controls.ControlPosition', 'controls.MapTypeControl', 'controls.MapTypeControlOptions', 'controls.NavigationControl', 'controls.NavigationControlOptions', 'controls.OverviewMapControl', 'controls.OverviewMapControlOptions', 'controls.PositionControl', 'controls.PositionControlOptions', 'controls.ScaleControl', 'controls.ScaleControlOptions', 'controls.ZoomControl', 'controls.ZoomControlOptions', 'geom.Attitude', 'geom.Point3D', 'geom.TransformationGeometry', 'overlays.EncodedPolylineData', 'overlays.GroundOverlay', 'overlays.GroundOverlayOptions', 'overlays.Marker', 'overlays.MarkerOptions', 'overlays.OverlayBase', 'overlays.Polygon', 'overlays.PolygonOptions', 'overlays.Polyline', 'overlays.PolylineOptions', 'overlays.TileLayerOverlay', 'services.ClientGeocoder', 'services.ClientGeocoderOptions', 'services.Directions', 'services.DirectionsEvent', 'services.DirectionsOptions', 'services.GeocodingEvent', 'services.GeocodingResponse', 'services.Placemark', 'services.Route', 'services.ServiceStatus', 'services.Step', 'styles.BevelStyle', 'styles.ButtonFaceStyle', 'styles.ButtonStyle', 'styles.FillStyle', 'styles.GradientStyle', 'styles.RectangleStyle', 'styles.StrokeStyle']);
  
  /*mapClasses.Polyline.fromEncoded = function(){
   return callStaticFn('overlays.Polyline', 'fromEncoded', arguments);
   };*/
  addStatics(true, {
    'overlays.Polyline': ['fromEncoded'],
    'overlays.Polygon': ['fromEncoded']
  });
  addStatics(false, {
    'MapType': ['NORMAL_MAP_TYPE']
  });
  
  for (var x in mapClasses) {
    if (mapClasses.hasOwnProperty(x)) {
      window[x] = mapClasses[x];
    }
  }
  // replace "function (" to "function (" 
})();
