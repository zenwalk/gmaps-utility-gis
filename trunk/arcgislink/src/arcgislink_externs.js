// This file contains ENUMS and JSON specs
// Although ENUMS can be written as quotation syntax to avoid change,
// it will require app code to use quotation too, which can be awkward.
// declare in extern allows both use dot notation. 
// there is no need to reference this extern file when lib + app compiled together
// for dead code removal. However compile lib only requires this extern along with 
// the google maps v3 extern.


// put Config here because notation tool not be able to handle declaration in js.
// if declared with quote, then app must be in quote too if compiled together.
// if rename app's dot notation before compile together, then the results "proxyUrl"
// won't be shortened. The downside of putting here is "Config" will not be shortened. 
