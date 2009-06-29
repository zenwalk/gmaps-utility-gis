package ags {
  import com.adobe.serialization.json.*;
  import com.google.maps.LatLng;
  import com.google.maps.LatLngBounds;
  import com.google.maps.Map;

  import flash.events.*;
  import flash.net.*;

  import mx.rpc.events.*;
  import mx.rpc.http.*;


  /**
   * Utility tools
   */
  public class ArcGISUtil

  {
    public function ArcGISUtil() {

    }

    public static function getJSON(url:String, params:Object, callbackFn:Function):void {
      var full:String=url + (url.indexOf('?') === -1 ? '?' : '&');
      /* use mx framework will increase swc size dramatically even the final swf size is not directly impacted.
       */
      var service:HTTPService=new HTTPService();
      service.url=url;
      service.addEventListener(FaultEvent.FAULT, function(evt:FaultEvent):void {
          throw new Error(evt.message);
        });
      service.addEventListener(ResultEvent.RESULT, function(evt:ResultEvent):void {
          var jsons:String=evt.result as String;
          var d:JSONDecoder=new JSONDecoder(jsons, true);
          var json:Object=d.getValue();
          callbackFn.call(this, json);
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
    internal static function extractString(full:String, start:String, end:String):String {
      var i:int=(start === '') ? 0 : full.indexOf(start);
      var e:int=end === '' ? full.length : full.indexOf(end, i + start.length);
      return full.substring(i + start.length, e);
    }

    internal static function augmentObject(src:Object, dest:Object, force:Boolean=false):Object {
      if (src && dest) {
        var p:Object;
        for (p in src) {
          if (force || !(p in dest) || (p in dest && !dest[p])) {
            dest[p]=src[p];
          }
        }
      }
      return dest;
    }

    internal static function isString(o:*):Boolean {
      return o is String;
    }

    internal static function isArray(o:*):Boolean {
      return o is Array;
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
    ;

    /**
     * Helper method to convert an {@link ArcGISEnvelope} object to <code>GLatLngBounds</code>
     * @param {Envelope} extent
     * @return {GLatLngBounds} gLatLngBounds
     */
    public static function fromEnvelopeToLatLngBounds( /*Envelope*/ extent:*):LatLngBounds {
      var sr:ArcGISSpatialReference=ArcGISSpatialReferences.getSpatialReference(extent.spatialReference.wkid);
      sr=sr || ArcGISSpatialReferences.WGS84;
      var sw:Array=sr.reverse([extent.xmin, extent.ymin]);
      var ne:Array=sr.reverse([extent.xmax, extent.ymax]);
      return new LatLngBounds(new LatLng(sw[1], sw[0]), new LatLng(ne[1], ne[0]));
    }

    public static function fromLatLngBoundsToEnvelope(gLatLngBounds:LatLngBounds, spatialReference:ArcGISSpatialReference):* {
      if (spatialReference==null) spatialReference = ArcGISSpatialReferences.WEB_MERCATOR;
      var sw:Array=spatialReference.forward([gLatLngBounds.getSouthWest().lng(), gLatLngBounds.getSouthWest().lat()]);
      var ne:Array=spatialReference.forward([gLatLngBounds.getNorthEast().lng(), gLatLngBounds.getNorthEast().lat()]);
      return {xmin: sw[0], ymin: sw[1], xmax: ne[0], ymax: ne[1], spatialReference: {wkid: spatialReference.wkid}};
    }

    public static function fromLatLngToPoint(gLatLng:LatLng, sr:ArcGISSpatialReference):* {
      sr=sr || ArcGISSpatialReferences.WGS84;
      var p:Array=sr.forward([gLatLng.lng(), gLatLng.lat()]);
      return {x: p[0], y: p[1], spatialReference: {wkid: sr.wkid}};
    }

    /**
     * Add a ArcGIS Server resource to map. if it is cached, it will be added as a map type, if dynamic, it will be added as overlay.
     * @param map
     * @param url
     * @param opt_callback
     *
     */
    public static function addArcGISMap(map:Map, url:String, opt_callback:Function=null):void {
      var service:ArcGISMapService=new ArcGISMapService(url);
      service.addEventListener(ArcGISEvent.LOAD, function(evt:Event):void {
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
  }
}