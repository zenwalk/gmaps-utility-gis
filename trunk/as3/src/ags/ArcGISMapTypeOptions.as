package ags
{
  import com.google.maps.MapTypeOptions;
  
  public class ArcGISMapTypeOptions extends MapTypeOptions
  {
    
    public var name:String;
    public var projection:ArcGISProjection;
        
    public function ArcGISMapTypeOptions(opts:*=null)
    {
      if (opts) {
        ArcGISUtil.augmentObject(opts, this);
      }
    }

  }
}