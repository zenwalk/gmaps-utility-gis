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
(function () {
  /*jslint browser:true, evil: true */
  //jslint consider "document.write" evil. 
  /*global swfobject, FABridge */
  function loadScript(src) {
    document.write('<s' + 'cript type="text/javascript" src="' + src + '"></s' + 'cript>');
  }
  
  function parseScriptSrc(js) {
    var scripts = document.getElementsByTagName('script');
    var path, i, packed;
    var params = {};
    for (i = 0; i < scripts.length; i++) {
      var src = scripts[i].src;
      var idx = src.toLowerCase().lastIndexOf(js.toLowerCase());
      if (idx > -1) {
        path = src.substring(0, idx);
        packed = src.indexOf('_packed', idx) !== -1;
        var q = src.indexOf('?', idx);
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
      packed: packed,
      path: path,
      params: params
    };
  }
  var ps = parseScriptSrc('mapbridge');
  loadScript('http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js');
  loadScript(ps.path + 'bridge/FABridge' + (ps.packed ? '_packed' : '') + '.js');
  
  var defaultBridge;
  var defaultMap;
  var packageRoot = 'com.google.maps.';
  /**
   * @name MapBridgeOptions
   * @class This class represents the optional parameter passed into <code>MapBridge.createMap</code>.
   * @property {String} [swf] The customized swf file that may compiled with more classes.
   *                      Default value is the MapBridge.swf in the same folder as the JS.
   *                      The swf class must contains 'MapBridge' in its name if it extends MapBridge.as.
   */
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
   * The returned map instance also contains the following convient methods:
   * <ul>
   * <li><code>create(fullClassName:String, args:Array)</code>. Construct a object instance with parameters.
   * <li><code>getStatic(fullClassName:String, fnValName:String, args:Array)</code>. Get static variables or call static function from a class
   </ul>
   * @param {Node} node HTML node as map container.
   * @param {Function} callback Callback function. The parameters passed back is Map and Bridge.
   * @param {MapBridgeOptions} opt_bridge
   */
  MapBridge.createMap = function (node, callback, opt_bridge) {
    var bridgeName = '__MAPBRIDGE__' + node.id;
    var embedNode = document.createElement('div');
    embedNode.id = bridgeName;
    node.appendChild(embedNode);
    var flashvars = {
      bridgeName: bridgeName,
      key: ps.params.key
    };
    opt_bridge = opt_bridge ||
    {};
    var swfUrl = opt_bridge.swf || ps.path + 'MapBridge.swf';
    swfobject.embedSWF(swfUrl, embedNode.id, node.offsetWidth, node.offsetHeight, "9.0.0", false, flashvars);
    FABridge.addInitializationCallback(bridgeName, function () {
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
        if (ag.typeName && ag.typeName.indexOf('MapBridge') > -1 && ag.bridge) {
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
   * Create a class and insert into class collection.
   * @param {String} partial class name excluding com.google.maps., e.g  geom.Attitude.
   */
  function addClass(partName) {
    var key = partName.substring(partName.lastIndexOf('.') + 1);
    mapClasses[key] = function () {
      return createProxy(partName, arguments);
    };
  }
  
  function addClasses(partNames) {
    for (var i = 0; i < partNames.length; i++) {
      addClass(partNames[i]);
    }
  }
  function addStatic(partName, fnVar) {
    var key = partName.substring(partName.lastIndexOf('.') + 1);
    mapClasses[key][fnVar] = function () {
      var pa = parseArgs(arguments);
      return pa.map.getStatic(packageRoot + partName, fnVar, pa.args);
    };
  }
  function addClsStatics(partName, fnVals) {
    for (var i = 0; i < fnVals.length; i++) {
      addStatic(partName, fnVals[i]);
    }
  }
  /**
   * add static functions
   * @param {Object} cls: name = partClassName, value=Array of methods
   */
  function addStatics(cls) {
    for (var x in cls) {
      if (cls.hasOwnProperty(x)) {
        addClsStatics(x, cls[x]);
      }
    }
  }
  addClasses(['Alpha', 'Color', 'Copyright', 'CopyrightCollection', 'CopyrightNotice', 'InfoWindowOptions', 'LatLng', 'LatLngBounds', 'Map', 'Map3D', 'MapAction', 'MapAttitudeEvent', 'MapEvent', 'MapMouseEvent', 'MapMoveEvent', 'MapOptions', 'MapType', 'MapTypeOptions', 'MapZoomEvent', 'PaneId', 'ProjectionBase', 'TileLayerBase', 'View', 'controls.ControlBase', 'controls.ControlPosition', 'controls.MapTypeControl', 'controls.MapTypeControlOptions', 'controls.NavigationControl', 'controls.NavigationControlOptions', 'controls.OverviewMapControl', 'controls.OverviewMapControlOptions', 'controls.PositionControl', 'controls.PositionControlOptions', 'controls.ScaleControl', 'controls.ScaleControlOptions', 'controls.ZoomControl', 'controls.ZoomControlOptions', 'geom.Attitude', 'geom.Point3D', 'geom.TransformationGeometry', 'overlays.EncodedPolylineData', 'overlays.GroundOverlay', 'overlays.GroundOverlayOptions', 'overlays.Marker', 'overlays.MarkerOptions', 'overlays.OverlayBase', 'overlays.Polygon', 'overlays.PolygonOptions', 'overlays.Polyline', 'overlays.PolylineOptions', 'overlays.TileLayerOverlay', 'services.ClientGeocoder', 'services.ClientGeocoderOptions', 'services.Directions', 'services.DirectionsEvent', 'services.DirectionsOptions', 'services.GeocodingEvent', 'services.GeocodingResponse', 'services.Placemark', 'services.Route', 'services.ServiceStatus', 'services.Step', 'styles.BevelStyle', 'styles.ButtonFaceStyle', 'styles.ButtonStyle', 'styles.FillStyle', 'styles.GradientStyle', 'styles.RectangleStyle', 'styles.StrokeStyle']);
  
  addStatics({
    'Alpha': ['OPAQUE', 'PERCENT_0', 'PERCENT_10', 'PERCENT_100', 'PERCENT_20', 'PERCENT_30', 'PERCENT_40', 'PERCENT_50', 'PERCENT_60', 'PERCENT_70', 'PERCENT_80', 'PERCENT_90', 'UNSEEN'],
    'Color': ['BLACK', 'BLUE', 'CYAN', 'DEFAULTLINK', 'GRAY1', 'GRAY10', 'GRAY11', 'GRAY12', 'GRAY13', 'GRAY14', 'GRAY15', 'GRAY2', 'GRAY3', 'GRAY4', 'GRAY5', 'GRAY6', 'GRAY7', 'GRAY8', 'GRAY9', 'GREEN', 'MAGENTA', 'RED', 'WHITE', 'YELLOW', 'toHtml'],
    'InfoWindowOptions': ['ALIGN_CENTER', 'ALIGN_LEFT', 'ALIGN_RIGHT', 'getDefaultOptions', 'setDefaultOptions'],
    'LatLng': ['EARTH_RADIUS', 'fromRadians', 'fromUrlValue', 'wrapLatLng'],
    'MapAction': ['ACTION_NOTHING', 'ACTION_PAN', 'ACTION_PAN_ZOOM_IN', 'ACTION_ZOOM_IN', 'DRAGMODE_CAMERA_YAW_PITCH', 'DRAGMODE_LATLNG', 'DRAGMODE_MAP_YAW_PITCH', 'DRAGMODE_PITCH', 'DRAGMODE_YAW'],
    'MapAttitudeEvent': ['ATTITUDE_CHANGE_END', 'ATTITUDE_CHANGE_START', 'ATTITUDE_CHANGE_STEP'],
    'MapEvent': ['CONTROL_ADDED', 'CONTROL_REMOVED', 'COPYRIGHTS_UPDATED', 'FLY_TO_CANCELED', 'FLY_TO_DONE', 'INFOWINDOW_CLOSED', 'INFOWINDOW_CLOSING', 'INFOWINDOW_OPENED', 'MAPTYPE_ADDED', 'MAPTYPE_CHANGED', 'MAPTYPE_REMOVED', 'MAP_PREINITIALIZE', 'MAP_READY', 'OVERLAY_BEFORE_REMOVED', 'OVERLAY_MOVED', 'OVERLAY_REMOVED', 'SIZE_CHANGED', 'TILES_LOADED', 'TILES_LOADED_PENDING', 'VIEW_CHANGED', 'VISIBILITY_CHANGED'],
    'MapMouseEvent': ['CLICK', 'DOUBLE_CLICK', 'DRAG_END', 'DRAG_START', 'DRAG_STEP', 'MOUSE_DOWN', 'MOUSE_MOVE', 'MOUSE_UP', 'ROLL_OUT', 'ROLL_OVER'],
    'MapMoveEvent': ['MOVE_END', 'MOVE_START', 'MOVE_STEP'],
    'MapType': ['DEFAULT_MAP_TYPES', 'HYBRID_MAP_TYPE', 'NORMAL_MAP_TYPE', 'PHYSICAL_MAP_TYPE', 'SATELLITE_MAP_TYPE'],
    'MapTypeOptions': ['getDefaultOptions', 'setDefaultOptions'],
    'MapZoomEvent': ['CONTINUOUS_ZOOM_END', 'CONTINUOUS_ZOOM_START', 'CONTINUOUS_ZOOM_STEP', 'ZOOM_CHANGED', 'ZOOM_RANGE_CHANGED'],
    'PaneId': ['PANE_FLOAT', 'PANE_MAP', 'PANE_MARKER', 'PANE_OVERLAYS'],
    'View': ['VIEWMODE_2D', 'VIEWMODE_ORTHOGONAL', 'VIEWMODE_PERSPECTIVE'],
    'controls.ControlPosition': ['ANCHOR_BOTTOM_LEFT', 'ANCHOR_BOTTOM_RIGHT', 'ANCHOR_TOP_LEFT', 'ANCHOR_TOP_RIGHT', 'AUTO_ALIGN_NONE', 'AUTO_ALIGN_X', 'AUTO_ALIGN_Y'],
    'controls.MapTypeControlOptions': ['ALIGN_HORIZONTALLY', 'ALIGN_VERTICALLY'],
    'controls.ScaleControlOptions': ['UNITS_BOTH', 'UNITS_BOTH_PREFER_IMPERIAL', 'UNITS_BOTH_PREFER_METRIC', 'UNITS_IMPERIAL_ONLY', 'UNITS_METRIC_ONLY', 'UNITS_SINGLE'],
    'overlays.MarkerOptions': ['ALIGN_BOTTOM', 'ALIGN_HORIZONTAL_CENTER', 'ALIGN_LEFT', 'ALIGN_RIGHT', 'ALIGN_TOP', 'ALIGN_VERTICAL_CENTER', 'getDefaultOptions', 'setDefaultOptions'],
    'overlays.GroundOverlayOptions': ['getDefaultOptions', 'setDefaultOptions'],
    'overlays.Polygon': ['fromEncoded'],
    'overlays.PolygonOptions': ['getDefaultOptions', 'setDefaultOptions'],
    'overlays.Polyline': ['fromEncoded'],
    'overlays.PolylineOptions': ['getDefaultOptions', 'setDefaultOptions'],
    'services.DirectionsEvent': ['DIRECTIONS_ABORTED', 'DIRECTIONS_FAILURE', 'DIRECTIONS_SUCCESS'],
    'services.DirectionsOptions': ['TRAVEL_MODE_DRIVING', 'TRAVEL_MODE_WALKING'],
    'services.GeocodingEvent': ['GEOCODING_FAILURE', 'GEOCODING_SUCCESS'],
    'services.ServiceStatus': ['GEO_ABORTED_REQUEST', 'GEO_BAD_KEY', 'GEO_BAD_REQUEST', 'GEO_BAD_STATUS_START', 'GEO_MISSING_ADDRESS', 'GEO_MISSING_QUERY', 'GEO_SERVER_ERROR', 'GEO_SUCCESS', 'GEO_TOO_MANY_QUERIES', 'GEO_UNAVAILABLE_ADDRESS', 'GEO_UNKNOWN_ADDRESS', 'GEO_UNKNOWN_DIRECTIONS'],
    'styles.BevelStyle': ['BEVEL_LOWERED', 'BEVEL_NONE', 'BEVEL_RAISED'],
    'styles.BevelStyle': ['mergeStyles'],
    'styles.ButtonFaceStyle': ['mergeStyles'],
    'styles.ButtonStyle': ['mergeStyles'],
    'styles.FillStyle': ['mergeStyles'],
    'styles.RectangleStyle': ['mergeStyles'],
    'styles.StrokeStyle': ['mergeStyles']
  });
  
  for (var x in mapClasses) {
    if (mapClasses.hasOwnProperty(x)) {
      window[x] = mapClasses[x];
    }
  }
  // replace "function (" to "function (" 
})();
