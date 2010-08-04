// This file contains names to preserve if compiled as lib

// this file  should not be used when compile with apps + libs together

// includes: 
//   --enums: so that app code does not have to use sub syntax
//   --public properties: export only works well with functions by creating alias.  



gmaps.ags.Config = {
  proxyUrl: null,
  alwaysUseProxy: false
};

gmaps.ags.GeometryType = {
  POINT: 'esriGeometryPoint',
  MULTIPOINT: 'esriGeometryMultipoint',
  POLYLINE: 'esriGeometryPolyline',
  POLYGON: 'esriGeometryPolygon',
  ENVELOPE: 'esriGeometryEnvelope'
};

gmaps.ags.SRUnit = {
  METER: 9001,
  FOOT: 9002,
  SURVEY_FOOT: 9003,
  SURVEY_MILE: 9035,
  KILLOMETER: 9036,
  RADIAN: 9101,
  DEGREE: 9102
};

gmaps.ags.SpatialRelationship = {
  INTERSECTS: 'esriSpatialRelIntersects',
  CONTAINS: 'esriSpatialRelContains',
  CROSSES: 'esriSpatialRelCrosses',
  ENVELOPE_INTERSECTS: 'esriSpatialRelEnvelopeIntersects',
  INDEX_INTERSECTS: 'esriSpatialRelIndexIntersects',
  OVERLAPS: 'esriSpatialRelOverlaps',
  TOUCHES: 'esriSpatialRelTouches',
  WITHIN: 'esriSpatialRelWithin'
};
// used in SR constructor
gmaps.ags.SRParams = {
  wkid: 0,
  wkt: null,
  inverse_flattening: 0,
  standard_parallel_1: 0,
  standard_parallel_2: 0,
  latitude_of_origin: 0,
  semi_major: 0,
  unit: 0,
  central_meridian: 0,
  false_easting: 0,
  false_northing: 0,
  scale_factor: 0
};

gmaps.ags.Layer.url;
gmaps.ags.Layer.id;
gmaps.ags.Layer.name;
gmaps.ags.Layer.definition;
gmaps.ags.Layer.maxScale;
gmaps.ags.Layer.minScale;
gmaps.ags.Layer.visible;
gmaps.ags.Layer.subLayers;
gmaps.ags.Layer.parentLayer;

gmaps.ags.MapService.name;

