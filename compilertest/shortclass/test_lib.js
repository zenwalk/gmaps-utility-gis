  var myns = window.myns || {};
  
  var RAD_DEG = Math.PI / 180;
  
  var MyUtil = {};
  MyUtil.usedPublicMethod = function(msg) {
    log_('inside MyUtil.usedPublicMethod;' + msg);
  };
  MyUtil.privateMethod_ = function(){
    log_('MyUtil.privateMethod');
  };
  MyUtil.unusedPublicMethod = function(){
    log_('MyUtil.unuseMethod');
  };
  function log_( msg){
    var l = document.getElementById('map_canvas');
    if (l) l.innerHTML += '<br/>' + msg;
  }
  /** @type {IMyConfig} */
  var MyConfig = {
    configKey:  'defaultConfigValue'
  };
  /** 
   * @constructor 
   * @implements {IMyClass}
   */
  function MyClass(){
    this.myPublicProperty = 'MyClass.myPublicProperty_Default';
    this.myPrivateProperty_ = 'MyClass.myPrivateProperty_Default';
  }
  
  MyClass.prototype.usedPublicMethod = function(json){
    log_('MyClass.prototype.usedPublicMethod');
    this.myPrivateMethod_(json);
  };
  MyClass.prototype.myPrivateMethod_ = function(/** @type {MyMessage}*/json){
    log_('inside MyClass.prototype.myPrivateMethod_');
    MyUtil.usedPublicMethod('myConfig:'+MyConfig.configKey+' json  '+json.myVeryLongJSONProperty.anotherJSONProperty + '  myProp:'+ this.myPublicProperty);
  };
  MyClass.prototype.unusedPublicMethod = function(json){
    log_('inside MyClass.prototype.unusedPublicMethod');
    this.myPrivateMethod_(json);
  };
  /**
   * @enum
   */
  var MyEnum = {
    ONE: 1, TWO: 2, THREE: 3
  };
  
  /**
   * @constructor
   */
  function MyUnusedClass(){ 
    this.myPublicProperty = 'MyUnusedClass.myPublicProperty_default';
  }
  
  
  myns.MyClass = MyClass;
  myns.MyEnum = MyEnum;
  myns.MyConfig = MyConfig;
  myns.MyUnusedClass = MyUnusedClass;
  myns.MyUtil = MyUtil;
  

  
  