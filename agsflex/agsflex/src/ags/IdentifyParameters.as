/*
 * ArcGIS for Google Maps Flash API
 *
 * License http://www.apache.org/licenses/LICENSE-2.0
 */
 /**
 * @author nianwei at gmail dot com
 */ 
package ags
{
  import com.google.maps.LatLngBounds;
  
  public class IdentifyParameters
  {
    public var dpi:int;
    public var f:String;
    public var geometry:*;
    //public var geometryType:String;
    /**
    * height of image, ignored if imageDisplay is specified;
    */ 
    public var height:int;
    /**
    * The screen image display parameters (width, height and DPI) of the map being currently viewed. You can also specifiy width, height, dip separately.
    */ 
    //public var imageDisplay:String;
    public var width:int;
    /**
    * top|visible|all
    */ 
    public var layerOption:String;
    public var layerIds:Array;
    //public var mapExtent:*;
    public var bounds:LatLngBounds;
    public var returnGeometry:Boolean;
    public var sr:SpatialReference;
    public var tolerance:int = 5;
    
    public function IdentifyParameters(params:*=null)
    {
      if (params){
        ArcGISUtil.augmentObject(params,this,true);
      }
    }

  }
}