package ags
{
  import flash.events.Event;
/**Events used in the lib
 */ 
  public class ArcGISEvent extends Event
  {
    public static const LOAD:String = 'load';
    public static const EXPORTIMAGE_START:String = 'exportimage_start';
    public static const EXPORTIMAGE_END:String = 'exportimage_end';
     
    public function ArcGISEvent(type:String, bubbles:Boolean=false, cancelable:Boolean=false)
    {
      //TODO: implement function
      super(type, bubbles, cancelable);
    }
    
  }
} 