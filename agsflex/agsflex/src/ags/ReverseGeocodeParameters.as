/*
* ArcGIS for Google Maps Flash API
* @author nianwei at gmail dot com
*
* Licensed under the Apache License, Version 2.0:
*  http://www.apache.org/licenses/LICENSE-2.0
*/
package ags
{
  import ags.ArcGISUtil;

  import com.google.maps.LatLng;
  
  public class ReverseGeocodeParameters
  {
    public var distance:Number;
    public var f:String;
    public var location:LatLng;
    public function ReverseGeocodeParameters(params:*=null)
    {
      if (params){
        ags.ArcGISUtil.augmentObject(params, this, false);
      }
    }

  }
}