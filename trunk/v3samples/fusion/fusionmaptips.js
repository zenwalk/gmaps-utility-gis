
if (!google || !google.loader) {
  document.write('<' + 'script type="text/javascript" src="http://www.google.com/jsapi"></' + 'script>');
}
if (!google.visualization) {
  document.write('<' + 'script type="text/javascript"> google.load(\'visualization\', \'1\', {});</' + 'script>');
}

(function() {
  function FusionTipOverlay() {
    this.latlng_ = null;
    this.text_ = null;
    this.div_ = null;
    this.cursorNode = null;
  }
  FusionTipOverlay.prototype = new google.maps.OverlayView();
  FusionTipOverlay.prototype.onAdd = function() {
    var div = document.createElement('DIV');
    div.style.border = "1px solid black";
    div.style.position = "absolute";
    div.style.whiteSpace = "nowrap";
    div.style.backgroundColor = "#ffffcc";
    div.style.fontSize = 'x-small';
    this.div_ = div;
    var panes = this.getPanes();
    this.cursorNode = panes.overlayLayer.parentNode;
    panes.floatPane.appendChild(div);
    google.maps.event.trigger(this, 'add');
  };
  FusionTipOverlay.prototype.draw = function() {
    var overlayProjection = this.getProjection();
    if (this.latlng_) {
      var sw = overlayProjection.fromLatLngToDivPixel(this.latlng_);
      var div = this.div_;
      div.style.left = sw.x + 'px';
      div.style.top = (sw.y - 20) + 'px';
      div.innerHTML = this.text_;
    }
    
  };
  FusionTipOverlay.prototype.onRemove = function() {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
  };
  FusionTipOverlay.prototype.hide = function() {
    if (this.div_) {
      this.div_.style.visibility = "hidden";
    }
  };
  FusionTipOverlay.prototype.show = function(latlng, text) {
    if (this.div_) {
      this.div_.style.visibility = "visible";
    }
    if (latlng || text) {
      this.latlng_ = latlng || this.latlng_;
      this.text_ = text;
      this.draw();
    }
  };
  FusionTipOverlay.prototype.createQueryBounds = function(latlng, tolerance) {
    var prj = this.getProjection();
    var px = prj.fromLatLngToDivPixel(latlng);
    px.x -= tolerance;
    px.y += tolerance;
    var sw = prj.fromDivPixelToLatLng(px);
    px.x += tolerance * 2;
    px.y -= tolerance * 2;
    var ne = prj.fromDivPixelToLatLng(px);
    return new google.maps.LatLngBounds(sw, ne);
  };
  google.maps.FusionTablesLayer.prototype.enableMapTips = function(opts) {
    // opts has query(FusionTablesQuery(from, select, geometry )), suppressMapTips(bool)
    opts = opts || {};
    var query = opts.query;
    var maptip = new FusionTipOverlay(null, null);
    var me = this;
    var currentLatLng = null;
    var currentCursor = null;
    var delayTimeout = null;
    google.maps.event.addListenerOnce(maptip, 'add', function() {
      me.mapmoveListener_ = google.maps.event.addListener(me.getMap(), 'mousemove', function(mevt) {
        currentLatLng = mevt.latLng;
      });
      me.showmaptipListener_ = google.maps.event.addListener(me, 'mouseover', function(fevt) {
        if (!opts.suppressMapTips && maptip && fevt.latLng && fevt.infoWindowHtml) {
          maptip.show(fevt.latLng, fevt.infoWindowHtml);
        }
      })
      me.mousemoveListener_ = google.maps.event.addDomListener(me.getMap().getDiv(), 'mousemove', function(evt) {
        var c = getStyle(maptip.cursorNode, 'cursor');
        if (c != currentCursor) {
          if (c == 'pointer') {
            if (!query) {
              google.maps.event.trigger(me, 'mouseover');
            } else {
              if (opts.delay ==0){
                queryFusion();
              } else {
                delayTimeout = window.setTimeout(queryFusion, opts.delay||300);
              }
            
            }
          } else if (currentCursor == 'pointer') {
            google.maps.event.trigger(me, 'mouseout');
            maptip.hide();
            if (delayTimeout!=null){
              window.clearTimeout(delayTimeout);
              delayTimeout = null;
            }
          }
          
          currentCursor = c;
        }
      });
    });
    maptip.setMap(this.getMap());
    this.maptipOverlay_ = maptip;
    
    
    //http://www.quirksmode.org/dom/getstyles.html
    function getStyle(el, styleProp) {
      if (el.style[styleProp]) {
        return el.style[styleProp];
      } else if (el.getComputedStyle) {
        return el.getComputedStyle()[styleProp];
      } else if (el.currentStyle) {
        return el.currentStyle[styleProp];
      } else if (window.getComputedStyle) {
        return document.defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
      }
      return null;
    }
    
    function queryFusion() {
      var latlng = currentLatLng;
      var bounds = maptip.createQueryBounds(latlng, opts.tolerance || 6);
      var swhere = "ST_INTERSECTS(" + query.geometry + ",RECTANGLE(LATLNG(" + bounds.getSouthWest().lat() + "," + bounds.getSouthWest().lng() + "),LATLNG(" + bounds.getNorthEast().lat() + "," + bounds.getNorthEast().lng() + ")))";
      var queryText = encodeURIComponent("SELECT " + query.select + " FROM " + query.from + " WHERE " + swhere);
      var vquery = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq=' + queryText);
      vquery.send(function(response) {
        var data = response.getDataTable();
        html = "";
        var row = {};
        if (data) {
          var numRows = data.getNumberOfRows();
          var numCols = data.getNumberOfColumns();
          if (numRows > 0) {
            for (i = 0; i < numCols; i++) {
              html += data.getValue(0, i) + "<br/>";
              var cell = {
                columnName: data.getColumnLabel(i),
                value: data.getValue(0, i)
              };
              row[data.getColumnLabel(i)] = cell;
            }
          }
          
        } else {
          if (console) 
            console.log('no data');
        }
        google.maps.event.trigger(me, 'mouseover', {
          infoWindowHtml: html,
          latLng: latlng,
          row: row
        });
      });
    }
  };
  google.maps.FusionTablesLayer.prototype.disableMapTips = function() {
    this.maptipOverlay_.setMap(null);
    this.maptipOverlay_ = null;
    google.maps.event.removeListener(this.mapmoveListener_);
    this.mapmoveListener_ = null;
    google.maps.event.removeListener(this.mousemoveListener_);
    this.mousemoveListener_ = null;
    google.maps.event.removeListener(this.showmaptipListener_);
    this.showmaptipListener_ = null;
  };
  
  
})();
