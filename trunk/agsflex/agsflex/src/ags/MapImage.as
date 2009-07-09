package ags
{
  import com.google.maps.LatLngBounds;
  
  public class MapImage
  {
    public var extent:*;
    public var height:int;
    public var width:int;
    public var scale:Number;
    public var href:String;
    public var bounds:LatLngBounds;
    
    public function MapImage(params:*)
    {
      if (params){
        ArcGISUtil.augmentObject(params,this, false);
        if (extent){
          bounds = ArcGISUtil.fromEnvelopeToLatLngBounds(extent);
        } 
      }
      
    }

  }
}