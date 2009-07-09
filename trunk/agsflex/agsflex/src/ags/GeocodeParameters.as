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
  
  public class GeocodeParameters
  {
    public var f:String;
    public var inputs:*;
    public var outFields:Array;
    public function GeocodeParameters(params:*=null)
    {
      if (params){
        ags.ArcGISUtil.augmentObject(params, this, false);
      }
    }

  }
}