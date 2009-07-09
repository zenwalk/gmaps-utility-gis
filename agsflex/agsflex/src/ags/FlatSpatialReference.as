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
  * This class is a special type of coordinate reference assuming lat/lng will increase
   * evenly as if earth is flat. Approximate for small regions without implementing
   * a real projection.
   */
  public class FlatSpatialReference extends SpatialReference
  {
    private var lng_:Number;
    private var lat_:Number;
    private var x_:Number;
    private var y_:Number;
    private var xscale_:Number;
    private var yscale_:Number;
    
     /**
   * Create a flat transform spatial reference. The <code>params</code> passed in constructor should have the following properties:
   * <li><code>wkid</code>: wkid
   * <li><code>latlng</code>:  {@link ArcGISEnvelope} in latlng unit;
   * <li><code>coords</code>: {@link ArcGISEnvelope} in coords unit
   * @name ArcGISFlatSpatialReference
   * @param {Object} params
   * @extends ArcGISSpatialReference
   */
    public function FlatSpatialReference(params:Object)
    {
      params = params || {};   
      super(params);
      this.lng_ = params.latlng.xmin;
      this.lat_ = params.latlng.ymin;
      this.x_ = params.coords.xmin;
      this.y_ = params.coords.ymin;
      this.xscale_ = (params.coords.xmax - params.coords.xmin) / (params.latlng.xmax - params.latlng.xmin);
      this.yscale_ = (params.coords.ymax - params.coords.ymin) / (params.latlng.ymax - params.latlng.ymin);
    }
    override public function forward(lnglat:Array):Array{
      var E:Number = this.x_ + (lnglat[0] - this.lng_) * this.xscale_;
      var N:Number = this.y_ + (lnglat[1] - this.lat_) * this.yscale_;
      return [E, N];
    } 
    override public function reverse(coords:Array):Array{
      var lng:Number = this.lng_ + (coords[0] - this.x_) / this.xscale_;
      var lat:Number = this.lat_ + (coords[1] - this.y_) / this.yscale_;
      return [lng, lat];
    }
    override public function getCircumference():Number{
      return this.xscale_ * 360;
    }
  }
}