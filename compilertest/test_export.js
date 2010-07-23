window['myns'] = myns;
myns['MyClass'] = MyClass;
var p = MyClass.prototype;
p['myMethod'] = p.myMethod;
p['myUnusedMethod'] = p.myUnusedMethod;
myns['MyEnum'] = MyEnum;
