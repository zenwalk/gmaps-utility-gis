/*
*  ArcGIS for Google Maps Flash API
* @author nianwei at gmail dot com
*
* Licensed under the Apache License, Version 2.0:
*  http://www.apache.org/licenses/LICENSE-2.0
*/
package ags.service
{
  import flash.events.Event;
/**Events used in the lib
 */ 
  public class ServiceEvent extends Event
  {
    public static const LOAD:String = 'load';
    public static const EXPORTIMAGE_START:String = 'exportimage_start';
    public static const EXPORTIMAGE_END:String = 'exportimage_end';
    public static const FIND_START:String = 'find_start';
    public static const FIND_END:String = 'find_end';
    public static const QUERY_START:String = 'query_start';
    public static const QUERY_END:String = 'query_end';
     
    public function ServiceEvent(type:String, bubbles:Boolean=false, cancelable:Boolean=false)
    {
      //TODO: implement function
      super(type, bubbles, cancelable);
    }
    
  }
} 