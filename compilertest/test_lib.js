  var myns = myns || {};
  
  var RAD_DEG = Math.PI / 180;
  
  myns.MyUtil = {};
  myns.MyUtil.usedPublicMethod = function(msg) {
    log_('inside MyUtil.usedPublicMethod;' + msg);
  };
  myns.MyUtil.privateMethod_ = function(){
    log_('MyUtil.privateMethod');
  };
  myns.MyUtil.unusedPublicMethod = function(){
    log_(' MyUtil.unuseMethod');
  };
  function log_( msg){
    var l = document.getElementById('map_canvas');
    if (l) l.innerHTML += '<br/>' + msg;
  }
  /** @type {IMyConfig} */
  myns.MyConfig = {
    configKey:  'defaultConfigValue'
  };
  /** 
   * @constructor 
   * @implements {IMyClass}
   */
  myns.MyClass = function(){
    this.myPublicProperty = 'MyClass.myPublicProperty_Default';
    this.myPrivateProperty_ = 'MyClass.myPrivateProperty_Default';
  };
  
  
  myns.MyClass.prototype.usedPublicMethod = function(/** @type {myns.MyMessage}*/json){
    log_('MyClass.prototype.usedPublicMethod');
    this.myPrivateMethod_(json);

  };
  myns.MyClass.prototype.myPrivateMethod_ = function(/** @type {myns.MyMessage}*/json){
     log_('inside MyClass.prototype.myPrivateMethod_');
     myns.MyUtil.usedPublicMethod('myConfig:'+myns.MyConfig.configKey+' json  '+json.myVeryLongJSONProperty.anotherJSONProperty + '  myProp:'+ this.myPublicProperty);

  };
  myns.MyClass.prototype.unusedPublicMethod = function(/** @type {myns.MyMessage}*/json){
    log_('inside MyClass.prototype.unusedPublicMethod');
    this.myPrivateMethod_(json);
  };
  /**
   * @enum
   */
  myns.MyEnum = {
    ONE: 1, TWO: 2, THREE: 3
  }
  
  /**
   * @constructor
   */
  myns.MyUnusedClass = function(){ 
    this.myPublicProperty = 'MyUnusedClass.myPublicProperty_default';
  };
    
  
  

  
  