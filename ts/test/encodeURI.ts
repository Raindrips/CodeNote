export function getPragma2(obj: { [key: string]: string }) {
    let str = '';
    let and = '?';
    for (let key in obj) {
        const value = obj[key];
        str += `${and}${key}=${value}`;
        and = '&';
    }
    return str;
}

function encode(str: string) {
    return str
}
export function getPragma(obj: { [key: string]: any }, fn = encode) {
    let result = '';
    let and = '?';
    for (let key in obj) {
        const value = obj[key];
        result += `${and}${key}=${fn(value)}`;
        and = '&';
    }
    return result;
}

let str = 'hello';

let code = btoa(str)    // base64 转码
let str2 = atob(code);  // base64 解码

console.log(str)
console.log(code)
console.log(str2);

let r = getPragma({ a: '123', b: '567' }, btoa);
console.log(r);
