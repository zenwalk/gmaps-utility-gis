/**
 * a map type class that supports show/hide/opacity
 * based on
 * http://google-maps-utility-library-v3.googlecode.com/svn/trunk/arcgis/
 */
(function() {
  function HidableImageMapType(/** @type {google.maps.ImageMapTypeOptions} */opt_typeOpts) {
    opt_typeOpts = opt_typeOpts || {};
    for (var x in opt_typeOpts) {
      if (opt_typeOpts.hasOwnProperty(x)) {
        this[x] = opt_typeOpts[x];
      }
    }
    this.tiles_ = {};
  }
  
  /**
   * Get a tile for given tile coordinates Returns a tile for the given tile coordinate (x, y) and zoom level.
   * This tile will be appended to the given ownerDocument.
   * @param {Point} tileCoord
   * @param {Number} zoom
   * @return {Node}
   */
  HidableImageMapType.prototype.getTile = function(tileCoord, zoom, ownerDocument) {
    var div = ownerDocument.createElement('div');
    var tileId = '_' + tileCoord.x + '_' + tileCoord.y + '_' + zoom;
    if (zoom <= (this.maxZoom || 20) && zoom >= (this.minZoom || 0)) {
      var url = this.getTileUrl(tileCoord, zoom);
      if (url) {
        var img = ownerDocument.createElement(document.all ? 'img' : 'div');//IE does not like img
        img.style.border = '0px none';
        img.style.margin = '0px';
        img.style.padding = '0px';
        img.style.overflow = 'hidden';
        img.style.position = 'absolute';
        img.style.top = '0px';
        img.style.left = '0px';
        img.style.width = '' + this.tileSize.width + 'px';
        img.style.height = '' + this.tileSize.height + 'px';
        if (document.all) {
          img.src = url;
        } else {
          img.style.backgroundImage = 'url(' + url + ')';
        }
        div.appendChild(img);
        if (this.opacity !== undefined) {
          this.setNodeOpacity_(img, this.opacity);
        }
      }
    }
    this.tiles_[tileId] = div;
    div.setAttribute('tid', tileId);
    return div;
  };
  /**
   * Release tile and cleanup
   * @param {Node} node
   */
  HidableImageMapType.prototype.releaseTile = function(node) {
    if (node.getAttribute('tid')) {
      var tileId = node.getAttribute('tid');
      if (this.tiles_[tileId]) {
        delete this.tiles_[tileId];
      }
    }
  };
  /**
   * Set Opactity
   * @param {Number} op
   */
  HidableImageMapType.prototype.setOpacity = function(op) {
    this.opacity = op;
    var tiles = this.tiles_;
    for (var x in tiles) {
      if (tiles.hasOwnProperty(x)) {
        var nodes = tiles[x].childNodes;
        for (var i = 0; i < nodes.length; i++) {
          this.setNodeOpacity_(nodes[i], op);
        }
      }
    }
  };
  HidableImageMapType.prototype.setNodeOpacity_ = function(node, op) {
    op = Math.min(Math.max(op, 0), 1);
    var st = node.style;
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
  HidableImageMapType.prototype.showHide_ = function(vis) {
    var tiles = this.tiles_;
    for (var x in tiles) {
      if (tiles.hasOwnProperty(x)) {
        tiles[x].style.visibility = vis ? 'visible' : 'hidden';
      }
    }
  };
  HidableImageMapType.prototype.show = function() {
    this.showHide_(true);
  };
  HidableImageMapType.prototype.hide = function(vis) {
    this.showHide_(false);
  };
  window.gmaps = window.gmaps || {};
  window.gmaps.HidableImageMapType = HidableImageMapType;
  
})();

