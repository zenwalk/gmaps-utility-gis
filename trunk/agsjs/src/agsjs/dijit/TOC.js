/**
 * @name Table of Contents (TOC) widget for ArcGIS Server JavaScript API
 * @version 1.0
 * @author: Nianwei Liu (nianwei at gmail dot com)
 * @fileoverview
 * <p>A TOC (Table of Contents) widget for ESRI ArcGIS Server JavaScript API. The namespace is <code>agsjs</code></p>
 * @version 1.2
 */
// change log: 
// 2010-08-11: support for not showing legend or layer list; slider at service level config; removed style background.

/*global dojo esri*/
// reference: http://dojotoolkit.org/reference-guide/quickstart/writingWidgets.html

dojo.provide('agsjs.dijit.TOC');
dojo.require('dijit._Widget');
dojo.require('dijit._Templated');
dojo.require('dijit.form.Slider');
dojo.require("dojo.fx");

(function() {
  var link = dojo.create("link", {
    type: "text/css",
    rel: "stylesheet",
    href: dojo.moduleUrl("agsjs.dijit", "css/TOC.css")
  });
  dojo.doc.getElementsByTagName("head")[0].appendChild(link);
}());

/**
 * _TOCNode is a node, with 4 possible types: service|group|layer|legend
 * @private
 */
dojo.declare("agsjs.dijit._TOCNode", [dijit._Widget, dijit._Templated], {
  //templateString: dojo.cache('agsjs.dijit', 'templates/tocNode.html'),
  templateString: '<div class="agsTOCNode">' +
  '<div data-dojo-attach-point="rowNode" data-dojo-attach-event="onclick:_onClick">' +
  '<span data-dojo-attach-point="contentNode" class="agsTOCContent">' +
  '<img src="${_blankGif}" alt="" data-dojo-attach-point="iconNode" />' +
  '<input type="checkbox" data-dojo-attach-point="checkNode"/>' +
  '<span data-dojo-attach-point="labelNode">' +
  '</span></span></div>' +
  '<div data-dojo-attach-point="containerNode" style="display: none;"> </div></div>',
  service: null,
  layer: null,
  legend: null,
  serviceTOC: null,
  constructor: function(params, srcNodeRef) {
    dojo.mixin(this, params);
  },
  // extension point. called automatically after widget DOM ready.
  postCreate: function() {
    dojo.style(this.rowNode, 'paddingLeft', '' + this.serviceTOC.toc.indentSize * this.serviceTOC._currentIndent + 'px');
    // using the availability of certain property to decide what kind of node to create
    var data = null;
    var blank = this.iconNode.src;
    if (this.legend) {
      data = this.legend;
      this._createLegendNode(this.legend);
    } else if (this.layer) {
      data = this.layer;
      this._createLayerNode(this.layer);
      this._adjustToState();
    } else if (this.service) {
      data = this.service;
      this._createServiceNode(this.service);
    }
    if (this.containerNode) {
      this.toggler = new dojo.fx.Toggler({
        node: this.containerNode,
        showFunc: dojo.fx.wipeIn,
        hideFunc: dojo.fx.wipeOut
      })
    }
    if (this.checkNode) {
      this.checkNode.checked = data.visible;
    }
    var show = data.visible;
    if (data.collapsed) show = false;
    if (this.iconNode.src == blank) {
      dojo.addClass(this.iconNode, 'dijitTreeExpando');
      dojo.addClass(this.iconNode, show ? 'dijitTreeExpandoOpened' : 'dijitTreeExpandoClosed');
    }
    dojo.style(this.containerNode, 'display', show ? 'block' : 'none');
    
    if (this.serviceTOC.toc.style == 'inline') {
      dojo.place(this.iconNode, this.checkNode, 'after');
    }
  },
  _createServiceNode: function(service) {
    dojo.addClass(this.rowNode, 'agsTOCService');
    dojo.addClass(this.labelNode, 'agsTOCServiceLabel');
    
    var title = this.serviceTOC.info.title || service.id;
    service.collapsed = this.serviceTOC.info.collapsed;
    if (this.serviceTOC.info.slider) {
      this.sliderNode = dojo.create('div', {
        'class': 'agsTOCSlider'
      }, this.rowNode, 'last');//
      this.slider = new dijit.form.HorizontalSlider({
        showButtons: false,
        value: service.opacity * 100,
        intermediateChanges: true,
        //style: "width:100%;padding:0 20px 0 20px",
        tooltip: 'adjust transparency',
        onChange: function(value) {
          service.setOpacity(value / 100);
        },
        layoutAlign: 'right'
      });
      this.slider.placeAt(this.sliderNode);
    }
    if (!this.serviceTOC.info.noLayers) {
      this._createChildrenNodes(service.tocInfos, 'layer');
    } else {
      dojo.style(this.iconNode, 'visibility', 'hidden');
    }
    this.labelNode.innerHTML = title;
  },
  _createLayerNode: function(layer) {
    // layer: layerInfo with nested subLayerInfos
    this.labelNode.innerHTML = layer.name;
    if (layer.subLayerInfos) {
      dojo.destroy(this.checkNode);
      dojo.addClass(this.rowNode, 'agsTOCGroup');
      dojo.addClass(this.labelNode, 'agsTOCGroupLabel');
      if (this.serviceTOC.info.showGroupCount) {
        this.labelNode.innerHTML = layer.name + ' (' + layer.subLayerInfos.length + ')';
      }
      this._createChildrenNodes(layer.subLayerInfos, 'layer');
    } else {
      dojo.addClass(this.rowNode, 'agsTOCLayer');
      dojo.addClass(this.labelNode, 'agsTOCLayerLabel');
      if (agsjs.layers && this.service instanceof agsjs.layers.GoogleMapsLayer){
        var mapid = '';
        var gmap = this.service.getGMap();
        if (gmap)  mapid = gmap.getMapTypeId();
        var value = layer.name.toLowerCase();// may need change in future version.
        this.radioNode = dojo.create('input', {
          'type': 'radio',
          name: 'gmaps' + this.service.id,
          value: value,
          checked: mapid == value
        }, this.checkNode, 'replace');
        
      } else if (this.service.tileInfo) {//} instanceof esri.layers.TiledMapServiceLayer) {
        dojo.destroy(this.checkNode);
      }
      if (layer.legends && !this.serviceTOC.info.noLegend) {
        if (this.serviceTOC.toc.style == 'inline' && layer.legends.length == 1) {
          this.iconNode.src = this._getLegendIconUrl(layer.legends[0]);
          dojo.destroy(this.containerNode);
        } else {
          this._createChildrenNodes(layer.legends, 'legend');
        }
      } else {
        dojo.destroy(this.iconNode);
        dojo.destroy(this.containerNode);
      }
    }
    this.serviceTOC._layerWidgets.push(this);
  },
  _createLegendNode: function(legend) {
    //{label:, url: , imageData}
    dojo.destroy(this.checkNode);
    dojo.destroy(this.containerNode);
    dojo.addClass(this.labelNode, 'agsTOCLegendLabel');
    this.iconNode.src = this._getLegendIconUrl(legend);
    this.labelNode.innerHTML = legend.label;
  },
  _getLegendIconUrl: function(legend) {
    var src = legend.url;
    if (!dojo.isIE && legend.imageData && legend.imageData.length > 0) {
      src = "data:image/png;base64," + legend.imageData;
    } else {
      if (src.indexOf('http') !== 0) {
        // resolve relative url
        src = this.service.url + '/' + this.layer.id + '/images/' + src;
      }
    }
    return src;
  },
  _createChildrenNodes: function(children, type) {
    this.serviceTOC._currentIndent++;
    dojo.forEach(children, function(child) {
      var params = {
        serviceTOC: this.serviceTOC,
        service: this.service,
        layer: this.layer,
        legend: this.legend
      };
      params[type] = child;
      var node = new agsjs.dijit._TOCNode(params);
      node.placeAt(this.containerNode);
    }, this);
    this.serviceTOC._currentIndent--;
  },
  _toggleContainer: function(on) {
  
    if (dojo.hasClass(this.iconNode, 'dijitTreeExpandoClosed') ||
    dojo.hasClass(this.iconNode, 'dijitTreeExpandoOpened')) {
      // make sure its not clicked on legend swatch
      if (on) {
        dojo.removeClass(this.iconNode, 'dijitTreeExpandoClosed');
        dojo.addClass(this.iconNode, 'dijitTreeExpandoOpened');
      } else if (on === false) {
        dojo.removeClass(this.iconNode, 'dijitTreeExpandoOpened');
        dojo.addClass(this.iconNode, 'dijitTreeExpandoClosed');
      } else {
        dojo.toggleClass(this.iconNode, 'dijitTreeExpandoClosed');
        dojo.toggleClass(this.iconNode, 'dijitTreeExpandoOpened');
      }
      if (dojo.hasClass(this.iconNode, 'dijitTreeExpandoOpened')) {
        this.toggler.show();
      } else {
        this.toggler.hide();
      }
      
    }
  },
  _adjustToState: function() {
    if (this.layer) {
      var scale = esri.geometry.getScale(this.serviceTOC.toc.map);
      var outScale = (this.layer.maxScale != 0 && scale < this.layer.maxScale) || (this.layer.minScale != 0 && scale > this.layer.minScale);
      if (outScale) {
        dojo.addClass(this.domNode, 'agsTOCOutOfScale');
      } else {
        dojo.removeClass(this.domNode, 'agsTOCOutOfScale');
      }
      if (this.checkNode) {
        this.checkNode.disabled = outScale;
        this.checkNode.checked = this.layer.visible;
      } 
      if (this.radioNode) {
        var checked = false;
        if (this.service.getGMap() != null){
          checked = this.radioNode.value == this.service.getGMap().getMapTypeId()
        }
        this.radioNode.checked =  checked;
      } 
    }
  },
  _onClick: function(evt) {
    var t = evt.target;
    if (t == this.checkNode) {
      if (this.serviceTOC.toc.style == 'inline') {
        this._toggleContainer(this.checkNode.checked);
      }
      if (this.layer) {
        this.layer.visible = this.checkNode.checked;
        var vis = [];
        dojo.forEach(this.service.layerInfos, function(layerInfo) {
          if (layerInfo.subLayerIds) {
            // if a group layer is set to vis, all sub layer will be drawn
            return;
          }
          if (layerInfo.visible) 
            vis.push(layerInfo.id);
        });
        if (vis.length === 0) {
          vis.push(-1);
        }
        this.service.setVisibleLayers(vis, false);
        this.serviceTOC._refreshLayer();
      } else if (this.service) {
        this.service.setVisibility(this.checkNode.checked);
      }
    } else if (t == this.iconNode) {
      this._toggleContainer();
    } else if (t == this.radioNode){
      if (this.service.setMapTypeId) {
        this.service.setMapTypeId(t.value);
      }
    }
  }
  
});

dojo.declare('agsjs.dijit._ServiceTOC', [dijit._Widget], {
  _currentIndent: 0,
  service: null,
  _layerWidgets: [],
  constructor: function(params, srcNodeRef) {
    this.service = params.service;
    this.toc = params.toc;
    this.info = params.info || {};
    
  },
  postCreate: function() {
    if ((this.service instanceof (esri.layers.ArcGISDynamicMapServiceLayer) ||
    this.service instanceof (esri.layers.ArcGISTiledMapServiceLayer))) {
      if (!this.info.title) {
        var start = this.service.url.toLowerCase().indexOf('/rest/services/');
        var end = this.service.url.toLowerCase().indexOf('/mapserver', start);
        this.info.title = this.service.url.substring(start + 15, end);
      }
    } else if (agsjs.layers && this.service instanceof (agsjs.layers.GoogleMapsLayer)) {
      if (!this.info.title) {
        this.info.title = 'Google Maps';
      }
      // may need change in future version. use this naming convention to avoid the requirement of loading gmaps api
      this.service.tocInfos = [{
        'name': 'Hybrid'
      }, {
        'name': 'RoadMap'
      }, {
        'name': 'Satellite'
      }, {
        'name': 'Terrain'
      }];
    } else {
      this.info.noLayers = true;
    }
    if (this.service.legendResponse || !this.service.url || this.info.noLegend || this.info.noLayers) {
      this._createServiceTOC();
    } else {
      this._getLegendInfo();
    }
  },
  _getLegendInfo: function() {
    var url = '';
    if (this.service.version >= 10.01) {
      url = this.service.url + '/legend';
    } else {
      url = 'http://www.arcgis.com/sharing/tools/legend';
      var i = this.service.url.toLowerCase().indexOf('/rest/');
      var soap = this.service.url.substring(0, i) + this.service.url.substring(i + 5);
      url = url + '?soapUrl=' + escape(soap);
    }
    var handle = esri.request({
      url: url,
      content: {
        f: "json"
      },
      callbackParamName: 'callback',
      handleAs: 'json',
      load: dojo.hitch(this, this._processLegendInfo),
      error: dojo.hitch(this, this._createServiceTOC)
    });
  },
  _processLegendError: function(err) {
    console.log(err);
    this._createServiceTOC();
  },
  _processLegendInfo: function(json) {
    this.service.legendResponse = json;
    this._createServiceTOC();
  },
  _createServiceTOC: function() {
    var service = this.service;
    if (!service.tocInfos) {
      // create a lookup map, key=layerId, value=LayerInfo
      // generally id = index, this is to assure we find the right layer by ID
      var layerLookup = {};
      dojo.forEach(service.layerInfos, function(layerInfo) {
        layerLookup['' + layerInfo.id] = layerInfo;
        // used for later reference.
        layerInfo.visible = layerInfo.defaultVisibility;
      });
      // attached legend Info to layer info
      if (service.legendResponse) {
        dojo.forEach(service.legendResponse.layers, function(legendInfo) {
          var layerInfo = layerLookup['' + legendInfo.layerId];
          if (layerInfo && legendInfo.legend) {
            layerInfo.legends = legendInfo.legend;
          }
        });
      }
      // nest layer Infos
      dojo.forEach(service.layerInfos, function(layerInfo) {
        if (layerInfo.subLayerIds) {
          var subLayerInfos = [];
          dojo.forEach(layerInfo.subLayerIds, function(id, i) {
            subLayerInfos[i] = layerLookup[id];
          });
          layerInfo.subLayerInfos = subLayerInfos;
        }
      });
      //finalize the tree structure in tocInfos, skipping all sublayers because they were nested already.
      var tocInfos = [];
      dojo.forEach(service.layerInfos, function(layerInfo) {
        if (layerInfo.parentLayerId == -1) {
          tocInfos.push(layerInfo);
        }
      });
      service.tocInfos = tocInfos;
    }
    this._serviceNode = new agsjs.dijit._TOCNode({
      serviceTOC: this,
      service: service
    });
    this._serviceNode.placeAt(this.domNode);
    
    this._visHandler = dojo.connect(service, "onVisibilityChange", this, "_adjustToState");
    // this will make sure all TOC linked to a Map synchronized.
    this._visLayerHandler = dojo.connect(service, "setVisibleLayers", this, "_adjustToState");
    if (agsjs.layers && this.service instanceof (agsjs.layers.GoogleMapsLayer)){
      this._maptypeIdHandler = dojo.connect(service, "onMapTypeIdChanged", this, "_adjustToState");
    }
  },
  _refreshLayer: function() {
    var service = this.service;
    if (this._refreshTimer) {
      window.clearTimeout(this._refreshTimer);
      this._refreshTimer = null;
    }
    this._refreshTimer = window.setTimeout(function() {
      service.setVisibleLayers(service.visibleLayers);
    }, 1000);
  },
  _adjustToState: function() {
    this._serviceNode.checkNode.checked = this.service.visible;
    dojo.forEach(this._layerWidgets, function(layerWidget) {
      layerWidget._adjustToState();
    });
  },
  destroy: function() {
    dojo.disconnect(this._visHandler);
    dojo.disconnect(this._visLayerHandler);
    dojo.disconnect(this._maptypeIdHandler);
  }
});

dojo.declare("agsjs.dijit.TOC", [dijit._Widget], {
  indentSize: 18,
  style: 'standard',
  layerInfos: null,
  slider: false,
  
  /**
   * @name TOCLayerInfo
   * @class This is an object literal that specify the options for each map service layer.
   * @property {esri.layers.ArcGISTiledMapServiceLayer | esri.layers.ArcGISDynamicMapServiceLayer} layer: ArcGIS Server layer.
   * @property {string} [title] title. optional. If not specified, service name is used.
   * @property {Boolean} [slider] whether to show slider for each service to adjust transparency. default is false.
   * @property {Boolean} [noLayers] whether to skip the sub layers inside a service layer.
   *   This typically for services (such as raster)that you only want to turn on/off but do not care what's inside.
   *   default is false.
   * @property {Boolean} [noLegend] whether to skip the legend, and only display layers. default is false.
   * @property {Boolean} [showGroupCount] whether to add number of sub layers after group layer. default is false.
   * @property {Boolean} [collapsed] whether to collapsed the service layer at beginning. default is false, which means expand if visible, collapse if not.
   *
   */
  /**
   * @name TOCOptions
   * @class This is an object literal that specify the option to construct a {@link TOC}.
   * @property {esri.Map} [map] the map instance. required.
   * @property {Object[]} [layerInfos] a subset of layers in the map to show in TOC. each object is a {@link TOCLayerInfo}
   * @property {Number} [indentSize] indent size of tree nodes. default to 18.
   * @property {String} [style] how legend swatches should be positioned. <code>inline|standard</code>. See example docs for details.
   */
  /** 
   * Create a Table Of Contents (TOC)
   * @name TOC
   * @constructor
   * @class This class is a Table Of Content widget.
   * @param {ags.TOCOptions} opts
   * @param {DOMNode|id} srcNodeRef
   */
  constructor: function(params, srcNodeRef) {
    params = params || {};
    if (!params.map) {
      throw new Error('no map defined in params for TOC');
    }
    dojo.mixin(this, params);
    this._serviceWidgets = [];
    if (!this.layerInfos) {
      this.layerInfos = [];
      for (var i = this.map.layerIds.length - 1; i >= 0; i--) {
        var layer = this.map.getLayer(this.map.layerIds[i]);
        this.layerInfos.push({
          layer: layer
        });
      }
    }
    
  },
  // extension point
  postCreate: function() {
    this._createTOC();
    this._zoomHandler = dojo.connect(this.map, "onZoomEnd", this, "_adjustToState");
  },
  _createTOC: function() {
    for (var i = 0, c = this.layerInfos.length; i < c; i++) {
      // attach a title to service layer itself
      var service = this.layerInfos[i].layer;
      var svcTOC = new agsjs.dijit._ServiceTOC({
        service: service,
        info: this.layerInfos[i],
        toc: this
      });
      this._serviceWidgets.push(svcTOC);
      svcTOC.placeAt(this.domNode);
    }
  },
  _adjustToState: function() {
    dojo.forEach(this._serviceWidgets, function(serviceWidget) {
      serviceWidget._adjustToState();
    });
  },
  destroy: function() {
    dojo.disconnect(this._zoomHandler);
  }
  
  
});
