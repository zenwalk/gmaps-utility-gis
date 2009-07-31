/**
 * License Apache 2.0
 */
package {
  import bridge.FABridge;

  import com.google.maps.*;
  import com.google.maps.overlays.*;

  import flash.system.ApplicationDomain;

  /**
   * This class is a gateway for Google Maps Flash API using FABridge
   * @author Nianwei Liu [nianwei at gmail dot com]
   */
  public class MapBridge extends Map3D {
    private var externalBridge:FABridge;

    // a simple way to force the compiled swf to include a class
    // is to add then as a reference, as the FABridge sample did. 
    // e.g. private var cls:Array=[NavigationControl];
    // A more elegant way is to include the swc in compiler options
    // -include-libraries+=path_to_\map_1_14.swc.
    // create AS project in FlexBuilder, add additional Flex libs.
    // Create a flex app directly will yield a swf of size 200+K vs ~70K.

    public function MapBridge() {
      super();
      // key should be set via FlashVars
      externalBridge=new FABridge();
      externalBridge.rootObject=this;
    /*     var map:MapBridge = this;
       this.addEventListener(MapEvent.MAP_READY, function(e:MapEvent):void{
       map.setCenter(new LatLng(40.7121341, -73.967857), 13, MapType.NORMAL_MAP_TYPE);
       var encodedPoints:String = "iuowFf{kbMzH}N`IbJb@zBpYzO{dAvfF{LwDyN`_@`NzKqB|Ec@|L}BKmBbCoPjrBeEdy@uJ`Mn@zoAer@bjA~Xz{JczBa]pIps@de@tW}rCdxSwhPl`XgikCl{soA{dLdAaaF~cCyxCk_Aao@jp@kEvnCgoJ`]y[pVguKhCkUflAwrEzKk@yzCv^k@?mI";
       var encodedLevels:String = "B????????????????????????????????????B";
       var encodedPolyline:Polyline = map.staticFn('com.google.maps.overlays.Polyline','fromEncoded', [new EncodedPolylineData(encodedPoints, 32, encodedLevels, 4)]);
       map.addOverlay(encodedPolyline);
     });*/
    }

    // 
    /**
     * Dynamically construct class based on class name, a simple flavor of reflection.
     * @className: full class name with package
     * @args: argument list up to 8. The longest constructor is MapMouseEvent
     */ /* Altantively can modify function FABridge..js_create(className:String, args:Array):*
       then change  FABridge.create to: function(className)
       {
       var args = [];
       for(var i = 1; i < arguments.length; i++)
       {
       args.push(arguments[i]);
       }
       return this.deserialize(this.target.create(className, args));
       }
       and call FABridge.bridgeName.create.
     */
    public function create(className:String, args:Array):* {
      try {
        var c:Class=Class(ApplicationDomain.currentDomain.getDefinition(className));
        var instance:Object;
        args=args || [];
        switch (args.length) {
          case 0:
            instance=new c();
            break;
          case 1:
            instance=new c(args[0]);
            break;
          case 2:
            instance=new c(args[0], args[1]);
            break;
          case 3:
            instance=new c(args[0], args[1], args[2]);
            break;
          case 4:
            instance=new c(args[0], args[1], args[2], args[3]);
            break;
          case 5:
            instance=new c(args[0], args[1], args[2], args[3], args[4]);
            break;
          case 6:
            instance=new c(args[0], args[1], args[2], args[3], args[4], args[5]);
            break;
          case 7:
            instance=new c(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
            break;
          case 8:
            instance=new c(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
            break;
        }

      } catch (e:Error) {
        return "__FLASHERROR__" + "||" + e.message;
      }
      return instance;
    }

    public function staticVar(className:String, prop:String):* {
      var val:Object;
      try {
        var c:Class=Class(ApplicationDomain.currentDomain.getDefinition(className));
        val=c[prop];

      } catch (e:Error) {
        return "__FLASHERROR__" + "||" + e.message;
      }
      return val;
    }

    public function staticFn(className:String, fnName:String, args:Array):* {
      var fn:Function;
      try {
        var c:Class=Class(ApplicationDomain.currentDomain.getDefinition(className));
        fn=c[fnName];
        return fn.apply(this, args);
      } catch (e:Error) {
        return "__FLASHERROR__" + "||" + e.message;
      }
      return null;
    }
  }

}


