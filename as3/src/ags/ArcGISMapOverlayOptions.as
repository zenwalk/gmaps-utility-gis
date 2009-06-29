package ags
{
  public class ArcGISMapOverlayOptions 
  {
    public var alpha:Number;
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
        ArcGISUtil.augmentObject(opts, this);
      }
    }

  }
}