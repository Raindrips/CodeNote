
import { promises as fs, readFileSync } from 'fs';
import { readFile } from 'fs';
import { readdir, stat } from 'fs/promises';
import path from 'path';


// 异步读取文件示例
async function readFileAsync(path: string): Promise<void> {
    try {
        const data = await fs.readFile(path, 'utf8');
        console.log(`文件内容 (异步): ${data}`);
    } catch (error) {
        console.error(`读取文件出错 (异步): ${error}`);
    }
}

// 同步读取文件示例
function readFileSyncExample(path: string): void {
    try {
        const data = readFileSync(path, 'utf8');
        console.log(`文件内容 (同步): ${data}`);
    } catch (error) {
        console.error(`读取文件出错 (同步): ${error}`);
    }
}


// 非阻塞的方式读取
function readFileWithCallback(path: string): void {
    readFile(path, 'utf8', (error, data) => {
        if (error) {
            console.error(`读取文件出错: ${error.message}`);
            return;
        }
        dataParse(data);
    });
}

function dataParse(data: string) {
    const lines = data.split(/\n/).filter(item => item.length > 0);
    for (const line of lines) {
        const items = line.split(/\s+/).filter(item => item.length > 0);
        console.log(items);
    }
}

type FileCall = (file: string) => void;

async function traverseDirectory(directoryPath: string, doFile: FileCall): Promise<void> {
    try {
        const files = await readdir(directoryPath);
        for (const file of files) {

            const fullPath = path.join(directoryPath, file);
            // 检查文件状态
            const fileStats = await stat(fullPath);
            if (fileStats.isDirectory()) {
                await traverseDirectory(fullPath, doFile);
            } else {
                doFile(fullPath);
            }
        }
    } catch (error) {
        console.error(`Error traversing directory: ${error}`);
    }
}



// const filepath = './109_audio.txt';
// // 调用函数读取文件
// readFileWithCallback(filepath);

