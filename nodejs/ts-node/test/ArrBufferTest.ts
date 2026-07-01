import { Buffer } from 'buffer';

// 申请内存
const sendBuffer = Buffer.allocUnsafe(10 * 64);

let offset = 0;

//写入1字节数据
sendBuffer.writeUInt8(0xff, offset);
offset += 1;

sendBuffer.writeUInt16LE(0xdddd, offset);
offset += 2;

// 写入4字节数据
sendBuffer.writeUInt32LE(0xcccccccc, offset);
offset += 4;

//切片
const packet = sendBuffer.subarray(0, offset);

console.log(sendBuffer);
console.log(packet);

// let str = '';
// for (let i = 0; i < sendBuffer.length; i++) {
//     const v = sendBuffer.at(i);
//     str = `${str}${v}`;
// }
// console.log(str);
