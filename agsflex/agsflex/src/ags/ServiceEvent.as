/*
*  ArcGIS for Google Maps Flash API
* @author nianwei at gmail dot com
*
* Licensed under the Apache License, Version 2.0:
*  http://www.apache.org/licenses/LICENSE-2.0
*/
package ags
{
  import flash.events.Event;
/**
 * Events dispatched when interact with server. Depending on the request type, the data property type can be different.
 */ 
  public class ServiceEvent extends Event
  {
    public static const LOAD:String = 'load';
    public static const ERROR:String= 'error';
    public static const GEOCODE_COMPLETE:String = "geocode_complete";
    public static const REVERSEGEOCODE_COMPLETE:String = "reversegeocode_complete";
    public static const EXPORTMAP_START:String = "exportmap_start";
    public static const EXPORTMAP_COMPLETE:String = "exportmap_complete";
    public static const EXPORTMAP_LOAD:String = "exportmap_load";
    public static const IDENTIFY_COMPLETE:String = 'identify_complete';
    
    /**
    * The data returned by server if applicable. It can be of type GeocodeResults etc depending on the request type.  
    */ 
    public  var data:*;
    public function ServiceEvent(type:String, data:*=null, bubbles:Boolean=false, cancelable:Boolean=false)
    {
      super(type, bubbles, cancelable);
      this.data= data;
    }
    
  }
} 