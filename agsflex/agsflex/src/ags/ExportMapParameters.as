/*
* ArcGIS for Google Maps Flash API
* @author nianwei at gmail dot com
*
* Licensed under the Apache License, Version 2.0:
*  http://www.apache.org/licenses/LICENSE-2.0
*/
package ags
{
  import com.google.maps.LatLngBounds;
  
  /**
  * Represent the parameters needed to perform an exportMap operation on a map service.
  * Most of the value will be set automatically in ArcGISMapOverlay.
  */ 
  public class ExportMapParameters
  {
    public var bbox:*;
    public var bboxSR:int;
    public var f:String;
    public var format:String;
    public var height:int;
    public var width:int;
    public var imageSR:int;
    //public var bounds_:LatLngBounds;
    public var dpi:int;
    
    /**
     *Allows you to filter the features of individual layers in the exported map by specifying 
     * definition expressions for those layers. Syntax: layerId1:layerDef1;layerId2:layerDef2 
     * Example: 0:POP2000 > 1000000;5:AREA > 100000 
     */    
    public var layerDefs:String;
    /**
     *Syntax: [show | hide | include | exclude]:layerId1,layerId2 
     */    
    public var layers:String;
    /**
    * Syntax: <width>, <height>. You can also set width and height.
    */ 
    public var size:String;
    
    public var transparent:Boolean;
    
    public function ExportMapParameters(params:*=null)
    {
      if (params){
        ArcGISUtil.augmentObject(params, this, false);
      }
      
    }

    public function set bounds(bnds:LatLngBounds):void{
      bbox = {minx:bnds.getWest(), miny:bnds.getSouth(), maxx:bnds.getEast(), maxy:bnds.getNorth()};
      bboxSR = SpatialReferences.WGS84.wkid;
    }
  }
}