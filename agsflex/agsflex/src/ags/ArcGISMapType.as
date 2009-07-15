/*
 * ArcGIS for Google Maps Flash API
 *
 * License http://www.apache.org/licenses/LICENSE-2.0
 */
 /**
 * @author nianwei at gmail dot com
 */ 

package ags {
  import com.google.maps.MapType;
  import com.google.maps.MapTypeOptions;
  import com.google.maps.interfaces.*;
  
  import flash.events.*;
 

/**
 * A customized map type that can be used as background map.
 */ 
  public class ArcGISMapType extends MapType {// MapType already implements IEventDispatcher {
    
    private var projection_:ArcGISTileConfig;
    
    public function ArcGISMapType(tileLayers:*, opt_typeOpts:ArcGISMapTypeOptions=null) {
      var me:ArcGISMapType = this;
      opt_typeOpts=opt_typeOpts || new ArcGISMapTypeOptions();
      var layers:Array;
      var i:int;
      if (tileLayers is String){
        layers = [new ArcGISTileLayer(tileLayers)];
      } else if (tileLayers is Array){
        if (tileLayers[0] is String){
          layers = [];
          for (i = 0; i < tileLayers.length; i++){
            layers.push(new ArcGISTileLayer(tileLayers[i]));
          }
        } else {
          layers = tileLayers;
        }
         
      }
      var layer0:ArcGISTileLayer=layers[0] as ArcGISTileLayer;
      var prj:ArcGISTileConfig=opt_typeOpts.projection||layer0.getProjection();
     // var gOpts:MapTypeOptions=new MapTypeOptions({tileSize: prj.getTileSize()});
     // ArcGISUtil.augmentObject(opt_typeOpts, gOpts);
      opt_typeOpts.tileSize =prj.getTileSize(); 
      super(layers, prj, opt_typeOpts.name || layer0.getMapService().name, opt_typeOpts);
      
      function checkLoaded():void{
        if (layersLoaded == layers.length){
          me.init_(layers, opt_typeOpts);
          me.dispatchEvent(new ServiceEvent(ServiceEvent.LOAD));
        }
      }
      var layersLoaded:int;
      for (i = 0 ; i < layers.length; i++){
        var layer:ArcGISTileLayer = layers[i];
        if (opt_typeOpts.projection){
          layer.projection_ = opt_typeOpts.projection;
        }
        var svc:MapService = layer.getMapService();
        if (svc.hasLoaded()){
          layersLoaded++;
        }else {
          svc.addEventListener(ServiceEvent.LOAD, function(evt:Event):void{
            layersLoaded++;
            checkLoaded();
          });
        }
      }
      checkLoaded();
    }
    private function init_(tileLayers:Array, opt_typeOpts:ArcGISMapTypeOptions):void{
      var layer:ArcGISTileLayer = tileLayers[0] as ArcGISTileLayer;
      this.projection_ = layer.getProjection();
    }
    
    public override function getTileSize():Number {
      return this.projection_?this.projection_.getTileSize():super.getTileSize();
    }
    public override function getProjection():IProjection {
      return this.projection_?this.projection_:super.getProjection();
    }
    
  }
}