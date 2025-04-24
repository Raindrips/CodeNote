import { createCanvas, Image, loadImage } from 'canvas';
import { drawImage, getImageInfo, getImageMaxWidth } from './func';

import fs from 'fs';
const imageUrl: string = 'd:/countdown/';


async function main() {
    const url = process.argv[2] + '/'
    let imageMap: Map<number, Image> = await getImageInfo(url);
    let maxWidth: number = getImageMaxWidth(imageMap);
    console.log(maxWidth)
    for (let i = 0; i <= 9; i++) {
        const image = imageMap.get(i);
        if (image)  {
            let buffer = drawImage(image, maxWidth);
            fs.writeFileSync(url + i + '.png', buffer);
        }
    }
}

main();
