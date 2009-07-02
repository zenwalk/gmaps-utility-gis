/*
*  ArcGIS for Google Maps Flash API
* @author nianwei at gmail dot com
*
* Licensed under the Apache License, Version 2.0:
*  http://www.apache.org/licenses/LICENSE-2.0
*/
package ags.service
{
  import flash.events.Event;
  import flash.events.EventDispatcher;
  import flash.events.IEventDispatcher;
   import ags.*;
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
  public function project (params:*, callback:Function):void{
    if (!params) {
      return;
    }
    params.f = params.f || 'json';
    if (!Util.isString(params.geometries)) {
      // problem: REST seems do not like esriGeometryEnvelope
      var gt:String = Constants.ESRI_GEOMETRY_POINT;
      var json:Array = [];
      for (var i:int = 0, c:int = params.geometries.length; i < c; i++) {
        var g:* = params.geometries[i];
        if (i === 0) {
          if (g.points) {
            gt = Constants.ESRI_GEOMETRY_MULTIPOINT;
          } else if (g.paths) {
            gt = Constants.ESRI_GEOMETRY_POLYLINE;
          } else if (g.rings) {
            gt = Constants.ESRI_GEOMETRY_POLYGON;
          }
        }
        json.push(Util.fromGeometryToJSON(g, false));
      }
      params.geometries = '{ geometryType:' + gt + ', geometries:[' + json.join(',') + ']}';
    }
    Util.getJSON(this.url + '/project', params, callback);
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