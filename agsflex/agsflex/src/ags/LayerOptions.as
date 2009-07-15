/*
 * ArcGIS for Google Maps Flash API
 *
 * License http://www.apache.org/licenses/LICENSE-2.0
 */
 /**
 * @author nianwei at gmail dot com
 */ 

package ags {
  import ags.*;

  /**
   * Options to construct an layer object
   */
  public class LayerOptions {
    /**
     * Indicates whether the layer should load meta data in constrcutor. default is true
     */
    public var initLoad:Boolean=true;

    public function LayerOptions(opts:*) {
      if (opts) {
        ArcGISUtil.augmentObject(opts, this, true);
      }
    }

  }
}