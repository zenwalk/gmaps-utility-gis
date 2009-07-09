/*
* ArcGIS for Google Maps Flash API
* @author nianwei at gmail dot com
*
* Licensed under the Apache License, Version 2.0:
*  http://www.apache.org/licenses/LICENSE-2.0
*/
package ags
{
  import com.google.maps.MapTypeOptions;
  public class ArcGISMapTypeOptions extends MapTypeOptions
  {
    
    
    public var name:String;
    public var projection:ArcGISProjection;
        
    public function ArcGISMapTypeOptions(opts:*=null)
    {
      //super(opts);
      // note augment object will fail if 
      if (opts) {
        ArcGISUtil.augmentObject(opts, this);
      }
    }

  }
}