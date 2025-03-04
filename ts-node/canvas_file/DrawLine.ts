import { CanvasRenderingContext2D, createCanvas, loadImage } from 'canvas';
import * as fs from 'fs';
import { showLineByVec, v2, v22v, Vec2 } from './Line';

async function readFile(path: string) {
    try {
        const data = await fs.promises.readFile(path, 'utf8');
        return data;
    } catch (error) {
        return '';
    }
}

function dataParse(data: string) {
    let dataArray: [number, number][][] = [];
    const lines = data.split(/\s+/).filter((item) => item.length > 0);

    for (const line of lines) {
        const items = eval(line) as [number, number][];
        dataArray.push(items);
    }
    return dataArray;
}

function toVec2(arr: [number, number][]) {
    const arrV2: Vec2[] = [];
    for (let i = 0; i < arr.length; i++) {
        arrV2.push(v22v(arr[i][0], arr[i][1]));
    }
    return arrV2;
}

async function main() {
    const data = await readFile('./line.txt');
    // console.log(data);
    const posArr = dataParse(data);
    // console.log(posArr);

  
    for (let i = 0; i < posArr.length; i++) {
        const canvas = createCanvas(270, 270);
        const g = canvas.getContext('2d');
        const arr = posArr[i];
        const pos = toVec2(arr);
        showLineByVec(g, pos);
        
        //@ts-ignore
        fs.writeFileSync(`build/${i+1}.png`, canvas.toBuffer('image/png'));
    }
}

main();
