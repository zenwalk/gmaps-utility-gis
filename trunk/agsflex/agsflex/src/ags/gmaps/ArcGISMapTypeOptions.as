/*
* ArcGIS for Google Maps Flash API
* @author nianwei at gmail dot com
*
* Licensed under the Apache License, Version 2.0:
*  http://www.apache.org/licenses/LICENSE-2.0
*/
package ags.gmaps
{
  import com.google.maps.MapTypeOptions;
  import ags.service.*;
   import ags.*;
  public class ArcGISMapTypeOptions extends MapTypeOptions
  {
    
    
    public var name:String;
    public var projection:ArcGISProjection;
        
    public function ArcGISMapTypeOptions(opts:*=null)
    {
      if (opts) {
        Util.augmentObject(opts, this);
      }
    }

  }
}