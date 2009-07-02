/*
 *  ArcGIS for Google Maps Flash API
 * @author nianwei at gmail dot com
 *
 * Licensed under the Apache License, Version 2.0:
 *  http://www.apache.org/licenses/LICENSE-2.0
 */
package ags.service {
  import flash.events.*;
  import ags.sr.*;
  import ags.*;

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
      Util.getJSON(url, {f: 'json'}, function(json:Object):void {
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
        // triggerEvent(me, "load", me);
        me.dispatchEvent(new ServiceEvent(ServiceEvent.LOAD));
      }

      if (json.error) {
        this.correct_=false;
      } else {
        this.correct_=true;
        Util.augmentObject(json, this);
        var layers:Array=[];
        var ids:Array=[];
        for (var i:int=0, c:int=json.layers.length; i < c; i++) {
          var info:Object=json.layers[i];
          var layer:Layer=new Layer(this.url + '/' + info.id, new LayerOptions({initLoad: false}));
          Util.augmentObject(info, layer);
          layer.visible=info.defaultVisibility;
          layers.push(layer);
          ids.push(info.id);
        }
        this.layers_=layers;
        delete this.layers;

        this.spatialReference_=SpatialReferences.getSpatialReference(json.spatialReference.wkid);
        if (!this.spatialReference_) {
          this.exportMap({bbox: json.fullExtent, bboxSR: json.spatialReference.wkid, size: '1,1', imageSR: 4326, layers: 'hide:' + ids.join(',')}, function(image:Object):void {
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
    public function getLayerIds(name:Object):Object {
      var layer:Layer;
      if (name is String) {
        layer=this.getLayer(name);
        if (layer) {
          return layer.id;
        }
      } else if (name is Array) {
        var ids:Array=[];
        for (var i:int=0, c:int=name.length; i < c; i++) {
          layer=this.getLayer(name[i]);
          ids.push(layer ? layer.id : -1);
        }
        return ids;
      }
      return -1;
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
    public function exportMap(eparams:*, callback:Function):void {
      if (!eparams) {
        return;
      }
      // note: dynamic map may overlay on top of maptypes with different projection
      var params:*=Util.augmentObject(eparams, {});
      params.f=params.f || 'json';
      var bbox:*=params.bbox;
      if (bbox.xmin) {
        params.bbox='' + bbox.xmin + ',' + bbox.ymin + ',' + bbox.xmax + ',' + bbox.ymax;
      }
      params.size=params.size || '' + params.width + ',' + params.height;
      params.transparent=(params.transparent === false ? false : true);
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
      if (changed === true) {
        if (!params.layers || !(params.layers is String)) { // !isString(params.layers)) {
          params.layers='show:' + vlayers.join(',');
        }
      }
      if (layerDefs.length > 0) {
        if (!params.layerDefs || !(params.layerDefs is String)) { // !isString(params.layerDefs)) {
          params.layerDefs=layerDefs.join(';');
        }
      }
      if (vlayers.length === 0) {
        // avoid an error:{"error":{"code":400,"message":"","details":["Invalid layer ID specified."]}
        callback({});
      } else {
        Util.getJSON(this.url + '/export', params, callback);
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
    public function identify(iparams:*, callback:Function):void {
      if (!iparams) {
        return;
      }
      var params:*=Util.augmentObject(iparams, {});
      params.f=params.f || 'json';
      if (!Util.isString(params.geometry)) {
        params.geometry=Util.fromGeometryToJSON(params.geometry);
      }
      var ext:*=params.mapExtent; // maybe Extent or String
      if (ext.xmin) {
        params.mapExtent='' + ext.xmin + ',' + ext.ymin + ',' + ext.xmax + ',' + ext.ymax;
      }
      if (!params.imageDisplay) {
        params.imageDisplay='' + params.width + ',' + params.height + ',' + params.dpi;
      }
      if (params.layers && !Util.isString(params.layers)) {
        params.layers='all:' + this.getLayerIds(params.layers).join(',');
      }
      params.returnGeometry=(params.returnGeometry === false ? false : true);
      Util.getJSON(this.url + '/identify', params, callback);
    }


    /**
     * Find features using the {@link ArcGISFindParameters} and process {@link ArcGISFindResults}
     * using the <code>callback</code> function.
     * For more info see <a
     * href  = 'http://resources.esri.com/help/9.3/arcgisserver/apis/rest/find.html'>Find Operation</a>.
     * @param {FindParameters} params
     * @param {Function} callback
     */
    public function find(fparams:*, callback:Function):void {
      if (!fparams) {
        return;
      }
      var params:*=Util.augmentObject(fparams, {});
      params.f=params.f || 'json';
      if (params.layers && !Util.isString(params.layers)) {
        params.layers=this.getLayerIds(params.layers).join(',');
      }
      if (params.searchFields && !Util.isString(params.searchFields)) {
        params.searchFields=params.searchFields.join(',');
      }
      params.contains=(params.contains === false ? false : true);
      params.returnGeometry=(params.returnGeometry === false ? false : true);
      Util.getJSON(this.url + '/find', params, callback);
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
    public function queryLayer(layerNameOrId:String, params:*, callback:Function):void {
      var layer:Layer=this.getLayer(layerNameOrId);
      if (layer) {
        layer.query(params, callback);
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