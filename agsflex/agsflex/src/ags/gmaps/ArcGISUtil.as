/*
* ArcGIS for Google Maps Flash API
* @author nianwei at gmail dot com
*
* Licensed under the Apache License, Version 2.0:
*  http://www.apache.org/licenses/LICENSE-2.0
*/
package ags.gmaps {

  import com.google.maps.*;
  import com.google.maps.interfaces.IOverlay;
  import com.google.maps.overlays.*;

  import flash.events.*;
  import flash.geom.Point;
  import flash.net.*;

  import mx.rpc.events.*;
  import mx.rpc.http.*;
 import ags.service.*;
  import ags.sr.*;
  /**
   * Utility tools
   */
  public class ArcGISUtil

  {
    public function ArcGISUtil() {

    }

    
    

    /**
     * Helper method to convert an {@link ArcGISEnvelope} object to <code>GLatLngBounds</code>
     * @param {Envelope} extent
     * @return {GLatLngBounds} gLatLngBounds
     */
    public static function fromEnvelopeToLatLngBounds( /*Envelope*/ extent:*):LatLngBounds {
      var sr:SpatialReference=SpatialReferences.getSpatialReference(extent.spatialReference.wkid);
      sr=sr || SpatialReferences.WGS84;
      var sw:Array=sr.reverse([extent.xmin, extent.ymin]);
      var ne:Array=sr.reverse([extent.xmax, extent.ymax]);
      return new LatLngBounds(new LatLng(sw[1], sw[0]), new LatLng(ne[1], ne[0]));
    }

    public static function fromLatLngBoundsToEnvelope(gLatLngBounds:LatLngBounds, spatialReference:SpatialReference):* {
      if (spatialReference == null)
        spatialReference=SpatialReferences.WEB_MERCATOR;
      var sw:Array=spatialReference.forward([gLatLngBounds.getSouthWest().lng(), gLatLngBounds.getSouthWest().lat()]);
      var ne:Array=spatialReference.forward([gLatLngBounds.getNorthEast().lng(), gLatLngBounds.getNorthEast().lat()]);
      return {xmin: sw[0], ymin: sw[1], xmax: ne[0], ymax: ne[1], spatialReference: {wkid: spatialReference.wkid}};
    }

    public static function fromLatLngToPoint(gLatLng:LatLng, sr:SpatialReference):* {
      sr=sr || SpatialReferences.WGS84;
      var p:Array=sr.forward([gLatLng.lng(), gLatLng.lat()]);
      return {x: p[0], y: p[1], spatialReference: {wkid: sr.wkid}};
    }

    public static function fromPointToLatLng(point:*, opt_sr:*):LatLng {
      var srid:*=point.spatialReference || opt_sr;
      var sr:SpatialReference=srid ? SpatialReferences.getSpatialReference(srid.wkid) : SpatialReferences.WGS84;
      sr=sr || SpatialReferences.WGS84;
      if (isNaN(point.x) || isNaN(point.y)) {
        return null;
      }
      var p:Array=sr.reverse([point.x, point.y]);
      return new LatLng(p[1], p[0]);
    }

    /**
     * Add a ArcGIS Server resource to map. if it is cached, it will be added as a map type, if dynamic, it will be added as overlay.
     * @param map
     * @param url
     * @param opt_callback
     *
     */
    public static function addArcGISMap(map:Map, url:String, opt_callback:Function=null):void {
      var service:MapService=new MapService(url);
      service.addEventListener(ServiceEvent.LOAD, function(evt:Event):void {
          if (service.singleFusedMapCache) {
            var tile:ArcGISTileLayer=new ArcGISTileLayer(service);
            var type:ArcGISMapType=new ArcGISMapType([tile], new ArcGISMapTypeOptions({name: tile.getName().replace(/ /g, '\n')}));
            map.addMapType(type);
            if (opt_callback != null) {
              opt_callback.call(null, type);
            }
          } else {
            var ov:ArcGISMapOverlay=new ArcGISMapOverlay(service);
            map.addOverlay(ov);
            if (opt_callback != null) {
              opt_callback.call(null, ov);
            }
          }
        });
    }

    /**
     * Enable wheel zoom as alternative to Map.enableScrollWheelZoom because the later passed zoom=0 to Projection.
     */
    public static function enableScrollWheelZoom(map:com.google.maps.Map):void {
      map.getDisplayObject().addEventListener(MouseEvent.MOUSE_WHEEL, function(evt:MouseEvent):void {
          var p:Point=new Point(evt.localX, evt.localY);
          var latlng:LatLng;
          var c:Point=new Point(map.width / 2, map.height / 2);
          var z:Number=map.getZoom();
          if (evt.delta > 0) {
            z=Math.min(z + 1, map.getMaxZoomLevel());
            latlng=map.fromViewportToLatLng(new Point((p.x + c.x) / 2, (p.y + c.y) / 2));
          } else {
            z=Math.max(z - 1, map.getMinZoomLevel());
            latlng=map.fromViewportToLatLng(new Point(c.x * 2 - p.x, c.y * 2 - p.y));
          }
          map.setCenter(latlng, z);
        });
    }

    public static var ArcGISConfig:*={maxPolyPoints: 1000, style: {icon: null, strokeStyle: {thickness: 3, color: 0xffff00, alpha: 0.5, pixelHinting: true}, fillStyle: {color: 0xFFFF00, alpha: 0.5}

        }};

    /**
     * Convert a {@link ArcGISFeature} or {@link ArcGISIdentifyResult} or {@link ArcGISFindResult} to core Google Maps API
     * overlays such as  {@link ArcGISGMarker},
     * {@link ArcGISGPolyline}, or {@link ArcGISGPolygon}s.
     * Note ArcGIS Geometry may have multiple parts, but the coresponding GOverlay
     * does not  support multi-parts, so the result is an array.
     * <ul><li><code>feature</code>: an object returned by ArcGIS Server with at least <code>geometry</code> property of type {@link ArcGISGeometry}.
     *  if it contains a name-value pair "attributes" property, it will be attached to the result overlays.
     * <li><code>opt_sr</code>: optional {@link ArcGISSpatialReference}. Can be object literal.
     * <li><code>opt_agsStyle</code> {@link ArcGISStyleOptions}. default is {@link ArcGISConfig}.style.
     * <li><code>opt_displayName</code> optional field name used for title of feature.
     * @param {Feature} feature
     * @param {ArcGISSpatialReference} opt_sr
     * @param {StyleOptions} opt_agsStyle
     * @param {String} opt_displayName
     * @return {GOverlay[]}
     */

    public static function fromFeatureToOverlays(geom:*, opt_sr:*=null, opt_agsStyle:*=null, title:String=''):Array {
      var ovs:Array=[];
      var sr:SpatialReference=null;
      var ov:IOverlay=null;
      //var geom:*=feature.geometry;
      if (opt_sr) {
        if (opt_sr is SpatialReference) {
          sr=opt_sr;
        } else {
          sr=SpatialReferences.getSpatialReference(opt_sr.wkid);
        }
      } else {
        sr=SpatialReferences.getSpatialReference(geom.spatialReference.wkid);
      }
      if (sr === null) {
        return ovs;
      }
      var style:*=opt_agsStyle || ArcGISConfig.style;
      var x:String, i:int, ic:int, j:int, jc:int, parts:Array, part:Array, lnglat:Array, glatlngs:Array;
      // title = title;

      if (geom.x) {
        //point
        lnglat=sr.reverse([geom.x, geom.y]);
        ov=new Marker(new LatLng(lnglat[1], lnglat[0]), new MarkerOptions({
          //icon: style.icon,
            tooltip: title}));
        //(ov as Marker)['attributes']  =  feature.attributes;
        ///ov.html = html;
        ovs.push(ov);
      } else {
        //mulpt, line and poly
        parts=geom.points || geom.paths || geom.rings;
        if (!parts) {
          return ovs;
        }
        for (i=0, ic=parts.length; i < ic; i++) {
          part=parts[i];
          if (geom.points) {
            // multipoint
            lnglat=sr.reverse(part);
            ov=new Marker(new LatLng(lnglat[1], lnglat[0]), new MarkerOptions({
              //icon: style.icon
              }));
          } else {
            if (part.length > ArcGISConfig.maxPolyPoints) {
              // TODO: do a simple point reduction 
              continue;
            }
            glatlngs=[];
            for (j=0, jc=part.length; j < jc; j++) {
              lnglat=sr.reverse(part[j]);
              glatlngs.push(new LatLng(lnglat[1], lnglat[0]));
            }
            if (geom.paths) {
              ov=new Polyline(glatlngs, new PolylineOptions({strokeStyle: style.strokeStyle}));
                // {
                //thickness: 3,
                //color: 0x123456,
                //alpha: 0.5,
                // pixelHinting: true
                // }
            } else if (geom.rings) {
              ov=new Polygon(glatlngs, new PolygonOptions({strokeStyle: style.strokeStyle, fillStyle: style.fillStyle, tooltip: title})); //, style.outlineColor, style.outlineWeight, style.outlineOpacity, style.fillColor, style.fillOpacity);
            }
          }
          ///ov.attributes   =  feature.attributes;
          //// ov.html = html;
          ovs.push(ov);
        }
      }
      return ovs;
    }
  }
}