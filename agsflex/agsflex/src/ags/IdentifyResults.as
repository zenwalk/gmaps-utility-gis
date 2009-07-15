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
  public class IdentifyResults
  {
    public var results:Array=[];
    public function IdentifyResults(params:*=null, sr:SpatialReference=null, ovOpts:OverlayOptions=null)
    {
      if (params && params.results){
        var res:* = params.results;
        for (var i:int = 0; i< res.length; i++){
          results.push(new IdentifyResult(res[i],sr,ovOpts));
        }
      }
    }

  }
}