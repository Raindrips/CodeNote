import { Canvas, CanvasRenderingContext2D, createCanvas, Image } from "canvas";
import { FreeRect, PackResult, PlistData, Vec2 } from "../plist/PlistData";
import { outImageMaxWidth, outImageMaxHeight, XMLEncoding, XMLVersion, doctype, plistVersion, plistFormat, pixelFormat, premultiplyAlpha } from "../config";
import path from "path";
import { FileCtrl } from "./FileCtrl";
import { FileType } from "./FileType";



export namespace FuncUtil {

    /**
     * 最大矩形打包算法
     * @param images 
     * @param width 
     * @returns 
     */
    export function packImagesMaxRects(images: Image[], width: number): PackResult {
        let freeRects: { x: number, y: number, w: number, h: number }[] = [
            { x: 0, y: 0, w: width, h: Number.MAX_SAFE_INTEGER }
        ];

        const plistData: PlistData[] = [];

        function findPosition(img: Image): { x: number, y: number, w: number, h: number, rotated: boolean } | null {
            let best: any = null;

            for (let rect of freeRects) {
                // 尝试不旋转
                if (img.width <= rect.w && img.height <= rect.h) {
                    if (!best || rect.y < best.y || (rect.y === best.y && rect.x < best.x)) {
                        best = { x: rect.x, y: rect.y, w: img.width, h: img.height, rotated: false };
                    }
                }
                // 尝试旋转
                if (img.height <= rect.w && img.width <= rect.h) {
                    if (!best || rect.y < best.y || (rect.y === best.y && rect.x < best.x)) {
                        best = { x: rect.x, y: rect.y, w: img.height, h: img.width, rotated: true };
                    }
                }
            }

            return best;
        }

        function splitFreeRect(free: { x: number, y: number, w: number, h: number },
            placed: { x: number, y: number, w: number, h: number }) {
            const newRects: typeof freeRects = [];

            if (placed.x + placed.w <= free.x + free.w) {
                newRects.push({ x: placed.x + placed.w, y: free.y, w: free.x + free.w - (placed.x + placed.w), h: free.h });
            }
            if (placed.y + placed.h <= free.y + free.h) {
                newRects.push({ x: free.x, y: placed.y + placed.h, w: free.w, h: free.y + free.h - (placed.y + placed.h) });
            }

            freeRects = freeRects.filter(r => r !== free).concat(newRects);
        }

        for (let img of images) {
            const pos = findPosition(img);
            if (!pos) throw new Error("无法放置图片");

            plistData.push({
                textureRect: [{ x: pos.x, y: pos.y }, { x: pos.w, y: pos.h }],
                textureRotated: pos.rotated
            });

            for (let free of [...freeRects]) {
                if (pos.x < free.x + free.w && pos.x + pos.w > free.x &&
                    pos.y < free.y + free.h && pos.y + pos.h > free.y) {
                    splitFreeRect(free, pos);
                }
            }
        }

        // 计算最小外接矩形
        let maxX = 0, maxY = 0;
        for (let data of plistData) {
            const pos = data.textureRect![0];
            const size = data.textureRect![1];
            maxX = Math.max(maxX, pos.x + size.x);
            maxY = Math.max(maxY, pos.y + size.y);
        }

        const aspectRatio = maxX / maxY;

        return {
            plistData,
            boundingWidth: maxX,
            boundingHeight: maxY,
            aspectRatio
        };
    }

    export function packWithBestAspect(images: Image[]): PackResult {
        const totalArea = images.reduce((a, img) => a + img.width * img.height, 0);
        const bestSide = Math.sqrt(totalArea);

        const minWidth = Math.max(...images.map(img => img.width));
        const maxWidth = totalArea; // 理论上最大（全横排）

        let best: PackResult | null = null;
        let bestScore = Infinity;

        for (let w = minWidth; w <= maxWidth; w += 32) {

            const result = packImagesMaxRects(images, w);
            const ratio = result.boundingWidth / result.boundingHeight;
            const score = Math.abs(ratio - 1); // 越接近正方形越好

            if (score < bestScore) {
                bestScore = score;
                best = result;
            }

            // 提前退出：如果 ratio 很接近 1，就不用再算
            if (score < 0.05) break;
        }

        return best!;
    }

    export function getScale(width: number, height: number) {
        return Math.min(outImageMaxWidth / width, outImageMaxHeight / height, 1);
    }


    /**
     * 缩放plist数据
     * 填充spriteSourceSize和spriteSize
     * 
     * @param plistDataList 要缩放的plist数据列表
     * @param scale 缩放比例
     */

    export function scalePlistDataList(plistDataList: PlistData[], imageList: Image[], scale: number) {
        let index: number = 0;
        for (let plistData of plistDataList) {
            
            const textureRect = plistData.textureRect;
            plistData.spriteOffset = new Vec2();
            if (textureRect) {
                plistData.spriteSourceSize = new Vec2(imageList[index].width, imageList[index].height);


                textureRect[0].x = Math.floor(textureRect[0].x * scale);
                textureRect[0].y = Math.floor(textureRect[0].y * scale);
                textureRect[1].x = Math.floor(textureRect[1].x * scale);
                textureRect[1].y = Math.floor(textureRect[1].y * scale);
                plistData.spriteSize = new Vec2(imageList[index].width * scale, imageList[index].height * scale);
            }
            index++;
        }
        return;
    }

    /**
     * 创建plist数据
     * @param plistDataList 要创建的plist数据列表
     * @param fileName 文件名
     * @param maxX 最大宽度
     * @param maxY 最大高度
     * @param fileType 文件类型
     * @returns 
     */
    export function CreatorPlistData(plistDataList: PlistData[], fileName: string, maxX: number, maxY: number, fileType: FileType) {


        const plistFileHead: string =
            `<?xml version="${XMLVersion}" encoding="${XMLEncoding}"?>

<!DOCTYPE plist ${doctype}>`;
        let plistFileContent: string =
            `<plist version="${plistVersion}">
    <dict>
        <key>frames</key>
        <dict>
        `;
        for (let i = 0; i < plistDataList.length; i++) {
            const plistData = plistDataList[i];
            plistFileContent += getImagePlistData(plistData, i);
        }
        plistFileContent += `
        </dict>`
        const plistFileTail: string =
            `<key>metadata</key>
        <dict>
            <key>format</key>
            <integer>${plistFormat}</integer>
            <key>pixelFormat</key>
            <string>${pixelFormat}</string>
            <key>premultiplyAlpha</key>
            <${premultiplyAlpha}/>
            <key>realTextureFileName</key>
            <string>${fileName + fileType}</string>
            <key>size</key>
            <string>{${maxX},${maxY}}</string>
            <key>textureFileName</key>
            <string>${fileName + fileType}</string>
        </dict>
    </dict>
</plist>`;
        return plistFileHead + plistFileContent + plistFileTail;
    }

    /**
     * 单个图片的plist数据
     * @param plistData 要获取的plist数据
     * @param index 索引
     * @returns 
     */
    function getImagePlistData(plistData: PlistData, index: number): string {

        let plistDataStr: string =
            `<key>image${index}</key>
<dict>
    <key>aliases</key>
    <array/>
    <key>spriteOffset</key>
    <string>${plistData.spriteOffset}</string>
    <key>spriteSize</key>
    <string>${plistData.spriteSize}</string>
    <key>spriteSourceSize</key>
    <string>${plistData.spriteSourceSize}</string>
    <key>textureRect</key>
    <string>{{${plistData.textureRect![0].x},${plistData.textureRect![0].y}},{${plistData.textureRect![1].x},${plistData.textureRect![1].y}}}</string>

    <key>textureRotated</key>
    <${plistData.textureRotated ? "true" : "false"}/>
</dict>`;
        return plistDataStr;
    }

    export async function createPlistFile(imagePathList: string[], fileName: string, filePath: string) {
        const imageList: Image[] = [];
        for (const imagePath of imagePathList) {
            const image: Image = await FileCtrl.loadImageInfo(imagePath);
            imageList.push(image);
        }

        const packResult = FuncUtil.packWithBestAspect(imageList);

        if (!packResult) {
            console.warn('图集创建失败');
            return;
        }
        // console.log("缩放比为", packResult.scale);
        const scale = FuncUtil.getScale(packResult.boundingWidth, packResult.boundingHeight);
        const imageBuffer = getImageBuffer(packResult, imageList, scale);
        FuncUtil.scalePlistDataList(packResult.plistData, imageList, scale);
        let plistData: string = FuncUtil.CreatorPlistData(packResult.plistData, fileName, packResult.boundingWidth * scale, packResult.boundingHeight * scale, FileType.jpg);
        FileCtrl.writeFile(path.join(filePath, fileName + FileType.plist), Buffer.from(plistData));
        console.log('图集配置文件以保存为 ' + fileName + FileType.plist);
        FileCtrl.writeFile(path.join(filePath, fileName + FileType.jpg), imageBuffer);
        console.log('图片已保存为 ' + fileName + FileType.jpg);
    }


    /**
 * 生成图片缓冲区
 * @param packResult 打包结果
 * @param imageList 图片列表
 * @param scale 缩放比例
 * @returns 
 */
    function getImageBuffer(packResult: PackResult, imageList: Image[], scale: number) {
        let outCanvas: Canvas;

        const canvas = createCanvas(packResult.boundingWidth, packResult.boundingHeight);
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < packResult.plistData.length; i++) {
            const placement: PlistData = packResult.plistData[i];
            ctx.drawImage(imageList[i], placement.textureRect![0].x, placement.textureRect![0].y);
        }

        //判断是否需要缩放
        if (scale == 1) {
            outCanvas = canvas;
        } else {
            const newWidth = Math.floor(packResult.boundingWidth * scale);
            const newHeight = Math.floor(packResult.boundingHeight * scale);
            outCanvas = createCanvas(newWidth, newHeight);
            const ctx = outCanvas.getContext('2d');
            // 将原 canvas 内容绘制到新 canvas 上，同时缩放
            ctx.drawImage(canvas, 0, 0, newWidth, newHeight);
        }
        return outCanvas.toBuffer('image/jpeg', {
            quality: 0.9 // 可选，0~1，默认0.92
        });
    }


}

