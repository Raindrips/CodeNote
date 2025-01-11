import { readFile } from './ReadFile';
import { writeFile } from './WriteFile';

let url: string = 'D:\\GUI_sounds.ogg.json';

async function getBase64() {
    // 读取JSON文件
    let data: any = await readFile(url);
    try {
        // 解析JSON文件
        const jsonData = JSON.parse(data);
        let sounds: any[] = jsonData.sounds;
        for (let i = 0; i < sounds.length; i++) {
            let obj = sounds[i];
            // 提取Base64编码的音频数据
            const audioBase64 = obj.data;
            // 解码Base64数据
            const audioBuffer = Buffer.from(audioBase64, 'base64');
            writeFile('../out/' + (i + 1) + '.ogg', audioBuffer);
        }
    } catch (err) {
        console.error('解析出错:', err);
    }
}

// 解析链接
function extractUrlsFromJson(json: string): string[] {
    const regex = /https?:\/\/[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\S*)?(?=["])/g;
    const matches = json.match(regex); // 匹配所有符合条件的URL
    return matches || []; // 返回所有匹配的URL，如果没有匹配到返回空数组
}

// 匹配MP3后缀的文件
function matchMp3Files(urls: string[]): string[] {
    const mp3Regex = /\.mp3$/i; // 匹配以.mp3结尾的文件
    return urls.filter((url) => mp3Regex.test(url)); // 过滤出所有符合条件的URL
}

async function getJsonFile(url: string) {
    try {
        let data = await readFile(url);
        let urlArr = extractUrlsFromJson(data);
        let mp3 = matchMp3Files(urlArr);
        console.log(mp3);
    } catch (err) {
        console.error('解析出错:', err);
    }
}

function main() {
    const url = process.argv[2];
    getJsonFile(url);
}
main();
