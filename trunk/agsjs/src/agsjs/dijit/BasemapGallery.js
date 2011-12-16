/**
 * @name BasemapGallery Extension widget for ArcGIS Server JavaScript API
 * @author: Nianwei Liu (nianwei at gmail dot com)
 * @fileoverview
 * <p>A BasemapGallery Extension widget for ESRI ArcGIS Server JavaScript API. The namespace is <code>agsjs</code></p>
 * @version 1.06
 */
dojo.provide('agsjs.dijit.BasemapGallery');

dojo.require('esri.dijit.BasemapGallery');
dojo.require('agsjs.layers.GoogleMapsLayer');

esri.dijit.BasemapGallery.prototype._original_postMixInProperties = esri.dijit.BasemapGallery.prototype.postMixInProperties;
esri.dijit.BasemapGallery.prototype._original_startup = esri.dijit.BasemapGallery.prototype.startup;

  
  
// extended behaviors
agsjs.dijit._BasemapGalleryExt = {
  googleMapsApi: null,
  _googleLayers: [],
  toggleReference: false,
  postMixInProperties: function() {
    if (!this._onSelectionChangeListener) {
      this._onSelectionChangeListener = dojo.connect(this, 'onSelectionChange', this, this._onSelectionChange)
    }
    if (this.googleMapsApi != undefined && this.showArcGISBasemaps) {
      this.basemaps.push(new esri.dijit.Basemap({
        id: 'google_road',
        layers: [new esri.dijit.BasemapLayer({
          type: 'GoogleMapsRoad'
        })],
        title: "Google Road",
        thumbnailUrl: dojo.moduleUrl("agsjs.dijit", "images/googleroad.png")
      }));
      this.basemaps.push(new esri.dijit.Basemap({
        id: 'google_satellite',
        layers: [new esri.dijit.BasemapLayer({
          type: 'GoogleMapsSatellite'
        })],
        title: "Google Satellite",
        thumbnailUrl: dojo.moduleUrl("agsjs.dijit", "images/googlesatellite.png")
      }));
      this.basemaps.push(new esri.dijit.Basemap({
        id: 'google_hybrid',
        layers: [new esri.dijit.BasemapLayer({
          type: 'GoogleMapsHybrid'
        })],
        title: "Google Hybrid",
        thumbnailUrl: dojo.moduleUrl("agsjs.dijit", "images/googlehybrid.png")
      }));
      
    }
    if (this.loaded) {
      this._onLoad();
    } else {
      this._onLoadListener = dojo.connect(this, 'onLoad', this, this._onLoad);
    }
    if (this._original_postMixInProperties) {
      this._original_postMixInProperties();
    }
  },
  startup: function() {
    // user have option of not calling startup for custom UI.
    // _startupCalled is used to flag if we need refresh UI for toggle reference layer
    this._startupCalled = true;
    //this.inherited(arguments);
    this._original_startup();
  },
  _onLoad: function() {
    //console.log('inside _onLoad ');
    if (this._onLoadListener) 
      dojo.disconnect(this._onLoadListener);
    if (this.toggleReference) {
      dojo.forEach(this.basemaps, function(basemap) {
        var layers = basemap.getLayers();
        if (layers.length) {
          this._processReferenceLayers(basemap);
        } else {
          layers.then(dojo.hitch(this, this._processReferenceLayers, basemap));
        }
      }, this);
    }
  },
  _processReferenceLayers: function(basemap) {
    var layers = basemap.getLayers();
    var hasRef = false, vis = true;
    dojo.forEach(layers, function(layer) {
      if (layer.isReference) {
        hasRef = true;
        if (layer.visibility === false) {
          vis = false;
        }
      }
    });
    if (hasRef && this.toggleReference) {
      basemap.title += '<input type="checkbox"  disabled ' + (vis ? 'checked' : '') + '/>';
      basemap._hasReference = true;
    } else {
      basemap._hasReference = false;
    }
    
    var needsRefresh = 0;
    dojo.forEach(this.basemaps, function(b) {
      // make sure all basemaps are processed. it is decided by each basemap has a _hasReference property, regardless true or false.
      // if there is any basemap not processed, should not refresh.
      // if there are at least one ref layers for that basemap, will refresh.
      if (b._hasReference == undefined) {
        needsRefresh -= this.basemaps.length;
      }
      if (b._hasReference) {
        needsRefresh++;
      }
    }, this);
    if (needsRefresh >= 0) {
      if (needsRefresh > 0 && this._startupCalled) {
        // if startup is executed before all basemap are processed, need recall it. if not called yet, does not matter.
        this.startup();
      }
      if (this.domNode) {
        this._onGalleryClickListener = dojo.connect(this.domNode, 'click', this, this._onGalleryClick);
      }
    }
  },
  _onSelectionChange: function() {
    var selected = this.getSelected();
    if (selected) {
      if (this._googleLayers.length > 0) {
        dojo.forEach(this._googleLayers, function(lay) {
          this.map.removeLayer(lay);
        }, this);
        this._googleLayers.length = 0;
      }
      dojo.query('input', this.domNode).forEach(function(m) {
        m.disabled = true;
      });
      var layers = selected.getLayers();
      dojo.forEach(layers, function(blay) {
        if (blay.type && blay.type.indexOf("GoogleMaps") > -1) {
          var mtype = agsjs.layers.GoogleMapsLayer.MAP_TYPE_ROADMAP;
          if (blay.type == "GoogleMapsSatellite") {
            mtype = agsjs.layers.GoogleMapsLayer.MAP_TYPE_SATELLITE;
          } else if (blay.type == "GoogleMapsHybrid") {
            mtype = agsjs.layers.GoogleMapsLayer.MAP_TYPE_HYBRID;
          }
          var opts = {
            apiOptions: this.googleMapsApi,
            mapOptions: {
              mapTypeId: mtype,
              streetViewControl: this.googleMapsApi.streetView
            }
          };
          var layer = new agsjs.layers.GoogleMapsLayer(opts);
          this.map.addLayer(layer, 0);
          this._googleLayers.push(layer);
        }
      }, this);
    }
    // when the first basemap is selected, UI may already built, but at that time, 
    // nothing to mark as selected node because first onSelectionChange has not been fired yet.
    var hasSelectedNode = this._checkSelectedNode();
    if (!hasSelectedNode && this._startupCalled) {
      // mark selected basemap in UI.
      this.startup();
      // this enables checkbox;
      this._checkSelectedNode();
    }
    
  },
  _checkSelectedNode: function(){
     var hasSelectedNode = false;
     var layers = this.getSelected().getLayers();
    dojo.query('.esriBasemapGallerySelectedNode', this.domNode).forEach(function(n) {
      hasSelectedNode = true;
      dojo.query('input', n).forEach(function(m) {
        m.disabled = false;
        // jsapi fires onSelectionChange before reference layer updates, (should be a bug) so we can not set vis directly.
        //this._setReferenceVis(m.checked);
        dojo.forEach(layers, function(blay) {
          if (blay.isReference) {
            blay.visibility = m.checked;
          }
        }, this);
        
      }, this);
    }, this);
    return hasSelectedNode;
  },
  _onGalleryClick: function(evt) {
    var t = evt.target;
    if (t.tagName.toLowerCase() == 'input') {
      this._setReferenceVis(t.checked);
    } else if (dojo.hasClass(t.parentNode, 'esriBasemapGalleryLabelContainer')) {
      t.parentNode.parentNode.firstChild.click();
    }
  },
  _setReferenceVis: function(visible) {
    //arcgis API does not associate the actual created esri.layers.Layer and esri.dijit.BasemapLayer
    // so have to use undocumented _basemapGalleryLayerType.
    dojo.forEach(this.map.layerIds, function(id) {
      var layer = this.map.getLayer(id);
      if (layer._basemapGalleryLayerType == "reference") {
        if (visible) {
          layer.show();
        } else {
          layer.hide();
        }
        
      }
    }, this);
  }
};

dojo.extend(esri.dijit.BasemapGallery, agsjs.dijit._BasemapGalleryExt);

// _BasemapGallery is used to put in front of esri.dijit.BasemapGallery to intercept calling of constructor of esri.dijit.BasemapGallery
dojo.declare('agsjs.dijit._BasemapGallery', null, {
  constructor: function(params, srcNode) {
    if (params.basemapGroup) {
      this.basemapGroup = params.basemapGroup;
      esri.setRequestPreCallback(dojo.hitch(this, this._setOnlineParams));
    }
  },
  _setOnlineParams: function(ioArgs) {
    //console.log(ioArgs.url, ioArgs.content);
    if (ioArgs.url === 'http://www.arcgis.com/sharing/community/groups') {
      if (this.basemapGroup.title && this.basemapGroup.owner) {
        //: "title:\"ArcGIS Online Basemaps\" AND owner:esri"
        var basemapQuery = "title:" + this.basemapGroup.title + " AND " + this.basemapGroup.owner;
        ioArgs.content.q = basemapQuery;
      }
    } else if (ioArgs.url === 'http://www.arcgis.com/sharing/search') {
      if (ioArgs.content.q.indexOf('group') != -1 && ioArgs.content.sortField && this.basemapGroup.sortField) {
        ioArgs.content.sortField = this.basemapGroup.sortField;
        ioArgs.content.sortOrder = this.basemapGroup.sortOrder || ioArgs.content.sortOrder;
      }
    }
    return ioArgs;
  }
});
/**
 * 
 */
dojo.declare('agsjs.dijit.BasemapGallery', [agsjs.dijit._BasemapGallery, esri.dijit.BasemapGallery], agsjs.dijit._BasemapGalleryExt);
