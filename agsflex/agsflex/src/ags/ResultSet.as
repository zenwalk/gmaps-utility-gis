package ags {

  public class ResultSet {
    public var displayFieldName:String;
    public var features:Array=[];
    public var fieldAliases:*;
    public var geometryType:String;
    public var spatialReference:SpatialReference;

    public function ResultSet(params:*=null, ovOpts:OverlayOptions=null) {
      if (params) {
        if (params.features) {
          var res:*=params.features;
          for (var i:int=0; i < res.length; i++) {
            var r:* = res[i];
            features.push(new Feature(r, ovOpts,ArcGISUtil.getAttributeValue(r.attributes, params.displayFieldName)));
          }
        }
        spatialReference = SpatialReferences.getSpatialReference(params.spatialReference.wkid)
        ||new SpatialReference(params.spatialReference);
        ArcGISUtil.augmentObject(params, this, false);
      }
    }

  }
}