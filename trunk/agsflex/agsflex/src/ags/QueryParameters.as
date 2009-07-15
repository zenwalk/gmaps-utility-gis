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
  /**
  * Parameters for query operation
  * Note in/
  */ 
  public class QueryParameters
  {
    /**
    * LatLng[], Marker[], Polyline[], Polygon[]
    */ 
    public var geometry:Array;
    public var spatialRelationship:String= ArcGISConstants.SPATIAL_REL_INTERSECTS;
    public var where:String;
    public var text:String;
    public var outFields:Array;
    public var returnGeometry:Boolean;
    //public var outSpatialReference:SpatialReference;
    
    public function QueryParameters(params:*=null)
    {
      if (params){
        ArcGISUtil.augmentObject(params,this,true);
      }
    }

  }
}