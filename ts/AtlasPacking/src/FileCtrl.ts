import * as fs from "fs";
import * as path from "path";
import { createCanvas, Image, loadImage } from 'canvas'; // 引入canvas库
import { FileType, isImageFile } from "./FileType";

export namespace FileCtrl {
    export function readFile(path: string) {
        return fs.readFileSync(path);
    }

    export function getImageToFolder(dir: string): string[] {
        const fileList: string[] = [];
        const files = fs.readdirSync(dir); // 读取目录内容
        for (const file of files) {
            const fullPath = path.join(dir, file); // 拼接绝对路径
            const stat = fs.statSync(fullPath);   // 获取文件信息
            if (stat.isDirectory()) {
                // 如果是文件夹，递归读取
                // getAllFiles(fullPath, fileList);
            } else {
                // 如果是文件，加入数组
                const fileType = path.extname(file);
                if (isImageFile(fileType)) {
                    fileList.push(fullPath);
                }
            }
        }
        //排序
        fileList.sort((a, b) => {
            return a.localeCompare(b, undefined, { numeric: true })
        })

        return fileList;
    }

    export function getImageToFolderAll(dir: string): { folderName: string, fileList: string[] }[] {

        const folderList: { folderName: string, fileList: string[] }[] = [];
        const fileList: string[] = [];
        folderList.push({ folderName: path.basename(dir), fileList: fileList });
        const files = fs.readdirSync(dir); // 读取目录内容
        for (const file of files) {
            const fullPath = path.join(dir, file); // 拼接绝对路径
            const stat = fs.statSync(fullPath);   // 获取文件信息
            if (stat.isDirectory()) {
                // 如果是文件夹，递归读取
                const folder = getImageToFolderAll(fullPath);
                folderList.push(...folder);

            } else {
                // 如果是文件，加入数组
                const fileType = path.extname(file);
                if (isImageFile(fileType)) {
                    fileList.push(fullPath);
                }
            }
        }
        //排序
        fileList.sort((a, b) => {
            return a.localeCompare(b, undefined, { numeric: true })
        })
        return folderList;
    }

    export async function loadImageInfo(path: string) {
        return loadImage(path)
    }

    export function writeFile(path: string, data: Buffer) {
        fs.writeFileSync(path, data);
    }


}