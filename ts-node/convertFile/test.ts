import { format, parse } from 'date-fns';
import * as fs from 'fs';
import * as path from 'path';





/**
 * 创建文件及其所在的文件夹
 * @param filePath 文件路径
 * @param content 文件内容
 */
function createDirs(filePath: string): void {
    // 获取文件夹路径
    const dirPath = path.dirname(filePath);

    // 检查文件夹是否存在，如果不存在则创建
    fs.mkdir(dirPath, { recursive: true }, (err) => {
        if (err) {
            console.error(`创建文件夹出错: ${err.message}`);
            return;
        }
        console.log(`文件已成功创建: ${dirPath}`);
    });
}

// createDirs("E:/123/456/abc/");

function point(val: number, n: number) {
    const p = n * Math.pow(10, n);
    return Math.round(val * p) / p;
}

function change(a: string) {
    let left = a.substring(0, a.lastIndexOf('.'));
    let right = a.substring(a.lastIndexOf('.') + 1);

    let num = parseInt(right);
    let frame = num * point(1 / 24.0, 3) * 1000;

    let newStr = `${left}.${frame}`;
    return newStr
}



change("00:00:10.21")