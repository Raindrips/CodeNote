
// keyof
interface Person {
    name: string;
    age: number;
}

type PersonKeys = keyof Person;// "name" | "age"

let a: PersonKeys = 'name';
let b: PersonKeys = 'age';
// let c:PersonKeys='id';

// 类型解构
let t2: Person['name'] = 'Ki';  // string
let t3: Person['age'] = 10;     //number

// typeof
const person = {
    name: "John",
    age: 30
};

type PersonType = typeof person; // { name: string; age: number; }

let t1: PersonType = { name: 'hello', age: 20 }

// 获取object中的value
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

// 设置值
function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]): void {
    obj[key] = value;
}

console.log(getProperty(person, 'age'));
setProperty(person, 'name', 'hello');



