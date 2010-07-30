  var myns = myns || {};
  
  var RAD_DEG = Math.PI / 180;
  var MyUtil = {
    show: function(msg) {
      alert('msg is ' + msg);
    }
  };
  function privateFn(){
    alert('privateFn');
  }
  /** @type {MyConfig_} */
  var MyConfig = {
    configKey:  'defaultConfigValue'
  };
  /** 
   * @constructor 
   * @implements {IMyClass}
   */
  function MyClass(){
    this.myPublicProperty = 'myPublicProperty_Default';
    this.myPrivateProperty_ = 'myPrivateProperty_Default';
  }
  
  MyClass.prototype.myPublicMethod = function(json){
    this.myPrivateMethod_(json);
    privateFn();
  }
  MyClass.prototype.myPrivateMethod_ = function(/** @type {MyMessage}*/json){
    MyUtil.show('myConfig:'+MyConfig['configKey']+' json  '+json.myVeryLongJSONProperty.anotherJSONProperty + '  myProp:'+ this.myPublicProperty);
  }
  MyClass.prototype['myUnusedMethod'] = function(json){
    MyUtil.show('unused method');
  }
  /**
   * @enum
   */
  var MyEnum = {
    ONE: 1, TWO: 2, THREE: 3
  }
  
  /**
   * @constructor
   */
  function MyUnusedClass(){ 
    this.myPublicProperty = 'MyUnusedClass.myPublicProperty_default';
  }
  
  
  myns['MyClass'] = MyClass;
  myns['MyEnum'] = MyEnum;
  myns['MyConfig'] = MyConfig;
  myns.MyUnusedClass = MyUnusedClass;
  
  // do not do this for compile with app: 
  
  
