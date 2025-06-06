//动态调用类中的类型
namespace FunctionCall {
    class MyClass {
        public greet(name: string): string {
            return `Hello, ${name}!`;
        }

        public farewell(name: string): string {
            return `Goodbye, ${name}!`;
        }
    }

    function Method() { }

    const myClass = new MyClass();

    function callMethod(obj: any, methodName: string, ...args: any[]): any {
        const method = obj[methodName];
        if (typeof method === "function") {
            return method.apply(obj, args);
        }
        return null;
    }

    function callStaticMethod<T, K extends keyof T>(obj: T, methodName: K, ...args: any[]): any {
        const method = obj[methodName];
        if (typeof method === "function") {
            return method.apply(obj, args);
        }
        return null
    }

    type MethodNames<T> = {
        [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
    }[keyof T];



    function callMethodF<T, K extends MethodNames<T>>(obj: T, methodName: K, ...args: any) {
        const method = obj[methodName];
        if (typeof method === "function") {
            return method.apply(obj, args);
        }
        throw new Error("");
    }

    //获取参数类型 [a:number,b:number]
    let a: Parameters<(a: number, b: number) => number>

    //获取返回值类型 number
    let b: ReturnType<() => number>

}