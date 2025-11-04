namespace TestProxy {
    const handler = {
        get(target: any, prop: string, receiver: any): any {
            console.log(`访问属性 "${prop},${target}"`);
            return Reflect.get(target, prop, receiver);
        },
        set<T extends object, P extends PropertyKey>(
            target: T,
            prop: P,
            value: T,
            receiver: P,
        ): boolean {
            console.log(`设置属性: "${prop.toString()}" = "${value}"`);
            console.log('设置前:',target, receiver);
            return Reflect.set(target, prop, value, receiver);
        },
    };

    const target = {
        name: 'Alice',
        age: 30,
        data: {
            id: 0,
            health: 100,
        },
        arr: [1, 2, 3, 4, 5],
    };

    const proxy = new Proxy(target, handler);

    // 访问属性
    console.log(proxy.name); // 输出: Getting property "name" 然后是 Alice

    // 设置属性
    proxy.age = 31; // 输出: Setting property "age" to "31"
    proxy.arr[2] = 10;
    console.log(target);
}
