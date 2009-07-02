/*
* ArcGIS for Google Maps Flash API
* @author nianwei at gmail dot com
*
* Licensed under the Apache License, Version 2.0:
*  http://www.apache.org/licenses/LICENSE-2.0
*/
package ags.gmaps
{
  public class ArcGISMapOverlayOptions 
  {
    import ags.service.*;
    import ags.*;
    
    /**
    * Alpha/transparency of the overlay
    */ 
    public var alpha:Number;
    /**
    * Additional parameters defined by the REST API,
    */ 
    public var exportParams:*;
    public var name:String;
    public var maxResolution:Number;
    public var minResolution:Number;
    /**
    * Options to create an ArcGISMapOverlay
    */
    public function ArcGISMapOverlayOptions(opts:*)
    {
     if (opts) {
        Util.augmentObject(opts, this);
      }
    }

  }
}