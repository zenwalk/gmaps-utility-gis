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
   * @property {String} [key] the modifier key to use while this.dragging_ the box, <code> shift | alt | ctrl </code>. Default is shift.
   * @property {Object} [boxStyle] the css style of the zoom box.  e.g. <code> {border: '2px dashed red'} </code>
   * @property {Object} [paneStyle] the css style of the pane which overlays the this.map_ when a drag zoom is activated. 
   * e.g. <code> {backgroundColor: 'gray', opacity: 0.2}</code>.
   */
  /**
   * @name DragZoom
   * @class This class represents a drag zoom object for a map. It can be activated by holding a special key.
   * This is no constructor for this class. Use GMap2.getDragZoomObject() to gain access to this object.
   * @param {GMap2} map
   * @param {KeyDragZoomOptions} opt_zoomOpts
   */
  function DragZoom(map, opt_zoomOpts) {
    this.map_ = map;
    opt_zoomOpts = opt_zoomOpts || {};
    this.key_ = opt_zoomOpts.key || 'shift';
    this.key_ = this.key_.toLowerCase();
    
    this.borderWidths_ = getBorderWidths(this.map_.getContainer());
    
    this.paneDiv_ = document.createElement("div");
    this.paneDiv_.onselectstart = function () {
      return false;
    };
    // default style
    setVals(this.paneDiv_.style, {
      backgroundColor: 'white',
      opacity: 0.0,
      cursor: 'crosshair'
    });
    // allow overwrite 
    setVals(this.paneDiv_.style, opt_zoomOpts.paneStyle);
    // stuff that can not be overwritten
    setVals(this.paneDiv_.style, {
      position: 'absolute',
      overflow: 'hidden',
      zIndex: 101,
      display: 'none'
    });
    if (this.key_ === 'shift') { // Workaround for Firefox Shift-Click problem
      this.paneDiv_.style.MozUserSelect = "none";
    }
    setOpacity(this.paneDiv_);
    // an IE fix: if background transparent, it can not capture mousedown
    if (this.paneDiv_.style.backgroundColor === 'transparent') {
      this.paneDiv_.style.backgroundColor = 'white';
      setOpacity(this.paneDiv_, 0);
    }
    this.map_.getContainer().appendChild(this.paneDiv_);
    
    this.boxDiv_ = document.createElement('div');
    setVals(this.boxDiv_.style, {
      border: 'thin solid #FF0000'
    });
    setVals(this.boxDiv_.style, opt_zoomOpts.boxStyle);
    setVals(this.boxDiv_.style, {
      position: 'absolute',
      display: 'none'
    });
    setOpacity(this.boxDiv_);
    this.map_.getContainer().appendChild(this.boxDiv_);
    
    this.boxBorderWidths_ = getBorderWidths(this.boxDiv_);
    this.keyDownListener_ = GEvent.bindDom(document, 'keydown',  this, this.onKeyDown_);
    this.keyUpListener_ = GEvent.bindDom(document, 'keyup', this, this.onKeyUp_);
    this.mouseDownListener_ = GEvent.bindDom(this.paneDiv_, 'mousedown', this, this.onMouseDown_);
    this.mouseMoveListener_ = GEvent.bindDom(document, 'mousemove', this, this.onMouseMove_);
    this.mouseUpListener_ = GEvent.bindDom(document, 'mouseup', this, this.onMouseUp_);
  
    this.hotKeyDown_ = false;
    this.dragging_ = false;
    
    this.startPt_ = null;
    this.endPt_ = null;
    this.mapPosn_ = null;
    this.boxMaxX_ = null;
    this.boxMaxY_ = null;
    
  }
  


  /**
   * Draw the drag box. 
   */
  DragZoom.prototype.drawBox_ = function () {
    if (this.map_ && this.startPt_ && this.endPt_) {
      this.boxDiv_.style.left = Math.min(this.startPt_.x, this.endPt_.x) + 'px';
      this.boxDiv_.style.top = Math.min(this.startPt_.y, this.endPt_.y) + 'px';
      this.boxDiv_.style.width = Math.abs(this.startPt_.x - this.endPt_.x) + 'px';
      this.boxDiv_.style.height = Math.abs(this.startPt_.y - this.endPt_.y) + 'px';
      this.boxDiv_.style.display = 'block';
    }
  };
  /**
   * Zoom to the drag box
   */
  DragZoom.prototype.zoomBox_  = function () {
    if (this.map_ && this.startPt_ && this.endPt_) {
      var sw = this.map_.fromContainerPixelToLatLng(new GPoint(Math.min(this.startPt_.x, this.endPt_.x), Math.max(this.startPt_.y, this.endPt_.y)));
      var ne = this.map_.fromContainerPixelToLatLng(new GPoint(Math.max(this.startPt_.x, this.endPt_.x), Math.min(this.startPt_.y, this.endPt_.y)));
      var bnds = new GLatLngBounds(sw, ne);
      var level = this.map_.getBoundsZoomLevel(bnds);
      this.map_.setCenter(bnds.getCenter(), level);
    }
  };
  /**
   * Returns true if a hot key is pressed in the event
   * @param {Event} e
   * @return {Boolean}
   */
  DragZoom.prototype.isHotKeyDown_ = function (e) {
    var isHot;
    e = e || window.event;
    isHot = (e.shiftKey && this.key_ === 'shift') || (e.altKey && this.key_ === 'alt') || (e.ctrlKey && this.key_ === 'ctrl');
    if (!isHot) {
      // Need to look at keyCode for Opera because it
      // doesn't set the shiftKey, altKey, ctrlKey properties
      // unless a non-modifier event is being reported.
      //
      // See http://cross-browser.com/x/examples/shift_mode.php
      // Also see http://unixpapa.com/js/key.html
      switch (e.keyCode) {
      case 16:
        if (this.key_ === 'shift') {
          isHot = true;
        }
        break;
      case 17:
        if (this.key_ === 'ctrl') {
          isHot = true;
        }
        break;
      case 18:
        if (this.key_ === 'alt') {
          isHot = true;
        }
        break;
      }
    }
    return isHot;
  };
   /**
   * Handle key down
   * @param {Event} e
   */
  DragZoom.prototype.onKeyDown_ = function (e) {
    if (this.map_ && !this.hotKeyDown_ && this.isHotKeyDown_(e)) {
      this.hotKeyDown_ = true;
      var size = this.map_.getSize();
      this.paneDiv_.style.left = 0 + 'px';
      this.paneDiv_.style.top = 0 + 'px';
      this.paneDiv_.style.width = size.width - (this.borderWidths_.left + this.borderWidths_.right) + 'px';
      this.paneDiv_.style.height = size.height - (this.borderWidths_.top + this.borderWidths_.bottom) + 'px';
      this.paneDiv_.style.display = 'block';
      this.boxMaxX_ = parseInt(this.paneDiv_.style.width, 10) - (this.boxBorderWidths_.left + this.boxBorderWidths_.right);
      this.boxMaxY_ = parseInt(this.paneDiv_.style.height, 10) - (this.boxBorderWidths_.top + this.boxBorderWidths_.bottom);
     /**
       * This event is fired after the DragZoom tool is activated. 
       * @name DragZoom#activate
       * @event
       */
      GEvent.trigger(this, 'activate');
    }
  };
  /**
   * Get GPoint of mouse postion
   * @param {Object} e
   * @return {GPoint} point
   * @private
   */
  DragZoom.prototype.getMousePoint_ = function (e) {
    var mousePosn = getMousePosition(e);
    var p = new GPoint();
    p.x = mousePosn.left - this.mapPosn_.left - this.borderWidths_.left;
    p.y = mousePosn.top - this.mapPosn_.top - this.borderWidths_.top;
    p.x = Math.min(p.x, this.boxMaxX_);
    p.y = Math.min(p.y, this.boxMaxY_);
    p.x = Math.max(p.x, 0);
    p.y = Math.max(p.y, 0);
    return p;
  }
  /**
   * Handle mouse down
   * @param {Event} e
   */
  DragZoom.prototype.onMouseDown_ = function (e) {
    if (this.map_ && this.hotKeyDown_) {
      this.startPt_ = this.endPt_ = null;
      this.mapPosn_ = getElementPosition(this.map_.getContainer());
      this.dragging_ = true;
      this.startPt_ = this.getMousePoint_(e);
      /**
       * This event is fired when drag started. 
       * @name DragZoom#dragstart
       * @param {GPoint} start
       * @event
       */
      GEvent.trigger(this, 'dragstart', this.startPt_);
    }
  };
 
  /**
   * Handle mouse move
   * @param {Event} e
   */
  DragZoom.prototype.onMouseMove_ = function (e) {
    if (this.dragging_) {
      this.endPt_ = this.getMousePoint_(e);
      this.drawBox_();
      /**
       * This event is repeatedly fired while the user drags the box. The start point and mouse point
       * is passed as parameter of type GPoint, relative to map container.
       * The event listener is responsible for convert Pixel to LatLng if necessary.
       * @name DragZoom#drag 
       * @param {GPoint} start
       * @param {GPoint} end
       * @event
       */
      //pass GPoint instead of GLatLng to avoid repeated PixelToLatLng if not needed.
      GEvent.trigger(this, 'drag', this.startPt_, this.endPt_); 
    }
  };
  /**
   * Handle mouse up
   * @param {Event} e
   */
  DragZoom.prototype.onMouseUp_ = function (e) {
    if (this.dragging_) {
      this.zoomBox_();
      this.dragging_ = false;
      this.boxDiv_.style.display = 'none';
      /**
       * This event is fired after drag end. 
       * Note that the dragend event is not fired if the hot key is released before the end of the drag operation.
       * @name DragZoom#dragend
       * @param {GPoint} start
       * @param {GPoint} end
       * @event
       */
      GEvent.trigger(this, 'dragend', this.startPt_, this.endPt_);
    }
  };
 
  /**
   * Handle key up
   * @param {Event} e
   */
  DragZoom.prototype.onKeyUp_ = function (e) {
    if (this.map_ && this.hotKeyDown_) {
      this.hotKeyDown_ = false;
      this.dragging_ = false;
      this.boxDiv_.style.display = 'none';
      this.paneDiv_.style.display = "none";
      /**
       * This event is fired while the user release the key
       * @name DragZoom#deactivate 
       * @event
       */
      GEvent.trigger(this, 'deactivate'); 
    }
  };

 
  
  
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
    this.dragZoom_ = new DragZoom(this, opt_zoomOpts);
  };
  /**
   * Disable drag zoom 
   */
  GMap2.prototype.disableKeyDragZoom = function () {
    var d = this.dragZoom_;
    if (d) {
      GEvent.removeListener(d.mouseDownListener_);
      GEvent.removeListener(d.mouseMoveListener_);
      GEvent.removeListener(d.mouseUpListener_);
      GEvent.removeListener(d.keyUpListener_);
      GEvent.removeListener(d.keyDownListener_);
      this.getContainer().removeChild(d.boxDiv_);
      this.getContainer().removeChild(d.paneDiv_);
      this.dragZoom_ = null;
    }
  };
  /**
   * Returns true if the drag zoom is enabled.
   * @return {Boolean}
   */
  GMap2.prototype.keyDragZoomEnabled = function () {
    return this.dragZoom_ !== null;
  };
  /**
   * Returns the DragZoom Object on this map instance after <code>GMap2.enableKeyDragZoom</code> is called.
   * EventListened can be attached afterwards. 
   * @return {DragZoom}
   */
  GMap2.prototype.getDragZoomObject = function () {
    return this.dragZoom_;
  };
})();