/*
* ArcGIS for Google Maps Flash API
* @author nianwei at gmail dot com
*
* Licensed under the Apache License, Version 2.0:
*  http://www.apache.org/licenses/LICENSE-2.0
*/
package ags.gmaps {
  import com.google.maps.MapType;
  import com.google.maps.MapTypeOptions;
  import com.google.maps.interfaces.*;
  
  import flash.events.*;
 import ags.service.*;
 import ags.*;
 

/**
 * A customized map type that can be used as background map.
 */ 
  public class ArcGISMapType extends MapType {// MapType already but do not know what event implements IEventDispatcher {
    
    private var projection_:ArcGISProjection;
    
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
      var prj:ArcGISProjection=opt_typeOpts.projection||layer0.getProjection();
      var gOpts:MapTypeOptions=new MapTypeOptions({tileSize: prj.getTileSize()});
      Util.augmentObject(opt_typeOpts, gOpts);
      super(layers, prj, opt_typeOpts.name || layer0.getMapService().name, gOpts);
      
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