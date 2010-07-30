window['myns'] = myns;

myns['MyClass'] = MyClass;
MyClass.prototype['usedPublicMethod'] = MyClass.prototype.usedPublicMethod;
MyClass.prototype['unusedPublicMethod'] = MyClass.prototype.unusedPublicMethod;

myns['MyUtil'] = MyUtil;
MyUtil['usedPublicMethod'] = MyUtil.usedPublicMethod;
MyUtil['unusedPublicMethod'] = MyUtil.unusedPublicMethod;

myns['MyUnusedClass'] = MyUnusedClass;
myns['MyEnum'] = MyEnum;
myns['MyConfig'] = MyConfig;


