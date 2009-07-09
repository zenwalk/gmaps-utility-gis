/*
*  ArcGIS for Google Maps Flash API
* @author nianwei at gmail dot com
*
* Licensed under the Apache License, Version 2.0:
*  http://www.apache.org/licenses/LICENSE-2.0
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
    /**
 * Transform an extent to this Spatial Reference and return 
 * a new instance of {@link ArcGISEnvelope} if the spatial references are different.
 * @param {Envelope} extent
 * @return {Envelope}
 */
    public function transform(extent:Object):Object{
      if (extent.spatialReference.wkid !== this.wkid) {
        var sr:SpatialReference = SpatialReferences.getSpatialReference(extent.spatialReference.wkid);
        var sw:Array = sr.reverse([extent.xmin, extent.ymin]);
        var ne:Array = sr.reverse([extent.ymin, extent.ymax]);
        sw = this.forward(sw);
        ne = this.forward(ne);
        return {
          xmin: sw[0],
          ymin: sw[1],
          xmax: ne[0],
          ymax: ne[1],
          spatialReference: {
            wkid: this.wkid
          }
        };
      } else {
        return extent;
      }
    }
  }
}