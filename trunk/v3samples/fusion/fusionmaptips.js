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
    this.cursorNode = panes.overlayLayer;//.parentNode;
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
  //http://www.quirksmode.org/js/findpos.html
  function findElPos(obj) {
    var curleft = 0;
    var curtop = 0;
    if (obj.offsetParent) {
      do {
        curleft += obj.offsetLeft;
        curtop += obj.offsetTop;
        obj = obj.offsetParent;
      } while (obj != null);
    }
    return {
      x: curleft,
      y: curtop
    };
  }
  function findMousePos(e) {
    var posx = 0;
    var posy = 0;
    if (!e) 
      var e = window.event;
    if (e.pageX || e.pageY) {
      posx = e.pageX;
      posy = e.pageY;
    } else if (e.clientX || e.clientY) {
      posx = e.clientX + document.body.scrollLeft +
      document.documentElement.scrollLeft;
      posy = e.clientY + document.body.scrollTop +
      document.documentElement.scrollTop;
    }
    // posx and posy contain the mouse position relative to the document
    // Do something with this information
    return {
      x: posx,
      y: posy
    };
  }
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
    var scriptid = 0;
    
  google.maps.FusionTablesLayer.prototype.enableMapTips = function(opts) {
    // opts has query(FusionTablesQuery(from, select, geometry )), suppressMapTips(bool)
    opts = opts || {};
    var query = opts.query;
    var maptip = new FusionTipOverlay(null, null);
    var me = this;
    var currentLatLng = null;
    var currentCursor = null;
    var delayTimeout = null;
    //var rect;
    var containerPos = findElPos(me.getMap().getDiv());
    
    google.maps.event.addListenerOnce(maptip, 'add', function() {
      
      me.showmaptipListener_ = google.maps.event.addListener(me, 'mouseover', function(fevt) {
        if (!opts.suppressMapTips && maptip && fevt.latLng && fevt.infoWindowHtml) {
          maptip.show(fevt.latLng, fevt.infoWindowHtml);
        }
      })
      // map.mousemove may not fire consistently when fusionlayer is poly, so we calc latlng from DOM events
      me.mousemoveListener_ = google.maps.event.addDomListener(me.getMap().getDiv(), 'mousemove', function(evt) {
        var mousePos = findMousePos(evt);
        var containerPx = new google.maps.Point(mousePos.x - containerPos.x, mousePos.y - containerPos.y);
        currentLatLng = maptip.getProjection().fromContainerPixelToLatLng(containerPx);
        if (delayTimeout) {
          window.clearTimeout(delayTimeout);
          delayTimeout = null;
        }
        var c = getStyle(maptip.cursorNode, 'cursor');
        if (c != currentCursor && currentCursor == 'pointer') {
            google.maps.event.trigger(me, 'mouseout');
            maptip.hide();
        } else if (c == 'pointer') {
          // for polygons, features may change while cursor not.
           delayTimeout = window.setTimeout(queryFusion, opts.delay || 300);
        }
        currentCursor = c;
      });
    });
    maptip.setMap(this.getMap());
    this.maptipOverlay_ = maptip;
    
    
    
    function queryFusion() {
      var latlng = currentLatLng;
      var bounds = maptip.createQueryBounds(latlng, opts.tolerance || 6);
      var swhere = "ST_INTERSECTS(" + query.geometry + ",RECTANGLE(LATLNG(" + bounds.getSouthWest().lat() + "," + bounds.getSouthWest().lng() + "),LATLNG(" + bounds.getNorthEast().lat() + "," + bounds.getNorthEast().lng() + ")))";
      var queryText = encodeURIComponent("SELECT " + query.select + " FROM " + query.from + " WHERE " + swhere);
      if (google.visualization) {
        queryVisualization(latlng, queryText);
      } else {
        queryFusionJson(latlng, queryText);
      }
    }
    
    function queryVisualization(latlng, queryText) {
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
    //http://gmaps-samples.googlecode.com/svn/trunk/fusiontables/mouseover.html
    // undocumented unsupported method;
    function queryFusionJson(latlng, queryText) {
      var script = document.createElement('script');
      // Note that a simplified geometry and the NAME column are being requested
      var sid = scriptid++;
      script.setAttribute('src', 'http://www.google.com/fusiontables/api/query?sql=' + queryText + '&jsonCallback=ft' + sid);
      window['ft' + sid] = function(json) {
        processFusionJson(json, latlng);
        delete window['ft' + sid];
      };
      document.getElementsByTagName('head')[0].appendChild(script);
      
    }
    
    function processFusionJson(json, latlng) {
      //{table:{cols:[col1,col2], rows:[[val11,val12],[val21,val22]]}};
      var data = json.table;
      html = "";
      var row = {};
      if (data) {
        var numRows = data.rows.length;
        var numCols = data.cols.length;
        if (numRows > 0) {
          for (i = 0; i < numCols; i++) {
            html += data.rows[0][i] + "<br/>";
            var cell = {
              columnName: data.cols[i],
              value: data.rows[0][i]
            };
            row[data.cols[i]] = cell;
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
      
    }
    
  };
  google.maps.FusionTablesLayer.prototype.disableMapTips = function() {
    this.maptipOverlay_.setMap(null);
    this.maptipOverlay_ = null;
    google.maps.event.removeListener(this.mousemoveListener_);
    this.mousemoveListener_ = null;
    google.maps.event.removeListener(this.showmaptipListener_);
    this.showmaptipListener_ = null;
  };
  
})();



