package ags {
  import com.google.maps.*;
  import com.google.maps.interfaces.*;
  import com.google.maps.overlays.OverlayBase;

  import flash.events.*;
  import flash.geom.Point;
  import ags.*;

  import mx.controls.Image;

  /**
   * This is the UI component of an dynamic map service, used as an IOverlay.
   */
  public class ArcGISMapOverlay extends OverlayBase {
    private var minZoom_:Number;
    private var maxZoom_:Number;
    private var mapService_:ArcGISMapService;
    private var exportParams_:*;
    private var drawing_:Boolean;
    private var redraw_:Boolean;
    private var map_:IMap;
    private var fullBounds_:LatLngBounds;
    private var initialBounds_:LatLngBounds;
    private var bounds_:LatLngBounds;
    private var moveend_:Boolean;
    // private var visible_:Boolean;
    private var img_:Image;
    private var alpha_:Number;

    public function ArcGISMapOverlay(service:*, opt_overlayOpts:ArcGISMapOverlayOptions=null) {
      super();
      opt_overlayOpts=opt_overlayOpts || new ArcGISMapOverlayOptions({});
      this.mapService_=(service is ArcGISMapService) ? service as ArcGISMapService : new ArcGISMapService(service);

      if (opt_overlayOpts.name) {
        this.mapService_.name=opt_overlayOpts.name;
      }
      this.alpha_=opt_overlayOpts.alpha || 1;
      this.minZoom_=opt_overlayOpts.minResolution;
      this.maxZoom_=opt_overlayOpts.maxResolution;
      if (this.mapService_.hasLoaded()) {
        this.init_(opt_overlayOpts);
      } else {
        var me:ArcGISMapOverlay=this;
        this.mapService_.addEventListener(ArcGISEvent.LOAD, function(event:Event):void {
            me.init_(opt_overlayOpts);
          });
      }
      this.addEventListener(MapEvent.OVERLAY_ADDED, onOverlayAdded);
      this.addEventListener(MapEvent.OVERLAY_REMOVED, onOverlayRemoved);
      this.addEventListener(MapEvent.MAPTYPE_CHANGED, refresh);
   }

    private function init_(opt_overlayOpts:ArcGISMapOverlayOptions):void {
      // this.opacity_  =  opt_overlayOpts.opacity || 1;
      this.exportParams_=opt_overlayOpts.exportParams || {};
      // if the map imaging is been generated on server.
      this.drawing_=false;
      // if a follow up refresh is needed, normally cause by map view change before
      // the previous map has finished drawing.
      this.redraw_=false;
      if (this.img_ != null) {
        this.refresh();
      }
      this.dispatchEvent(new ArcGISEvent(ArcGISEvent.LOAD));
    }

    public override function getDefaultPane(map:IMap):IPane {
      this.map_=map;
      return map.getPaneManager().getPaneById(PaneId.PANE_OVERLAYS);
    }

    public override function positionOverlay(zoomChanged:Boolean):void {
      if (this.bounds_ && this.img_ != null && this.pane != null) {
        var point:Point=this.pane.fromLatLngToPaneCoords(this.bounds_.getNorthWest());
        this.img_.x=point.x;
        this.img_.y=point.y;
      }
    }

    private function onOverlayAdded(event:MapEvent):void {
      this.map_.addEventListener(MapMoveEvent.MOVE_END, onMapMoveEnd);
      this.img_=new Image();
      this.img_.alpha=this.alpha_;
      this.addChild(this.img_);
      if (this.mapService_.hasLoaded()) {
        this.refresh();
      }
      this.img_.addEventListener(Event.COMPLETE, onImageLoadComplete);
    }
    private function onImageLoadComplete(event:Event):void{
      //This is an advantage AS3 over JS, sort of know when image are loaded, then dispatch end event.
      this.dispatchEvent(new ArcGISEvent(ArcGISEvent.EXPORTIMAGE_END));
    }

    private function onOverlayRemoved(event:MapEvent):void {
      // trace('onOverlayRemoved');
      this.img_.source=null;
      this.removeChild(this.img_);
      this.map_.removeEventListener(MapMoveEvent.MOVE_END, refresh);
    }

    private function onMapMoveEnd(event:MapMoveEvent):void {
      // trace('onMapMoveEnd');
      this.refresh();
    }
    public function refresh():void {
      if (!this.mapService_.hasLoaded() || this.map_ === null) {
        return;
      }
      if (this.drawing_ === true) {
        this.redraw_=true;
        return;
      }
      //if (this.img_ !== null && this.moveend_) {
      this.img_.source=null;
      //}

      var bnds:LatLngBounds=this.map_.getLatLngBounds();
      var prj:IProjection=this.map_.getCurrentMapType().getProjection();
      var sr:ArcGISSpatialReference;
      if (prj is ArcGISProjection) {
        sr=(prj as ArcGISProjection).getSpatialReference();
      } else {
        sr=ArcGISSpatialReferences.WEB_MERCATOR;
      }
      var me:ArcGISMapOverlay=this;
      var params:*=this.exportParams_;
      params.size='' + this.map_.getSize().x + ',' + this.map_.getSize().y;
      params.bbox=ArcGISUtil.fromLatLngBoundsToEnvelope(bnds, sr);
      params.bboxSR=sr.wkid;
      params.imageSR=sr.wkid;
      this.drawing_=true;
      this.dispatchEvent(new ArcGISEvent(ArcGISEvent.EXPORTIMAGE_START));
      this.mapService_.exportMap(params, function(json:*):void {
          me.drawing_=false;
          if (me.redraw_ === true) {
            me.redraw_=false;
            me.refresh();
            return;
          }
          if (json.href) {
            me.bounds_=ArcGISUtil.fromEnvelopeToLatLngBounds(json.extent);
            //var wrapWidth:Number=me.map_.getCurrentMapType().getProjection().getWrapWidth(me.map_.getZoom());
            me.img_.width=json.width;
            me.img_.height=json.width;
            me.img_.source=json.href;
            me.positionOverlay(false);
          } else {
            me.img_.source=null;
          }
          
          
        });
    }

    public function getMapService():ArcGISMapService {
      return this.mapService_;
    }

    public function getFullBounds():LatLngBounds {
      this.fullBounds_=this.fullBounds_ || ArcGISUtil.fromEnvelopeToLatLngBounds(this.mapService_.fullExtent);
      return this.fullBounds_;
    }

    public function getInitialBounds_():LatLngBounds {
      this.initialBounds_=this.initialBounds_ || ArcGISUtil.fromEnvelopeToLatLngBounds(this.mapService_.initialExtent);
      return this.initialBounds_;
    }

    public function hasLoaded():Boolean {
      return this.mapService_.hasLoaded();
    }

    public function show():void {
      this.visible=true;
    }

    public function hide():void {
      this.visible=false;
    }
    
    public function setAlpha(alpha:Number):void{
      this.alpha_ = alpha;
      if (this.img_!=null){
        this.img_.alpha = alpha;
      }
    }

  }
}