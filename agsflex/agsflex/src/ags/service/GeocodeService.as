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
 * This class represent an  <a href="http://resources.esri.com/help/9.3/arcgisserver/apis/rest/geocodeserver.html">GeocodeServer</a>
 *  service.
 */ 
  public dynamic class GeocodeService implements IEventDispatcher
  {
    
    
    public var url:String;
    
    public function GeocodeService(url:String)
    {
        dispatcher_ = new EventDispatcher(this);
        this.url = url;
        var me:GeocodeService = this;
        Util.getJSON(url, {
          f: 'json'
        }, function (json:*):void {
          me.init_(json);
        });
    
    }
    
    
  /**
   * init
   * @param {Object} json
   */
  private function init_ (json:*):void {
    Util.augmentObject(json, this);
    /**
     * This event is fired when the service and it's service info is loaded.
     * @name ArcGISGeocodeService#load
     * @event
     */
   // triggerEvent(this, 'load');
   this.dispatchEvent(new ServiceEvent(ServiceEvent.LOAD));
  };
  /**
   * If this ArcGISGeocodeService meta data has loaded. useful to get the Spatial Reference information.
   * @return {Boolean}
   */
  public function hasLoaded():Boolean {
    return this.addressFields !== null;
  };
  public function findAddressCandidates (gparams:*, callback:Function):void {
    var params:* = Util.augmentObject(gparams, {});
    params.f = params.f || 'json';
    if (params.inputs) {
      Util.augmentObject(params.inputs, params);
      delete params.inputs;
    }
    if (Util.isArray(params.outFields)) {
      params.outFields = params.outFields.join(',');
    }
    Util.getJSON(this.url + '/findAddressCandidates', params, callback);
  };

  public function geocode (gparams:*, callback:Function):void {
  this.findAddressCandidates(gparams, callback);
  }
  /**
 * The reverseGeocode operation is The reverseGeocode operation is performed on a geocode service resource. 
 * The result of this operation is a reverse geocoded address resource.
 *  param is an instance of {@link ArcGISReverseGeocodeParameters}. An instance of
 *  {@link ArcGISReverseGeocodeResult} will be passed into callback function.
 * @param {ReverseGeocodeParameters} params
 * @param {Function} callback
 */
  public function reverseGeocode (gparams:*, callback:Function):void  {
    var params:* = Util.augmentObject(gparams, {});
    params.f = params.f || 'json';
    if (!Util.isString(params.location)) {
      params.location = Util.fromGeometryToJSON(params.location);
    }
    Util.getJSON(this.url + '/reverseGeocode', params, callback);
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