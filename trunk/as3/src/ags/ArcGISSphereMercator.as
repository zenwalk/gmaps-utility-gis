package ags
{
  /**
  * A special type of spatial reference system that uses mercator projection and consider earth as sphere.
  */ 
  public class ArcGISSphereMercator extends ArcGISSpatialReference
  {
     private var a_:Number;
     private var lamdaF_:Number;
     
    /**
 * Creates a Spatial Reference based on Sphere Mercator Projection. 
 * The <code>params</code> passed in constructor should have the following properties:
 * <code><br/>-wkid: wkid
 * <br/>-semi_major:  ellipsoidal semi-major axis 
 * <br/>-unit: meters per unit
 * <br/>-central_meridian: lamdaF, longitude of the false origin  (with respect to the prime meridian)
 * </code>
 * <br/>e.g. The "Web Mercator" used in ArcGIS Server:<br/>
 * <code> var web_mercator  = new ArcGISSphereMercator({wkid: 102113,  semi_major:6378137.0,  central_meridian:0, unit: 1 });
 * </code>
 * @name ArcGISSphereMercator
 * @class This class (<code>google.maputils.arcgis.SphereMercator</code>) is the Projection Default Google Maps uses. It is a special form of Mercator.
 * @param {Object} params 
 * @extends ArcGISSpatialReference
 */
    public function ArcGISSphereMercator(params:Object)
    {
      params = params || {};
      super(params);
      this.a_ = (params.semi_major || 6378137.0) / (params.unit || 1);
      this.lamdaF_ = (params.central_meridian || 0.0) * RAD_DEG;//(Math.PI / 180);
    }
    override public function forward(lnglat:Array):Array{
      var phi:Number = lnglat[1] * RAD_DEG;//(Math.PI / 180);
      var lamda:Number = lnglat[0] * RAD_DEG;
      var E:Number = this.a_ * (lamda - this.lamdaF_);
      var N:Number = (this.a_ / 2) * Math.log((1 + Math.sin(phi)) / (1 - Math.sin(phi)));
      return [E, N];
    } 
    override public function reverse(coords:Array):Array{
      var E:Number = coords[0];
      var N:Number = coords[1];
      var phi:Number = Math.PI / 2 - 2 * Math.atan(Math.exp(-N / this.a_));
      var lamda:Number = E / this.a_ + this.lamdaF_;
      return [lamda / RAD_DEG, phi / RAD_DEG];
    }
    override public function getCircumference():Number{
      return Math.PI * 2 * this.a_;
    }
  }
}