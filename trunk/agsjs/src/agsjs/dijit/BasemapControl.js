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
      var atLeastOneVisible = false;
      dojo.forEach(b.layers, function(lay, j) {
        if (!lay.id) {
          lay.id = 'basemap_' + i + '_' + j;
        }
        lay.visible = lay.visible || false;// undefined became false so layer constructor won't create as visible
        if (lay.isReference) {
          b._refs.push(lay);
        } else {
          // regular base layer
          b._bases.push(lay);
          if (lay.visible) {
            //b._selectedLayer = lay;
            atLeastOneVisible = true;
          }
        }
      }, this);
      // if (!b._selectedLayer) {
      if (!atLeastOneVisible) {
        //b._selectedLayer = b._bases[0];
        //b._selectedLayer.visible = true;
        b._bases[0].visible = true;
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
    this._createUI();
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
            if (lay.visible && layer == this._googleLayer) {
              layer.setMapTypeId(lay._subtype);
              if (lay.styles) {
                layer.setMapStyles(lay.styles);
              } else {
                layer.setMapStyles(null);
              }
              
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
    if (!(agsjs && agsjs.layers && agsjs.layers.GoogleMapsLayer)) {
      throw "use dojo.require('agsjs.layers.GoogleMapsLayer') before using this widget";
      ;
    }
    var maptype = {
      'GoogleMapsRoadMap': agsjs.layers.GoogleMapsLayer.MAP_TYPE_ROADMAP,
      'GoogleMapsSatellite': agsjs.layers.GoogleMapsLayer.MAP_TYPE_SATELLITE,
      'GoogleMapsHybrid': agsjs.layers.GoogleMapsLayer.MAP_TYPE_HYBRID,
      'GoogleMapsTerrain': agsjs.layers.GoogleMapsLayer.MAP_TYPE_TERRAIN
    }[lay.type];
    lay._subtype = maptype;
    if (!this._googleLayer) {
      this._googleLayer = new agsjs.layers.GoogleMapsLayer(dojo.mixin({
        mapOptions: {
          mapTypeId: maptype
        }
      }, lay));
      dojo.connect(this._googleLayer, "onStreetViewVisibilityChange", this, function(v) {
        if (v) {
          esri.hide(this.domNode);
        } else {
          esri.show(this.domNode);
        }
      });
      
      this.onGoogleMapsLayerCreate(this._googleLayer);
    } else if (lay.visible) {
      this._googleLayer.setMapTypeId(maptype);
      this._googleLayer.show();
    }
    return this._googleLayer;
  },
  onGoogleMapsLayerCreate: function(layer) {
    // event
  },
  _createBingLayer: function(lay) {
    var maptype = {
      'BingMapsRoad': esri.virtualearth.VETiledLayer.MAP_STYLE_ROAD,
      'BingMapsAerial': esri.virtualearth.VETiledLayer.MAP_STYLE_AERIAL,
      'BingMapsHybrid': esri.virtualearth.VETiledLayer.MAP_STYLE_AERIAL_WITH_LABELS
    }[lay.type];
    lay._subtype = maptype;
    if (!this._bingLayer) {
      this._bingLayer = new esri.virtualearth.VETiledLayer(dojo.mixin({
        mapStyle: maptype
      }, lay));
      this.onBingMapsLayerCreate(this._bingLayer);
    } else if (lay.visible) {
      this._bingLayer.setMapStyle(maptype);
      this._bingLayer.show();
    }
    return this._bingLayer;
  },
  onBingMapsLayerCreate: function(layer) {
    // event
  },
  _switchLayer: function(name, name2, op) {
    var b = this._selectedBase;
    var isRef = false;
    dojo.forEach(b._refs, function(lay) {
      if (lay.name == name) {
        lay.visible = !lay.visible;
        if (lay._layer) {
          lay._layer.setVisibility(lay.visible);
        }
        isRef = true;
      }
    }, this);
    if (isRef) 
      return;
    // hide all other layers.
    // since for Google/Bings the later subtypes may mess up with different groups
    // safer to do 2 loops.
    dojo.forEach(b._bases, function(lay) {
      if (lay.name != name && lay.name != name2) {
        lay.visible = false;
        if (lay._layer) 
          lay._layer.hide();
      }
    });
    dojo.forEach(b._bases, function(lay) {
      if (lay.name == name || lay.name == name2) {
        var layer = lay._layer;
        if (layer == this._googleLayer) {
          layer.setMapTypeId(lay._subtype);
          if (lay.styles) {
            layer.setMapStyles(lay.styles);
          } else {
            layer.setMapStyles(null);
          }
          
        } else if (layer == this._bingLayer) {
          layer.setMapStyle(lay._subtype);
        }
        layer.show();
        lay.visible = true;
        if (lay.name == name) {
          layer.setOpacity(op);
        } else {
          layer.setOpacity(1 - op);
        }
      }
    }, this);
    
  },
  onLoad: function() {
    // dispatch event
  },
  // create a single set of basemaps
  _createBasemapUI: function(b) {
    var tab = new dijit.layout.ContentPane({
      title: b.title,
      selected: b.selected
    });
    dojo.forEach(b._refs, function(lay) {
      var chk;
      if (dijit.form && dijit.form.CheckBox) {
        chk = new dijit.form.CheckBox({
          value: lay.name,
          checked: lay.visible
        });
        chk.placeAt(tab.domNode);
      } else {
        chk = dojo.create('input', {
          type: 'checkbox',
          value: lay.name
        }, tab.domNode);
      }
      chk.checked = lay.visible;
      
      tab.domNode.appendChild(dojo.doc.createTextNode(lay.name));
      
    });
    if (b._refs.length > 0) {
      dojo.create('br', null, tab.domNode);
    }
    if (b.slider != undefined) {
      var count = b._bases.length;
      // find out current slider from last visible layer
      var val = count - 1;
      for (var i = val; i >= 0; i--) {
        if (b._bases[i].visible) {
          val = i;
          break;
        }
      }
      var opts = dojo.mixin({
        showButtons: false,
        style: "width:95%; margin-top:6px",
        maximum: count - 1,
        value: val
      }, b.slider);
      var labels = [];
      dojo.forEach(b._bases, function(lay) {
        labels.push(lay.name);
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
      dojo.connect(slider, 'onChange', this, this._onSliderChanged);
    } else {
      var names = {};
      dojo.forEach(b._bases, function(lay) {
        if (!names[lay.name]) {
          var ra = null;
          if (dijit.form && dijit.form.RadioButton) {
            ra = new dijit.form.RadioButton({
              name: b.title,
              value: lay.name,
              checked: lay.visible
            });
            ra.placeAt(tab.domNode);
          } else {
            ra = dojo.create('input', {
              type: 'radio',
              name: b.title,
              value: lay.name
            }, tab.domNode);
            ra.checked = lay.visible;
          }
          
          tab.domNode.appendChild(dojo.doc.createTextNode(lay.name));
          names[lay.name] = ra;
        }
      });
    }
    dojo.connect(tab, 'onClick', this, this._onTabClicked);
    return tab;
  },
  _createUI: function() {
    if (this.basemaps.length == 1 && this.noTabs) {
      var tab = this._createBasemapUI(this.basemaps[0]);
      dojo.addClass(tab.domNode, 'dijitTabPaneWrapper');
      tab.domNode.style.borderWidth = '1px';
      tab.domNode.style.borderStyle = 'solid';
      tab.placeAt(this.domNode);
      tab.startup();
    } else {
      var tc = new dijit.layout.TabContainer({
        doLayout: false
      });
      this._onTabChangeHandle = dojo.connect(tc, "selectChild", this, this._onTabChangeHandler);
      dojo.forEach(this.basemaps, function(b, i) {
        var tab = this._createBasemapUI(b);
        tc.addChild(tab);
      }, this);
      tc.placeAt(this.domNode);
      tc.startup();
    }
    
  },
  _onTabChangeHandler: function(child) {
    dojo.every(this.basemaps, function(b) {
      if (b.title == child.title) {
        this._selectBase(b);
        return false;
      }
      return true;
    }, this);
  },
  _onTabClicked: function(evt) {
    var t = evt.target;
    var b = this._selectedBase;
    if (t.tagName == 'INPUT') {
      var name = null;
      var w = dijit.getEnclosingWidget(t); // pass a domNode
      if (w && (w.declaredClass == 'dijit.form.CheckBox' || w.declaredClass == 'dijit.form.RadioButton')) {
        this._switchLayer(w.value);
      } else {
        this._switchLayer(t.value);
      }
      
    }
  },
  _onSliderChanged: function(value) {
  
    var bases = this._selectedBase._bases;
    var first = Math.floor(value);
    var op = 1 - (value - first);
    var second = Math.min(bases.length - 1, first + 1);
    //if (first != second){
    this._switchLayer(bases[first].name, bases[second].name, op);
    //} else {
  
    //}
  
  
  },
  // extention point
  destroy: function() {
    dojo.disconnect(this._onTabChangeHandle);
  }
  
  
});
