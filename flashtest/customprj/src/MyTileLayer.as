package {
  import com.google.maps.*;
  import com.google.maps.interfaces.*;
  
  import flash.display.DisplayObject;
  import flash.display.Loader;
  import flash.events.*;
  import flash.geom.Point;
  import flash.net.URLRequest;

  public class MyTileLayer extends TileLayerBase {

    public function MyTileLayer() {
      var copyrightCollection:CopyrightCollection=new CopyrightCollection();
      super(copyrightCollection, 0, 17);
      copyrightCollection.addCopyright(new Copyright("MyCopyright", new LatLngBounds(new LatLng(-90, -180), new LatLng(90, 180)), 0, "<a href=\"http://www.casa.ucl.ac.uk\">CASA</a>"));
    }



    /**
     * Creates and loads a tile (x, y) at the given zoom level.
     * @param tilePos  Tile coordinates.
     * @param zoom  Tile zoom.
     * @return  Display object representing the tile.
     */
    public override function loadTile(tile:Point, zoom:Number):DisplayObject {
      //converts tile x,y into keyhole string
      
      var c:Number=Math.pow(2,zoom);

        var d:Number=tile.x;
        var e:Number=tile.y;
        var f:String="t";
        for(var g:int=0;g<zoom;g++){
            c=c/2;
            if(e<c){
                if(d<c){f+="q"}
                else{f+="r";d-=c}
            }
            else{
                if(d<c){f+="t";e-=c}
                else{f+="s";d-=c;e-=c}
            }
        }
        var url:String= "http://www.birthright.net/arjan/Cerilia Terrain Map-tiles/"+f+".jpg";
     var loader:Loader=new Loader();
        loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, ioErrorHandler);

        loader.load(new URLRequest(url));
        return loader;
    }

    private function ioErrorHandler(event:IOErrorEvent):void {
      trace("ioErrorHandler: " + event);
    }

    

  }
}