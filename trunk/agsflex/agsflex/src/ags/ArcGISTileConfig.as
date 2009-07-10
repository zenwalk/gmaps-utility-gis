/*
* ArcGIS for Google Maps Flash API
* @author nianwei at gmail dot com
*
* Licensed under the Apache License, Version 2.0:
*  http://www.apache.org/licenses/LICENSE-2.0
*/
package ags {
  import com.google.maps.*;
  import com.google.maps.interfaces.*;
  
  import flash.geom.Point;

  /**
   * This class is a bridge between Google's projection and ArcGIS's spatial reference system.
   */
  public class ArcGISTileConfig extends ProjectionBase {
    private var tileInfo_:*;
    private var spatialReference_:SpatialReference;
    internal var zoomOffset_:int; //used in TileLayer
    private var fullExtent_:*;


    public function ArcGISTileConfig( /*TileInfo*/ tileInfo:*, /*Envelope*/  opt_fullExtent:*=null) {
      super();
      if (!tileInfo) {
        throw new Error('map service is not tiled');
      }
      this.tileInfo_=tileInfo;
      this.spatialReference_=SpatialReferences.getSpatialReference(tileInfo.spatialReference.wkid);
      if (!this.spatialReference_) {
        throw new Error('unsupported Spatial Reference');
      }
      this.zoomOffset_=Math.floor(Math.log(this.spatialReference_.getCircumference() / this.tileInfo_.lods[0].resolution / 256) / Math.LN2 + 0.5);
      this.fullExtent_=opt_fullExtent;


    }



    /**
     * See <a href  = 'http://code.google.com/apis/maps/documentation/reference.html#GProjection'>GProjection</a>.
     * @param {GLatLng} gLatLng
     * @param {Number} zoom
     * @return {GPoint} pixel
     */
    override public function fromLatLngToPixel(gLatLng:LatLng, zoom:Number):flash.geom.Point {
      if (!gLatLng || isNaN(gLatLng.lat()) || isNaN(gLatLng.lng())) {
        return null;
      }
      var coords:Array=this.spatialReference_.forward([gLatLng.lng(), gLatLng.lat()]);
      var zoomIdx:int=zoom - this.zoomOffset_;
      var res:Number=this.getUnitsPerPixel(zoom);
      //!!!! must NOT round to integer, even it is fine in JS version, Flex version 
      // will cause HUGE shift!
      var px:Number=(coords[0] - (this.tileInfo_.origin.x as Number)) / res;
      var py:Number=((this.tileInfo_.origin.y as Number) - coords[1]) / res;
      
      return new Point(px, py);
    }

    /**
     * Get resolution (Units per Pixel) at given zoom level.
     * @param {Number} zoom
     * @return Number
     */
    public function getUnitsPerPixel(zoom:int):Number {
      var zoomIdx:int=zoom - this.zoomOffset_;
      var res:Number=Number.MAX_VALUE;
      var factor:Number = 1;
      if (zoomIdx <0){
       // trace('invalid zoom: ' +zoom);
        factor = Math.pow(2, -zoomIdx);
        res=this.tileInfo_.lods[0].resolution * factor;
        
      } else if (zoomIdx > this.tileInfo_.lods.length-1){
       // trace('invalid zoom: ' +zoom);
        factor=Math.pow(2, zoom - this.maxResolution());
        res=this.tileInfo_.lods[this.tileInfo_.lods.length - 1].resolution / factor;
        
      } else {
        res=this.tileInfo_.lods[zoomIdx].resolution;
      }
      return res;
    }

    /**
     * Get the scale at given level;
     * @param {Number} zoom
     * @return {Number}
    
    public function getScale(zoom:int):Number {
      var zoomIdx:int=zoom - this.zoomOffset_;
      var res:Number=0;
      if (this.tileInfo_.lods[zoomIdx]) {
        res=this.tileInfo_.lods[zoomIdx].scale;
      } else {
        //this is a special case when the maxZoom is set larger than what's actually defined in the tiling scheme.
        // the goal is to allow map continue to zoom to extremely detail level by using ArcGISMapOverlay.
        var factor:Number=Math.pow(2, zoom - this.maxResolution());
        res=this.tileInfo_.lods[this.tileInfo_.lods.length - 1].scale / factor;
      }
      return res;
    }
    */
    /**
     * See <a href  = 'http://code.google.com/apis/maps/documentation/reference.html#GProjection'>GProjection</a>.
     * @param {GPoint} pixel
     * @param {Number} zoom
     * @param {Boolean} unbound
     * @return {GLatLng} gLatLng
     */
    override public function fromPixelToLatLng(pixel:flash.geom.Point, zoom:Number, unbound:Boolean=false):LatLng {
      if (pixel === null) {
        return null;
      }
      var zoomIdx:int=zoom - this.zoomOffset_;
      var res:Number=this.getUnitsPerPixel(zoom);
      var x:Number=pixel.x * res + (this.tileInfo_.origin.x as Number);
      var y:Number=(this.tileInfo_.origin.y as Number)- pixel.y * res;
      var ll:Array=this.spatialReference_.reverse([x, y]);
      return new LatLng(ll[1], ll[0]);
    }

    /**
     * See <a href  = 'http://code.google.com/apis/maps/documentation/reference.html#GProjection'>GProjection</a>.
     * @param {Object} tile
     * @param {Number} zoom
     * @param {Number} tilesize
     */
    override public function tileCheckRange(tile:flash.geom.Point, zoom:Number, tilesize:Number):Boolean {
      var zoomIdx:Number=zoom - this.zoomOffset_;
      if (this.tileInfo_.lods[zoomIdx]) {
        var b:*=this.fullExtent_;
        if (!b) {
          return true;
        }
        var minX:Number=tile.x * tilesize * this.tileInfo_.lods[zoomIdx].resolution + this.tileInfo_.origin.x;
        var minY:Number=this.tileInfo_.origin.y - (tile.y + 1) * tilesize * this.tileInfo_.lods[zoomIdx].resolution;
        var maxX:Number=(tile.x + 1) * tilesize * this.tileInfo_.lods[zoomIdx].resolution + this.tileInfo_.origin.x;
        var maxY:Number=this.tileInfo_.origin.y - tile.y * tilesize * this.tileInfo_.lods[zoomIdx].resolution;
        var ret:Boolean=!(b.xmin > maxX || b.xmax < minX || b.ymax < minY || b.ymin > maxY);
        return ret;
      } else {
        return false;
      }
    }

    /**
     * See <a href  = 'http://code.google.com/apis/maps/documentation/reference.html#GProjection'>GProjection</a>.
     * @param {Number} zoom
     * @return {Number} numOfpixel
     */
    override public function getWrapWidth(zoom:Number):Number {
      var zoomIdx:Number=zoom - this.zoomOffset_;
      if (this.tileInfo_.lods[zoomIdx]) {
        return this.spatialReference_.getCircumference() / this.tileInfo_.lods[zoomIdx].resolution;
      } else {
        return Number.MAX_VALUE;
      }
    }

    /**
     * Get the tile size used by this Projection. Shortcut to tileInfo.rows;
     * @return {Number}
     */
    public function getTileSize():Number {
      return this.tileInfo_.rows;
    }

    /**
     * Get min zoom level of actual tiles
     * @return {Number}
     */
    public function minResolution():Number {
      return this.zoomOffset_;
    }

    /**
     * Get max zoom level of actual tiles
     * @return {Number}
     */
    public function maxResolution():Number {
      return this.zoomOffset_ + this.tileInfo_.lods.length - 1;
    }

    /**
     * Get the underline {@link ArcGISSpatialReference}
     * @return {ArcGISSpatialReference}
     */
    public function getSpatialReference():SpatialReference {
      return this.spatialReference_;
    }

    /**
     *tile configuration used by Google Maps 
     */
    public static const GOOGLE_MAPS:ArcGISTileConfig=new ArcGISTileConfig({"rows": 256, "cols": 256, "dpi": 96, "format": "PNG8", "compressionQuality": 0, "origin": {"x": -20037508.342787, "y": 20037508.342787}, "spatialReference": {"wkid": 102113}, "lods": [{"level": 0, "resolution": 156543.033928, "scale": 591657527.591555}, {"level": 1, "resolution": 78271.5169639999, "scale": 295828763.795777}, {"level": 2, "resolution": 39135.7584820001, "scale": 147914381.897889}, {"level": 3, "resolution": 19567.8792409999, "scale": 73957190.948944}, {"level": 4, "resolution": 9783.93962049996, "scale": 36978595.474472}, {"level": 5, "resolution": 4891.96981024998, "scale": 18489297.737236}, {"level": 6, "resolution": 2445.98490512499, "scale": 9244648.868618}, {"level": 7, "resolution": 1222.99245256249, "scale": 4622324.434309}, {"level": 8, "resolution": 611.49622628138, "scale": 2311162.217155}, {"level": 9, "resolution": 305.748113140558, "scale": 1155581.108577}, {"level": 10, "resolution": 152.874056570411, "scale": 577790.554289}, {"level": 11, "resolution": 76.4370282850732, "scale": 288895.277144}, {"level": 12, "resolution": 38.2185141425366, "scale": 144447.638572}, {"level": 13, "resolution": 19.1092570712683, "scale": 72223.819286}, {"level": 14, "resolution": 9.55462853563415, "scale": 36111.909643}, {"level": 15, "resolution": 4.77731426794937, "scale": 18055.954822}, {"level": 16, "resolution": 2.38865713397468, "scale": 9027.977411}, {"level": 17, "resolution": 1.19432856685505, "scale": 4513.988705}, {"level": 18, "resolution": 0.597164283559817, "scale": 2256.994353}, {"level": 19, "resolution": 0.298582141647617, "scale": 1128.497176}]}, null);
    /**
     *tile configuration used by ArcGIS online 
     */
    public static const ARCGIS_ONLINE:ArcGISTileConfig=new ArcGISTileConfig({"rows": 512, "cols": 512, "dpi": 96, "origin": {"x": -180, "y": 90}, "spatialReference": {"wkid": 4326}, "lods": [{"level": 0, "resolution": 0.351562499999999, "scale": 147748799.285417}, {"level": 1, "resolution": 0.17578125, "scale": 73874399.6427087}, {"level": 2, "resolution": 0.0878906250000001, "scale": 36937199.8213544}, {"level": 3, "resolution": 0.0439453125, "scale": 18468599.9106772}, {"level": 4, "resolution": 0.02197265625, "scale": 9234299.95533859}, {"level": 5, "resolution": 0.010986328125, "scale": 4617149.97766929}, {"level": 6, "resolution": 0.0054931640625, "scale": 2308574.98883465}, {"level": 7, "resolution": 0.00274658203124999, "scale": 1154287.49441732}, {"level": 8, "resolution": 0.001373291015625, "scale": 577143.747208662}, {"level": 9, "resolution": 0.0006866455078125, "scale": 288571.873604331}, {"level": 10, "resolution": 0.000343322753906249, "scale": 144285.936802165}, {"level": 11, "resolution": 0.000171661376953125, "scale": 72142.9684010827}, {"level": 12, "resolution": 8.58306884765626E-05, "scale": 36071.4842005414}, {"level": 13, "resolution": 4.29153442382813E-05, "scale": 18035.7421002707}, {"level": 14, "resolution": 2.14576721191406E-05, "scale": 9017.87105013534}, {"level": 15, "resolution": 1.07288360595703E-05, "scale": 4508.93552506767}]});


  }
}