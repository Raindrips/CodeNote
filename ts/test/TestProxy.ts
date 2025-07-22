const handler = {
    get(target: any, prop: string, receiver: any): any {
        console.log(`修改属性 "${prop}"`);
        return Reflect.get(target, prop, receiver);
    },
    set(target: any, prop: string, value: any, receiver: any): boolean {
        console.log(`设置属性 "${prop}" = "${value}"`);
        console.log('设置前', receiver);
        return Reflect.set(target, prop, value, receiver);
    },
};

const target = {
    name: 'Alice',
    age: 30,
};

const proxy = new Proxy(target, handler);

// 访问属性
console.log(proxy.name); // 输出: Getting property "name" 然后是 Alice

// 设置属性
proxy.age = 31; // 输出: Setting property "age" to "31"

console.log(target);
