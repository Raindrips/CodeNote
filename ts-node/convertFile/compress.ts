import * as fs from 'fs';

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
    execCmd(`${command} -q 100 "${inputFile}" -o "${outFile}" -quiet`);
}

function web2png(inputFile: string, outFile: string) {
    const command = 'E:/bin/libwebp/bin/dwebp';
    execCmd(`${command} "${inputFile}" -o "${outFile}"`);
}

const dirPath = `D:/project_v3/morn_raccoon_109/assets/game/res/spine`;
// const dirPath = `E:/res/109`;


async function convertFile(file: string) {
    // 获取文件后缀
    const ext = path.extname(file)
    const b = await isWebP(file);
    if (ext === '.png' || ext === '.jpg' || b) {
        const fileName = file.slice(0, -ext.length);
        const input = fileName + ext;
        const output = fileName + ext;
        // png2web(input, output);
        web2png(input,output);
        console.log(input);
    }

}


function isWebP(filePath: string) {
    return new Promise((resolve, reject) => {
        fs.open(filePath, 'r', (err, fd) => {
            if (err) return reject(err);

            const buffer = Buffer.alloc(12);
            fs.read(fd, buffer, 0, 12, 0, (err, bytesRead, buffer) => {
                if (err) return reject(err);

                const isRIFF = buffer.slice(0, 4).toString() === 'RIFF';
                const isWEBP = buffer.slice(8, 12).toString() === 'WEBP';

                fs.close(fd, (err) => {
                    if (err) return reject(err);
                    resolve(isRIFF && isWEBP);
                });
            });
        });
    });
}

traverseDirectory(dirPath, convertFile);


