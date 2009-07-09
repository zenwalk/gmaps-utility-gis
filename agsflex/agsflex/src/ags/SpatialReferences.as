/*
*  ArcGIS for Google Maps Flash API
* @author nianwei at gmail dot com
*
* Licensed under the Apache License, Version 2.0:
*  http://www.apache.org/licenses/LICENSE-2.0
*/
package ags
{
  import ags.*;
  /**
  * Collection of ArcGISSpatialReference
  */ 
  public class SpatialReferences
  {
    public static const WGS84:SpatialReference = new Geographic({wkid:4326});
    public static const NAD83:SpatialReference = new Geographic({wkid:4269});
    public static const WEB_MERCATOR:SpatialReference = new SphereMercator({
      wkid: 102113,
      semi_major: 6378137.0,
      central_meridian: 0,
      unit: 1
    });
    
    private static var _srs:Object = {
      '4326': WGS84,
      '4269': NAD83,
      '102113': WEB_MERCATOR
    };
    public static function addSpatialReference(wkid:int, wktOrSR:Object):SpatialReference
    {
      var sr:SpatialReference = _srs[''+wkid] as SpatialReference;
      if (sr) {
        return sr;
      }
      if (wktOrSR is SpatialReference){
        _srs[''+wkid] = wktOrSR;
        return wktOrSR as SpatialReference;
      }
      var wkt:String = wktOrSR as String;
      var params:Object = {
        wkid: wkid
      }
      var prj:String = ArcGISUtil.extractString(wkt, "PROJECTION[\"", "\"]");
      var spheroid:Array = ArcGISUtil.extractString(wkt, "SPHEROID[", "]").split(",");
      if (prj !== "") {
        params.unit = parseFloat(ArcGISUtil.extractString(ArcGISUtil.extractString(wkt, "PROJECTION", ""), "UNIT[", "]").split(",")[1]);
        params.semi_major = parseFloat(spheroid[1]);
        params.inverse_flattening = parseFloat(spheroid[2]);
        params.latitude_of_origin = parseFloat(ArcGISUtil.extractString(wkt, "\"Latitude_Of_Origin\",", "]"));
        params.central_meridian = parseFloat(ArcGISUtil.extractString(wkt, "\"Central_Meridian\",", "]"));
        params.false_easting = parseFloat(ArcGISUtil.extractString(wkt, "\"False_Easting\",", "]"));
        params.false_northing = parseFloat(ArcGISUtil.extractString(wkt, "\"False_Northing\",", "]"));
      }
      switch (prj) {
      case "":
        sr = new SpatialReference(params);
        break;
      case "Lambert_Conformal_Conic":
        params.standard_parallel_1 = parseFloat(ArcGISUtil.extractString(wkt, "\"Standard_Parallel_1\",", "]"));
        params.standard_parallel_2 = parseFloat(ArcGISUtil.extractString(wkt, "\"Standard_Parallel_2\",", "]"));
        sr = new LambertConformalConic(params);
        break;
      case "Transverse_Mercator":
        params.scale_factor = parseFloat(ArcGISUtil.extractString(wkt, "\"Scale_Factor\",", "]"));
        sr = new TransverseMercator(params);
        break;
      // more implementations here.
      default:
      //throw new Error(prj + "  not supported";
      }
      if (sr) {
        _srs['' + wkid] = sr;
      }
      return sr;
    }
    public static function getSpatialReference(wkid:Number):SpatialReference{
      return _srs[''+wkid];
    }

  }
}