/*
 * ArcGIS for Google Maps Flash API
 *
 * License http://www.apache.org/licenses/LICENSE-2.0
 */ /**
 * @author nianwei at gmail dot com
 */
package ags {
  import flash.events.*;

  public class NetworkService implements IEventDispatcher {
    public function NetworkService() {
      dispatcher_=new EventDispatcher(this);
    }
    private var dispatcher_:EventDispatcher;

    public function addEventListener(type:String, listener:Function, useCapture:Boolean=false, priority:int=0, useWeakReference:Boolean=false):void {

      dispatcher_.addEventListener(type, listener, useCapture, priority);
    }

    public function dispatchEvent(evt:Event):Boolean {
      return dispatcher_.dispatchEvent(evt);
    }

    public function hasEventListener(type:String):Boolean {
      return dispatcher_.hasEventListener(type);
    }

    public function removeEventListener(type:String, listener:Function, useCapture:Boolean=false):void {
      dispatcher_.removeEventListener(type, listener, useCapture);
    }

    public function willTrigger(type:String):Boolean {
      return dispatcher_.willTrigger(type);
    }
  }
}