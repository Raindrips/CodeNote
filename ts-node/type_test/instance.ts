
// Map

type Prototype<T> = { prototype: T, new(): T }

function create<T>(type: Prototype<T>) {
    return new type();
}

export class InstanceManager {
    map = new Map();

    private set<T>(type: Prototype<T>, inst: T) {
        this.map.set(type, inst)
    }

    public get<T>(type: Prototype<T>): T {
        if (this.map.has(type)) {
            return this.map.get(type);
        }
        const inst = create(type);
        this.set(type, inst);
        return this.map.get(type);
    }
}

class A {
    id: number = 10;
}

class B {
    name: string = 'hello';
}

function main() {
    let a = create(A);
    console.log(a);

    let inst = new InstanceManager();
    let a2 = inst.get(A);
    let b2 = inst.get(B);
    console.log(a2, b2);
}

main();