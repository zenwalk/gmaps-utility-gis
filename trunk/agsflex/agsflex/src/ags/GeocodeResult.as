/*
* ArcGIS for Google Maps Flash API
* @author nianwei at gmail dot com
*
* Licensed under the Apache License, Version 2.0:
*  http://www.apache.org/licenses/LICENSE-2.0
*/
package ags
{
  import com.google.maps.LatLng;
  
  public class GeocodeResult
  {
    public var address:String;
    public var attributes:*;
    public var location:LatLng;
    public var score:Number;
    public function GeocodeResult(params:*=null, sr:SpatialReference=null)
    {
      if (params){
        sr = sr ||SpatialReferences.WGS84;
        var ll:Array=sr.reverse([params.location.x, params.location.y]);
        location = new LatLng(ll[1],ll[0]);
        ags.ArcGISUtil.augmentObject(params, this, false);
      }
      
    }

  }
}