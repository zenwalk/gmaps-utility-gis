function init() {
  var t = new myns.MyClass();
  alert('expected myPublicProperty_Default:' + t.myPublicProperty);
  t.myPublicProperty = 'newProp';
  myns.MyConfig.configKey = 'newValue';
  t.usedPublicMethod({
    myVeryLongJSONProperty: {
      anotherJSONProperty: 'myVeryLongJSONProperty -- anotherJSONProperty'
    }
  });
  alert('expected myns.MyEnum.TWO=2:' + myns.MyEnum.TWO);
  myns.MyUtil.usedPublicMethod('app calling myns.MyUtil.usedPublicMethod');
}
window.onload = init;
