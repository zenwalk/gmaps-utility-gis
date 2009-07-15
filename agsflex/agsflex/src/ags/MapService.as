/*
 * ArcGIS for Google Maps Flash API
 *
 * License http://www.apache.org/licenses/LICENSE-2.0
 */
 /**
 * @author nianwei at gmail dot com
 */ 

package ags {
  import com.google.maps.*;
  
  import flash.events.*;

  /**
   * This class is the core class for all map service operations.
   * It represents an  Server map service and serve as the underline resource
   * represented by  ArcGISTileLayer and  ArcGISMapOverlay.
   * It is constructed asynchronously so it should be used <b>after</b>
   * it is loaded, either by handle its "load" event, or used in a callback function
   * passed in the constructor.
   * <br/>For more info see <a  href  = 'http://resources.esri.com/help/9.3/arcgisserver/apis/rest/mapserver.html'>Map Service</a>

   * <p>Creates a ArcGISMapService objects that can be used by UI components.
   * <ul><li> <code> url</code> (required) is the URL of the map servive, e.g. <code>
   * http://server.arcgisonline.com//rest/services/ESRI_StreetMap_World_2D/MapServer</code>.
   * <li> <code>opt_service</code> optional parameter of type ArcGISMapServiceOptions
   * <ul/> Note the spatial reference of the map service must already exists
   * in the ArcGISSpatialReferences if actual coordinates transformation is needed.
   * @name ArcGISMapService
   * @class @param {String} url
   * @param {ArcGISMapServiceOptions} opt_service
   * @property {String} [url] map service URL
   * @property {String} [name] map service Name, taken as part of URL.
   * @property {String} [serviceDescription] serviceDescription
   * @property {String} [mapName] map frame Name inside the map document
   * @property {String} [description] description
   * @property {String} [copyrightText] copyrightText
   * @property {Boolean} [singleFusedMapCache] if map cache is singleFused
   * @property {TileInfo} [tileInfo] See {@link ArcGISTileInfo}
   * @property {Envelope} [initialExtent] initialExtent, see {@link ArcGISEnvelope}
   * @property {Envelope} [fullExtent] fullExtent, see {@link ArcGISEnvelope}
   * @property {String} [units] unit
   * @property {Object} [documentInfo] Object with the folloing properties: <code>Title, Author,Comments,Subject,Category,Keywords</code>
   */
  public dynamic class MapService implements IEventDispatcher {
    public var url:String;
    public var name:String;
    public var copyrightText:String;
    public var documentInfo:*;
    public var fullExtent:*; // maybe should be envelope, but object literal for now
    public var initialExtent:*;
    public var mapName:String;
    public var serviceDescription:String;
    public var singleFusedMapCache:Boolean;
    public var units:String;

    private var loaded_:Boolean;
    private var correct_:Boolean;

    public function MapService(url:String, opt_service:MapServiceOptions=null) {
      dispatcher_=new EventDispatcher(this);
      opt_service=opt_service || new MapServiceOptions();
      this.url=url;
      var tks:Array=url.split("/");
      this.name=opt_service.name || tks[tks.length - 2].replace(/_/g, ' ');
      var me:MapService=this;
      this.loaded_=false;
      this.correct_=false;
      ArcGISUtil.restRequest(url, {f: 'json'}, this, function(json:Object):void {
          me.init_(json, opt_service);
        });

    }

    /**
     * initialize an  Map Service from the meta data information.
     * The <code>json</code> parameter is the json object returned by Map Service.
     * @private
     * @param {Object} json
     * @param {ArcGISMapServiceOptions} opt_service
     */
    public function init_(json:Object, opt_service:Object):void {
      var me:MapService=this;
      function doneLoad(json:Object):void {
        me.loaded_=true;
        for (var i:int=0, c:int=me.layers_.length; i < c; i++) {
          var layer:Layer=me.layers_[i];
          if (layer.subLayerIds) {
            layer.subLayers=[];
            for (var j:int=0, jc:int=layer.subLayerIds.length; j < jc; j++) {
              var subLayer:Layer=me.getLayer(layer.subLayerIds[j]);
              layer.subLayers.push(subLayer);
              subLayer.parentLayer=layer;
            }
          }
        }
        // some  bad services will have an initial extent outside fullextent;
        me.initialExtent.xmin=Math.max(me.initialExtent.xmin, me.fullExtent.xmin);
        me.initialExtent.ymin=Math.max(me.initialExtent.ymin, me.fullExtent.ymin);
        me.initialExtent.xmax=Math.min(me.initialExtent.xmax, me.fullExtent.xmax);
        me.initialExtent.ymax=Math.min(me.initialExtent.ymax, me.fullExtent.ymax);

        /**
         * This event is fired when the service and it's service info is loaded.
         * @name ArcGISMapService#load
         * @param {ArcGISMapService} service
         * @event
         */
        me.dispatchEvent(new ServiceEvent(ServiceEvent.LOAD, me));
      }

      if (json.error) {
        this.correct_=false;
      } else {
        this.correct_=true;
        ArcGISUtil.augmentObject(json, this);
        var layers:Array=[];
        var ids:Array=[];
        for (var i:int=0, c:int=json.layers.length; i < c; i++) {
          var info:Object=json.layers[i];
          var layer:Layer=new Layer(this.url + '/' + info.id, new LayerOptions({initLoad: false}));
          ArcGISUtil.augmentObject(info, layer);
          layer.visible=info.defaultVisibility;
          layers.push(layer);
          ids.push(info.id);
        }
        this.layers_=layers;
        delete this.layers;

        this.spatialReference_=SpatialReferences.getSpatialReference(json.spatialReference.wkid);
        if (!this.spatialReference_) {
          var bbox:*=json.fullExtent;
          ArcGISUtil.restRequest(this.url + '/export', {f: 'json', bbox: '' + bbox.xmin + ',' + bbox.ymin + ',' + bbox.xmax + ',' + bbox.ymax, bboxSR: json.spatialReference.wkid, size: '1,1', imageSR: 4326, layers: 'hide:' + ids.join(',')}, this, function(image:*):void {
              var sr:FlatSpatialReference=new FlatSpatialReference({wkid: json.spatialReference.wkid, latlng: image.extent, coords: json.fullExtent});
              SpatialReferences.addSpatialReference(json.spatialReference.wkid, sr);
              me.spatialReference_=sr;
              doneLoad(json);
            });
        } else {
          doneLoad(json);
        }
      }
    }
    ;


    /**
     * If this map service has finished loading from server.
     * @return {Boolean}
     */
    public function hasLoaded():Boolean {
      return this.loaded_;
    }


    /**
     * Get the Spatial Reference of this map service that can convert between LatLng and Coordinates
     * Note, if the actual spatial reference is not aleady added via {@link ArcGISSpatialReferences}, it will return an object literal with <b>wkid info only</b>.
     * @return {ArcGISSpatialReference}
     */
    public function getSpatialReference():SpatialReference {
      return this.spatialReference_;
    }


    /**
     * Get the Array of {@link ArcGISLayer}[] for this map service
     * @return {Layer[]}
     */
    public function getLayers():Array {
      return this.layers_;
    }


    /**
     * Get a map layer by it's name(String) or id (Number), return {@link ArcGISLayer}.
     * @param {String|Number} nameOrId
     * @return {Layer}
     */
    public function getLayer(nameOrId:Object):Layer {
      var layers:Array=this.layers_;
      if (layers) {
        for (var i:int=0, c:int=layers.length; i < c; i++) {
          if (nameOrId === layers[i].id) {
            return layers[i];
          }
          if (nameOrId is String && layers[i].name.toLowerCase() === nameOrId.toLowerCase()) {
            return layers[i];
          }
        }
      }
      return null;
    }


    /**
     * Get layer id or array of ids from a layer name or array of names.
     * @param {String|String[]} names
     * @return {Number|Number[]}
     */
    public function getLayerIdsByName(names:Array):Array {
      var layer:Layer;
      var ids:Array=[];
      for (var i:int=0, c:int=names.length; i < c; i++) {
        layer=this.getLayer(names[i]);
        ids.push(layer ? layer.id : -1);
      }
      return ids;
    }




    /**
     * Export an image with given parameters.
     * For more info see <a  href  = 'http://resources.esri.com/help/9.3/arcgisserver/apis/rest/export.html'>Export Operation</a>.
     * <br/> The <code>params</code> is an instance of {@link ArcGISExportMapParameters}.
     * The following properties will be set automatically if not specified:...
     * <br/> The <code>callback</code> is the callback function with argument of
     * an instance of {@link ArcGISMapImage}.
     * @param {ExportMapOptions} params
     * @param {Function} callback
     */
    public function exportMap(params:ImageParameters, callbackFn:Function=null, failedFn:Function=null):void {
      if (!params) {
        return;
      }
      // note: dynamic map may overlay on top of maptypes with different projection
      var ps:*={f: params.f, size: '' + params.width + ',' + params.height, dpi: params.dpi || 96, format: params.format, transparent: params.transparent === false ? false : true};
      var sr:SpatialReference=params.imageSpatialReference || SpatialReferences.WEB_MERCATOR;
      // although AGS support different imageSR & bboxSR, we only use one here.
      ps.imageSR=sr.wkid;

      var inSr:SpatialReference=sr; //SpatialReferences.WGS84
      ps.bboxSR=inSr.wkid; //sr.wkid;
      var bbox:*=ArcGISUtil.fromLatLngBoundsToEnvelope(params.bounds, inSr);
      ps.bbox='' + bbox.xmin + ',' + bbox.ymin + ',' + bbox.xmax + ',' + bbox.ymax;

      var vlayers:Array=[];
      var layerDefs:Array=[];
      var changed:Boolean=false;
      var layer:Layer;
      // a special behavior of REST: if partial group then parent must be off
      var i:int, c:int;
      for (i=0, c=this.layers_.length; i < c; i++) {
        layer=this.layers_[i];
        if (layer.subLayers) {
          for (var j:int=0, jc:int=layer.subLayers.length; j < jc; j++) {
            if (layer.subLayers[j].visible === false) {
              layer.visible=false;
              break;
            }
          }
        }
      }
      for (i=0, c=this.layers_.length; i < c; i++) {
        layer=this.layers_[i];
        if (layer.visible !== layer.defaultVisibility) {
          changed=true;
        }
        if (layer.visible === true) {
          vlayers.push(layer.id);
        }
        if (layer.definition) {
          layerDefs.push(layer.id + ':' + layer.definition);
        }
      }
      if (params.layerIds != null && params.layerOption != null) {
        ps.layers=params.layerOption + ':' + params.layerIds.join(',');
      } else if (changed === true) {
        ps.layers=ArcGISConstants.LAYER_OPTION_SHOW + ':' + vlayers.join(',');
      }
      if (params.layerDefinitions != null) {
        ps.layerDef=params.layerDefinitions.join(';');
      } else if (layerDefs.length > 0) {
        ps.layerDefs=layerDefs.join(';');
      }
      var me:MapService=this;
      if (vlayers.length === 0) {
        // avoid an error:{"error":{"code":400,"message":"","details":["Invalid layer ID specified."]}
        var res:MapImage=new MapImage({});
        if (callbackFn != null) {
          callbackFn.call(me, res);
        }
        me.dispatchEvent(new ServiceEvent(ServiceEvent.EXPORTMAP_COMPLETE, res));

        return;
      } else {

        this.dispatchEvent(new ServiceEvent(ServiceEvent.EXPORTMAP_START, params));
        ArcGISUtil.restRequest(this.url + '/export', ps, this, function(json:*):void {
            var res:MapImage=new MapImage(json);
            if (callbackFn != null) {
              callbackFn.call(me, res);
            }
            me.dispatchEvent(new ServiceEvent(ServiceEvent.EXPORTMAP_COMPLETE, res));
          }, failedFn);
      }
    }


    /**
     * Identify features on a particular ArcGISGeographic location, using {@link ArcGISIdenitfyParameters} and
     * process {@link ArcGISIdentifyResults} using the <code>callback</code> function.
     * For more info see <a
     * href  = 'http://resources.esri.com/help/9.3/arcgisserver/apis/rest/identify.html'>Identify Operation</a>.
     * @param {IdentifyParameters} params
     * @param {Function} callback
     */
    public function identify(iparams:IdentifyParameters, callbackFn:Function=null, failedFn:Function=null, ovOpts:OverlayOptions=null):void {
      if (!iparams) {
        return;
      }
      var sr:SpatialReference=iparams.sr || SpatialReferences.WGS84;
      var params:*={f: iparams.f || 'json', returnGeometry: iparams.returnGeometry, tolerance: iparams.tolerance, sr: sr.wkid};
      var ovs:Array;
      var geom:*;
      if (iparams.geometry is LatLng) {
        ovs=[iparams.geometry];
      } else {
        ovs=iparams.geometry;
      }
      geom=ArcGISUtil.fromOverlaysToGeometry(ovs, sr);
      params.geometry=ArcGISUtil.fromGeometryToJSON(geom);
      if (geom.x) {
        params.geometryType=ArcGISConstants.GEOMETRY_POINT;
      } else if (geom.points) {
        params.geometryType=ArcGISConstants.GEOMETRY_MULTIPOINT;
      } else if (geom.rings) {
        params.geometryType=ArcGISConstants.GEOMETRY_POLYGON;
      } else if (geom.paths) {
        params.geometryType=ArcGISConstants.GEOMETRY_POLYLINE;
      }
      params.mapExtent=ArcGISUtil.fromGeometryToJSON(ArcGISUtil.fromLatLngBoundsToEnvelope(iparams.bounds, sr));
      params.imageDisplay='' + iparams.width + ',' + iparams.height + ',' + (iparams.dpi || 96);
      params.layers=iparams.layerOption || 'all' + ':' + iparams.layerIds.join(',');
      var me:MapService=this;
      ArcGISUtil.restRequest(this.url + '/identify', params, this, function(json:*):void {
          var res:IdentifyResults=new IdentifyResults(json);
          if (callbackFn != null) {
            callbackFn.call(me, res);
          }
          me.dispatchEvent(new ServiceEvent(ServiceEvent.IDENTIFY_COMPLETE, res));
        }, failedFn);
    }


    /**
     * Find features using the {@link ArcGISFindParameters} and process {@link ArcGISFindResults}
     * using the <code>callback</code> function.
     * For more info see <a
     * href  = 'http://resources.esri.com/help/9.3/arcgisserver/apis/rest/find.html'>Find Operation</a>.
     * @param {FindParameters} params
     * @param {Function} callback
     */
    public function find(fparams:FindParameters, callbackFn:Function=null, failedFn:Function=null, ovOpts:OverlayOptions=null):void {
      if (!fparams) {
        return;
      }
      var params:*={f: 'json', searchText: fparams.searchText, sr: SpatialReferences.WGS84.wkid, contains: fparams.contains === false ? false : true, returnGeometry: fparams.returnGeometry === false ? false : true};
      if (fparams.layerIds && fparams.layerIds.length > 0) {
        params.layers=fparams.layerIds.join(',');
      }
      if (fparams.searchFields && fparams.searchFields.length > 0) {
        params.searchFields=fparams.searchFields.join(',');
      }
      var me:MapService=this;
      ArcGISUtil.restRequest(this.url + '/find', params, this, function(json:*):void {
          var res:FindResults=new FindResults(json);
          if (callbackFn != null) {
            callbackFn.call(me, res);
          }
          me.dispatchEvent(new ServiceEvent(ServiceEvent.FIND_COMPLETE, res));
        }, failedFn);
    }


    /**
     * Query a layer with given id or name using the {@link ArcGISQueryParameters} and process {@link ArcGISResultSet}
     * using the <code>callback</code> function.
     * See {@link ArcGISLayer}.
     * For more info see <a  href  = 'http://resources.esri.com/help/9.3/arcgisserver/apis/rest/query.html'>Query Layer Operation</a>.
     * @param {Number|String} layerNameOrId
     * @param {QueryParameters} params
     * @param {Function} callback
     */
    public function queryLayer(layerNameOrId:String, params:*, callback:Function=null, failedFn:Function=null):void {
      var layer:Layer=this.getLayer(layerNameOrId);
      if (layer) {
        layer.query(params, callback, failedFn);
      }
    }



    private var dispatcher_:EventDispatcher;

    public function addEventListener(type:String, listener:Function, useCapture:Boolean=false, priority:int=0, useWeakReference:Boolean=false):void {

      dispatcher_.addEventListener(type, listener, useCapture, priority);
    }

    public function dispatchEvent(evt:Event):Boolean {
      return dispatcher_.dispatchEvent(evt);
    }

    public function hasEventListener(type:String):Boolean {
      return dispatcher_.hasEventListener(type);
    }

    public function removeEventListener(type:String, listener:Function, useCapture:Boolean=false):void {
      dispatcher_.removeEventListener(type, listener, useCapture);
    }

    public function willTrigger(type:String):Boolean {
      return dispatcher_.willTrigger(type);
    }
  }
}