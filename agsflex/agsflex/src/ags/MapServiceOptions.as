/*
*  ArcGIS for Google Maps Flash API
* @author nianwei at gmail dot com
*
* Licensed under the Apache License, Version 2.0:
*  http://www.apache.org/licenses/LICENSE-2.0
*/
package ags
{ import ags.*;
  /**
  * used to set up some init options for an ArcGISMapService
  */ 
  public class MapServiceOptions
  {
    public var name:String;
    public function MapServiceOptions(opts:*=null)
    {
      if (opts){
        ArcGISUtil.augmentObject(opts,this);
      }
    }

  }
}