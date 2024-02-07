import fs from 'fs';
/*
汉字转 unicode
'好'.charCodeAt(0).toString(16)
"597d"

unicode 转汉字
'\u54e6'
"哦"


*/

function toUnicodeFun(data: string) {
    if (data == '' || typeof data == 'undefined') return '请输入汉字';
    var str = '';
    for (var i = 0; i < data.length; i++) {
        str += "\\u" + data.charCodeAt(i).toString(16);
    }
    return str;
}

function toChineseWords(data: string) {
    if (data == '' || typeof data == 'undefined') return '请输入十六进制unicode';
    let dataArray = data.split("\\u");
    var str = '';
    for (var i = 0; i < dataArray.length; i++) {
        let s = parseInt(dataArray[i], 16)
        str += String.fromCharCode(s);
    }
    return str;
}

function test1() {
    let i = toChineseWords('\\u0x4E00\\u0x4E01')
    console.log(i);
}

function saveFile(text: string) {
    const path = './output.txt';
    fs.writeFile(path, text, (err) => {
        if (err) {
            console.log('write error ' + err)
        }
    })
}

function exec() {
    const start = 0x4E00;
    const end = 0x9FA5;
    let str = new String()
    for (let i = start; i < end; i++) {
        str += String.fromCharCode(i)
    }
    const start2=0xFE30
    const end2=0xFFA0
    for (let i = start2; i < end2; i++) {
        str += String.fromCharCode(i)
    }
    saveFile(str.valueOf())
}

function main() {
    // test1();
    exec()
}

main();