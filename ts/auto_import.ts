import { readdir } from 'fs/promises';
import path from 'path';

async function runAllFiles(folderPath: string) {
    const files = await readdir(folderPath);

    for (const file of files) {
        if (file.endsWith('.ts')) {
            const fullPath = path.join(folderPath, file);
            await import(fullPath); // 这里用import动态加载文件
        }
    }
}

// 执行文件夹中的所有ts文件
runAllFiles('./your-folder-name').catch(console.error);
