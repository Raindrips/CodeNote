import fs from 'fs';
import { checkSpineFile, checkSpineData, getSpineData, getSpineJsonData, getSpineAtlasData } from './spineFileCtrl';
import path from 'path';

export function writeTextFile(url: string, data: string | NodeJS.ArrayBufferView) {

    const dirPath = path.dirname(url);

    // 确保目录存在，如果不存在则递归创建
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
    
    fs.writeFile(url, data, (err: NodeJS.ErrnoException | null) => {
        if (err) {
            console.log(err);
        } else {
            // console.log('File written successfully\n');
        }
    });
}

export function writeJsonFile(url: string, data: string) {
    writeTextFile(url + ".json", data);
}

export function writeAtlasFile(url: string, data: string) {
    writeTextFile(url + ".atlas", data);

}

export function writePngFile(url: string, data: Buffer) {
    fs.writeFile(url, data, (err: NodeJS.ErrnoException | null) => {
        if (err) {
            console.log(err);
        } else {
            console.log('File written successfully\n');
        }
    });
}

export function writeSpineFile(url: string, data: string) {
    try {
        let obj: any = JSON.parse(data)
        if (Array.isArray(obj)) {
            let boo: boolean = checkSpineFile(obj)
            if (boo) {
                writeJsonFile(url,data)
                // console.log(boo)
                let spineData: any[] = [];
                if (checkSpineData(obj)) {
                    spineData = obj;
                }else {
                    spineData = getSpineData(obj);
                }
                let spineJsonData: string = getSpineJsonData(spineData);
                let spineAtlasData: string = getSpineAtlasData(spineData);
                writeJsonFile(url+ "_spine", JSON.stringify(spineJsonData));
                writeAtlasFile(url+ "_spine", JSON.stringify(spineAtlasData));
            }
        }
    }catch (e){
        console.log(e)
    }
}

export function writeAudioFile(url: string, data: string) {
    const audioBuffer = Buffer.from(data, "base64");
    const dirPath = path.dirname(url);

    // 确保目录存在，如果不存在则递归创建
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFile(url + ".mp3", audioBuffer, (err: NodeJS.ErrnoException | null) => {
        if (err) {
            console.log(err);
        } else {
            // console.log('File written successfully\n');
        }
    });
}

export async function writeImageFile(url: string, data: any) {

    try {
        // let obj: Headers = new Headers();
        // data.headers.forEach((item: any) => {
        //     obj.append(item.name, item.value)
        // });
        // console.log(obj)
        let info: Request = data;
        // 发送 GET 请求获取图片
        const response = await fetch(data);

        // 检查响应是否成功
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // 获取二进制数据（Blob）
        const imageBlob = await response.blob();
        console.log("imageBlob",imageBlob)

        // // 创建一个对象 URL（这个 URL 可以用来作为 img 标签的 src）
        // const imageObjectUrl = URL.createObjectURL(imageBlob);

        // // 创建一个 img 元素并设置 src
        // const imgElement = document.createElement('img');
        // imgElement.src = imageObjectUrl;

        // // 将图片添加到页面中（你可以根据需要自定义添加方式）
        // document.body.appendChild(imgElement);

        console.log("Image fetched and displayed successfully!");

    } catch (error) {
        // 错误处理
        console.error('Error fetching image:', error);
    }
    // if (!fs.existsSync(dirPath)) {
    //     fs.mkdirSync(dirPath, { recursive: true });
    // }
    // fs.writeFile(url + ".mp3", audioBuffer, (err: NodeJS.ErrnoException | null) => {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         console.log('File written successfully\n');
    //     }
    // });
}


export function wirteImageToHtmlFile(imageList: string[], url: string) {
    let head = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>index</title>
</head>
<body>`
    let body = "";
    imageList.forEach((item: string, index: number) => {
        // if (index < 100) {
        //     return;
        // }
        body += `<img src="${item}" alt="">`
    })
    let end = `</body></html>`;
    writeTextFile(url + ".html", head + body + end)
}