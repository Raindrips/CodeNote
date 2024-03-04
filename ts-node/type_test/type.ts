interface IType {
    name: string,
    readonly age: number,
}

type V1 = IType['name'] // string
type V2 = IType['age']  // number

type V3 = IType[keyof IType]  //等同于  string|number
let v1: V1 = 'string';
let v2: V2 = 123;

let v3: V3 = 123;
v3 = 'name';

type A1 = 'x' extends 'x' ? 1 : 2;
type A2 = 'x' extends 'y' ? 1 : 2;

let a1: A1 = 1;
let a2: A2 = 2;


type P<T> = T extends 'x' ? 1 : 2;
type A3 = P<'x' | 'y'>
let a3: A3;
a3 = 1;
a3 = 2;


type NotArray<T> = T extends any[] ? never : T;
let arr: NotArray<number> = 10;
// let arr2: NotArray<number[]> = []; //error
