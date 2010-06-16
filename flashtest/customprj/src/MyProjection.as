package {
  import com.google.maps.*;
  import com.google.maps.interfaces.*;

  import flash.geom.Point;

  public class MyProjection extends ProjectionBase {
    private var imageDimension:int;
    private var pixelsPerLonDegree:Array;
    private var tileBounds:Array;
    private var tileSize:int=256;
    private var isWrapped:Boolean;
    private var pixelOrigin:Array;

    public function MyProjection(a:int, wrapped:Boolean) {
      super();
      this.imageDimension=65536;
      this.pixelsPerLonDegree=[];
      this.pixelOrigin=[];
      this.tileBounds=[];
      this.tileSize=256;
      this.isWrapped=wrapped;
      var b:int=this.tileSize;
      var c:int=1;
      for (var d:int=0; d < a; d++) {
        var e:Number=b / 2;
        this.pixelsPerLonDegree.push(b / 360);
        this.pixelOrigin.push(new Point(e, e));
        this.tileBounds.push(c);
        b*=2;
        c*=2;
      }
    }



    override public function fromLatLngToPixel(latlng:LatLng, zoom:Number):Point {
      var c:Number=Math.round(this.pixelOrigin[zoom].x + latlng.lng() * this.pixelsPerLonDegree[zoom]);
      var d:Number=Math.round(this.pixelOrigin[zoom].y + (-2 * latlng.lat()) * this.pixelsPerLonDegree[zoom]);
      return new Point(c, d);
     }

    override public function fromPixelToLatLng(pixel:Point, zoom:Number, unbound:Boolean=false):LatLng {
      var d:Number=(pixel.x - this.pixelOrigin[zoom].x) / this.pixelsPerLonDegree[zoom];
      var e:Number=-0.5 * (pixel.y - this.pixelOrigin[zoom].y) / this.pixelsPerLonDegree[zoom];
      return new LatLng(e, d, unbound)
    }


    override public function tileCheckRange(tile:Point, zoom:Number, tilesize:Number):Boolean {
      trace(tile.x);
      var tileBound:Number=this.tileBounds[zoom];
      if (tile.y < 0 || tile.y >= tileBound) {
        return false;
      }
      if (this.isWrapped) {
        if (tile.x < 0 || tile.x >= tileBound) {
          tile.x=tile.x % tileBound;
          if (tile.x < 0) {
            tile.x+=tileBounds;
          }
        }
      } else {
        if (tile.x < 0 || tile.x >= tileBound) {
          return false;
        }
      }
      return true;

    }

    override public function getWrapWidth(zoom:Number):Number {
      return this.tileBounds[zoom] * this.tileSize;

    }




  }
}