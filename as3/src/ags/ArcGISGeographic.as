package ags
{
  /**
  This class will simply retuns same LatLng as Coordinates. 
   *   The <code>param</code> should have wkid property. Any Geographic Coordinate Systems (eg. WGS84(4326)) can 
   *   use this class As-Is. 
   *   <br/>Note:<b> This class does not support datum transformation</b>.
   */
  public class ArcGISGeographic extends ArcGISSpatialReference
  {
    public function ArcGISGeographic(params:Object)
    {
      //TODO: implement function
      super(params);
    }
    
  }
}