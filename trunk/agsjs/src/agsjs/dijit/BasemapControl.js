/**
 * @name Base Map Groups widget for ArcGIS Server JavaScript API
 * @author: Nianwei Liu (nianwei at gmail dot com)
 * @fileoverview
 * <p>Base Map Groups widget. Typically placed on top right corner of the map, and organize base maps into groups that displayed as Tabs.
 * Can use Google maps, and can have slider for images.
 * @version 1.2
 */
// change log: 
// 2010-08-11: support for not showing legend or layer list; slider at service level config; removed style background.

/*global dojo esri*/
// reference: http://dojotoolkit.org/reference-guide/quickstart/writingWidgets.html

dojo.provide('agsjs.dijit.BasemapControl');
dojo.require('dijit._Widget');
dojo.require('dijit.layout.TabContainer');
dojo.require('dijit.layout.ContentPane');
dojo.require('dijit.form.Slider');
dojo.require('esri.layers.osm');
dojo.require('agsjs.layers.GoogleMapsLayer');

dojo.declare("agsjs.dijit.BasemapControl", [dijit._Widget], {
  maps: null,
  basemaps: null,
  _selectedBase: null,
  /**
   * @name BasemapControl
   */
  /** 
   * Create a BasemapControl (TOC)
   * @name BasemapControl
   * @constructor
   * @class This class is a BasemapControl widget.
   * @param {Object} opts
   * @param {DOMNode|id} srcNodeRef
   */
  constructor: function(params, srcNodeRef) {
    params = params || {};
    if (!params.map) {
      throw new Error('no map defined in params for TOC');
    }
    dojo.mixin(this, params);
    this._init();
  },
  _init: function() {
    dojo.forEach(this.basemaps, function(b, i) {
      if (b.selected) {
        this._selectedBase = b;
      }
      // split layers into 2 groups
      b._refs = [];// references
      b._bases = []; // actual layers;
      dojo.forEach(b.layers, function(lay, j) {
        if (!lay.id) {
          lay.id = 'basemap_' + i + '_' + j;
        }
        lay.visible = lay.visible || false;// undefined became false;
        if (lay.isReference) {
          b._refs.push(lay);
        } else {
          // regular base layer
          b._bases.push(lay);
          if (lay.visible) {
            b._selectedLayer = lay;
          }
        }
      }, this);
      if (!b._selectedLayer) {
        b._selectedLayer = b._bases[0];
        b._selectedLayer.visible = true;
      }
    }, this);
    if (!this._selectedBase) {
      this._selectedBase = this.basemaps[0];
      this._selectedBase.selected = true;
    }
    if (this.map.layerIds.length == 0 && this._selectedBase) {
      this._selectBase(this._selectedBase, true);
    }
    
    this.loaded = true;
    this.onLoad();
  },
  // extension point
  postCreate: function() {
    this._createControl();
    //this._zoomHandler = dojo.connect(this.map, "onZoomEnd", this, "_adjustToState");
  },
  _selectBase: function(bmap, force) {
    if (!force && (bmap == this._selectedBase)) 
      return;
    this._selectedBase = bmap;
    this._removeBaseLayers();
    var layer;
    // then add all layers;
    this._addBaseLayers(bmap._refs);
    this._addBaseLayers(bmap._bases);
  },
  _addBaseLayers: function(lays) {
    var layer;
    dojo.forEach(lays, function(lay) {
      layer = lay._layer;
      if (!layer) {
        layer = this._createLayer(lay);
        lay._layer = layer;
      }
      if (layer) {
        if (lay.isReference) {
          layer._isReference = true;
          this.map.addLayer(layer);
        } else {
          layer._isBaseMap = true;
          if (layer == this._googleLayer || layer == this._bingLayer) {
            if (!layer._addedToMap) {
              this.map.addLayer(layer, 0);
              layer._addedToMap = true;
            }
            
          } else {
            this.map.addLayer(layer, 0);
          }
          
        }
        
      }
      
    }, this);
  },
  // remove all layers marked as base or reference
  _removeBaseLayers: function() {
    var ids = this.map.layerIds;
    var bases = [];
    dojo.forEach(ids, function(id) {
      var layer = this.map.getLayer(id);
      if (layer._isBaseMap || layer._isReference) {
        bases.push(layer);
      }
    }, this);
    console.log('toremove' + bases.length);
    if (bases.length > 0) {
      dojo.forEach(bases, function(layer) {
        try {
          if (layer == this._googleLayer || layer == this._bingLayer) {
            layer._addedToMap = false;
          }
          this.map.removeLayer(layer);
        } catch (e) {
          // there is a chance if config is wrong, a layer may never loaded, thus removing it will cause exception
          if (console) 
            console.error(e);
        };
      }, this);
    }
  },
  _createLayer: function(lay) {
    var layer = null;
    var type = lay.type || 'ArcGISTiled';
    if (type.indexOf("GoogleMaps") == 0) {
      layer = this._createGoogleLayer(lay);
    } else if (type.indexOf("BingMaps") == 0) {
      layer = this._createBingLayer(lay);
    } else {
      switch (type) {
      case 'OpenStreetMap':
        layer = new esri.layers.OpenStreetMapLayer(lay);
        break;
      case 'ArcGISTiled':
        layer = new esri.layers.ArcGISTiledMapServiceLayer(lay.url, lay);
        break;
      }
    }
    return layer;
  },
  _createGoogleLayer: function(lay) {
    var maptype = {
      'GoogleMapsRoadMap': agsjs.layers.GoogleMapsLayer.MAP_TYPE_ROADMAP,
      'GoogleMapsSatellite': agsjs.layers.GoogleMapsLayer.MAP_TYPE_SATELLITE,
      'GoogleMapsHybrid': agsjs.layers.GoogleMapsLayer.MAP_TYPE_HYBRID,
      'GoogleMapsTerrain': agsjs.layers.GoogleMapsLayer.MAP_TYPE_TERRAIN
    }[lay.type];
    lay._subtype=maptype;
    if (!this._googleLayer) {
      this._googleLayer = new agsjs.layers.GoogleMapsLayer(dojo.mixin({
        mapOptions: {
          mapTypeId: maptype
        }
      }, lay));
    } else if (lay.visible) {
      this._googleLayer.setMapTypeId(maptype);
      this._googleLayer.show();
    }
    return this._googleLayer;
  },
  _createBingLayer: function(lay) {
    var maptype = {
      'BingMapsRoad': esri.virtualearth.VETiledLayer.MAP_STYLE_ROAD,
      'BingMapsAerial': esri.virtualearth.VETiledLayer.MAP_STYLE_AERIAL,
      'BingMapsHybrid': esri.virtualearth.VETiledLayer.MAP_STYLE_AERIAL_WITH_LABELS
    }[lay.type];
    lay._subtype=maptype;
    if (!this._bingLayer) {
      this._bingLayer = new esri.virtualearth.VETiledLayer(dojo.mixin({
        mapStyle: maptype
      }, lay));
    } else if (lay.visible) {
      this._bingLayer.setMapStyle(maptype);
      this._bingLayer.show();
    }
    return this._bingLayer;
  },
  _switchLayer: function(lay) {
    var b = this._selectedBase;
    dojo.forEach(b.layers, function (lay){
      if (lay._layer){
        lay._layer.hide();
      }
    });
    var layer = lay._layer;
    b._selectedLayer = lay;
    if (layer) {
      if (layer == this._googleLayer){
        layer.setMapTypeId(lay._subtype);
      } else if (layer == this._bingLayer){
        layer.setMapStyle(lay._subtype);
      }
      layer.show();
    }
  },
  onLoad: function() {
    // dispatch event
  },
  _createControl: function() {
    var tc = new dijit.layout.TabContainer({
      doLayout: false
    });
    dojo.forEach(this.basemaps, function(b, i) {
      var tab = new dijit.layout.ContentPane({
        title: b.title,
        selected: b.selected
      });
      var refCount = 0;
      dojo.forEach(b.layers, function(layer) {
        if (layer.isReference) {
          refCount++;
          var cont = tab.get('content');
          cont += '<input type="checkbox" name="' + layer.name + '" >' + layer.name;
          tab.set('content', cont);
        }
      });
      if (b.slider != undefined) {
        var count = b.layers.length - refCount;
        var opts = dojo.mixin({
          showButtons: false,
          style: "width:95%",
          maximum: count,
          value: count
        }, b.slider);
        var labels = [];
        dojo.forEach(b.layers, function(layer) {
          if (layer.isReference) 
            return;
          labels.push(layer.name);
        });
        var ruleOpts = {
          labels: labels,
          container: "bottomDecoration",
          count: count,
          style: "height:0.5em;font-size:75%"
        };
        
        var sliderNode = dojo.create('div', {}, tab.domNode);
        var sliderRule = new dijit.form.HorizontalRule(ruleOpts, dojo.create('div', {
          style: {
            height: "2px"
          }
        }, sliderNode));
        
        var sliderLabels = new dijit.form.HorizontalRuleLabels(ruleOpts, dojo.create('div', {
          style: {
            height: "2px"
          }
        }, sliderNode));
        var slider = new dijit.form.HorizontalSlider(opts, sliderNode);
        slider.startup();
        sliderRule.startup();
        sliderLabels.startup();
        
      } else {
        dojo.forEach(b.layers, function(layer) {
          if (layer.isReference) 
            return;
          var tp = layer.type || '';
          var cont = tab.get('content');
          cont += '<input type="radio" name="' + b.title + '"' + (layer.visible ? " checked" : "") + ' value="'+layer.id+'">' + layer.name;
          tab.set('content', cont);
        });
      }
      dojo.connect(tab, 'onClick', this, this._onTabClicked);
      tc.addChild(tab);
    }, this);
    
    tc.placeAt(this.domNode);
    tc.startup();
    this._onTabChangeHandle = dojo.connect(tc, "selectChild", this, this._onTabChangeHandler);
  },
  _onTabChangeHandler: function(child){
    dojo.every(this.basemaps, function(b) {
        console.log(b.title);
        if (b.title == child.title) {
          this._selectBase(b);
          return false;
        }
        return true;
      }, this);
  },
  _onTabClicked: function (evt){
    var t = evt.target;
    var b = this._selectedBase;
    var id = null;
    if (t.tagName == 'INPUT'){
      console.log('clicked'+t.value);
      id = t.value;
    }
    dojo.every(b.layers, function(lay){
      if (lay.id == id){
        this._switchLayer(lay);
        return false;
      }
      return true;
    }, this);
    
  },
  // extention point
  destroy: function() {
    dojo.disconnect(this._onTabChangeHandle);
  }
  
  
});
