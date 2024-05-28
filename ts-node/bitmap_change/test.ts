
//@ts-ignore
// let a=parseInt(undefined);
// console.log(a);
// if(Number.isNaN(a)){
//     console.log('isNaN');
// }
// if(typeof(a)==='number'){
//     console.log('number');
// }


console.log()

console.log()

let mat=/\s+(?=[a-z]+=)/
let mat2=/ /
let str=`a=10 b=20 c='12' count id=1,2,3,4  =1`;

let sp=str.split(mat)
console.log(sp);