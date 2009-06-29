package ags
{
  import flash.events.Event;
  import flash.events.EventDispatcher;
  import flash.events.IEventDispatcher;
  import ags.*;
  
/**
 * This class represent an ArcGIS <a href="http://resources.esri.com/help/9.3/arcgisserver/apis/rest/geocodeserver.html">GeocodeServer</a>
 *  service.
 */ 
  public dynamic class ArcGISGeocodeService implements IEventDispatcher
  {
    public var url:String;
    
    public function ArcGISGeocodeService(url:String)
    {
        dispatcher_ = new EventDispatcher(this);
        this.url = url;
        var me:ArcGISGeocodeService = this;
        ArcGISUtil.getJSON(url, {
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
    ArcGISUtil.augmentObject(json, this);
    /**
     * This event is fired when the service and it's service info is loaded.
     * @name ArcGISGeocodeService#load
     * @event
     */
   // triggerEvent(this, 'load');
   this.dispatchEvent(new ArcGISEvent(ArcGISEvent.LOAD));
  };
  /**
   * If this ArcGISGeocodeService meta data has loaded. useful to get the Spatial Reference information.
   * @return {Boolean}
   */
  public function hasLoaded():Boolean {
    return this.addressFields !== null;
  };
  public function findAddressCandidates (gparams:*, callback:Function):void {
    var params:* = ArcGISUtil.augmentObject(gparams, {});
    params.f = params.f || 'json';
    if (params.inputs) {
      ArcGISUtil.augmentObject(params.inputs, params);
      delete params.inputs;
    }
    if (ArcGISUtil.isArray(params.outFields)) {
      params.outFields = params.outFields.join(',');
    }
    ArcGISUtil.getJSON(this.url + '/findAddressCandidates', params, callback);
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
    var params:* = ArcGISUtil.augmentObject(gparams, {});
    params.f = params.f || 'json';
    if (!ArcGISUtil.isString(params.location)) {
      params.location = ArcGISUtil.fromGeometryToJSON(params.location);
    }
    ArcGISUtil.getJSON(this.url + '/reverseGeocode', params, callback);
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