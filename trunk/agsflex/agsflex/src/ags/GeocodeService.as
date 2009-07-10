/*
 *  ArcGIS for Google Maps Flash API
 * @author nianwei at gmail dot com
 *
 * Licensed under the Apache License, Version 2.0:
 *  http://www.apache.org/licenses/LICENSE-2.0
 */
package ags {
  import flash.events.Event;
  import flash.events.EventDispatcher;
  import flash.events.IEventDispatcher;

  /**
   * This class represent an  <a href="http://resources.esri.com/help/9.3/arcgisserver/apis/rest/geocodeserver.html">GeocodeServer</a>
   *  service.
   */
  public dynamic class GeocodeService implements IEventDispatcher {


    public var url:String;
    public var serviceDescription:String;
    public var addressFields:Array;
    public var candidateFields:Array;
    public var intersectionCandidateFields:Array;
    public var spatialReference:SpatialReference;
    public var locatorProperties:*;

    public function GeocodeService(url:String) {
      dispatcher_=new EventDispatcher(this);
      this.url=url;
      var me:GeocodeService=this;
      ArcGISUtil.restRequest(url, {f: 'json'}, me, function(json:*):void {
          me.init_(json);
        });

    }


    /**
     * init
     * @param {Object} json
     */
    private function init_(json:*):void {
      this.spatialReference=new SpatialReference(json.spatialReference);
      ArcGISUtil.augmentObject(json, this);
      /**
       * This event is fired when the service and it's service info is loaded.
       * @name ArcGISGeocodeService#load
       * @event
       */
      // triggerEvent(this, 'load');
      this.dispatchEvent(new ServiceEvent(ServiceEvent.LOAD, this));
    }
    

    /**
     * If this ArcGISGeocodeService meta data has loaded. useful to get the Spatial Reference information.
     * @return {Boolean}
     */
    public function hasLoaded():Boolean {
      return this.addressFields !== null;
    }
    

    public function findAddressCandidates(gparams:GeocodeParameters, callbackFn:Function=null, failedFn:Function=null):void {
      var params:*=ArcGISUtil.augmentObject(gparams, {});
      params.f=params.f || 'json';
      if (params.inputs) {
        ArcGISUtil.augmentObject(params.inputs, params);
        delete params.inputs;
      }
      if (ArcGISUtil.isArray(params.outFields)) {
        params.outFields=params.outFields.join(',');
      }
      var me:GeocodeService=this;
      ArcGISUtil.restRequest(this.url + '/findAddressCandidates', params, this, function(json:*):void {
          var res:GeocodeResults=new GeocodeResults(json, me.spatialReference);
          if (callbackFn != null) {
            callbackFn.call(me, res);
          }
          me.dispatchEvent(new ServiceEvent(ServiceEvent.GEOCODE_COMPLETE, res));
        }, failedFn);
    }
    

    public function geocode(gparams:GeocodeParameters, callback:Function=null, failedFn:Function=null):void {
      this.findAddressCandidates(gparams, callback, failedFn);
    }

    /**
     * The reverseGeocode operation is The reverseGeocode operation is performed on a geocode service resource.
     * The result of this operation is a reverse geocoded address resource.
     *  param is an instance of {@link ArcGISReverseGeocodeParameters}. An instance of
     *  {@link ArcGISReverseGeocodeResult} will be passed into callback function.
     * @param {ReverseGeocodeParameters} params
     * @param {Function} callback
     */
    public function reverseGeocode(gparams:ReverseGeocodeParameters, callbackFn:Function=null, failedFn:Function=null):void {
      var params:*=ArcGISUtil.augmentObject(gparams, {});
      params.f=params.f || 'json';
      if (!ArcGISUtil.isString(params.location)) {
        params.location=ArcGISUtil.fromGeometryToJSON(ArcGISUtil.fromLatLngToPoint(params.location));
      }
      var me:GeocodeService=this;
      ArcGISUtil.restRequest(this.url + '/reverseGeocode', params, this, function(json:*):void {
          var res:ReverseGeocodeResult=new ReverseGeocodeResult(json, me.spatialReference);
          if (callbackFn != null) {
            callbackFn.call(me, res);
          }
          me.dispatchEvent(new ServiceEvent(ServiceEvent.REVERSEGEOCODE_COMPLETE, res));
        }, failedFn);
    }
    


    private var dispatcher_:EventDispatcher;

    public function addEventListener(type:String, listener:Function, useCapture:Boolean=false, priority:int=0, useWeakReference:Boolean=false):void {

      dispatcher_.addEventListener(type, listener, useCapture, priority);
    }

    public function dispatchEvent(evt:Event):Boolean {
      return dispatcher_.dispatchEvent(evt);
    }

    public function hasEventListener(type:String):Boolean {
      return dispatcher_.hasEventListener(type);
    }

    public function removeEventListener(type:String, listener:Function, useCapture:Boolean=false):void {
      dispatcher_.removeEventListener(type, listener, useCapture);
    }

    public function willTrigger(type:String):Boolean {
      return dispatcher_.willTrigger(type);
    }

  }
}