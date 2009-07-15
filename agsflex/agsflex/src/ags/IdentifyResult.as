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
  import com.google.maps.interfaces.IOverlay;
  
  public class IdentifyResult
  {
    public var attributes:*;
    public var displayFieldName:String;
    /**
    * IOverlay[]
    */ 
    public var geometry:Array;
    public var geometryType:String;
    public var layerId:int;
    public var layerName:String;
    public var value:String;
    
    public function IdentifyResult(params:*=null, sr:SpatialReference=null, ovOpts:OverlayOptions=null)
    {
      if (params){
        if (params.geometry){
          geometry=ArcGISUtil.fromGeometryToOverlays(params.geometry, sr,ovOpts,params.value );
        }
        ArcGISUtil.augmentObject(params, this, false);
      }
    }

  }
}