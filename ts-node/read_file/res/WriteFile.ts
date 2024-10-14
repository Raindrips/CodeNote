import { promises as fs } from "fs";
/**
 * 将ogg资源写入文件
 * @param path 
 * @param audioBuffer 
 * @returns 
 */
export async function  writeFile(path: string, audioBuffer: Buffer) {
    try{
        let data: any = fs.writeFile(path, audioBuffer);
        return data;
    }catch(err: any) {
        console.log("读入文件错误：" + path);
        console.log(err);
    }
}