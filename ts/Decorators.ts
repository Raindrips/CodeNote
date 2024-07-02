//类装饰器
function classDecorator(target: Function) {
    console.log('Class decorator called for', target);
}

// 方法装饰器
function methodDecorator(target: Object, propertyKey: string | symbol) {
    console.log('Method decorator called for', target, propertyKey);
}

//访问装饰器
function accessorDecorator(target: Object, propertyKey: string | symbol) {
    console.log('Accessor decorator called for', target, propertyKey);
}


// 属性装饰器
function propertyDecorator(target: Object, propertyKey: string | symbol) {
    console.log('Property decorator called for', target, propertyKey);
}

// 参数装饰器
function paramDecorator(target: Object, propertyKey: string | symbol, parameterIndex: number) {
    console.log('Parameter decorator called for', target, propertyKey, parameterIndex);
}

//装饰器工厂
function logDecorator(target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    console.log(`Accessing ${propertyKey.toString()}`);
}

function logOnRead(target: Object, propertyKey: string | symbol) {
    const originalDescriptor = Object.getOwnPropertyDescriptor(target, propertyKey)!;
    originalDescriptor.get = function () {
        logDecorator(target, propertyKey, originalDescriptor);
        return originalDescriptor.get!.apply(this);
    };
    return originalDescriptor;
}

@classDecorator
class MyClass {

    @propertyDecorator
    property: string = 'hello';

    @methodDecorator
    myMethod() {
        // ...
    }

    @accessorDecorator
    get myProperty() {
        return 123;
    }


    pragmaFn(@paramDecorator param: string) { }

    private _value: string = '';

    @logOnRead
    public get value(): string {
        return this._value;
    }
}





