/**
 * @name Key Drag Zoom
 * @version 1.0.3
 * @author: Nianwei Liu [nianwei at gmail dot com] & Gary Little [gary at luxcentral dot com]
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
  /*jslint browser:true */
  /*global GMap2,GEvent,GLatLng,GLatLngBounds,GPoint */
  //utility functions. use "var funName=function()" syntax to allow Dean packer shrink without base62 */

  /**
   * Converts 'thin', 'medium', and 'thick' to pixel widths
   * in an MSIE environment. Not called for other browsers
   * because getComputedStyle() does this automatically.
   * @param {String} value
   */ 
  var toPixels = function (value) {
    var px;
    switch (value) {
    case 'thin':
      px = "2px";
      break;
    case 'medium':
      px = "4px";
      break;
    case 'thick':
      px = "6px";
      break;
    default:
      px = value;
    }
    return px;
  };
 /**
 * Get the widths of the borders of an element
 *
 * @param {Object} h  HTML element
 * @return {Object} widths object (top, bottom left, right)
 */
  var getBorderWidths = function (h) {
    var computedStyle;
    var bw = {};
    if (document.defaultView && document.defaultView.getComputedStyle) {
      computedStyle = h.ownerDocument.defaultView.getComputedStyle(h, "");
      if (computedStyle) {
        // The computed styles are always in pixel units (good!)
        bw.top = parseInt(computedStyle.borderTopWidth, 10) || 0;
        bw.bottom = parseInt(computedStyle.borderBottomWidth, 10) || 0;
        bw.left = parseInt(computedStyle.borderLeftWidth, 10) || 0;
        bw.right = parseInt(computedStyle.borderRightWidth, 10) || 0;
        return bw;
      }
    } else if (document.documentElement.currentStyle) {
      if (h.currentStyle) {
        // The current styles may not be in pixel units so try to convert (bad!)
        bw.top = parseInt(toPixels(h.currentStyle.borderTopWidth), 10) || 0;
        bw.bottom = parseInt(toPixels(h.currentStyle.borderBottomWidth), 10) || 0;
        bw.left = parseInt(toPixels(h.currentStyle.borderLeftWidth), 10) || 0;
        bw.right = parseInt(toPixels(h.currentStyle.borderRightWidth), 10) || 0;
        return bw;
      }
    }
    bw.top = parseInt(h.style["border-top-width"], 10) || 0;
    bw.bottom = parseInt(h.style["border-bottom-width"], 10) || 0;
    bw.left = parseInt(h.style["border-left-width"], 10) || 0;
    bw.right = parseInt(h.style["border-right-width"], 10) || 0;
    return bw;
  };

  /**
   * Get position of mouse relative to document
   * @param {Object} e  Mouse event
   * @return {Object} left & top position
   */
  var getMousePosition = function (e) {
    var posX = 0, posY = 0;
    e = e || window.event;
    if (typeof e.pageX !== "undefined") {
      posX = e.pageX;
      posY = e.pageY;
    } else if (typeof e.clientX !== "undefined") {
      posX = e.clientX +
      (typeof document.documentElement.scrollLeft !== "undefined" ? document.documentElement.scrollLeft : document.body.scrollLeft);
      posY = e.clientY +
      (typeof document.documentElement.scrollTop !== "undefined" ? document.documentElement.scrollTop : document.body.scrollTop);
    }
    return {
      left: posX,
      top: posY
    };
  };

  /**
   * Get position of HTML element relative to document
   * @param {Object} h  HTML element
   * @return {Object} left & top position
   */
  var getElementPosition = function (h) {
    var posX = h.offsetLeft;
    var posY = h.offsetTop;
    var parent = h.offsetParent;
    // Add offsets for all ancestors in the hierarchy
    while (parent !== null) {
      // Adjust for scrolling elements which may affect the map position.
      //
      // See http://www.howtocreate.co.uk/tutorials/javascript/browserspecific
      //
      // "...make sure that every element [on a Web page] with an overflow
      // of anything other than visible also has a position style set to
      // something other than the default static..."
      if (parent !== document.body && parent !== document.documentElement) {
        posX -= parent.scrollLeft;
        posY -= parent.scrollTop;
      }
      posX += parent.offsetLeft;
      posY += parent.offsetTop;
      parent = parent.offsetParent;
    }
    return {
      left: posX,
      top: posY
    };
  };
   /**
   * Set the property of object from another object
   * @param {Object} obj target object
   * @param {Object} vals source object
   */
  var setVals = function (obj, vals) {
    if (obj && vals) {
      for (var x in vals) {
        if (vals.hasOwnProperty(x)) {
          obj[x] = vals[x];
        }
      }
    }
    return obj;
  };
  /**
   * Set opacity. if op is not passed in, this function just does an IE fix.
   * @param {Node} div
   * @param {Number} op (0-1)
   */
  var setOpacity = function (div, op) {
    if (typeof op !== 'undefined') {
      div.style.opacity = op;
    }
    if (typeof div.style.opacity !== 'undefined') {
      div.style.filter = "alpha(opacity=" + (div.style.opacity * 100) + ")";
    }
  };
  /**
   * @name KeyDragZoomOptions
   * @class This class represents the optional parameter passed into GMap2.enableDragBoxZoom().
   * @property {String} [key] the modifier key to use while dragging the box, <code> shift | alt | ctrl </code>. Default is shift.
   * @property {Object} [boxStyle] the css style of the zoom box.  e.g. <code> {border: '2px dashed red'} </code>
   * @property {Object} [paneStyle] the css style of the pane which overlays the map when a drag zoom is activated. 
   * e.g. <code> {backgroundColor: 'gray', opacity: 0.2}</code>.
   * @property {Object} [callbacks] the callback functions for dragstart, drag, dragend [NOT YET IMPLEMENTED]
   */
  /**
   * Object to enable drag zoom on a map
   * @param {Object} opt_zoomOpts
   */
  function DragZoom(opt_zoomOpts) {
    
    
  }
  var key = null;//shift|crtl|alt
  var keyUpListener = null;
  var keyDownListener = null;
  var mouseDownListener = null;
  var mouseMoveListener = null;
  var mouseUpListener = null;
  
  var borderWidths = null;
  var boxBorderWidths = null;
  var boxDiv = null;
  var paneDiv = null;
  
  var hotKeyDown = false;
  var dragging = false;
  
  var startLatLng = null;
  var endLatLng = null;
  var mapPosn = null;
  var boxMaxX, boxMaxY;
  
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
   * Returns true if a hot key is pressed in the event
   * @param {Event} e
   * @return {Boolean}
   */
  function isHotKeyDown(e) {
  
    var isHot;
    e = e || window.event;
    isHot = (e.shiftKey && key === 'shift') || (e.altKey && key === 'alt') || (e.ctrlKey && key === 'ctrl');
    if (!isHot) {
      // Need to look at keyCode for Opera because it
      // doesn't set the shiftKey, altKey, ctrlKey properties
      // unless a non-modifier event is being reported.
      //
      // See http://cross-browser.com/x/examples/shift_mode.php
      // Also see http://unixpapa.com/js/key.html
      switch (e.keyCode) {
      case 16:
        if (key === 'shift') {
          isHot = true;
        }
        break;
      case 17:
        if (key === 'ctrl') {
          isHot = true;
        }
        break;
      case 18:
        if (key === 'alt') {
          isHot = true;
        }
        break;
      }
    }
    return isHot;
  }
   /**
   * Handle key down
   * @param {Event} e
   */
  function onKeyDown(e) {
    if (map && !hotKeyDown && isHotKeyDown(e)) {
      hotKeyDown = true;
      var size = map.getSize();
      paneDiv.style.left = 0 + 'px';
      paneDiv.style.top = 0 + 'px';
      paneDiv.style.width = size.width - (borderWidths.left + borderWidths.right) + 'px';
      paneDiv.style.height = size.height - (borderWidths.top + borderWidths.bottom) + 'px';
      paneDiv.style.display = 'block';
      boxMaxX = parseInt(paneDiv.style.width, 10) - (boxBorderWidths.left + boxBorderWidths.right);
      boxMaxY = parseInt(paneDiv.style.height, 10) - (boxBorderWidths.top + boxBorderWidths.bottom);
    }
  }
  /**
   * Handle mouse down
   * @param {Event} e
   */
  function onMouseDown(e) {
    if (map && hotKeyDown) {
      startLatLng = endLatLng = null;
      mapPosn = getElementPosition(map.getContainer());
      dragging = true;
    }
  }
  /**
   * Handle mouse move
   * @param {Event} e
   */
  function onMouseMove(e) {
    if (dragging) {
      var mousePosn = getMousePosition(e);
      var p = new GPoint();
      p.x = mousePosn.left - mapPosn.left - borderWidths.left;
      p.y = mousePosn.top - mapPosn.top - borderWidths.top;
      p.x = Math.min(p.x, boxMaxX);
      p.y = Math.min(p.y, boxMaxY);
      p.x = Math.max(p.x, 0);
      p.y = Math.max(p.y, 0);
      var latlng = map.fromContainerPixelToLatLng(p);
      if (!startLatLng) {
        startLatLng = latlng;
      }
      endLatLng = latlng;
      drawBox();
    }
  }
  /**
   * Handle mouse up
   * @param {Event} e
   */
  function onMouseUp(e) {
    if (dragging) {
      zoomBox();
      dragging = false;
    }
    boxDiv.style.display = 'none';
  }
 
  /**
   * Handle key up
   * @param {Event} e
   */
  function onKeyUp(e) {
    if (map && hotKeyDown) {
      hotKeyDown = false;
      dragging = false;
      boxDiv.style.display = 'none';
      paneDiv.style.display = "none";
    }
  }

 
  
  
  /**
   * @name GMap2
   * @class These are new methods added to Google Maps API's
   * <a href  = 'http://code.google.com/apis/maps/documentation/reference.html#GMap2'>GMap2</a>
   * class.
   */
   /**
   * Enable drag zoom. User can zoom to a point of interest by holding a special key (shift | ctrl | alt )
   * while dragging a box. 
   * @param {KeyDragZoomOptions} opt_zoomOpts
   */
  
  GMap2.prototype.enableKeyDragZoom = function (opt_zoomOpts) {
    map = this;
    opt_zoomOpts = opt_zoomOpts ||
    {};
    key = opt_zoomOpts.key || 'shift';
    key = key.toLowerCase();
    
    borderWidths = getBorderWidths(map.getContainer());
    
    paneDiv = document.createElement("div");
    paneDiv.onselectstart = function () {
      return false;
    };
    // default style
    setVals(paneDiv.style, {
      backgroundColor: 'white',
      opacity: 0.0,
      cursor: 'crosshair'
    });
    // allow overwrite 
    setVals(paneDiv.style, opt_zoomOpts.paneStyle);
    // stuff that can not be overwritten
    setVals(paneDiv.style, {
      position: 'absolute',
      overflow: 'hidden',
      zIndex: 101,
      display: 'none'
    });
    if (key === 'shift') { // Workaround for Firefox Shift-Click problem
      paneDiv.style.MozUserSelect = "none";
    }
    setOpacity(paneDiv);
    // an IE fix: if background transparent, it can not capture mousedown
    if (paneDiv.style.backgroundColor === 'transparent') {
      paneDiv.style.backgroundColor = 'white';
      setOpacity(paneDiv, 0);
    }
    map.getContainer().appendChild(paneDiv);
    
    boxDiv = document.createElement('div');
    setVals(boxDiv.style, {
      border: 'thin solid #FF0000'
    });
    setVals(boxDiv.style, opt_zoomOpts.boxStyle);
    setVals(boxDiv.style, {
      position: 'absolute',
      display: 'none'
    });
    setOpacity(boxDiv);
    map.getContainer().appendChild(boxDiv);
    
    boxBorderWidths = getBorderWidths(boxDiv);
    
    keyDownListener = GEvent.addDomListener(document, 'keydown', onKeyDown);
    keyUpListener = GEvent.addDomListener(document, 'keyup', onKeyUp);
    mouseDownListener = GEvent.addDomListener(paneDiv, 'mousedown', onMouseDown);
    mouseMoveListener = GEvent.addDomListener(document, 'mousemove', onMouseMove);
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