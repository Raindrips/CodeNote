import { exec } from 'child_process';
import { promises as fs, readFileSync, readFile } from 'fs';

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

const CommandPath = "E:/ffmpeg/bin/ffmpeg";
const InputDir = "C:/Users/admin/Downloads/109";
const OutputDir = "./out";

function cutAudios(inputFile: string, outFile: string, startTime: string, endTime: string) {
    execCmd(`${CommandPath} -i ${InputDir}/${inputFile} -ss ${startTime} -to ${endTime} -c copy ${OutputDir}/${outFile} -loglevel quiet`);
}

async function readFileAsync(path: string): Promise<string> {
    try {
        const data = await fs.readFile(path, 'utf8');
        return data;
    } catch (error) {
        return "";
    }
}

/**
 * 创建文件及其所在的文件夹
 * @param filePath 文件路径
 * @param content 文件内容
 */
function createDirs(filePath: string): void {
    // 检查文件夹是否存在，如果不存在则创建
    fs.mkdir(filePath, { recursive: true });
}

const filePath = './109_audio.txt';


function dataParse(data: string) {
    let dataArray: string[][] = [];
    const lines = data.split(/\n/).filter(item => item.length > 0);

    for (const line of lines) {
        const items = line.split(/\s+/).filter(item => item.length > 0);
        dataArray.push(items)
    }
    return dataArray;
}

function point(val: number, n: number) {
    const p = n * Math.pow(10, n);
    return Math.trunc(val * p) / p;
}

function changeFrame(a: string) {
    let left = a.substring(0, a.lastIndexOf('.'));
    let right = a.substring(a.lastIndexOf('.') + 1);

    let num = parseInt(right);
    let frame = Math.floor(num * (1 / 24.0) * 1000);
    console.log(frame);
    let newStr = `${left}.${frame}`;
    return newStr;
}

async function main() {

    // 读取文件
    const data = await readFileAsync(filePath);
    console.log(data);

    //解析数据
    const dataArray = dataParse(data);
    console.log(dataArray);

    createDirs(OutputDir);

    //执行命令
    let i = 0;
    for (const timestamp of dataArray) {
        const t1 = changeFrame(timestamp[0]);
        const t2 = changeFrame(timestamp[1]);
        cutAudios('atlas.mp3', `${i}.mp3`, t1, t2);
        i++;
    }

}

main();