  var myns = myns || {};
  
  var MyUtil = {
    show: function(msg) {
      alert('msg is ' + msg);
    }
  };
  
  var MyConfig = {};
  MyConfig['configKey']='defaultValue';
  
  /** @constructor */
  function MyClass(){
    this['myProp'] = 'myProp_Default';
  }
  
  MyClass.prototype.myMethod = function(json){
    this.myPrivateMethod(json);
  }
  MyClass.prototype.myPrivateMethod = function(/** @type {MyMessage}*/json){
    MyUtil.show('myConfig:'+MyConfig['configKey']+' json  '+json.myVeryLongJSONProperty.anotherJSONProperty + '  myProp:'+ this['myProp']);
  }
  MyClass.prototype.myUnusedMethod = function(json){
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
  function MyClass2(){ 
    this.myProp2 = 'test';
  }
  
  window.myns = myns;
  myns.MyClass = MyClass;
  myns.MyEnum = MyEnum;
  myns.MyConfig = MyConfig;
  
  
  window['myns'] = myns;
myns['MyClass'] = MyClass;
var p = MyClass.prototype;
p['myMethod'] = p.myMethod;
p['myUnusedMethod'] = p.myUnusedMethod;
myns['MyEnum'] = MyEnum;
myns['MyConfig'] = MyConfig;
