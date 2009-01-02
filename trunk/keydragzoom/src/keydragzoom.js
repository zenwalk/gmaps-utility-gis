/**
 * @name Key Drag Zoom
 * @version 1.0.2.gl
 * @author: Nianwei Liu [nianwei at gmail dot com], contributions by Gary Little [gary at luxcentral.com]
 * @fileoverview This lib provides a very simple drag zoom. Holding a user-defined special key (shift | ctrl | alt)
 *  while dragging a box will zoom to the desired area. 
 *  Only one line of code GMap2.enableKeyDragZoom() is needed.
 */
/*!
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function () {

// branche test 1
  /*jslint browser:true */
  /*global GMap2,GEvent,GLatLng,GLatLngBounds */
  
  var key = null;//shift|crtl|alt
  var borderAdjust = null;
  
  var keyUpListener = null;
  var keyDownListener = null;
  var mouseDownListener = null;
  var mouseMoveListener = null;
  var mouseUpListener = null;
  
  var boxDiv = null;
  var paneDiv = null;
  
  var hotKeyDown = false;
  var dragging = false;
  
  var startLatLng = null;
  var endLatLng = null;
  
  var map = null;
  
  /**
   * Draw the drag box. 
   */
  function drawBox() {
    if (map && startLatLng && endLatLng) {
      var start = map.fromLatLngToContainerPixel(startLatLng);
      var end = map.fromLatLngToContainerPixel(endLatLng);
      boxDiv.style.left = Math.min(start.x, end.x) + 'px';
      boxDiv.style.top = Math.min(start.y, end.y) + 'px';
      boxDiv.style.width = Math.abs(start.x - end.x) + 'px';
      boxDiv.style.height = Math.abs(start.y - end.y) + 'px';
      boxDiv.style.display = 'block';
    }
  }
  /**
   * Zoom to the drag box
   */
  function zoomBox() {
    if (map && startLatLng && endLatLng) {
      var sw = new GLatLng(Math.min(startLatLng.lat(), endLatLng.lat()), Math.min(startLatLng.lng(), endLatLng.lng()));
      var ne = new GLatLng(Math.max(startLatLng.lat(), endLatLng.lat()), Math.max(startLatLng.lng(), endLatLng.lng()));
      var bnds = new GLatLngBounds(sw, ne);
      var level = map.getBoundsZoomLevel(bnds);
      map.setCenter(bnds.getCenter(), level);
    }
  }
  /**
   * returns true if a hot key is pressed in the event
   * @param {Object} e event
   * @return {Boolean}
   */
  function isHotKeyDown(e) {
    e = e || window.event;
    return (e.shiftKey && key === 'shift') ||
    (e.altKey && key === 'alt') ||
    (e.ctrlKey && key === 'ctrl');
  }
   /**
   * handle key down
   */
  function onKeyDown(e) {
    if (map && !hotKeyDown && isHotKeyDown(e)) {
      hotKeyDown = true;
      var size = map.getSize();
      paneDiv.style.left = 0 + 'px';
      paneDiv.style.top = 0 + 'px';
      paneDiv.style.width = size.width - borderAdjust.width   + 'px';
      paneDiv.style.height = size.height - borderAdjust.height + 'px';
      paneDiv.style.display = 'block';
    }
  }
  /**
   * handle mouse down
   * @param {Event} e
   */
  function onMouseDown(e) {
    if (map && hotKeyDown) {
      startLatLng = endLatLng = null;
      dragging = true;
    }
  }
  /**
   * handle mouse move
   * @param {GLatLng} latlng of mouse 
   */
  function onMouseMove(latlng) {
    if (dragging) {
      var p = map.fromLatLngToContainerPixel(latlng);
      var b = parseInt(boxDiv.style.borderWidth, 10);
      var xMax = parseInt(paneDiv.style.width, 10) - 2 * b;
      var yMax = parseInt(paneDiv.style.height, 10) - 2 * b;
      p.x = Math.min(p.x, xMax);
      p.y = Math.min(p.y, yMax);
      p.x = Math.max(p.x, 0);
      p.y = Math.max(p.y, 0);
      latlng = map.fromContainerPixelToLatLng(p);

      if (!startLatLng) {
        startLatLng = latlng;
      }
      endLatLng = latlng;
      drawBox();
    }
  }
  function onMouseMove2(e) {
    if (map && hotKeyDown) {
      e = e || window.event;
      GLog.write(e);
    }
  }
  /**
   * handle mouse up
   */
  function onMouseUp() {
    if (dragging) {
      zoomBox();
      dragging = false;
    }
    boxDiv.style.display = 'none';
  }
 
  /**
   * handle key up
   */
  function onKeyUp(e) {
    if (map && hotKeyDown && !isHotKeyDown(e)) {
      hotKeyDown = false;
      dragging = false;
      boxDiv.style.display = 'none';
      paneDiv.style.display = "none";
    }
  }
  /**
   *  set the property of object from another object
   * @param {Object} obj target object
   * @param {Object} vals source object
   */
  function setVals(obj, vals) {
    if (obj && vals) {
      for (var x in vals) {
        if (vals.hasOwnProperty(x)) {
          obj[x] = vals[x];
        }
      }
    }
    return obj;
  }
  /**
   * Set opacity. if op is not passed in, this function just do an IE fix.
   * @param {Node} div
   * @param {Number} op (0-1)
   */
  function setOpacity(div, op) {
    if (typeof op !== 'undefined') {
      div.style.opacity = op;
    }
    if (typeof div.style.opacity !== 'undefined') {
      div.style.filter = "alpha(opacity=" + (div.style.opacity * 100) + ")";
    }
  }
  
  /**
   * @name GMap2
   * @class These are new methods added to Google Maps API's
   * <a href  = 'http://code.google.com/apis/maps/documentation/reference.html#GMap2'>GMap2</a>
   * class.
   */
  /**
   * @name KeyDragZoomOptions
   * @class This class represents the optional parameter passed into GMap2.enableDragBoxZoom().
   * @property {String} [key] the modifier key to use while dragging the box, <code> shift | alt | ctrl </code>. Default is shift.
   * @property {Object} [boxStyle] the css style of the zoom box.  e.g. <code> {border: '2px dashed red'} </code>
   * @property {Object} [paneStyle] the css style of the pane which overlays the map when a drag zoom is activated. 
   * e.g. <code> {backgroundColor: 'gray', opacity: 0.2}</code>.
   * @property {Object} [borderAdjust] the combined thickness, in pixels, of the left & right borders (width) and of the top & bottom borders (height) of the map container.  e.g. <code> {width: 4, height: 4} </code>. This option is not required if the map container's border or borderWidth property is set with an inline style assignment; even if specified, it is ignored in these situations. 
   */
   /**
   * Enable drag zoom. User can zoom to a point of interest by holding a special key (shift | ctrl | alt )
   * while dragging a box. 
   * @param {KeyDragZoomOptions} opt_zoomOpts
   */
  
  GMap2.prototype.enableKeyDragZoom = function (opt_zoomOpts) {
    map = this;
    opt_zoomOpts = opt_zoomOpts || {};
    key = opt_zoomOpts.key || 'shift';
    key = key.toLowerCase();
    
    borderAdjust = opt_zoomOpts.borderAdjust || {};
    var bw = map.getContainer().style.borderWidth;
	if ( bw !== "" ) {

		bw = parseInt(bw, 10);
		borderAdjust.width = 2 * bw;
		borderAdjust.height = 2 * bw;

	} else if ( typeof borderAdjust.width === "undefined" || typeof borderAdjust.height === "undefined" ) {

		borderAdjust.width = 0;
		borderAdjust.height = 0;
	}

    paneDiv = document.createElement("div");
    paneDiv.onselectstart = function () { 
      return false; 
    };
    // default style
    setVals(paneDiv.style, { backgroundColor: 'white',  opacity: 0.0, cursor: 'crosshair' });
    // allow overwrite 
    setVals(paneDiv.style, opt_zoomOpts.paneStyle);
    // stuff that can not be overwritten
    setVals(paneDiv.style, {position: 'absolute', overflow: 'hidden',  zIndex: 101, display: 'none'});
    setOpacity(paneDiv);
    // an IE fix: if background transparent, it can not capture mousedown
    if (paneDiv.style.backgroundColor === 'transparent') {
      paneDiv.style.backgroundColor = 'white';
      setOpacity(paneDiv, 0);
    }
    map.getContainer().appendChild(paneDiv);
    
    boxDiv = document.createElement('div');
    setVals(boxDiv.style, { border: 'thin solid #FF0000'});
    setVals(boxDiv.style, opt_zoomOpts.boxStyle);
    setVals(boxDiv.style, { position: 'absolute', display: 'none'});
    setOpacity(boxDiv);
    map.getContainer().appendChild(boxDiv);

    keyDownListener = GEvent.addDomListener(document, 'keydown', onKeyDown);
    keyUpListener = GEvent.addDomListener(document, 'keyup', onKeyUp);
    mouseDownListener = GEvent.addDomListener(paneDiv, 'mousedown', onMouseDown);
    mouseMoveListener = GEvent.addListener(map, 'mousemove', onMouseMove);
    mouseUpListener = GEvent.addDomListener(document, 'mouseup', onMouseUp);
  };
  /**
   * Disable drag zoom 
   */
  GMap2.prototype.disableKeyDragZoom = function () {
    if (map) {
      GEvent.removeListener(mouseDownListener);
      GEvent.removeListener(mouseMoveListener);
      GEvent.removeListener(mouseUpListener);
      GEvent.removeListener(keyUpListener);
      GEvent.removeListener(keyDownListener);
      map.getContainer().removeChild(boxDiv);
      map.getContainer().removeChild(paneDiv);
      map = null;
    }
  };
  /**
   * Returns true if the drag zoom is enabled.
   * @return {Boolean}
   */
  GMap2.prototype.keyDragZoomEnabled = function () {
    return map !== null;
  };
  
})();
