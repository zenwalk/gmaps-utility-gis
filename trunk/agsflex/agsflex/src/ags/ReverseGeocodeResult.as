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
 import com.google.maps.LatLng;
  
  public class ReverseGeocodeResult
  {
    public var address:*;
    public var location:LatLng;
    public function ReverseGeocodeResult(params:*=null, sr:SpatialReference=null)
    {
      if (params){
        sr = sr ||SpatialReferences.WGS84;
        var ll:Array=sr.reverse([params.location.x, params.location.y]);
        location = new LatLng(ll[1],ll[0]);
        address = params.address;
      }
    }

  }
}