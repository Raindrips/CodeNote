import { CanvasRenderingContext2D, createCanvas, loadImage } from 'canvas';
import * as fs from 'fs';

async function draw() {
    const canvas = createCanvas(10000, 200);
    const ctx = canvas.getContext('2d');

    // 绘制背景  
    // ctx.fillStyle = '#FF0000';
    // ctx.fillRect(0, 0, 100, 100);

    // 加载并绘制图像  
    // const img = await loadImage('path/to/your/image.jpg');
    // ctx.drawImage(img, 10, 10, 150, 150);

    // 保存图像  
    fs.writeFileSync('build/test.png', canvas.toBuffer('image/png'));
}

export function drawArray(arr: number[], wid: number, hei: number) {
    const canvas = createCanvas(wid, hei);
    const ctx = canvas.getContext('2d');
    let w = wid / arr.length;
   
    for (let i = 0; i < arr.length; i++) {
        ctx.fillStyle = '#FF0000';
        ctx.strokeStyle = '#FF0000';
        let x = i * w;
        ctx.fillRect(x, 0, w, arr[i]);
    }
    fs.writeFileSync('build/test.png', canvas.toBuffer('image/png'));
}

// draw();
function test(){
    let arr = [];
    arr.length = 10000;
    for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 400);
    }
    drawArray(arr,arr.length,400);
}
test();
