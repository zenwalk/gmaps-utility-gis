/*
 * ArcGIS for Google Maps Flash API
 * @author nianwei at gmail dot com
 *
 * Licensed under the Apache License, Version 2.0:
 *  http://www.apache.org/licenses/LICENSE-2.0
 */
package ags {

  import ags.json.*;
  
  import com.google.maps.*;
  import com.google.maps.interfaces.IOverlay;
  import com.google.maps.overlays.*;
  
  import flash.events.*;
  import flash.geom.Point;
  import flash.net.*;
  import flash.utils.*;
  
  import mx.rpc.events.*;
  import mx.rpc.http.*;

  /**
   * Utility tools
   */
  public class ArcGISUtil
  {
    public function ArcGISUtil() {

    }
    /**
     * Helper method to convert an {@link ArcGISEnvelope} object to <code>GLatLngBounds</code>
     * @param {Envelope} extent
     * @return {GLatLngBounds} gLatLngBounds
     */
    public static function fromEnvelopeToLatLngBounds( /*Envelope*/ extent:*):LatLngBounds {
      var sr:SpatialReference=SpatialReferences.getSpatialReference(extent.spatialReference.wkid);
      sr=sr || SpatialReferences.WGS84;
      var sw:Array=sr.reverse([extent.xmin, extent.ymin]);
      var ne:Array=sr.reverse([extent.xmax, extent.ymax]);
      return new LatLngBounds(new LatLng(sw[1], sw[0]), new LatLng(ne[1], ne[0]));
    }

    public static function fromLatLngBoundsToEnvelope(gLatLngBounds:LatLngBounds, spatialReference:SpatialReference=null):* {
      spatialReference=spatialReference || SpatialReferences.WGS84;
      var sw:Array=spatialReference.forward([gLatLngBounds.getSouthWest().lng(), gLatLngBounds.getSouthWest().lat()]);
      var ne:Array=spatialReference.forward([gLatLngBounds.getNorthEast().lng(), gLatLngBounds.getNorthEast().lat()]);
      return {xmin: sw[0], ymin: sw[1], xmax: ne[0], ymax: ne[1], spatialReference: {wkid: spatialReference.wkid}};
    }

    public static function fromLatLngToPoint(gLatLng:LatLng, sr:SpatialReference=null):* {
      sr=sr || SpatialReferences.WGS84;
      var p:Array=sr.forward([gLatLng.lng(), gLatLng.lat()]);
      return {x: p[0], y: p[1], spatialReference: {wkid: sr.wkid}};
    }

    public static function fromPointToLatLng(point:*, opt_sr:*=null):LatLng {
      var srid:*=point.spatialReference || opt_sr;
      var sr:SpatialReference=srid ? SpatialReferences.getSpatialReference(srid.wkid) : SpatialReferences.WGS84;
      sr=sr || SpatialReferences.WGS84;
      if (isNaN(point.x) || isNaN(point.y)) {
        return null;
      }
      
      var p:Array=sr.reverse([point.x, point.y]);
      return new LatLng(p[1], p[0]);
    }

    /**
     * Add a ArcGIS Server resource to map. if it is cached, it will be added as a map type, if dynamic, it will be added as overlay.
     * @param map
     * @param url
     * @param opt_callback
     *
     */
    public static function addArcGISMap(map:Map, url:String, opt_callback:Function=null):void {
      var service:MapService=new MapService(url);
      service.addEventListener(ServiceEvent.LOAD, function(evt:Event):void {
          if (service.singleFusedMapCache) {
            var tile:ArcGISTileLayer=new ArcGISTileLayer(service);
            var type:ArcGISMapType=new ArcGISMapType([tile], new ArcGISMapTypeOptions({name: tile.getName().replace(/ /g, '\n')}));
            map.addMapType(type);
            if (opt_callback != null) {
              opt_callback.call(null, type);
            }
          } else {
            var ov:ArcGISMapOverlay=new ArcGISMapOverlay(service);
            map.addOverlay(ov);
            if (opt_callback != null) {
              opt_callback.call(null, ov);
            }
          }
        });
    }

    /**
     * Enable wheel zoom as alternative to Map.enableScrollWheelZoom because the later passed zoom=0 to Projection.
     */
    public static function enableScrollWheelZoom(map:com.google.maps.Map):void {
      map.getDisplayObject().addEventListener(MouseEvent.MOUSE_WHEEL, function(evt:MouseEvent):void {
          var p:flash.geom.Point=new flash.geom.Point(evt.localX, evt.localY);
          var latlng:LatLng;
          var c:flash.geom.Point=new flash.geom.Point(map.width / 2, map.height / 2);
          var z:Number=map.getZoom();
          if (evt.delta > 0) {
            z=Math.min(z + 1, map.getMaxZoomLevel());
            latlng=map.fromViewportToLatLng(new flash.geom.Point((p.x + c.x) / 2, (p.y + c.y) / 2));
          } else {
            z=Math.max(z - 1, map.getMinZoomLevel());
            latlng=map.fromViewportToLatLng(new flash.geom.Point(c.x * 2 - p.x, c.y * 2 - p.y));
          }
          map.setCenter(latlng, z);
        });
    }

    public static var ArcGISConfig:*={maxPolyPoints: 3000, style: {icon: null, strokeStyle: {thickness: 3, color: 0xffff00, alpha: 0.5, pixelHinting: true}, fillStyle: {color: 0xFFFF00, alpha: 0.5}

        }};

    /**
     * Convert a {@link ArcGISFeature} or {@link ArcGISIdentifyResult} or {@link ArcGISFindResult} to core Google Maps API
     * overlays such as  {@link ArcGISGMarker},
     * {@link ArcGISGPolyline}, or {@link ArcGISGPolygon}s.
     * Note ArcGIS Geometry may have multiple parts, but the coresponding GOverlay
     * does not  support multi-parts, so the result is an array.
     * <ul><li><code>feature</code>: an object returned by ArcGIS Server with at least <code>geometry</code> property of type {@link ArcGISGeometry}.
     *  if it contains a name-value pair "attributes" property, it will be attached to the result overlays.
     * <li><code>opt_sr</code>: optional {@link ArcGISSpatialReference}. Can be object literal.
     * <li><code>opt_agsStyle</code> {@link ArcGISStyleOptions}. default is {@link ArcGISConfig}.style.
     * <li><code>opt_displayName</code> optional field name used for title of feature.
     * @param {Feature} feature
     * @param {ArcGISSpatialReference} opt_sr
     * @param {overlayOptions} opt_agsStyle
     * @param {String} opt_displayName
     * @return {GOverlay[]}
     */

    public static function fromGeometryToOverlays(geom:*, opt_sr:SpatialReference=null, overlayOptions:OverlayOptions=null, title:String=''):Array {
      var ovs:Array=[];
      var sr:SpatialReference=null;
      var ov:IOverlay=null;
      overlayOptions = overlayOptions || new OverlayOptions();
      if (opt_sr) {
          sr=opt_sr;
      } else {
        sr=SpatialReferences.getSpatialReference(geom.spatialReference.wkid);
      }
      if (sr === null) {
        return ovs;
      }

      var x:String, i:int, ic:int, j:int, jc:int, parts:Array, part:Array, lnglat:Array, glatlngs:Array;

      if (geom.x) {
        //point
        lnglat=sr.reverse([geom.x, geom.y]);
        if (!overlayOptions.marker) {
          overlayOptions.marker=new MarkerOptions({tooltip: title});
        } else if (!overlayOptions.marker.tooltip) {
          overlayOptions.marker.tooltip=title;
        }
        ov=new Marker(new LatLng(lnglat[1], lnglat[0]), overlayOptions.marker);
        ovs.push(ov);
      } else {
        //mulpt, line and poly
        parts=geom.points || geom.paths || geom.rings;
        if (!parts) {
          return ovs;
        }
        for (i=0, ic=parts.length; i < ic; i++) {
          part=parts[i];
          if (geom.points) {
            // multipoint
            lnglat=sr.reverse(part);
            ov=new Marker(new LatLng(lnglat[1], lnglat[0]), overlayOptions.marker);
          } else {
            if (part.length > ArcGISConfig.maxPolyPoints) {
              // TODO: do a simple point reduction 
              continue;
            }
            glatlngs=[];
            for (j=0, jc=part.length; j < jc; j++) {
              lnglat=sr.reverse(part[j]);
              glatlngs.push(new LatLng(lnglat[1], lnglat[0]));
            }
            if (geom.paths) {
              
              ov=new Polyline(glatlngs, overlayOptions.polyline); //new PolylineOptions({strokeStyle: style.strokeStyle}));
            } else if (geom.rings) {
              overlayOptions.polygon = overlayOptions.polygon || new PolygonOptions();
              overlayOptions.polygon.tooltip = title;
              ov=new Polygon(glatlngs, overlayOptions.polygon); //new PolygonOptions({strokeStyle: style.strokeStyle, fillStyle: style.fillStyle, tooltip: title})); //, style.outlineColor, style.outlineWeight, style.outlineOpacity, style.fillColor, style.fillOpacity);
            }
          }
          ovs.push(ov);
        }
      }
      return ovs;
    }
    
    public static function fromOverlaysToGeometry(ovs:Array, opt_sr:SpatialReference=null):* {
      var sr:SpatialReference=null;
      if (opt_sr) {
        sr=opt_sr;
      } else {
        sr=SpatialReferences.WGS84;
      }
      var ov:*;
      if (!ovs || ovs.length==0) return null;
      ov = ovs[0];
      var x:String, i:int, ic:int, j:int, jc:int, parts:Array, part:Array, ll:LatLng, lnglat:Array;
      if (ovs.length==1 && (ov is LatLng || ov is Marker)){
          ll = (ov is LatLng? ov as LatLng:(ov as Marker).getLatLng());
          lnglat = sr.forward([ll.lng(), ll.lat()]);
          return {x:lnglat[0], y:lnglat[1], spatialReference:{wkid:sr.wkid}};
      }
      parts = [];
      if (ov is LatLng){
        for (i=0; i< ovs.length; i++){
          ll = ovs[i] as LatLng;
          parts.push(sr.forward([ll.lng(),ll.lat()])); 
        }
        return {points:parts,spatialReference:{wkid:sr.wkid}};
      } else if (ov is Marker){
        for (i=0; i< ovs.length; i++){
          ll = (ovs[i] as Marker).getLatLng();
          parts.push(sr.forward([ll.lng(),ll.lat()])); 
        }
        return {points:parts,spatialReference:{wkid:sr.wkid}};
      }else if (ov is Polyline || ov is Polygon){
         for (i=0; i< ovs.length; i++){
          part = [];
          //var line:Polyline = ovs[i] as Polyline;
          ov = ovs[i];
          for (j =0; j< ov.getVertexCount(); j++){
            ll = ov.getVertex(j);
            part.push(sr.forward([ll.lng(),ll.lat()]));   
          }
          parts.push(part);
        }
        if (ov is Polyline){
           return {paths:parts,spatialReference:{wkid:sr.wkid}};
        } else {
          return {rings:parts,spatialReference:{wkid:sr.wkid}};
        }
      } 
    }
    public static function restRequest(url:String, params:Object, thisObj:IEventDispatcher, sucessFn:Function, failFn:Function=null):void {
      var full:String=url + (url.indexOf('?') === -1 ? '?' : '&');
      var service:HTTPService=new HTTPService();
      service.url=url;
      service.addEventListener(FaultEvent.FAULT, function(evt:FaultEvent):void {
          var err:ServiceError = new ServiceError({code:-1,message:evt.toString(),details:[]});
          if (thisObj != null) {
            thisObj.dispatchEvent(new ServiceEvent(ServiceEvent.ERROR, err));
          }
          if (failFn!=null){
            failFn(thisObj, err);
          }
        });
      service.addEventListener(ResultEvent.RESULT, function(evt:ResultEvent):void {
          var jsons:String=evt.result as String;
          var d:JSONDecoder=new JSONDecoder(jsons, true);
          var json:Object=d.getValue();
          if (json.error){
             var err:ServiceError = new ServiceError(json.error);
             thisObj.dispatchEvent(new ServiceEvent(ServiceEvent.ERROR, err));
             if (failFn!=null){
               failFn.call(thisObj,err);
             }
          } else if (sucessFn != null) {
            sucessFn.call(thisObj, json);
          }
        });
      service.send(params);
    /*
       if (params) {
       for (var x:String in params) {
       if (params.hasOwnProperty(x)) {
       full += (x + '=' + escape(params[x]) + '&');
       }
       }
       }
       var loader:URLLoader = new URLLoader();
       var request:URLRequest = new URLRequest(full);
       loader.addEventListener(Event.COMPLETE,function(evt:Event):void{
       var jsons:String = evt.target.data as String;
       var d:JSONDecoder = new JSONDecoder(jsons,true);
       var json:Object = d.getValue();
       callbackFn.call(this,json);;
       }
       );
       loader.addEventListener(IOErrorEvent.IO_ERROR, function(evt:IOErrorEvent):void{
       throw new Error(evt.text);
       });
       try {
       loader.load(request);
       } catch (error:Error) {
       trace("Unable to load requested document.");
     }*/
    }

    /**
     * Extract the substring from full string, between start string and end string
     * @param {Object} full
     * @param {Object} start
     * @param {Object} end
     */
    public static function extractString(full:String, start:String, end:String):String {
      var i:int=(start === '') ? 0 : full.indexOf(start);
      var e:int=end === '' ? full.length : full.indexOf(end, i + start.length);
      return full.substring(i + start.length, e);
    }

    public static function augmentObject(src:*, dest:*, force:Boolean=false):Object {
      if (src && dest) {
        var p:String;
        // used to count/check if it is a dyna class 
        // with properties that can be looped with for.. in
        // In AS3, for..in can not be used to loop properties of a class instance except those 
        // dynamic added. That makes converting parameter classes into REST request harder.
        var i:int=0;
        for (p in src) {
          i++;
          if (src.hasOwnProperty(p)) {
            if (force || !(p in dest) || (p in dest && !dest[p])) {
              dest[p]=src[p];
            }
          }
        }
        if (i == 0) {
          var varList:XMLList=flash.utils.describeType(src)..variable;
          for (i=0; i < varList.length(); i++) {
            p=varList[i].@name;
            if (src[p]) {
              dest[p]=src[p];
            }
          }
        }
      }
      return dest;
    }

    public static function isString(o:*):Boolean {
      return o && o is String;
    }

    public static function isArray(o:*):Boolean {
      return o && o is Array;
    }
     public static function getAttributeValue(attrs:*, name:String):* {
       if (attrs[name]) return attrs[name];
       for(var x:String in attrs){
         if (x.toUpperCase()==name.toUpperCase()){
           return attrs[x];
         }
       }
      return null;
    }

    public static function fromGeometryToJSON(geom:Object, opt_includeSR:Boolean=false):String {
      /*function fromPointsToJSON(pts) {
         var arr = [];
         for (var i = 0, c = pts.length; i < c; i++) {
         arr.push('[' + pts[i][0] + ',' + pts[i][1] + ']');
         }
         return '[' + arr.join(',') + ']';
         }
         function fromLinesToJSON(lines) {
         var arr = [];
         for (var i = 0, c = lines.length; i < c; i++) {
         arr.push(fromPointsToJSON(lines[i]));
         }
         return '[' + arr.join(',') + ']';
         }

         var json = '{';
         if (geom.x) {
         json += 'x:' + geom.x + ',y:' + geom.y;
         } else if (geom.xmin) {
         json += 'xmin:' + geom.xmin + ',ymin:' + geom.ymin + ',xmax:' + geom.xmax + ',ymax:' + geom.ymax;
         } else if (geom.points) {
         json += 'points:' + fromPointsToJSON(geom.points);
         } else if (geom.paths) {
         json += 'paths:' + fromLinesToJSON(geom.paths);
         } else if (geom.rings) {
         json += 'rings:' + fromLinesToJSON(geom.rings);
         }
         if (opt_includeSR && geom.spatialReference) {
         json += ',spatialReference:{wkid:' + geom.spatialReference.wkid + '}';
         }
         json += '}';
         return json;
       */
      var e:JSONEncoder=new JSONEncoder(geom);
      return e.getString();
    }
  }
}