/**
 * @name Table of Contents (TOC) widget for ArcGIS Server JavaScript API
 * @version 1.0
 * @author: Nianwei Liu (nianwei at gmail dot com)
 * @fileoverview
 * <p>A TOC (Table of Contents) widget for ESRI ArcGIS Server JavaScript API. The namespace is <code>agsjs</code></p>
 * @version 1.2
 */
// change log: 
// 2011-11-02: change css class name. use layer-sublayer-legend instead of service-layer-legend as names. inline style as default. standard maybe dropped.
// 2011-08-11: support for not showing legend or layer list; slider at service level config; removed style background.

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
  templateString: '<div class="agsjsTOCNode">' +
  '<div data-dojo-attach-point="rowNode" data-dojo-attach-event="onclick:_onClick">' +
  '<span data-dojo-attach-point="contentNode" class="agsjsTOCContent">' +
  '<input type="checkbox" data-dojo-attach-point="checkNode"/>' +
  '<img src="${_blankGif}" alt="" data-dojo-attach-point="iconNode" />' +
  '<span data-dojo-attach-point="labelNode">' +
  '</span></span></div>' +
  '<div data-dojo-attach-point="containerNode" style="display: none;"> </div></div>',
  layer: null,
  subLayer: null,
  legend: null,
  layerTOC: null,
  constructor: function(params, srcNodeRef) {
    dojo.mixin(this, params);
  },
  // extension point. called automatically after widget DOM ready.
  postCreate: function() {
    dojo.style(this.rowNode, 'paddingLeft', '' + this.layerTOC.toc.indentSize * this.layerTOC._currentIndent + 'px');
    // using the availability of certain property to decide what kind of node to create
    var data = null;
    var blank = this.iconNode.src;
    if (this.legend) {
      data = this.legend;
      this._createLegendNode(this.legend);
    } else if (this.subLayer) {
      data = this.subLayer;
      this._createSubLayerNode(this.subLayer);
      this._adjustToState();
    } else if (this.layer) {
      data = this.layer;
      this._createLayerNode(this.layer);
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
    // if it is a group subLayer and no child subLayer is visible, then collapse
    if (data._subLayerInfos) {
      var noneVisible = true;
      dojo.every(data._subLayerInfos, function(info) {
        if (info.visible) {
          noneVisible = false;
          return false;
        }
        return true;
      });
      if (noneVisible) 
        show = false;
    }
    
    if (data.collapsed) 
      show = false;
    if (this.iconNode && this.iconNode.src == blank) {
      dojo.addClass(this.iconNode, 'dijitTreeExpando');
      dojo.addClass(this.iconNode, show ? 'dijitTreeExpandoOpened' : 'dijitTreeExpandoClosed');
    }
    if (this.containerNode) 
      dojo.style(this.containerNode, 'display', show ? 'block' : 'none');
    
    if (this.layerTOC.toc.style == 'inline' && this.iconNode && this.checkNode) {
      dojo.place(this.iconNode, this.checkNode, 'after');
    }
  },
  // root level node
  _createLayerNode: function(layer) {
    dojo.addClass(this.rowNode, 'agsjsTOCLayer');
    dojo.addClass(this.labelNode, 'agsjsTOCLayerLabel');
    
    var title = this.layerTOC.info.title;// || layer.id;
    layer.collapsed = this.layerTOC.info.collapsed;
    if (this.layerTOC.info.slider) {
      this.sliderNode = dojo.create('div', {
        'class': 'agsjsTOCSlider'
      }, this.rowNode, 'last');//
      this.slider = new dijit.form.HorizontalSlider({
        showButtons: false,
        value: layer.opacity * 100,
        intermediateChanges: true,
        //style: "width:100%;padding:0 20px 0 20px",
        tooltip: 'adjust transparency',
        onChange: function(value) {
          layer.setOpacity(value / 100);
        },
        layoutAlign: 'right'
      });
      this.slider.placeAt(this.sliderNode);
    }
    if (!this.layerTOC.info.noLayers) {
      this._createChildrenNodes(layer._tocInfos, 'subLayer');
    } else {
      dojo.style(this.iconNode, 'visibility', 'hidden');
    }
    this.labelNode.innerHTML = title;
  },
  // a layer inside a map service.
  _createSubLayerNode: function(subLayer) {
    // subLayer: layerInfo with nested subLayerInfos
    this.labelNode.innerHTML = subLayer.name;
    if (subLayer._subLayerInfos) {
      // not allowing group layer to check on/off for now.
      //dojo.destroy(this.checkNode);
      dojo.addClass(this.rowNode, 'agsjsTOCGroupLayer');
      dojo.addClass(this.labelNode, 'agsjsTOCGroupLayerLabel');
      if (this.layerTOC.info.showGroupCount) {
        this.labelNode.innerHTML = subLayer.name + ' (' + subLayer._subLayerInfos.length + ')';
      }
      this._createChildrenNodes(subLayer._subLayerInfos, 'subLayer');
    } else {
      dojo.addClass(this.rowNode, 'agsjsTOCSubLayer');
      dojo.addClass(this.labelNode, 'agsjsTOCSubLayerLabel');
      if (this.layer.tileInfo) {
        // can not check on/off for tiled
        dojo.destroy(this.checkNode);
        this.checkNode = null;
      }
      if (subLayer.renderer && !this.layerTOC.info.noLegend) {
        if (this.layerTOC.toc.style == 'inline' && subLayer.renderer.symbol) {
          this._setIconNode(subLayer.renderer, this.iconNode, this);
          dojo.destroy(this.containerNode);
          this.containerNode = null;
        } else if (subLayer.renderer instanceof esri.renderer.SimpleRenderer) {
          this._createChildrenNodes([subLayer.renderer], 'legend');
        } else {
          var rends = subLayer.renderer.infos;
          if (subLayer.renderer.defaultSymbol) {
            rends = [{
              symbol: subLayer.renderer.defaultSymbol,
              label: subLayer.renderer.defaultLabel,
              isDefault: true
             }].concat(rends);
          }
          this._createChildrenNodes(rends, 'legend');
        }
      } else if (subLayer.legends && !this.layerTOC.info.noLegend) {
        if (this.layerTOC.toc.style == 'inline' && subLayer.legends.length == 1) {
          this.iconNode.src = this._getLegendIconUrl(subLayer.legends[0]);
          dojo.destroy(this.containerNode);
          this.containerNode = null;
        } else {
          this._createChildrenNodes(subLayer.legends, 'legend');
        }
      } else {
        dojo.destroy(this.iconNode);
        this.iconNode = null;
        dojo.destroy(this.containerNode);
        this.containerNode = null;
      }
    }
    this.layerTOC._layerWidgets.push(this);
  },
  _createLegendNode: function(rendLeg) {
    //{label:, url: , imageData}
    // here we use a pre-defined rule: if there is a definition expression we will make this subLayer's unique value on/off
    // note, there is a bug in ArcGIS server (as of 10.01) if the service expession has "OR", the request expression has no effect 
    // unless the service expression is enclosed with "()"
    // you can put a bugus "1=1" expression to flag this layer for definition operation.
    rendLeg.visible = false; 
    if (this.subLayer && this.subLayer.definitionExpression) {
      // for now only support unique
      if (this.subLayer.renderer && this.subLayer.renderer instanceof esri.renderer.UniqueValueRenderer) {
        if (!rendLeg.isDefault && this.layerTOC.toc.style == 'inline') {
          rendLeg.visible = true; 
        }
      }
    }
    if (!rendLeg.visible) {
      dojo.style(this.checkNode, 'visibility', 'hidden');
    }
    dojo.destroy(this.containerNode);
    dojo.addClass(this.labelNode, 'agsjsTOCLegendLabel');
    this._setIconNode(rendLeg, this.iconNode, this);
    this.labelNode.appendChild(document.createTextNode(rendLeg.label));
    if (rendLeg.value) {
      dojo.attr(this.labelNode, "datavalue", rendLeg.value);
    }
  },
  // set url or replace node
  _setIconNode: function(rendLeg, iconNode, tocNode) {
    if (rendLeg.url) {
      iconNode.src = this._getLegendIconUrl(rendLeg);
    } else if (rendLeg.symbol) {
      if (rendLeg.symbol.url) {
        iconNode.src = this._getLegendIconUrl(rendLeg.symbol);
        if (rendLeg.symbol.width && rendLeg.symbol.height) {
          this.iconNode.width = rendLeg.symbol.width;
          this.iconNode.height = rendLeg.symbol.height;
        }
      } else {
        var sym = this._createSymbol(rendLeg.symbol);
        dojo.place(sym, iconNode, 'replace');
        tocNode.iconNode = sym;
      }
    }
  },
  _createSymbol: function(symbol) {
  
    var w = this.layerTOC.toc.swatchSize[0], h = this.layerTOC.toc.swatchSize[1];
    
    if (symbol.width && symbol.height) {
      w = symbol.width;
      h = symbol.height;
    }
    var node = dojo.create('span', {
      style: "width:" + w + ";height:" + h
    });
    var mySurface = dojox.gfx.createSurface(node, w, h);
    var descriptors = esri.symbol.getShapeDescriptors(symbol);
    var shape = mySurface.createShape(descriptors.defaultShape).setFill(descriptors.fill).setStroke(descriptors.stroke);
    shape.applyTransform({
      dx: w / 2,
      dy: h / 2
    });
    return node;
  },
  _getLegendIconUrl: function(legend) {
    var src = legend.url;
    if (src.indexOf('data') == -1) {
      if (!dojo.isIE && legend.imageData && legend.imageData.length > 0) {
        src = "data:image/png;base64," + legend.imageData;
      } else {
        if (src.indexOf('http') !== 0) {
          // resolve relative url
          src = this.layer.url + '/' + this.subLayer.id + '/images/' + src;
        }
      }
    }
    return src;
  },
  _createChildrenNodes: function(children, type) {
    this.layerTOC._currentIndent++;
    dojo.forEach(children, function(child) {
      var params = {
        layerTOC: this.layerTOC,
        layer: this.layer,
        subLayer: this.subLayer,
        legend: this.legend
      };
      params[type] = child;
      params.data = child;
      var node = new agsjs.dijit._TOCNode(params);
      node.placeAt(this.containerNode);
    }, this);
    this.layerTOC._currentIndent--;
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
      if (this.toggler) {
        if (dojo.hasClass(this.iconNode, 'dijitTreeExpandoOpened')) {
          this.toggler.show();
        } else {
          this.toggler.hide();
        }
      }
    }
  },
  _adjustToState: function() {
    if (this.subLayer) {
      var scale = esri.geometry.getScale(this.layerTOC.toc.map);
      var outScale = (this.subLayer.maxScale != 0 && scale < this.subLayer.maxScale) || (this.subLayer.minScale != 0 && scale > this.subLayer.minScale);
      if (outScale) {
        dojo.addClass(this.domNode, 'agsjsTOCOutOfScale');
      } else {
        dojo.removeClass(this.domNode, 'agsjsTOCOutOfScale');
      }
      if (this.checkNode) {
        this.checkNode.disabled = outScale;
        this.checkNode.checked = this.subLayer.visible;
      }
    }
  },
  _onClick: function(evt) {
    var t = evt.target;
    if (t == this.checkNode) {
      if (this.legend) {
        // this is a check legend
        var renderer = this.subLayer.renderer;
        this.legend.visible = this.checkNode.checked;
        var def = [];
        if (renderer instanceof esri.renderer.UniqueValueRenderer) {
          // find type of attribute field and decide if need quote
          var q = '';
          if (this.subLayer.fields) {
            dojo.forEach(this.subLayer.fields, function(field) {
              if (field.name == renderer.attributeField) {
                switch (field.type) {
                case 'esriFieldTypeString':
                  q = '\'';
                }
              }
            });
          }
          dojo.forEach(renderer.infos, function(info) {
            if (info.visible) {
              /*var seg = '(' + renderer.attributeField;
               if (info.value) {
               seg += '=' + q+info.value+q;
               }
               seg += ')';
               def.push(seg)*/
              def.push(q + info.value + q);
            }
            
          }, this);
          if (def.length == renderer.infos.length) {
            this.subLayer._definitionExpression = '';
          } else if (def.length == 0) {
            // nothing is checked, so we set the sub layer off
            this.subLayer.visible = false;
            // even if the layer is checked on, if there is no sub type on, it should not show anything.
            this.subLayer._definitionExpression = '1=2';
          } else {
            this.subLayer.visible = true;
            this.subLayer._definitionExpression = renderer.attributeField + ' IN (' + def.join(',') + ')';// def.join(' OR ');
          }
        }
        
        this.layer.setVisibleLayers(this._getVisibleLayers(), false);
        this.layer.setLayerDefinitions(this._getLayerDefs(), false);
        this.layerTOC._refreshLayer();
      } else if (this.subLayer) {
        this.subLayer.visible = this.checkNode.checked;
        this.layer.setLayerDefinitions(this._getLayerDefs(), false);
        this.layer.setVisibleLayers(this._getVisibleLayers(), false);
        this.layerTOC._refreshLayer();
        if (this.subLayer.subLayerIds) {
          // give a visual clue on sublayers if group is on/off
          if (this.checkNode.checked) {
            dojo.addClass(this.containerNode, 'agsjsTOCGroupOn');
            dojo.removeClass(this.containerNode, 'agsjsTOCGroupOff');
          } else {
            dojo.addClass(this.containerNode, 'agsjsTOCGroupOff');
            dojo.removeClass(this.containerNode, 'agsjsTOCGroupOn');
          }
        }
      } else if (this.layer) {
        this.layer.setVisibility(this.checkNode.checked);
      }
      if (this.layerTOC.toc.style == 'inline') {
        this._toggleContainer(this.checkNode.checked);
      }
      
    } else if (t == this.iconNode) {
      this._toggleContainer();
    }
  },
  _getVisibleLayers: function() {
    var vis = [];
    dojo.forEach(this.layer.layerInfos, function(layerInfo) {
      if (layerInfo.subLayerIds) {
        // if a group subLayer is set to vis, all sub subLayer will be drawn regardless it's sublayer status
        return;
      } else if (layerInfo.visible) {
        if (!layerInfo._parentLayerInfo || layerInfo._parentLayerInfo.visible) {
          vis.push(layerInfo.id);
        }
      }
      
    });
    if (vis.length === 0) {
      vis.push(-1);
    }
    return vis;
  },
  _getLayerDefs: function() {
    var defs = [];
    dojo.forEach(this.layer.layerInfos, function(layerInfo, i) {
      if (layerInfo._definitionExpression) {
        defs[i] = layerInfo._definitionExpression;
      }
    });
    return defs;
  }
  
});

dojo.declare('agsjs.dijit._LayerTOC', [dijit._Widget], {
  _currentIndent: 0,
  layer: null,
  _layerWidgets: [],
  constructor: function(params, srcNodeRef) {
    this.layer = params.layer;
    this.toc = params.toc;
    this.info = params.info || {};
   },
  // extenstion point called by framework
  postCreate: function() {
    this._getLayerInfos();
  },
  // retrieve sublayer/legend data
  _getLayerInfos: function(){
    if ((this.layer instanceof (esri.layers.ArcGISDynamicMapServiceLayer) ||
    this.layer instanceof (esri.layers.ArcGISTiledMapServiceLayer))) {
      if (this.info.title === undefined) {
        var start = this.layer.url.toLowerCase().indexOf('/rest/services/');
        var end = this.layer.url.toLowerCase().indexOf('/mapserver', start);
        this.info.title = this.layer.url.substring(start + 15, end);
      }
    } else {
      this.info.noLayers = true;
    }
    if (!this.layer.url || this.info.noLegend || this.info.noLayers) {
      this._createLayerTOC();
    } else {
      // note: renderer info only has simple symbols. If the map layer has complex symbol,
      // the image returned from /legend is better than create from renderer.
      // however, /legend does not have field/value information.
      if (this.info.mode == 'legend') {
        this._getLegendInfo();
      } else if (this.info.mode == 'layers') {
        this._getLayersInfo();
      } else {
        this._getLayersInfo();
        this._getLegendInfo();
      }
      
    }
  },
  _getLegendInfo: function() {
    var url = '';
    if (this.layer.version >= 10.01) {
      url = this.layer.url + '/legend';
    } else {
      url = 'http://www.arcgis.com/sharing/tools/legend';
      var i = this.layer.url.toLowerCase().indexOf('/rest/');
      var soap = this.layer.url.substring(0, i) + this.layer.url.substring(i + 5);
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
      error: dojo.hitch(this, this._createLayerTOC)
    });
  },
  _getLayersInfo: function() {
    var url = this.layer.url + '/layers';
    var handle = esri.request({
      url: url,
      content: {
        f: "json"
      },
      callbackParamName: 'callback',
      handleAs: 'json',
      load: dojo.hitch(this, this._processLayersInfo),
      error: dojo.hitch(this, this._createLayerTOC)
    });
  },
  _processLegendError: function(err) {
    console.log(err);
    this._createLayerTOC();
  },
  _processLegendInfo: function(json) {
    this.layer._legendResponse = json;
    if (this.info.mode == 'legend' || this.layer._layersResponse) {
      this._createLayerTOC();
    }
  },
  _processLayersInfo: function(json) {
    this.layer._layersResponse = json;
    if (this.info.mode == 'layers' || this.layer._legendResponse) {
      this._createLayerTOC();
    }
  },
  _createLayerTOC: function() {
    var layer = this.layer;
    if (!layer._tocInfos) {
      // create a lookup map, key=layerId, value=LayerInfo
      // generally id = index, this is to assure we find the right subLayer by ID
      // note: not all layers have an entry in legend response.
      var layerLookup = {};
      dojo.forEach(layer.layerInfos, function(layerInfo) {
        layerLookup['' + layerInfo.id] = layerInfo;
        // used for later reference.
        layerInfo.visible = layerInfo.defaultVisibility;
      });
      // attach renderer info to layerInfo
      if (layer._layersResponse) {
        dojo.forEach(layer._layersResponse.layers, function(layInfo) {
          var layerInfo = layerLookup['' + layInfo.id];
          if (layerInfo) {
            dojo.mixin(layerInfo, layInfo);// push fields info
            layerInfo.definitionExpression = layInfo.definitionExpression;
            if (layInfo.drawingInfo && layInfo.drawingInfo.renderer) {
              layerInfo.renderer = esri.renderer.fromJson(layInfo.drawingInfo.renderer);
            }
          }
        });
      }
      
      // attached legend Info to subLayer info
      if (layer._legendResponse) {
        dojo.forEach(layer._legendResponse.layers, function(legInfo) {
          var layerInfo = layerLookup['' + legInfo.layerId];
          if (layerInfo && legInfo.legend) {
            layerInfo.legends = legInfo.legend;
            // merge legend symbol to renderers. Ideally the REST API already does that, but
            if (layerInfo.renderer) {
              if (layerInfo.renderer.infos) {
                // assume renderer's infos same order as legends, avoid nested loop.
                var offset = 0;
                if (layerInfo.renderer.defaultSymbol) {
                  offset = 1;
                  dojo.mixin(layerInfo.renderer.defaultSymbol, legInfo.legend[0]);
                }
                dojo.forEach(layerInfo.renderer.infos, function(info, i) {
                  dojo.mixin(info.symbol, legInfo.legend[i + offset]);
                });
              } else {
                // simple, merge url, imageData, contentType. note merged to renderer, not renderer symbol, avoid loss data.
                dojo.mixin(layerInfo.renderer.symbol, legInfo.legend[0]);
              }
            }
          }
        });
      }
      // nest subLayer Infos
      dojo.forEach(layer.layerInfos, function(layerInfo) {
        if (layerInfo.subLayerIds) {
          var subLayerInfos = [];
          dojo.forEach(layerInfo.subLayerIds, function(id, i) {
            subLayerInfos[i] = layerLookup[id];
            subLayerInfos[i]._parentLayerInfo = layerInfo;
          });
          layerInfo._subLayerInfos = subLayerInfos;
        }
      });
      //finalize the tree structure in _tocInfos, skipping all sublayers because they were nested already.
      var tocInfos = [];
      dojo.forEach(layer.layerInfos, function(layerInfo) {
        if (layerInfo.parentLayerId == -1) {
          tocInfos.push(layerInfo);
        }
      });
      layer._tocInfos = tocInfos;
    }
    this._layerNode = new agsjs.dijit._TOCNode({
      layerTOC: this,
      layer: layer
    });
    this._layerNode.placeAt(this.domNode);
    
    this._visHandler = dojo.connect(layer, "onVisibilityChange", this, "_adjustToState");
    // this will make sure all TOC linked to a Map synchronized.
    this._visLayerHandler = dojo.connect(layer, "setVisibleLayers", this, "_adjustToState");
  },
  _refreshLayer: function() {
    var layer = this.layer;
    if (this._refreshTimer) {
      window.clearTimeout(this._refreshTimer);
      this._refreshTimer = null;
    }
    this._refreshTimer = window.setTimeout(function() {
      layer.setVisibleLayers(layer.visibleLayers);
    }, 1000);
  },
  _adjustToState: function() {
    this._layerNode.checkNode.checked = this.layer.visible;
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
  swatchSize: [30, 30],
  style: 'inline',
  layerInfos: null,
  slider: false,
  
  /**
   * @name TOCLayerInfo
   * @class This is an object literal that specify the options for each map layer subLayer.
   * @property {esri.layers.ArcGISTiledMapServiceLayer | esri.layers.ArcGISDynamicMapServiceLayer} layer: ArcGIS Server subLayer.
   * @property {string} [title] title. optional. If not specified, layer name is used.
   * @property {Boolean} [slider] whether to show slider for each layer to adjust transparency. default is false.
   * @property {Boolean} [noLegend] whether to skip the legend, and only display layers. default is false.
   * @property {Boolean} [collapsed] whether to collapsed the layer subLayer at beginning. default is false, which means expand if visible, collapse if not.
   *
   */
  /**
   * @name TOCOptions
   * @class This is an object literal that specify the option to construct a {@link TOC}.
   * @property {esri.Map} [map] the map instance. required.
   * @property {Object[]} [layerInfos] a subset of layers in the map to show in TOC. each object is a {@link TOCLayerInfo}
   * @property {Number} [indentSize] indent size of tree nodes. default to 18.
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
    this._layerWidgets = [];
    if (!this.layerInfos) {
      this.layerInfos = [];
      for (var i = this.map.layerIds.length - 1; i >= 0; i--) {
        var layer = this.map.getLayer(this.map.layerIds[i]);
        // these properties defined in BasemapControl widget.
        // since the basemap control add/remove them requently, it's better not to show.
        if (!layer._isBaseMap && !layer._isReference) {
          this.layerInfos.push({
            layer: layer
          });
        }
        
      }
    }
    
    
    
  },
  // extension point
  postCreate: function() {
    // do we have any layerInfos without layer created?
    var createdLayers = [];
    dojo.forEach(this.layerInfos, function(layerInfo){
      if (!layerInfo.layer){
        layerInfo.layer = this._createLayer(layerInfo);
        createdLayers.push(layerInfo.layer);
      }
    }, this);
    if (createdLayers.length ==0){
      this._createTOC();
    } else {
      dojo.connect(this.map, 'onLayersAddResult', this, function(results) {
        this._createTOC();
      });
      this.map.addLayers(createdLayers);
    }
   
  },
  _createLayer: function(lay) {
    var layer = null;
    var type = lay.type || 'ArcGISDynamic';
    switch (type) {
      
      case 'ArcGISDynamic':
        layer = new esri.layers.ArcGISDynamicMapServiceLayer(lay.url, lay);
        break;
      }
    
    return layer;
  },
  _createTOC: function() {
    for (var i = 0, c = this.layerInfos.length; i < c; i++) {
      // attach a title to layer subLayer itself
      var layer = this.layerInfos[i].layer;
      var svcTOC = new agsjs.dijit._LayerTOC({
        layer: layer,
        info: this.layerInfos[i],
        toc: this
      });
      this._layerWidgets.push(svcTOC);
      svcTOC.placeAt(this.domNode);
    }
    this._zoomHandler = dojo.connect(this.map, "onZoomEnd", this, "_adjustToState");
  },
  _adjustToState: function() {
    dojo.forEach(this._layerWidgets, function(layerWidget) {
      layerWidget._adjustToState();
    });
  },
  destroy: function() {
    dojo.disconnect(this._zoomHandler);
  }
  
  
});
