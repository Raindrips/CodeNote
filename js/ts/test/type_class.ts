type ClassType<T> = new (...args: any[]) => T;

class AA {
    a = 10;
    b = Symbol('s');
    fn() {}
}

const aa = new AA();
const bb = { a: 10, b: Symbol('s') };

for (const k in aa) {
    let recode: Record<string, any> = aa;
    console.log(k, recode[k]);
}

// console.log(aa);

// console.log(AA);
// console.log(AA.prototype);

function listPrototype(ctor: Function) {
    const proto = (ctor as any).prototype;
    console.log('\n--- prototype of', ctor && (ctor as any).name, '---');

    // names and symbols
    const names = Object.getOwnPropertyNames(proto);
    const symbols = Object.getOwnPropertySymbols(proto);
    console.log('Object.getOwnPropertyNames(proto):', names);
    console.log('Object.getOwnPropertySymbols(proto):', symbols);
    console.log('Reflect.ownKeys(proto):', Reflect.ownKeys(proto));

    // descriptors
    const descriptors = Object.getOwnPropertyDescriptors(proto);
    for (const name of names) {
        const val = (proto as any)[name];
        const desc = descriptors[name];
        console.log(`${name} -> type: ${typeof val}`, desc);
    }
    for (const sym of symbols) {
        const val = (proto as any)[sym as any];
        const desc = Object.getOwnPropertyDescriptor(proto, sym as any);
        console.log(`${String(sym)} -> type: ${typeof val}`, desc);
    }

    // methods only
    const methods = names.filter(n => typeof (proto as any)[n] === 'function');
    console.log('methods on prototype:', methods);

    // show prototype from an instance
    try {
        const inst = Object.create(proto);
        console.log('Object.getPrototypeOf(instance) === proto?', Object.getPrototypeOf(inst) === proto);
    } catch (e) {
        // ignore
    }
}