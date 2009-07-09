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
  * This class represents a Spatial Reference System based on <a target  = wiki href  = 'http://en.wikipedia.org/wiki/Lambert_conformal_conic_projection'>Lambert Conformal Conic Projection</a>. */
  public class LambertConformalConic extends SpatialReference
  {
    private var a_:Number;
    private var e_:Number;
    private var F_:Number;
    private var FE_:Number;
    private var lamdaF_:Number;
    private var n_:Number;
    private var rF_:Number;
    private var FN_:Number;
    
    /**
 * Create a Lambert Conformal Conic Projection based Spatial Reference. The <code>params</code> passed in construction should
 * include the following properties:<code>
 * <br/>-wkid: well-known id
 * <br/>-semi_major:  ellipsoidal semi-major axis in meter
 * <br/>-unit: meters per unit
 * <br/>-inverse_flattening: inverse of flattening of the ellipsoid where 1/f  =  a/(a - b)
 * <br/>-standard_parallel_1: phi1, latitude of the first standard parallel
 * <br/>-standard_parallel_2: phi2, latitude of the second standard parallel
 * <br/>-latitude_of_origin: phiF, latitude of the false origin
 * <br/>-central_meridian: lamdaF, longitude of the false origin  (with respect to the prime meridian)
 * <br/>-false_easting: FE, false easting, the Eastings value assigned to the natural origin
 * <br/>-false_northing: FN, false northing, the Northings value assigned to the natural origin
 * </code>
 * <br/> e.g. North Carolina State Plane NAD83 Feet: <br/>
 * <code> var ncsp82  = new ArcGISLambertConformalConic({wkid:2264, semi_major: 6378137.0,inverse_flattening: 298.257222101,
 *   standard_parallel_1: 34.33333333333334, standard_parallel_2: 36.16666666666666,
 *   central_meridian: -79.0, latitude_of_origin: 33.75,'false_easting': 2000000.002616666,
 *   'false_northing': 0, unit: 0.3048006096012192 }); </code>
 * @name ArcGISLambertConformalConic
 * @extends ArcGISSpatialReference
 * @constructor
 * @param {Object} params
 */
    public function LambertConformalConic(params:Object)
    {
     //http://pubs.er.usgs.gov/djvu/PP/PP_1395.pdf
     // http://www.posc.org/Epicentre.2_2/DataModel/ExamplesofUsage/eu_cs34.html
     //for NCSP83: GLatLng(35.102363,-80.5666)<  === > GPoint(1531463.95, 495879.744);
      params = params || {};
      super(params);
      var f_i:Number = params.inverse_flattening;
      var phi1:Number = params.standard_parallel_1 * RAD_DEG;
      var phi2:Number = params.standard_parallel_2 * RAD_DEG;
      var phiF:Number = params.latitude_of_origin * RAD_DEG;
      this.a_ = params.semi_major / params.unit;
      this.lamdaF_ = params.central_meridian * RAD_DEG;
      this.FE_ = params.false_easting;
      this.FN_ = params.false_northing;
      
      var f:Number = 1.0 / f_i; //e: eccentricity of the ellipsoid where e^2  =  2f - f^2 
      var es:Number = 2 * f - f * f;
      this.e_ = Math.sqrt(es);
      var m1:Number = this.calc_m_(phi1, es);
      var m2:Number = this.calc_m_(phi2, es);
      var tF:Number = this.calc_t_(phiF, this.e_);
      var t1:Number = this.calc_t_(phi1, this.e_);
      var t2:Number = this.calc_t_(phi2, this.e_);
      this.n_ = Math.log(m1 / m2) / Math.log(t1 / t2);
      this.F_ = m1 / (this.n_ * Math.pow(t1, this.n_));
      this.rF_ = this.calc_r_(this.a_, this.F_, tF, this.n_);
    }
    private function calc_m_(phi:Number, es:Number):Number{
      var sinphi:Number = Math.sin(phi);
      return Math.cos(phi) / Math.sqrt(1 - es * sinphi * sinphi);
    }
    private function calc_t_(phi:Number, e:Number):Number{
      var esinphi:Number = e * Math.sin(phi);
      return Math.tan(Math.PI / 4 - phi / 2) / Math.pow((1 - esinphi) / (1 + esinphi), e / 2);
    }
    private function calc_r_ (a:Number, F:Number, t:Number, n:Number):Number {
      return a * F * Math.pow(t, n);
    };
    private function calc_phi_(t_i:Number, e:Number, phi:Number):Number{
      var esinphi:Number = e * Math.sin(phi);
      return Math.PI / 2 - 2 * Math.atan(t_i * Math.pow((1 - esinphi) / (1 + esinphi), e / 2));
    }
    private function solve_phi_(t_i:Number, e:Number, init:Number):Number{
      // iteration
      var i:int = 0;
      var phi:Number = init;
      var newphi:Number = this.calc_phi_(t_i, e, phi);//this.
      while (Math.abs(newphi - phi) > 0.000000001 && i < 10) {
        i++;
        phi = newphi;
        newphi = this.calc_phi_(t_i, e, phi);//this.
      }
      return newphi;
    }
    override public function forward(lnglat:Array):Array{
      var phi:Number = lnglat[1] * RAD_DEG;// (Math.PI / 180);
      var lamda:Number = lnglat[0] * RAD_DEG;
      var t:Number = this.calc_t_(phi, this.e_);
      var r:Number = this.calc_r_(this.a_, this.F_, t, this.n_);
      var theta:Number = this.n_ * (lamda - this.lamdaF_);
      var E:Number = this.FE_ + r * Math.sin(theta);
      var N:Number = this.FN_ + this.rF_ - r * Math.cos(theta);
      return [E, N];
    } 
    override public function reverse(coords:Array):Array{
      var E:Number = coords[0];
      var N:Number = coords[1];
      var theta_i:Number = Math.atan((E - this.FE_) / (this.rF_ - (N - this.FN_)));
      var r_i:Number = (this.n_ > 0 ? 1 : -1) * Math.sqrt((E - this.FE_) * (E - this.FE_) + (this.rF_ - (N - this.FN_)) * (this.rF_ - (N - this.FN_)));
      var t_i:Number = Math.pow((r_i / (this.a_ * this.F_)), 1 / this.n_);
      var phi:Number = this.solve_phi_(t_i, this.e_, 0);
      var lamda:Number = theta_i / this.n_ + this.lamdaF_;
      return [lamda / RAD_DEG, phi / RAD_DEG];
    }
    override public function getCircumference():Number{
      return Math.PI * 2 * this.a_;
    }
  }
}