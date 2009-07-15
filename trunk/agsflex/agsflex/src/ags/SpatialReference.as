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
  /**
  * Used to convert LatLng to other coordinate systems.
  */ 
  public class SpatialReference
  {
    protected var RAD_DEG:Number  =  Math.PI / 180.0;
    private var wkid_:int;
    public function SpatialReference(params:Object)
    {
      //TODO: implement function
      this.wkid_ = params?params.wkid:4326;
    }
    public function get wkid():int {
      return wkid_;
    }
     /**
   * Convert Lat Lng to real-world coordinates.
   * Note both input and output are array of [x,y], although their values in different units.
   * @param {Number[]} lnglat
   * @return {Number[]}
   */
    public function forward(lnglat:Array):Array{
      return lnglat;
    }
    public function reverse(coords:Array):Array{
      return coords;
    }
    public function getCircumference():Number{
      return 360;
    }
  
    
  }
}