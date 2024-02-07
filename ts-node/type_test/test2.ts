type Str = {
    id: number,
    name: string
}

interface Obj{
    hello():number;
    world():string;
}


type T0 = number | string;
type T1 = keyof T0;
type T2 = keyof Obj;


let a1: T0 = 1;
let a2: Str = { id: 1, name: "" };

class MyHistory<T> {
    commit(element: T, from: T, to: T) {

    }
}