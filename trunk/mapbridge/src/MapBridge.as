/**
 * License Apache 2.0
 */
package {
  import bridge.FABridge;
  
  import com.google.maps.Map3D;
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
    public function create(className:String, ags:Array=null):* {
      try { 
        var c:Class=Class(ApplicationDomain.currentDomain.getDefinition(className));
        var instance:Object;
        var args: Array = ags || [];
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
        return "__FLASHERROR__" + "||" + e.message + e.getStackTrace();
      }
      return instance;
    }

     public function getStatic(className:String, fnVar:String, args:Array = null):* {
      var ret:*;
      try {
        var c:Class=Class(ApplicationDomain.currentDomain.getDefinition(className));
        ret = c[fnVar];
        if (ret != null && ret is Function) {
          return  (ret as Function).apply(this, args || []);
        }
      } catch (e:Error) {
        return "__FLASHERROR__" + "||" + e.message + e.getStackTrace();
      }
      return ret;
    }
   
  }

}


