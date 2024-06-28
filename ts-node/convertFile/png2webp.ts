import { exec } from "child_process";
import { readdir, stat } from "fs/promises";
import path, { dirname } from "path";


function execCmd(command: string) {
    console.log(command);
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`error: ${error.message}`);
            return;
        }

        if (stderr) {
            console.error(`error_out: ${stderr}`);
            return;
        }
        console.log(stdout);
    });
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

function png2web(inputFile: string, outFile: string) {
    const command = 'E:/bin/libwebp/bin/cwebp';
    execCmd(`${command} "${inputFile}" -o "${outFile}"`);
}

const dirPath = `E:/105/`;

function convertFile(file: string) {
    // 获取文件后缀
    const ext = path.extname(file)
    const fileName = file.slice(0, -ext.length);
    const input = fileName + ext;
    const output = fileName + '.webp';
    png2web(input, output);
}

traverseDirectory(dirPath, convertFile);


