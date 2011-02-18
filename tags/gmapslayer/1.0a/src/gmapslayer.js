/**
 * @name Google Maps Layer for ArcGIS Server JavaScript API
 * @version 1.0
 * @author: Nianwei Liu (nianwei at gmail dot com)
 * @fileoverview
 * <p>Use Google Maps in application built on ESRI ArcGIS Server JavaScript API and dojo </p>
 */
/*global dojo esri  gmaps */
dojo.provide('gmaps');

dojo.declare("gmaps.GoogleMapsLayer", esri.layers.Layer, {
  /**
   * @name GoogleMapsLayerOptions
   * @class This is an object literal that specify the option to construct a {@link GoogleMapsLayer}.
   * @property {String|google.maps.MapTypeId} [mapTypeId] optional. default map type id. 
   * Note you can only use <code>google.maps.MapTypeId</code> constant if you pre-load Google API before construct.
   * @property {Number} [opacity] opacity (0-1)
   * @property {Boolean} [sensor] whether GPS device is used. default to false;
   * @property {Number} [version] API version, 3, 3.1 etc. default to 3.
   * @property {String} [client] client ID for Google Maps Premier license.
   * @property {String} [id] layerId.
   * @property {Boolean} [visible] default visibility
   */
  /** 
   * Create a GoogleMapsLayer
   * @name GoogleMapsLayer
   * @constructor
   * @class This class allows Google Maps been used in ESRI ArcGIS JavaScript API. 
   * @param {GoogleMapsLayerOptions} opts
   */
  constructor: function (opts) {
    opts = opts || {};
    // this tileInfo does not actually do anything. It simply tricks nav control to 
    // show a slider bar if only gmaps are used, which should be a rare case.
    this.tileInfo = new esri.layers.TileInfo({
      rows: 256,
      cols: 256,
      dpi: 96,
      origin: {
        x: -20037508.342787,
        y: 20037508.342787
      },
      spatialReference: {
        wkid: 102100
      },
      lods: [{
        level: 1,
        resolution: 78271.5169639999,
        scale: 295828763.795777
      }, {
        level: 2,
        resolution: 39135.7584820001,
        scale: 147914381.897889
      }, {
        level: 3,
        resolution: 19567.8792409999,
        scale: 73957190.948944
      }, {
        level: 4,
        resolution: 9783.93962049996,
        scale: 36978595.474472
      }, {
        level: 5,
        resolution: 4891.96981024998,
        scale: 18489297.737236
      }, {
        level: 6,
        resolution: 2445.98490512499,
        scale: 9244648.868618
      }, {
        level: 7,
        resolution: 1222.99245256249,
        scale: 4622324.434309
      }, {
        level: 8,
        resolution: 611.49622628138,
        scale: 2311162.217155
      }, {
        level: 9,
        resolution: 305.748113140558,
        scale: 1155581.108577
      }, {
        level: 10,
        resolution: 152.874056570411,
        scale: 577790.554289
      }, {
        level: 11,
        resolution: 76.4370282850732,
        scale: 288895.277144
      }, {
        level: 12,
        resolution: 38.2185141425366,
        scale: 144447.638572
      }, {
        level: 13,
        resolution: 19.1092570712683,
        scale: 72223.819286
      }, {
        level: 14,
        resolution: 9.55462853563415,
        scale: 36111.909643
      }, {
        level: 15,
        resolution: 4.77731426794937,
        scale: 18055.954822
      }, {
        level: 16,
        resolution: 2.38865713397468,
        scale: 9027.977411
      }, {
        level: 17,
        resolution: 1.19432856685505,
        scale: 4513.988705
      }, {
        level: 18,
        resolution: 0.597164283559817,
        scale: 2256.994353
      }, {
        level: 19,
        resolution: 0.298582141647617,
        scale: 1128.497176
      }]
    });
    
    this.opacity = opts.opacity || 1;
    this._options = opts;
    this._gmap = null;
    this.loaded = true;// it seems _setMap will only get called if loaded = true;
  },
  /**
   * set map type id.
   * @param {google.maps.MapTypeId|String} mapTypeId, one of google.maps.MapTypeId.ROADMAP|HYBRID|STELLITE|TERRIAN
   */
  setMapTypeId: function (mapTypeId) {
    //console.log('mapTypeId'+ mapTypeId)
    if (this._gmap) {
      this._gmap.setMapTypeId(mapTypeId);
    } else {
      this._options.mapTypeId = mapTypeId;
    }
  },
  /**
   * get the wrapped <code>google.maps.Map</code>.
   * @return {google.maps.Map}
   */
  getGMap: function () {
    return this._gmap;
  },
  _setMap: function (map, layersDiv, index, a, b, c) {
    // This overrides an undocumented private method from ESRI API. 
    // It's possible not to do this, but it requires
    // map instance implicitly set to the layer instance, which is a little bit inconvenient.
    // console.log('_setMap');
    // this is likely called inside esriMap.addLayer()
    this._map = map;
    var div = document.createElement('div');
    if (this._options.id) {
      div.id = this.id;
    }
    dojo.style(div, {
      position: 'absolute',
      top: '0px',
      left: '0px',
      width: (map.width || layersDiv.offsetWidth) + 'px',
      height: (map.height || layersDiv.offsetHeight) + 'px'
    });
    layersDiv.appendChild(div);
    this._div = div;
    this._visibilityChangeHandle = dojo.connect(this, 'onVisibilityChange', this, this._visibilityChangeHandler);
    this._opacityChangeHandle = dojo.connect(this, 'onOpacityChange', this, this._onOpacityChangeHandler);
    var vis = (this._options.visible === undefined) ? true : this._options.visible;
    if (vis) {
      this._initGMap();
    }
    return div;
  },
  _unsetMap: function (map, layersDiv) {
    // see _setMap. Undocumented method, but probably should be public.
    if (layersDiv) {
      layersDiv.removeChild(this._div);
    }
    dojo.destroy(this._div);
    this._map = null;
    this._div = null;
    this._gmap = null;
    dojo.disconnect(this._extentChangeHandle);
    dojo.disconnect(this._panHandle);
    dojo.disconnect(this._resizeHandle);
    dojo.disconnect(this._visibilityChangeHandle);
    dojo.disconnect(this._opacityChangeHandle);
  },
  // delayed init and Api loading.
  _initGMap: function () {
    // // console.log('_initGMap');
    if (window.google && google.maps) {
      var ext = this._map.extent;
      var bnds = this._esriExtentToLatLngBounds(ext || this.initialExtent);
      var level = this._map.getLevel();
      var myOptions = {
        mapTypeId: this._options.mapTypeId || google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        draggable: false, // maybe makes no difference because mouse events intercepted by ESRI JS.
        center: this._options.center || bnds.getCenter(),
        zoom: this._options.zoom || (level > -1) ? level : 1
      };
      var gmap = new google.maps.Map(this._div, myOptions);
      if (level < 0) {
        gmap.fitBounds(bnds);
      }
      this._gmap = gmap;
      this._extentChangeHandle = dojo.connect(this._map, 'onExtentChange', this, this._extentChangeHandler);
      this._panHandle = dojo.connect(this._map, 'onPan', this, this._panHandler);
      this._resizeHandle = dojo.connect(this._map, 'onResize', this, this._resizeHandler);
      this.onLoad(this);
    } else if (gmaps.onApiLoad) {
      // did another instance already started loading GMaps API but not done?
      // this should be very very rare because one instance of this layer would be suffient with setMapTypeId.
      dojo.connect(gmaps, 'onApiLoad', this, this._initGMap);
    } else {
      // this is the first instance that tries to load GMaps API on-demand
      gmaps.onApiLoad = function () {
        // do nothing, just needed to dispatch event.
      };
      dojo.connect(gmaps, 'onApiLoad', this, this._initGMap);
      var script = document.createElement('script');
      script.type = 'text/javascript';
      var src = window.location.protocol + '//maps.google.com/maps/api/js?sensor=' + (this._options.sensor ? 'true' : 'false');
      if (this._options.client) {
        src += '&client=' + this._options.client;
      }
      if (this._options.version) {
        src += '&v' + this._options.version;
      }
      src += '&callback=gmaps.onApiLoad';
      script.src = src;
      if (document.getElementsByTagName('head').length > 0) {
        document.getElementsByTagName('head')[0].appendChild(script);
      } else {
        document.body.appendChild(script);
      }
    }
  },
  _opacityChangeHandler: function (opacity) {
    // this probably should be handled in the core API using the div returned from _setMap().
    if (this._div) {
      opacity = Math.min(Math.max(opacity, 0), 1);
      var st = this._div.style;
      if (typeof st.opacity !== 'undefined') {
        st.opacity = opacity;
      } else if (typeof st.filters !== 'undefined') {
        st.filters.alpha.opacity = Math.floor(100 * opacity);
      } else if (typeof st.filter !== 'undefined') {
        st.filter = "alpha(opacity:" + Math.floor(opacity * 100) + ")";
      }
    }
  },
  _visibilityChangeHandler: function (v) {
    // console.log('_visibilityChangeHandler' + v);
    if (v) {
      esri.show(this._div);
      if (this._gmap) {
        google.maps.event.trigger(this._gmap, 'resize');
        this._setExtent(this._map.extent);
        this._panHandle = this._panHandle || dojo.connect(this._map, "onPan", this, "_panHandler");
        this._extentChangeHandle = this._extentChangeHandle || dojo.connect(this._map, "onExtentChange", this, "_extentChangeHandler");
      } else {
        this._initGMap();
      }
    } else {
      if (this._div) {
        esri.hide(this._div);
        if (this._panHandle) {
          dojo.disconnect(this._panHandle);
          this._panHandle = null;
        }
        if (this._extentChangeHandle) {
          dojo.disconnect(this._extentChangeHandle);
          this._extentChangeHandle = null;
        }
      }
    }
  },
  _resizeHandler: function (extent, height, width) {
    dojo.style(this._div, {
      width: this._map.width  + "px",
      height: this._map.height + "px"
    });
    google.maps.event.trigger(this._gmap, 'resize');
  },
  _extentChangeHandler: function (extent, delta, levelChange, lod) {
    if (levelChange) {
      this._setExtent(extent);
    } else {
      this._gmap.setCenter(this._esriPointToLatLng(extent.getCenter()));
    }
  },
  _panHandler: function (extent, delta) {
    this._gmap.setCenter(this._esriPointToLatLng(extent.getCenter()));
  },
  _setExtent: function (extent) {
    var lv = this._map.getLevel();
    if (lv >= 0) {
      var ct = this._esriPointToLatLng(extent.getCenter());
      this._gmap.setCenter(ct);
      this._gmap.setZoom(lv);
    } else {
      this._gmap.fitBounds(this._esriExtentToLatLngBounds(extent));
    }
  },
  _esriPointToLatLng: function (pt) {
    var ll = esri.geometry.webMercatorToGeographic(pt);
    return new google.maps.LatLng(ll.y, ll.x);
  },
  _esriExtentToLatLngBounds: function (ext) {
    var llb = esri.geometry.webMercatorToGeographic(ext);
    return new google.maps.LatLngBounds(new google.maps.LatLng(llb.ymin, llb.xmin, true), new google.maps.LatLng(llb.ymax, llb.xmax, true));
  }
});
