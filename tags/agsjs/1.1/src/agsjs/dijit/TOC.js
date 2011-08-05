/**
 * @name Table of Contents (TOC) widget for ArcGIS Server JavaScript API 
 * @version 1.0
 * @author: Nianwei Liu (nianwei at gmail dot com)
 * @fileoverview
 * <p>A TOC (Table of Contents) widget for ESRI ArcGIS Server JavaScript API. The namespace is <code>agsjs</code></p>
 */
/*global dojo esri*/
// reference: http://dojotoolkit.org/reference-guide/quickstart/writingWidgets.html

dojo.provide('agsjs.dijit.TOC');
dojo.require('dijit._Widget');
dojo.require('dijit._Templated');
dojo.require('dijit.form.Slider');

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
  templateString:'<div class="agsTOCNode">'+
    '<div data-dojo-attach-point="rowNode" data-dojo-attach-event="onclick:_onClick">'+
         '<span data-dojo-attach-point="contentNode" class="agsTOCContent">'+
          '<img src="${_blankGif}" alt="" data-dojo-attach-point="iconNode" />'+
          '<input type="checkbox" data-dojo-attach-point="checkNode"/>'+
          '<span data-dojo-attach-point="labelNode">'+
          '</span></span></div>'+
          '<div data-dojo-attach-point="containerNode" style="display: none;"> </div></div>',
  constructor: function(params, srcNodeRef) {
    // no need to define domNode in templates 
    this.service = params.service;
    this.layer = params.layer;
    this.legend = params.legend;
    this.serviceTOC = params.serviceTOC;
  },
  // extension point. called automatically after widget DOM ready.
  postCreate: function() {
    dojo.style(this.rowNode, 'paddingLeft', '' + this.serviceTOC.toc.indentSize * this.serviceTOC._currentIndent + 'px');
    // using the availability of certain property to decide what kind of node to create
    var data = null;
    var title = ''
    var blank = this.iconNode.src;
    if (this.legend) {
      data = this.legend;
      this._createLegendNode(this.legend);
      title = data.label;
    } else if (this.layer) {
      data = this.layer;
      this._createLayerNode(this.layer);
      title = data.name;
      this._adjustToState();
    } else if (this.service) {
      data = this.service;
      this._createServiceNode(this.service);
      dojo.forEach(this.serviceTOC.toc.layerInfos, function(info) {
        if (data == info.layer) {
          title = info.title;
          if (!title) {
            var start = data.url.toLowerCase().indexOf('/rest/services/');
            var end = data.url.toLowerCase().indexOf('/mapserver', start);
            title = data.url.substring(start + 15, end);
          }
        }
      })
      
    }
    this.labelNode.innerHTML = title;
    if (this.checkNode) {
      this.checkNode.checked = data.visible;
    }
    if (this.iconNode.src == blank) {
      dojo.addClass(this.iconNode, 'dijitTreeExpando');
      dojo.addClass(this.iconNode, data.visible ? 'dijitTreeExpandoOpened' : 'dijitTreeExpandoClosed');
    }
    dojo.style(this.containerNode, 'display', data.visible ? 'block' : 'none');
    if (this.serviceTOC.toc.style == 'inline') {
      dojo.place(this.iconNode, this.checkNode, 'after');
    }
  },
  _createServiceNode: function(service) {
    dojo.addClass(this.rowNode, 'agsTOCService');
    dojo.addClass(this.labelNode, 'agsTOCServiceLabel');
    if (this.serviceTOC.toc.slider) {
      this.slider = new dijit.form.HorizontalSlider({
        showButtons: false,
        value: service.opacity * 100,
        intermediateChanges: true,
        style: "width:100%;padding:0 20px 0 20px",
        tooltip: 'adjust transparency',
        onChange: function(value) {
          service.setOpacity(value / 100);
        },
        layoutAlign: 'right'
      });
      
      this.slider.placeAt(this.rowNode, 'last');
    }
    
    this._createChildrenNodes(service.tocInfos, 'layer');
  },
  _createLayerNode: function(layer) {
    // layer: layerInfo with nested subLayerInfos
    if (layer.subLayerInfos) {
      dojo.destroy(this.checkNode);
      dojo.addClass(this.rowNode, 'agsTOCGroup');
      dojo.addClass(this.labelNode, 'agsTOCGroupLabel');
      this._createChildrenNodes(layer.subLayerInfos, 'layer');
    } else {
      dojo.addClass(this.rowNode, 'agsTOCLayer');
      dojo.addClass(this.labelNode, 'agsTOCLayerLabel');
      if (this.service instanceof esri.layers.TiledMapServiceLayer){
        dojo.destroy(this.checkNode);
      }
      if (layer.legends) {
        if (this.serviceTOC.toc.style == 'inline' && layer.legends.length == 1) {
          this.iconNode.src = this._getLegendIconUrl(layer.legends[0]);
          dojo.destroy(this.containerNode);
        } else {
          this._createChildrenNodes(layer.legends, 'legend');
        }
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
      dojo.style(this.containerNode, 'display', dojo.hasClass(this.iconNode, 'dijitTreeExpandoOpened') ? 'block' : 'none');
    }
  },
  _adjustToState: function() {
    if (this.layer) {
      this.checkNode.checked = this.layer.visible;
      var scale = esri.geometry.getScale(this.serviceTOC.toc.map);
      var outScale = (this.layer.maxScale != 0 && scale < this.layer.maxScale) || (this.layer.minScale != 0 && scale > this.layer.minScale);
      if (outScale) {
        dojo.addClass(this.domNode, 'agsTOCOutScale');
      } else {
        dojo.removeClass(this.domNode, 'agsTOCOutScale');
      }
      if (this.checkNode) {
          this.checkNode.disabled = outScale;
      }
      if (this.serviceTOC.toc.hideOutScale){
        dojo.style(this.domNode, 'display', outScale?'none':'block');
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
  },
  postCreate: function() {
    if (this.service.legendResponse) {
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
    this._serviceNode = new agsjs.dijit._TOCNode({
      serviceTOC: this,
      service: service
    });
    this._serviceNode.placeAt(this.domNode);
    this._visHandler = dojo.connect(service, "onVisibilityChange", this, "_adjustToState");
    // this will make sure all TOC linked to a Map synchronized.
    this._visLayerHandler = dojo.connect(service, "setVisibleLayers", this, "_adjustToState");
    
  },
  _refreshLayer: function() {
    var service = this.service;
    if (this._refreshTimer) {
      window.clearTimeout(this._refreshTimer);
      this._refreshTimer = null;
    }
    this._refreshTimer = window.setTimeout(function() {
      service.setVisibleLayers(service.visibleLayers);
    }, 2000);
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
  }
});

dojo.declare("agsjs.dijit.TOC", [dijit._Widget], {
  /**
   * @name TOCOptions
   * @class This is an object literal that specify the option to construct a {@link TOC}.
   * @property {esri.Map} [map] the map instance. required.
   * @property {Object[]} [layerInfos] a subset of layers in the map to show in TOC. Each object has two
   *                      property: layer (only ArcGISTiledMapServiceLayer,ArcGISDynamicMapServiceLayer supported)
   *                      title: title. if not specified, service name is used.
   * @property {Number} [indentSize] indent size of tree nodes. default to 18.
   * @property {String} [style] how legend swatches should be positioned. <code>inline|standard</code>. See example docs for details.
   * @property {Boolean} [slider] whether to show slider for each service to adjust transparency. default is false.
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
    this.map = params.map;
    this.layerInfos = params.layerInfos;// TODO: make it optional
    this.indentSize = params.indentSize || 18;
    this.style = params.style || 'standard';//inline|
    this.slider = params.slider || false;
    this._serviceWidgets = [];
    if (!this.layerInfos) {
      this.layerInfos = [];
      for (var i = this.map.layerIds.length - 1; i > 0; i--) {
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
