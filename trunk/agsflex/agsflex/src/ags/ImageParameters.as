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
  
  import flash.geom.Point;
  
  /**
  * Represent the parameters needed to perform an exportMap operation on a map service.
  * Most of the value will be set automatically in ArcGISMapOverlay.
  */ 
  public class ImageParameters
  {
    //public var bbox:*;
    //public var bboxSR:int;
    public var f:String='json';
    /**
    * See ArcGISConstants.IMAGE_FORMAT_*;
    */ 
    public var format:String;
    public var height:int;
    public var width:int;
    public var imageSpatialReference:SpatialReference;
    public var bounds:LatLngBounds;
    public var dpi:int=96;
    
    /**
     * Allows you to filter the features of individual layers in the exported map by specifying 
     * definition expressions for those layers. Syntax: layerId1:layerDef1;layerId2:layerDef2 
     * Example: 0:POP2000 > 1000000;5:AREA > 100000
     * Normally you do not set this property directly. Instead, use Layer.definition for each layer.
     */    
    public var layerDefinitions:Array;
        
    /**  Normally you do not set this option directly. Instead, constrol visibility via Layer class
    */
    public var layerIds:Array;
   
    /**
    * show|hide|include|exclude, or use ArcGISConstants.LAYER_OPTIONS_*.
    *  Normally you do not set this option directly. Instead, constrol visibility via Layer class
    */ 
    public var layerOption:String;
    
    public var transparent:Boolean=true;
    
    public function ImageParameters(params:*=null)
    {
      if (params){
        ArcGISUtil.augmentObject(params, this, true);
      }
      
    }

  }
}