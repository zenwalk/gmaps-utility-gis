package ags
{
  /**
  * Find operation parameters. Returned geometry Spatial Reference will always set to WGS (4326)
  */ 
  public class FindParameters
  {
    public var searchText:String;
    public var contains:Boolean;
    public var searchFields :Array;
    public var layerIds:Array;
    public var returnGeometry:Boolean=true;
    
    public function FindParameters(params:*=null)
    {
      if (params){
        ArcGISUtil.augmentObject(params,this,true);
      }
    }


  }
}