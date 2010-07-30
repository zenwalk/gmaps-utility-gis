  var mynamespace = window['mynamespace'] || {};
  mynamespace.subnamespace = {};
  mynamespace.subnamespace.MyUtil = {};
  mynamespace.subnamespace.MyUtil.usedMethod = function() {
    alert('util used method');
  }
  
  mynamespace.subnamespace.MyUtil.unusedMethod = function() {
    alert('util unused method');
    mynamespace.subnamespace.MyUtil.usedMethod();
  };
  /** @constructor */
  mynamespace.subnamespace.MyClass = function(){
    this.privateProp_ = 'mynamespace.subnamespace.MyClass.privateProp_';
  };
  mynamespace.subnamespace.MyClass.prototype.usedClassMethod = function() {
    alert('class used method');
  }
  
  mynamespace.subnamespace.MyClass.prototype.unusedClassMethod = function() {
    alert('class unused method');
    mynamespace.subnamespace.MyUtil.usedMethod();
  };
  
  //window['mynamespace'] = window['mynamespace'] || mynamespace;
  //window['mynamespace']['subnamespace'] = mynamespace.subnamespace;
  //window['mynamespace']['subnamespace']['MyUtil'] = mynamespace.subnamespace.MyUtil;
  goog.exportSymbol('mynamespace.subnamespace.MyClass', mynamespace.subnamespace.MyClass);
  goog.exportSymbol('mynamespace.subnamespace.MyUtil.usedMethod', mynamespace.subnamespace.MyUtil.usedMethod);
  goog.exportProperty(mynamespace.subnamespace.MyClass.prototype,'usedClassMethod', mynamespace.subnamespace.MyClass.usedClassMethod);
  
 // window['mynamespace']['subnamespace']['MyUtil']['usedMethod'] =  mynamespace.subnamespace.MyUtil.usedMethod;
 // window['mynamespace']['subnamespace']['MyClass'] =  mynamespace.subnamespace.MyClass;  
  /*
   var a = new mynamespace.subnamespace.MyClass();
   function main() {
      mynamespace.subnamespace.MyUtil.usedMethod();
      a.usedClassMethod();
    }
    main();
  */
  
