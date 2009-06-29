package ags {
  import com.google.maps.interfaces.ICopyrightCollection;
  

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
    public var projection:ArcGISProjection;
    

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