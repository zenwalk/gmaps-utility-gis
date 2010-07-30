/*window['myns'] = myns;

myns['MyClass'] = myns.MyClass;
myns.MyClass.prototype['usedPublicMethod'] = myns.MyClass.prototype.usedPublicMethod;
myns.MyClass.prototype['unusedPublicMethod'] = myns.MyClass.prototype.unusedPublicMethod;

myns['MyUtil'] = myns.MyUtil;
myns.MyUtil['usedPublicMethod'] = myns.MyUtil.usedPublicMethod;
myns.MyUtil['unusedPublicMethod'] = myns.MyUtil.unusedPublicMethod;

myns['MyUnusedClass'] = myns.MyUnusedClass;
myns['MyEnum'] = myns.MyEnum;
myns['MyConfig'] = myns.MyConfig;
*/
goog.exportSymbol('myns.MyClass', myns.MyClass);
goog.exportProperty(myns.MyClass.prototype, 'usedPublicMethod', myns.MyClass.prototype.usedPublicMethod);
goog.exportProperty(myns.MyClass.prototype, 'unusedPublicMethod', myns.MyClass.prototype.unusedPublicMethod);

goog.exportSymbol('myns.MyUtil', myns.MyUtil);
goog.exportProperty(myns.MyUtil, 'usedPublicMethod', myns.MyUtil.usedPublicMethod);
goog.exportProperty(myns.MyUtil, 'unusedPublicMethod', myns.MyUtil.unusedPublicMethod);

goog.exportSymbol('myns.MyUnusedClass', myns.MyUnusedClass);
goog.exportSymbol('myns.MyEnum', myns.MyEnum);
goog.exportSymbol('myns.MyConfig', myns.MyConfig);


