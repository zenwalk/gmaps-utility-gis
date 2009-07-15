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
  import com.google.maps.overlays.*;
  /**
  * This is a wrapper for google overlay options. Used in cases when the geometry type is unknown (e.g identify results).
  */ 
  public class OverlayOptions
  {
    public var marker:MarkerOptions;
    public var polyline:PolylineOptions;
    public var polygon:PolygonOptions;
    
    public function OverlayOptions(params:*=null)
    {
      if (params){
        ArcGISUtil.augmentObject(params, this, false);
      }
      
    }

  }
}