/*
 * ArcGIS for Google Maps Flash API
 *
 * License http://www.apache.org/licenses/LICENSE-2.0
 */
 /**
 * @author nianwei at gmail dot com
 */ 

package ags {
  import flash.events.*;
 
  /**
   * This class represents a Map layer inside an ArcGISMapService. It carries
   *  information about a layer's name, id and other information such as scales etc.
   *  Due to the way REST API is implemented, each layers extra meta data must retrieved
   *  individually. However, most operations do not require those extra info and can be
   *  used directly.
   */
  // dynamic for now
  public dynamic class Layer implements IEventDispatcher {
    public var url:String;
    private var loaded_:Boolean;
    private var correct_:Boolean;
    public var definition:String;
    public var id:int;
    public var name:String;
    public var visible:Boolean;

    /**
     * Create a  map Layer using it's url ( 	http://[mapservice-url]/[layerId])
     * @name ArcGISLayer
     * @param {String} url
     * @property {Number} [id] layer ID
     * @property {String} [name] layer Name
     * @property {Number} [parentLayerId] parent LayerId
     * @property {Layer} [parentLayer] parent Layer {@link ArcGISLayer}
     * @property {Boolean} [defaultVisibility] defaultVisibility
     * @property {Number[]} [subLayerIds] sub LayerIds. null if no sub layers
     * @property {Layer[]} [subLayers] sub Layers. {@link ArcGISLayer}[].
     * @property {Boolean} [visibility] Visibility of this layer
     * @property {String} [definition] Layer definition.
     * @property {String} [type] layer type(Feature Layer|), only available after load.
     * @property {String} [geometryType] geometryType type(esriGeometryPoint|..), only available after load.
     * @property {String} [copyrightText] copyrightText, only available after load.
     * @property {Number} [minScale] minScale, only available after load.
     * @property {Number} [maxScale] maxScale, only available after load.
     * @property {Envelope} [extent] extent, only available after load.
     * @property {String} [displayField] displayField, only available after load.
     * @property {Field[]} [fields] fields, only available after load. See {@link ArcGISField}
     */
    public function Layer(url:String, opts:LayerOptions=null) {
      this.url=url;
      this.loaded_=false;
      this.correct_=false;
      this.definition=null;
      dispatcher_=new EventDispatcher(this);
      if (opts!=null && opts.initLoad===false){
        return ;
      }else{
        loadInfo();
      }
    }

    public function loadInfo(opt_callback:Function=null):void {
      trace('ArcGISLayer.loadInfo:'+this.url);
      var me:Layer=this;
      if (this.loaded_ && this.correct_) {
        return;
      }
      ArcGISUtil.restRequest(this.url, {f: 'json'}, this, function(json:Object):void {
          if (json.error) {
            me.correct_=false;
          } else {
            me.correct_=true;
            ArcGISUtil.augmentObject(json, me);
          }
          me.loaded_=true;
          me.dispatchEvent(new ServiceEvent(ServiceEvent.LOAD));
          if (opt_callback !== null) {
            opt_callback.call(null, me);
          }
        });
    }

    public function hasLoaded():Boolean {
      return this.loaded_;
    }

    public function getFieldNames():Array {
      var ret:Array=[];
      if (this.hasLoaded()) {
        for (var i:int=0; i < this.fields.length; i++) {
          ret.push(this.fields[i].name);
        }
      }
      return ret;
    }
    ;

    /**
     * Whether the layer is viewable at given scale
     * @param {Number} scale
     * @return {Boolean}
     */
    public function isInScale(scale:Number):Boolean {
      // note if the layer's extra info is not loaded, it will return true
      if (this.maxScale && this.maxScale > scale) {
        return false;
      }
      if (this.minScale && this.minScale < scale) {
        return false;
      }
      return true;
    }
    ;

    /**
     * The query operation is performed on a layer resource. The result of this operation is a resultset resource that will be
     * passed in the callback function. param is an instance of {@link ArcGISQueryParameters}
     * <br/>For more info see <a href  = 'http://resources.esri.com/help/9.3/arcgisserver/apis/rest/query.html'>Query Operation</a>.
     * @param {QueryParameters} params
     * @param {Function} callback
     */
    public function query(qparams:QueryParameters, callbackFn:Function=null, failedFn:Function=null, ovOpts:OverlayOptions=null):void {
      if (!qparams) {
        return;
      }
      var params:Object={
        f:'json',
        outFields:qparams.outFields.join(','),
        returnGeometry:qparams.returnGeometry === false ? false : true,
        where:qparams.where,
        outSR:SpatialReferences.WGS84.wkid
      };
      if (qparams.geometry && qparams.geometry.length>0){
        params.geometry=ArcGISUtil.fromGeometryToJSON(ArcGISUtil.fromOverlaysToGeometry(qparams.geometry, SpatialReferences.WGS84));
        params.spatialRel=qparams.spatialRelationship;
        params.inSR=SpatialReferences.WGS84.wkid;
        
      }
      var me:Layer=this;
      ArcGISUtil.restRequest(this.url + '/query', params, this, function(json:*):void {
          var res:ResultSet=new ResultSet(json);
          if (callbackFn != null) {
            callbackFn.call(me, res);
          }
          me.dispatchEvent(new ServiceEvent(ServiceEvent.QUERY_COMPLETE, res));
        }, failedFn);
    }
    ;

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