/*
 * ArcGIS for Google Maps Flash API
 *
 * License http://www.apache.org/licenses/LICENSE-2.0
 */
 /**
 * @author nianwei at gmail dot com
 */ 

package ags {

  /**
   * This class represents a Spatial Reference System based on
   * <a target  = wiki href  = 'http://en.wikipedia.org/wiki/Transverse_Mercator_projection'>Transverse Mercator Projection</a>
   */
  public class TransverseMercator extends SpatialReference {
    private var a_:Number;
    private var k0_:Number;
    private var lamdaF_:Number;
    private var FE_:Number;
    private var FN_:Number;
    private var es_:Number;
    private var ep4_:Number;
    private var ep6_:Number;
    private var eas_:Number;
    private var M0_:Number;

    /**
     * Create a Transverse Mercator Projection. The <code>params</code> passed in constructor should contain the
     * following properties: <br/>
     * <code>
     * <br/>-wkid: well-known id
     * <br/>-semi_major:  ellipsoidal semi-major axis in meters
     * <br/>-unit: meters per unit
     * <br/>-inverse_flattening: inverse of flattening of the ellipsoid where 1/f  =  a/(a - b)
     * <br/>-Scale Factor: scale factor at origin
     * <br/>-latitude_of_origin: phiF, latitude of the false origin
     * <br/>-central_meridian: lamdaF, longitude of the false origin  (with respect to the prime meridian)
     * <br/>-false_easting: FE, false easting, the Eastings value assigned to the natural origin
     * <br/>-false_northing: FN, false northing, the Northings value assigned to the natural origin
     * </code>
     * <br/>e.g. Georgia West State Plane NAD83 Feet:
     * <br/><code> var gawsp83  = new ArcGISTransverseMercator({wkid: 102667, semi_major:6378137.0,
     *  inverse_flattening:298.257222101,central_meridian:-84.16666666666667, latitude_of_origin: 30.0,
     *  scale_factor:0.9999,'false_easting':2296583.333333333, 'false_northing':0, unit: 0.3048006096012192});
     *  </code>
     * @param {Object} params
     * @name ArcGISTransverseMercator
     * @extends ArcGISSpatialReference
     */
    public function TransverseMercator(params:Object) {
      params=params || {};
      super(params);
      //GLatLng(33.74561,-84.454308)<  === >  GPoint(2209149.07977075, 1362617.71496891);
      this.a_=params.semi_major / params.unit; //this.
      var f_i:Number=params.inverse_flattening;
      this.k0_=params.scale_factor;
      var phiF:Number=params.latitude_of_origin * RAD_DEG; //(Math.PI / 180);
      this.lamdaF_=params.central_meridian * RAD_DEG;
      this.FE_=params.false_easting; //this.
      this.FN_=params.false_northing; //this.
      var f:Number=1.0 / f_i; //this.
      /*e: eccentricity of the ellipsoid where e^2  =  2f - f^2 */
      this.es_=2 * f - f * f;
      //var _e  =  Math.sqrt(this.es_);
      /* e^4 */
      this.ep4_=this.es_ * this.es_;
      /* e^6 */
      this.ep6_=this.ep4_ * this.es_;
      /* e'  second eccentricity where e'^2  =  e^2 / (1-e^2) */
      this.eas_=this.es_ / (1 - this.es_);
      this.M0_=this.calc_m_(phiF, this.a_, this.es_, this.ep4_, this.ep6_);
    }

    private function calc_m_(phi:Number, a:Number, es:Number, ep4:Number, ep6:Number):Number {
      return a * ((1 - es / 4 - 3 * ep4 / 64 - 5 * ep6 / 256) * phi - (3 * es / 8 + 3 * ep4 / 32 + 45 * ep6 / 1024) * Math.sin(2 * phi) + (15 * ep4 / 256 + 45 * ep6 / 1024) * Math.sin(4 * phi) - (35 * ep6 / 3072) * Math.sin(6 * phi));
    }

    override public function forward(lnglat:Array):Array {
      var phi:Number=lnglat[1] * RAD_DEG; // (Math.PI / 180);
      var lamda:Number=lnglat[0] * RAD_DEG; //(Math.PI / 180);
      var nu:Number=this.a_ / Math.sqrt(1 - this.es_ * Math.pow(Math.sin(phi), 2));
      var T:Number=Math.pow(Math.tan(phi), 2);
      var C:Number=this.eas_ * Math.pow(Math.cos(phi), 2);
      var A:Number=(lamda - this.lamdaF_) * Math.cos(phi);
      var M:Number=this.calc_m_(phi, this.a_, this.es_, this.ep4_, this.ep6_);
      var E:Number=this.FE_ + this.k0_ * nu * (A + (1 - T + C) * Math.pow(A, 3) / 6 + (5 - 18 * T + T * T + 72 * C - 58 * this.eas_) * Math.pow(A, 5) / 120);
      var N:Number=this.FN_ + this.k0_ * (M - this.M0_) + nu * Math.tan(phi) * (A * A / 2 + (5 - T + 9 * C + 4 * C * C) * Math.pow(A, 4) / 120 + (61 - 58 * T + T * T + 600 * C - 330 * this.eas_) * Math.pow(A, 6) / 720);
      return [E, N];
    }

    override public function reverse(coords:Array):Array {
      var E:Number=coords[0];
      var N:Number=coords[1];
      var e1:Number=(1 - Math.sqrt(1 - this.es_)) / (1 + Math.sqrt(1 - this.es_));
      var M1:Number=this.M0_ + (N - this.FN_) / this.k0_;
      var mu1:Number=M1 / (this.a_ * (1 - this.es_ / 4 - 3 * this.ep4_ / 64 - 5 * this.ep6_ / 256));
      var phi1:Number=mu1 + (3 * e1 / 2 - 27 * Math.pow(e1, 3) / 32) * Math.sin(2 * mu1) + (21 * e1 * e1 / 16 - 55 * Math.pow(e1, 4) / 32) * Math.sin(4 * mu1) + (151 * Math.pow(e1, 3) / 6) * Math.sin(6 * mu1) + (1097 * Math.pow(e1, 4) / 512) * Math.sin(8 * mu1);
      var C1:Number=this.eas_ * Math.pow(Math.cos(phi1), 2);
      var T1:Number=Math.pow(Math.tan(phi1), 2);
      var N1:Number=this.a_ / Math.sqrt(1 - this.es_ * Math.pow(Math.sin(phi1), 2));
      var R1:Number=this.a_ * (1 - this.es_) / Math.pow((1 - this.es_ * Math.pow(Math.sin(phi1), 2)), 3 / 2);
      var D:Number=(E - this.FE_) / (N1 * this.k0_);
      var phi:Number=phi1 - (N1 * Math.tan(phi1) / R1) * (D * D / 2 - (5 + 3 * T1 + 10 * C1 - 4 * C1 * C1 - 9 * this.eas_) * Math.pow(D, 4) / 24 + (61 + 90 * T1 + 28 * C1 + 45 * T1 * T1 - 252 * this.eas_ - 3 * C1 * C1) * Math.pow(D, 6) / 720);
      var lamda:Number=this.lamdaF_ + (D - (1 + 2 * T1 + C1) * Math.pow(D, 3) / 6 + (5 - 2 * C1 + 28 * T1 - 3 * C1 * C1 + 8 * this.eas_ + 24 * T1 * T1) * Math.pow(D, 5) / 120) / Math.cos(phi1);
      return [lamda / RAD_DEG, phi / RAD_DEG];
    }

    override public function getCircumference():Number {
      return Math.PI * 2 * this.a_;
    }

  }
}