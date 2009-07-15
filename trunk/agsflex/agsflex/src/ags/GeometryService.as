/*
 * ArcGIS for Google Maps Flash API
 *
 * License http://www.apache.org/licenses/LICENSE-2.0
 */
 /**
 * @author nianwei at gmail dot com
 */ 

package ags
{
  import flash.events.Event;
  import flash.events.EventDispatcher;
  import flash.events.IEventDispatcher;
/**
This class represent an  
 * <a href="http://resources.esri.com/help/9.3/arcgisserver/apis/rest/geometryserver.html">Geometry</a>
 *  service.
 */
  public class GeometryService implements IEventDispatcher
  {
    public var url:String;
    public function GeometryService(url:String)
    {
      dispatcher_= new EventDispatcher(this);
      this.url  = url;
    }
/**
   * This resource projects an array of input geometries from an input spatial reference
   * to an output spatial reference
   * @param {ProjectParameters} params
   * @param {Function} callback
   */
  public function project (params:*, callbackFn:Function=null, failedFn:Function=null):void{
    if (!params) {
      return;
    }
    params.f = params.f || 'json';
    if (!ArcGISUtil.isString(params.geometries)) {
      // problem: REST seems do not like esriGeometryEnvelope
      var gt:String = ArcGISConstants.GEOMETRY_POINT;
      var json:Array = [];
      for (var i:int = 0, c:int = params.geometries.length; i < c; i++) {
        var g:* = params.geometries[i];
        if (i === 0) {
          if (g.points) {
            gt = ArcGISConstants.GEOMETRY_MULTIPOINT;
          } else if (g.paths) {
            gt = ArcGISConstants.GEOMETRY_POLYLINE;
          } else if (g.rings) {
            gt = ArcGISConstants.GEOMETRY_POLYGON;
          }
        }
        json.push(ArcGISUtil.fromGeometryToJSON(g, false));
      }
      params.geometries = '{ geometryType:' + gt + ', geometries:[' + json.join(',') + ']}';
    }
    ArcGISUtil.restRequest(this.url + '/project', params, this, callbackFn, failedFn);
  };
    private var dispatcher_:EventDispatcher ;
    public function addEventListener(type:String, listener:Function, useCapture:Boolean = false, priority:int = 0, useWeakReference:Boolean = false):void{
       
        dispatcher_.addEventListener(type, listener, useCapture, priority);
    }
           
    public function dispatchEvent(evt:Event):Boolean{
        return dispatcher_.dispatchEvent(evt);
    }
    
    public function hasEventListener(type:String):Boolean{
        return dispatcher_.hasEventListener(type);
    }
    
    public function removeEventListener(type:String, listener:Function, useCapture:Boolean = false):void{
        dispatcher_.removeEventListener(type, listener, useCapture);
    }
                   
    public function willTrigger(type:String):Boolean {
        return dispatcher_.willTrigger(type);
    }
    
  }
}