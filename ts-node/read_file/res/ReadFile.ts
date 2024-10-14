import { promises as fs } from 'fs';
/**
 * 读取json文件数据
 * @param url 
 * @returns 
 */
export async function readFile(url:string): Promise<string>  {
    try{
        let data = fs.readFile(url, "utf8");
        return data
    }catch(err: any) {
        console.log("读取失败:" + err);
    }
    return ""
}