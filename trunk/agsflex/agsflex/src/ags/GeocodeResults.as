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
  import com.google.maps.overlays.MarkerOptions;
  
  public class GeocodeResults
  {
    public var candidates:Array=[];
    public function GeocodeResults(params:*, sr:SpatialReference=null)
    {
      if (params && params.candidates){
        for (var i:int = 0; i< params.candidates.length; i++){
          candidates.push(new GeocodeResult(params.candidates[i],sr));
        }
      }
        
    }

  }
}