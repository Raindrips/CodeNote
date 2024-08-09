import { readFile } from "./ReadFile";
import { writeFile } from "./WriteFile";

let url: string = "D:\\GUI_sounds.ogg.json";

async function main() {
  // 读取JSON文件
  let data: any = await readFile(url);
  try {
    // 解析JSON文件
    const jsonData = JSON.parse(data);
    let sounds: any[] = jsonData.sounds;
    for (let i = 0; i < sounds.length; i++) {
      let obj = sounds[i]
      // 提取Base64编码的音频数据
      const audioBase64 = obj.data;
      // 解码Base64数据
      const audioBuffer = Buffer.from(audioBase64, "base64");
      writeFile("../out/" + (i + 1) + ".ogg", audioBuffer);
    }
  } catch (err) {
    console.error("解析出错:", err);
  }
}

main();
