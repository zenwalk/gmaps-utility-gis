package ags {
  
  public class Util {
  //  import com.adobe.serialization.json.*;
    import ags.json.*;
    import flash.events.*;
    import flash.geom.Point;
    import flash.net.*;

    import mx.rpc.events.*;
    import mx.rpc.http.*;
    import ags.*;

    public function Util() {
    }

    public static function getJSON(url:String, params:Object, sucessFn:Function, faultFn:Function=null):void {
      var full:String=url + (url.indexOf('?') === -1 ? '?' : '&');
      /* use mx framework will increase swc size dramatically even the final swf size is not directly impacted.
       */
      var service:HTTPService=new HTTPService();
      service.url=url;
      service.addEventListener(FaultEvent.FAULT, function(evt:FaultEvent):void {
          if (faultFn!=null){
            faultFn.call(this,evt.message);
          }
          
        });
      service.addEventListener(ResultEvent.RESULT, function(evt:ResultEvent):void {
          var jsons:String=evt.result as String;
          var d:JSONDecoder=new JSONDecoder(jsons, true);
          var json:Object=d.getValue();
          if (sucessFn!=null){
            sucessFn.call(this, json);
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

    public static function augmentObject(src:Object, dest:Object, force:Boolean=false):Object {
      if (src && dest) {
        var p:Object;
        for (p in src) {
          if (src.hasOwnProperty(p)){
            if (force || !(p in dest) || (p in dest && !dest[p])) {
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