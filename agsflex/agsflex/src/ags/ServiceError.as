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
  /**
  * represent normal error returned by server, or wrapped RPC error
  */ 
  public class ServiceError
  {
    public var code:Number;
    public var message:String;
    public var details:Array;
    public function ServiceError(params:*=null)
    {
      if (params){
        ArcGISUtil.augmentObject(params,this,false);
      }
       
    }
    public  function toString():String{
      return '('+code+')'+message+'\n'+(details?details.join('\n'):'');
    }
  }
}