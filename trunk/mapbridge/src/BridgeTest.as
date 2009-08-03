package {
  import com.google.maps.*;
  import com.google.maps.controls.*;
  import com.google.maps.overlays.*;
  
  import flash.display.Loader;
  import flash.events.*;
  import flash.net.URLRequest;
        

  public class BridgeTest extends MapBridge {
    private var map:MapBridge;
    public function BridgeTest() {
      super();
      map=this;
      this.addEventListener(MapEvent.MAP_READY,onMapReady);

    }
    private function onMapReady0(event:Event):void {
        map.setCenter(new LatLng(40.740, -74.18), 12, MapType.NORMAL_MAP_TYPE);
        map.addControl(new ZoomControl());
        map.addControl(new MapTypeControl());
        
        var testLoader:Loader = new Loader();
        var urlRequest:URLRequest = new URLRequest("http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg");
        testLoader.contentLoaderInfo.addEventListener(Event.COMPLETE, function(e:Event):void {
            var groundOverlay:GroundOverlay = new GroundOverlay(
                testLoader,
                new LatLngBounds(new LatLng(40.716216,-74.213393), new LatLng(40.765641,-74.139235)));
            map.addOverlay(groundOverlay);
        });
        testLoader.load(urlRequest);  
    }
    private function onMapReady(event:Event):void {
        map.setCenter(new LatLng(40.740, -74.18), 12, MapType.NORMAL_MAP_TYPE);
        map.addControl(new ZoomControl());
        map.addControl(new MapTypeControl());
        
       var a:* = map.staticVar('com.google.maps.MapType','PHYSICAL_MAP_TYPE');
       trace(a);
       map.setMapType(a);
    }
   

  }
}