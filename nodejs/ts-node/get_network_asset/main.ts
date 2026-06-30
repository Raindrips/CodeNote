import path from "path";
import fs from "fs";
import { readJsonFile } from "./fileCtrl/readFile";
import {
  writeTextFile,
  writeSpineFile,
  writeAudioFile,
  wirteImageToHtmlFile,
} from "./fileCtrl/writeFile";

let spineUrl: string = "/spine/";

let audioUrl: string = "/audio/";

let htmlUrl: string = "/image";

const imageUrl: string = "image.json";

let atlasUrl: string = "/json/";

let jsonUrl: string = "/json/";

function updateUrl(outUrl: string) {
  spineUrl = outUrl + spineUrl;
  audioUrl = outUrl + audioUrl;
  htmlUrl = outUrl + htmlUrl;
  atlasUrl = outUrl + atlasUrl;
  jsonUrl = outUrl + jsonUrl;
}

function main(url: string, outUrl: string) {
  updateUrl(outUrl);
  readJsonFile(url, (err: NodeJS.ErrnoException | null, data: string) => {
    if (err) {
      console.log(err);
      return;
    }
    const har = JSON.parse(data);
    const entries: any[] = har.log.entries;
    let set: Set<string> = new Set();
    let imageList: string[] = [];
    const dirPath = path.dirname(imageUrl);

    // 确保目录存在，如果不存在则递归创建
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    entries.forEach((item: any, index: number) => {
      let type: string = parseObj(item, index);
      set.add(type);
      if (
        type == "image/png" ||
        type == "image/jpeg" ||
        type == "image/webp" ||
        type == "image/x-icon" ||
        type == "image/svg+xml"
      ) {
        imageList.push(item.request.url);
      }
    });
    if (imageList.length > 0) {
      console.log("图片数量:" + imageList.length);
      wirteImageToHtmlFile(imageList, htmlUrl);
    }
    console.log(set);
    console.log("文件种类:" + set.size);
  });
}

function parseObj(item: any, index: number): string {
  if (!item.response) {
    console.log(index, "is not response");
    return "";
  }
  let response = item.response;
  let content = response.content;
  if (!content) {
    console.log(index, "is not content");
    return "";
  }
  let extension: string = "";
  if (content.mimeType.includes("javascript")) extension = "js";
  else if (content.mimeType.includes("html")) extension = "html";
  else if (content.mimeType.includes("css")) extension = "css";
  else if (content.mimeType.includes("json")) extension = "json";
  else if (content.mimeType.includes("image/png")) {
    extension = "png";
  } else if (content.mimeType.includes("image/jpeg")) extension = "jpg";
  else if (content.mimeType.includes("audio/mpeg")) extension = "mp3";
  else {
    return content.mimeType;
  }

  let str: string = "";
  // str.split
  switch (extension) {
    case "json":
      if (fineAtlas(content.text)) {
        let arr: any[] = item.request.url.split(`/`);
        console.log(arr);
      }
      writeSpineFile(spineUrl + index, content.text);
      const fileName = `${jsonUrl}json_${index}.${extension}`;

      writeTextFile(fileName, content.text);
      break;
    case "mp3":
      writeAudioFile(audioUrl + index, content.text);
      break;
    case "png":
    case "jpg":
      break;
    default:
      break;
  }

  return content.mimeType;
}

function fineAtlas(data: string) {
  if (data.includes("_textureSetter") && data.includes("cc.SpriteFrame")) {
    return true;
  } else {
    return false;
  }
}

main(process.argv[2], process.argv[3]);
