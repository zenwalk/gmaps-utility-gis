// This file contains export statements for the lib
// needed as input when compiled as lib. not needed when compiled with apps together.

goog.exportSymbol('gmaps.ags.Util', Util);
goog.exportProperty(Util, 'getJSON', Util.getJSON);
goog.exportProperty(Util, 'addToMap', Util.addToMap);
goog.exportProperty(Util, 'removeFromMap', Util.removeFromMap);


goog.exportSymbol('gmaps.ags.Config', Config);

goog.exportSymbol('gmaps.ags.SpatialReference', SpatialReference);
goog.exportProperty(SpatialReference, 'register', SpatialReference.register);
goog.exportProperty(SpatialReference.prototype, 'forward', SpatialReference.prototype.forward);
goog.exportProperty(SpatialReference.prototype, 'inverse', SpatialReference.prototype.inverse);

goog.exportSymbol('gmaps.ags.Albers', Albers);
goog.exportSymbol('gmaps.ags.LambertConformalConic', LambertConformalConic);
goog.exportSymbol('gmaps.ags.SphereMercator', SphereMercator);
goog.exportSymbol('gmaps.ags.TransverseMercator', TransverseMercator);

goog.exportSymbol('gmaps.ags.GeometryType', GeometryType);

goog.exportSymbol('gmaps.ags.Catalog', Catalog);
goog.exportSymbol('gmaps.ags.Layer', Layer);
goog.exportProperty(Layer.prototype, 'load', Layer.prototype.load);

goog.exportSymbol('gmaps.ags.MapService', MapService);
goog.exportProperty(MapService.prototype, 'getLayer', MapService.prototype.getLayer);
goog.exportProperty(MapService.prototype, 'hasLoaded', MapService.prototype.hasLoaded);
goog.exportProperty(MapService.prototype, 'getInitialBounds', MapService.prototype.getInitialBounds);
goog.exportProperty(MapService.prototype, 'getLayers', MapService.prototype.getLayers);
goog.exportProperty(MapService.prototype, 'getTables', MapService.prototype.getTables);
goog.exportProperty(MapService.prototype, 'exportMap', MapService.prototype.exportMap);
goog.exportProperty(MapService.prototype, 'identify', MapService.prototype.identify);
goog.exportProperty(MapService.prototype, 'find', MapService.prototype.find);
goog.exportProperty(MapService.prototype, 'queryLayer', MapService.prototype.queryLayer);



goog.exportSymbol('gmaps.ags.GeocodeService', GeocodeService);

goog.exportSymbol('gmaps.ags.GeometryService', GeometryService);

goog.exportSymbol('gmaps.ags.GeocodeService', GeocodeService);

goog.exportSymbol('gmaps.ags.GPService', GPService);

goog.exportSymbol('gmaps.ags.GPTask', GPTask);

goog.exportSymbol('gmaps.ags.RouteTask', RouteTask);

goog.exportSymbol('gmaps.ags.RouteTask', GeocodeService);

goog.exportSymbol('gmaps.ags.Projection', Projection);

goog.exportSymbol('gmaps.ags.TileLayer', TileLayer);

goog.exportSymbol('gmaps.ags.MapOverlay', MapOverlay);

goog.exportSymbol('gmaps.ags.MapType', MapType);






