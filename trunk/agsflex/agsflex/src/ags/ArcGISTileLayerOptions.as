/*
 * ArcGIS for Google Maps Flash API
 *
 * License http://www.apache.org/licenses/LICENSE-2.0
 */
 /**
 * @author nianwei at gmail dot com
 */ 

package ags {
  import com.google.maps.interfaces.ICopyrightCollection;
  import ags.*;
   import ags.*;

  /**
   * options to create an ArcGISTileLayer
   */
  public class ArcGISTileLayerOptions {
    
    /**
     * 
     * @default 
     */
    public var hosts:String;
    /**
     * 
     * @default 
     */
    public var copyrights:ICopyrightCollection;
    /**
     * 
     * @default 
     */
    public var minResolution:Number;
    /**
     * 
     * @default 
     */
    public var maxResolution:Number;
    /**
     * 
     * @default 
     */
    public var alpha:Number;
    /**
     * 
     * @default 
     */
    public var name:String;
    /**
     * 
     * @default 
     */
    public var projection:ArcGISTileConfig;
    

    /**
     * 
     * @param opts
     * 
     * 
     */
    public function ArcGISTileLayerOptions(opts:*=null) {
      if (opts) {
        ArcGISUtil.augmentObject(opts, this);
      }
    }

  }
}