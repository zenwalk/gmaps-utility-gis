package ags
{
  public class FindResults
  {
    public var results:Array=[];
    public function FindResults(params:*=null, ovOpts:OverlayOptions=null)
    {
      if (params && params.results){
        var res:* = params.results;
        for (var i:int = 0; i< res.length; i++){
          results.push(new FindResult(res[i],ovOpts));
        }
      }
    }

  }
}