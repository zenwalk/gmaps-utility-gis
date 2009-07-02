/*
 *  ArcGIS for Google Maps Flash API
 * @author nianwei at gmail dot com
 *
 * Licensed under the Apache License, Version 2.0:
 *  http://www.apache.org/licenses/LICENSE-2.0
 */
package ags.service {
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
        Util.augmentObject(opts, this, true);
      }
    }

  }
}