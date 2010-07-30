var mynamespace = mynamespace || {};
mynamespace.subnamespace = {};
/** @constructor */
mynamespace.subnamespace.MyUtil = function(){};
mynamespace.subnamespace.MyUtil.prototype.usedMethod = function() {
  alert('used method');
}
mynamespace.subnamespace.MyUtil.prototype.unusedMethod = function() {
  alert('unused method');
};
// calling from an app
function main() {
  new mynamespace.subnamespace.MyUtil().usedMethod();
}
main();