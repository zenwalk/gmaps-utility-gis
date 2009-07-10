package ags
{
  import com.google.maps.interfaces.IOverlay;
  
  public class Feature
  {
    public var attributes:*;
    /**
    * IOverlay[]
    */ 
    public var geometry:Array;
    public function Feature(params:*=null, ovOpts:OverlayOptions=null, title:String=null)
    {
      if (params){
        if (params.geometry){
          geometry=ArcGISUtil.fromGeometryToOverlays(params.geometry, SpatialReferences.WGS84,ovOpts,title );
        }
        ArcGISUtil.augmentObject(params, this, false);
      }
    }

  }
}