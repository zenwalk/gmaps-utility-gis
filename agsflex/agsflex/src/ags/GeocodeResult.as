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
        if (!isNaN(params.location.x) && !isNaN( params.location.y)){
          var ll:Array=sr.reverse([params.location.x, params.location.y]);
          location = new LatLng(ll[1],ll[0]);
        } 
        address = params.address;
        attributes = params.attributes;
        score = params.score;
        // NAN will cause augument fail.
       // ags.ArcGISUtil.augmentObject(params, this, false);
      }
      
    }

  }
}