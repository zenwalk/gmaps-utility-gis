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
  import com.google.maps.overlays.TileLayerOverlay;

/**
 * Tile layer as overlay. tile layer must be loaded first.
 */ 
  public class ArcGISTileLayerOverlay extends TileLayerOverlay
  {
    public function ArcGISTileLayerOverlay(tileLayer:ArcGISTileLayer)
    {
      //arg0:ITileLayer, arg1:int=256, arg2:IProjection=null
      super(tileLayer, tileLayer.getProjection().getTileSize(), tileLayer.getProjection());
    }
    
  }
}