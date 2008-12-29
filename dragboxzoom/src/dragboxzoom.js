/**
 * @name Simple Drag Box Zoom
 * @version 1.0
 * @author: Nianwei Liu [nianwei at gmail dot com]
 * @fileoverview This lib provides a very simple drag zoom. Holding shift key while draw a box 
 * will zoom to the desired area. Only one line of code GMap2.enableDragZoom() is needed.
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
  /*global escape,GMap2,GEvent,GLatLng,GLatLngBounds */
  var downListener = null;
  var moveListener = null;
  var upListener = null;
  var boxDiv = null;
  var startLatLng;
  var endLatLng;
  var zooming = false;
  var map = null;
  var mapDragEnabled = false; 
  
  
  
  /**
   * Actually draw the box. Note the first point can be lower left cornor
   */
  function drawBox() {
    if (startLatLng && endLatLng && map) {
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
   * handle mouse down
   * @param {Event} e
   */
  function onMouseDown(e) {
    e = e || window.event;
    if (e.shiftKey && map) {
      mapDragEnabled = map.draggingEnabled();
      map.disableDragging();
      startLatLng = endLatLng = null;
      zooming = true;
    }
  }
  /**
   * handle mouse move
   * @param {GLatLng} latlng of mouse 
   */
  function onMouseMove(latlng) {
    if (zooming) {
      if (!startLatLng) {
        startLatLng = latlng;
      }
      endLatLng = latlng;
      drawBox();
    }
  }
  /**
   * handle mouse up
   */
  function onMouseUp() {
    if (zooming) {
      zooming = false;
      if (mapDragEnabled) {
        map.enableDragging();
      }
      if (map && startLatLng && endLatLng) {
        var sw = new GLatLng(Math.min(startLatLng.lat(), endLatLng.lat()), Math.min(startLatLng.lng(), endLatLng.lng()));
        var ne = new GLatLng(Math.max(startLatLng.lat(), endLatLng.lat()), Math.max(startLatLng.lng(), endLatLng.lng()));
        var bnds =  new GLatLngBounds(sw, ne);
        var level = map.getBoundsZoomLevel(bnds);
        map.setCenter(bnds.getCenter(), level);
      }
      boxDiv.style.display = 'none';
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
  }
  
  /**
   * @name GMap2
   * @class This is new methods added to Google Maps API's
   * <a href  = 'http://code.google.com/apis/maps/documentation/reference.html#GMap2'>GMap2</a>
   * class.
   */
  /**
   * Enable drag zoom. User can zoom to a point of interest by holding shift key 
   * while drag a box. 
   * The optional opt_boxStyle is an javascript object literal of css properties.
   * e.g. <code> {backgroundColor:'blue',opacity:0.6, filter:'alpha(opacity = 50)'} </code>
   * @param {Object} opt_boxStyle
   */
  GMap2.prototype.enableDragBoxZoom = function (opt_boxStyle) {
    map = this;
    // Thanks to Mike Williams on this post:
    //http://groups.google.com/group/Google-Maps-API/browse_thread/thread/a968adb7b85fb03f/ca976136cf7af09b?#ca976136cf7af09b
    downListener = GEvent.addDomListener(map.getDragObject(), 'mousedown', onMouseDown);
    moveListener = GEvent.addListener(map, 'mousemove', onMouseMove);
    upListener = GEvent.addDomListener(map.getContainer(), 'mouseup', onMouseUp);
    boxDiv = document.createElement('div');
    setVals(boxDiv.style, opt_boxStyle || {border: 'thin solid #FF0000'});
    boxDiv.style.position = 'absolute';
    boxDiv.style.display = 'none';
    map.getContainer().appendChild(boxDiv);
  };
  /**
   * Disable drag zoom 
   */
  GMap2.prototype.disableDragBoxZoom = function () {
    if (map) {
      GEvent.removeListener(downListener);
      GEvent.removeListener(moveListener);
      GEvent.removeListener(upListener);
      map.getContainer().removeChild(boxDiv);
      map = null;
    }
  };
  /**
   * Returns true if the drag zoom is enabled.
   * @return {Boolean}
   */
  GMap2.prototype.dragBoxZoomEnabled = function () {
    return map !== null;
  };
  
})();



