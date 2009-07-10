/*
* ArcGIS for Google Maps Flash API
* @author nianwei at gmail dot com
*
* Licensed under the Apache License, Version 2.0:
*  http://www.apache.org/licenses/LICENSE-2.0
*/
package ags {
  import com.google.maps.*;
  import com.google.maps.interfaces.*;

  import flash.display.DisplayObject;
  import flash.display.Loader;
  import flash.events.*;
  import flash.geom.Point;
  import flash.net.URLRequest;
   import ags.*;
 import ags.*;
  /**
   * Used for cached map service
   */
  //There some unique challenges in AS3 compare to JS in implementing this class :
  // --can not call super in a callback function, must be inside the constructor context
  //--copyright et once passed in constructor the overriden functions such as getCopyrightCollection etc does not seem to be used.
  public class ArcGISTileLayer extends TileLayerBase implements IEventDispatcher {

    private var baseUrl_:String;
    private var mapService_:MapService;
    private var urlTemplate_:String;
    private var numOfHosts_:int;
    internal var projection_:ArcGISTileConfig; // need access from MapType
    private var fullBounds_:* /*Envelope*/ ;
    private var initialBounds_:* /*Envelope*/ ;

    public function ArcGISTileLayer(service:*, opt_layerOpts:ArcGISTileLayerOptions=undefined) {
      dispatcher_=new EventDispatcher(this);
      opt_layerOpts=opt_layerOpts || new ArcGISTileLayerOptions({});
      this.mapService_=(service is MapService) ? service as MapService : new MapService(service as String);
      if (opt_layerOpts.name) {
        this.mapService_.name=opt_layerOpts.name;
      }
      this.alpha_=isNaN(opt_layerOpts.alpha) ? Alpha.OPAQUE : opt_layerOpts.alpha;

      //In the format of mt[number].domain.com
      if (opt_layerOpts.hosts) {
        var pro:String=ArcGISUtil.extractString(this.mapService_.url, '', '://');
        var host:String=ArcGISUtil.extractString(this.mapService_.url, '://', '/');
        var path:String=ArcGISUtil.extractString(this.mapService_.url, pro + '://' + host, '');
        this.urlTemplate_=pro + '://' + opt_layerOpts.hosts + path;
        this.numOfHosts_=parseInt(ArcGISUtil.extractString(opt_layerOpts.hosts, '[', ']'), 10);
      }
      var copy:ICopyrightCollection=opt_layerOpts.copyrights;
      if (!copy) {
        copy=new CopyrightCollection('pre');
        copy.addCopyright(new Copyright('1', new LatLngBounds(new LatLng(-90, -180), new LatLng(90, 180)), 0, ''));
      }
      this.copy_=copy;
      this.minZoom_=opt_layerOpts.minResolution || 0;
      this.maxZoom_=opt_layerOpts.maxResolution || 20;

      if (this.mapService_.hasLoaded()) {
        this.init_(opt_layerOpts);
      } else {
        var me:ArcGISTileLayer=this;
        this.mapService_.addEventListener(ServiceEvent.LOAD, function():void {
            me.init_(opt_layerOpts);
            me.dispatchEvent(new ServiceEvent(ServiceEvent.LOAD));
          });
      }
      super(this.copy_, this.minZoom_, this.maxZoom_, this.alpha_);
      if (this.mapService_.hasLoaded()) {
        dispatchEvent(new ServiceEvent(ServiceEvent.LOAD));
      }
    }

    /**
     * Initialize the tile layer from a loaded map service
     * @param {ArcGISMapService} mapService
     * @param {Object} opt_layerOpts
     */
    private function init_(opt_layerOpts:*):void {
      this.projection_=new ArcGISTileConfig(this.mapService_.tileInfo, this.mapService_.fullExtent);
      var copy:CopyrightCollection=opt_layerOpts.copyrights;
      if (!copy) {
        copy=new CopyrightCollection('');
        copy.addCopyright(new Copyright('1', ArcGISUtil.fromEnvelopeToLatLngBounds(this.mapService_.fullExtent), this.projection_.zoomOffset_, this.mapService_.copyrightText));
      }
      this.copy_=copy;
      this.minZoom_=opt_layerOpts.minResolution || this.projection_.minResolution();
      this.maxZoom_=opt_layerOpts.maxResolution || this.projection_.maxResolution();
      // It seems unlike in JS, AS3's super can be called only in one place in constructor, 
      // as a workaround all get methods are overriden.
      // TileLayerBase.call(this, copy, minZoom, maxZoom, opt_layerOpts);
      // super(copy, minZoom, maxZoom, opt_layerOpts.alpha);
    }
    

    /**
     * Creates and loads a tile (x, y) at the given zoom level.
     * @param tilePos  Tile coordinates.
     * @param zoom  Tile zoom.
     * @return  Display object representing the tile.
     */
    public override function loadTile(tile:Point, zoom:Number):DisplayObject {
      var url:String; //.minResolution()
      var z:Number=zoom - (this.projection_ ? this.projection_.zoomOffset_ : this.getMinResolution()); //.minResolution());
      if (!isNaN(tile.x) && !isNaN(tile.y) && z >= 0) {
        var u:String=this.mapService_.url;
        if (this.urlTemplate_) {
          u=this.urlTemplate_.replace('[' + this.numOfHosts_ + ']', '' + ((tile.y + tile.x) % this.numOfHosts_));
        }
        url=u + '/tile/' + z + '/' + tile.y + '/' + tile.x;

      }
      var loader:Loader=new Loader();
      loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, ioErrorHandler);
      loader.load(new URLRequest(url));
      return loader;
    }

    private function ioErrorHandler(event:IOErrorEvent):void {
      trace("ioErrorHandler: " + event);
    }

    /**
     * Gain access to the underline {@link ArcGISMapService}
     * @return {MapSerive}
     */
    public function getMapService():MapService {
      return this.mapService_;
    }

    /**
     * Get full bounds of the to the underline {@link ArcGISMapService}
     * @return {GLatLngBounds}
     */
    public function getFullBounds():LatLngBounds {
      this.fullBounds_=this.fullBounds_ || ArcGISUtil.fromEnvelopeToLatLngBounds(this.mapService_.fullExtent);
      return this.fullBounds_;
    }

    public function getInitialBounds():LatLngBounds {
      this.initialBounds_=this.initialBounds_ || ArcGISUtil.fromEnvelopeToLatLngBounds(this.mapService_.initialExtent);
      return this.initialBounds_;
    }

    /**
     * Returns the {@link ArcGISProjection}, a subclass of <code>GProjection</code>
     *  used by this ArcGISTileLayer.
     * @return {ArcGISProjection}
     */
    public function getProjection():ArcGISTileConfig {
      return this.projection_ || ArcGISTileConfig.GOOGLE_MAPS;
    }

    public function hasLoaded():Boolean {
      return this.mapService_.hasLoaded();
    }

    public function getName():String {
      return this.mapService_.name;
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


    private var copy_:ICopyrightCollection;

    public override function getCopyrightCollection():ICopyrightCollection {
      return this.copy_ ? this.copy_ : super.getCopyrightCollection();
    }
    private var maxZoom_:Number;

    public override function getMaxResolution():Number {
      return this.maxZoom_ ? this.maxZoom_ : super.getMaxResolution();
    }
    private var minZoom_:Number;

    public override function getMinResolution():Number {
      return this.minZoom_ ? this.minZoom_ : super.getMinResolution();
    }
    private var alpha_:Number;

    public override function getAlpha():Number {
      return this.alpha_ ? this.alpha_ : super.getAlpha();
    }

    public function setAlpha(alpha:Number):void {
      this.alpha_=alpha;
    }

  }
}