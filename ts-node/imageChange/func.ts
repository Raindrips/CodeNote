import { createCanvas, Image, loadImage } from 'canvas'; // 引入canvas库
import path from 'path';

export function drawImage(image: Image, width: number): Buffer {
    if (image.width > width) {
    }
    const canvas = createCanvas(width, image.height);
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, (width - image.width) / 2, 0);
    console.log((width - image.width) / 2);
    return canvas.toBuffer();
}

export async function getImageInfo(imagePath: string) {
    let imageList: Map<number, Image> = new Map<number, Image>();

    for (let i = 0; i <= 9; i++) {
        const filePath = path.join(imagePath, i + '.png');
        const image = await loadImage(path.join(filePath)).catch(
            (error: any) => {
                console.log(error + ':' + filePath);
            },
        );
        if (image) {
            imageList.set(i, image);
        }
    }
    return imageList;
}

export function getImageMaxWidth(imageList: Map<number, Image>) {
    let maxWidth: number = 0;
    imageList.forEach((value: Image, key: number) => {
        if (value.width > maxWidth) {
            maxWidth = value.width;
        }
    });
    return maxWidth;
}
