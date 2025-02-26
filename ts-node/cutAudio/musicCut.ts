import { exec } from 'child_process';
import { promises as fs, readFileSync, readFile } from 'fs';
import { argv } from 'process';

/**
 *
 * @param command 执行命令
 */
export function execCmd(command: string, output = false) {
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
        if (output) {
            console.log(stdout);
        }
    });
}

const CommandPath = 'E:/bin/ffmpeg/bin/ffmpeg';

export function cutAudios(
    inputFile: string,
    outFile: string,
    outputDir: string,
    startTime: string,
    endTime: string,
) {
    execCmd(
        `${CommandPath} -i ${inputFile} -ss ${startTime} -to ${endTime} -c copy ${outputDir}/${outFile} -loglevel quiet`,
    );
}

async function readFileAsync(path: string): Promise<string> {
    try {
        const data = await fs.readFile(path, 'utf8');
        return data;
    } catch (error) {
        return '';
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

function dataParse(data: string) {
    let dataArray: string[][] = [];
    const lines = data.split(/\n/).filter((item) => item.length > 0);

    for (const line of lines) {
        const items = line.split(/\s+/).filter((item) => item.length > 0);
        dataArray.push(items);
    }
    return dataArray;
}

function changeFrame(a: string) {
    let left = a.substring(0, a.lastIndexOf('.'));
    let right = a.substring(a.lastIndexOf('.') + 1);

    let num = parseInt(right);
    // let frame = Math.floor(num * (1 / 24.0) * 1000);
    let newStr = `${left}.${num}`;
    return newStr;
}

async function main() {
    if (process.argv.length < 5) {
        console.log('error argv more 5', argv.length);
        return;
    }
    const ruleFilePath = process.argv[2];
    const mp3File = process.argv[3];
    const outputDir = process.argv[4];
    // 读取文件
    const data = await readFileAsync(ruleFilePath);
    console.log(data);

    //解析数据
    const dataArray = dataParse(data);
    console.log(dataArray);

    createDirs(outputDir);

    //执行命令
    let i = 0;
    for (const timestamp of dataArray) {
        // const t1 = changeFrame(timestamp[0]);
        // const t2 = changeFrame(timestamp[1]);
        // console.log(t1, t2);
        cutAudios(
            mp3File,
            `${i}.mp3`,
            outputDir,
            timestamp[0],
            timestamp[1],
        );
        i++;
    }
}

main();
