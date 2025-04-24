import { CanvasRenderingContext2D, createCanvas, loadImage } from 'canvas';

export const Canvas_Width = 1080;
export const Canvas_Height = 450;

const angleMax: number = 170;
const r: number = 15;
const romveNum: number = Math.PI * 0.02;

export interface Vec2 {
    x: number;
    y: number;
}

export function showLineByVec(
    g: CanvasRenderingContext2D,
    positionArray: Vec2[],
) {
    let first = positionArray[0];
    g.moveTo(first.x, first.y);

    for (let i = 1; i < positionArray.length; i++) {
        let pos = positionArray[i];
        g.lineTo(pos.x, pos.y);
    }

    g.lineJoin = 'round'; // 连接处圆角
    g.lineCap = 'round'; // 端点圆角

    g.lineWidth = 4;
    g.strokeStyle = 'rgba(255,255,255,255)';
    g.translate(0.5, 0.5);
    g.stroke();
    g.closePath();
}

export function showLineByArc(
    g: CanvasRenderingContext2D,
    positionArray: Vec2[],
) {
    let [posList, raduisList, augleList]: [Vec2[], number[], Vec2[]] =
        getCentreCircle(positionArray);
    let first = posList[0];
    g.moveTo(first.x, first.y);
    let index = 0;
    for (let i = 1; i < posList.length; i++) {
        let pos = posList[i];
        if (raduisList[i] == 0) {
            g.lineTo(pos.x, pos.y);
        } else {
            g.arc(
                pos.x,
                pos.y,
                raduisList[i],
                augleList[index].x,
                augleList[index].y,
                pos.y < posList[i - 1].y,
            );
            index++;
        }
    }
    g.lineWidth = 1.5;

    g.strokeStyle = 'rgba(255,255,255,255)';
    g.stroke();
    g.closePath();
}

/**
 * 获取圆心
 */
function getCentreCircle(posList: Vec2[]): [Vec2[], number[], Vec2[]] {
    let vec1: Vec2 = v2(0, 0);
    let vec2: Vec2 = v2(0, 0);

    let radiusList: number[] = [];
    let posList2: Vec2[] = [];
    let angleList: Vec2[] = [];

    posList2.push(v2(posList[0].x, posList[0].y));
    radiusList.push(0);

    let pos1: Vec2 = v2(0, 0);
    let pos2: Vec2 = v2(0, 0);

    /**
     * 计算圆心所在位置
     */
    for (let i = 1; i < posList.length - 1; i++) {
        //获取以当前点的两个对象
        vec1.x = posList[i - 1].x - posList[i].x;
        vec1.y = posList[i - 1].y - posList[i].y;
        vec2.x = posList[i + 1].x - posList[i].x;
        vec2.y = posList[i + 1].y - posList[i].y;

        let angle: number = V2Angle(vec1, vec2);
        if ((angle * 180) / Math.PI > angleMax) {
            posList2.push(v2(posList[i].x, posList[i].y));
            radiusList.push(0);
            continue;
        }

        let ratio1: number = r / V2Length(vec1);
        let ratio2: number = r / V2Length(vec2);

        pos1.x = posList[i].x + ratio1 * vec1.x;
        pos1.y = posList[i].y + ratio1 * vec1.y;
        pos2.x = posList[i].x + ratio2 * vec2.x;
        pos2.y = posList[i].y + ratio2 * vec2.y;

        let centre: Vec2 = v2(0, 0);

        centre.x = (pos1.x + pos2.x) / 2;
        centre.y = (pos1.y + pos2.y) / 2;

        let x1: number = posList[i].x - centre.x;
        let y1: number = posList[i].y - centre.y;

        let length3: number = x1 * x1 + y1 * y1;
        let length4: number =
            Math.pow(pos1.x - centre.x, 2) +
            Math.pow(pos1.y - centre.y, 2);
        let ratio3: number = length4 / length3;

        centre.x = centre.x - (posList[i].x - centre.x) * ratio3;
        centre.y = centre.y - (posList[i].y - centre.y) * ratio3;

        posList2.push(v2(pos1.x, pos1.y));
        posList2.push(v2(centre.x, centre.y));
        posList2.push(v2(pos2.x, pos2.y));
        radiusList.push(0);
        radiusList.push(
            Math.sqrt(
                Math.pow(pos1.x - centre.x, 2) +
                    Math.pow(pos1.y - centre.y, 2),
            ),
        );
        radiusList.push(0);

        let ratioPos: Vec2 = v2(0, 0);
        ratioPos.x = getAngleFromXAxis(
            pos1.x - centre.x,
            pos1.y - centre.y,
        );
        ratioPos.y = getAngleFromXAxis(
            pos2.x - centre.x,
            pos2.y - centre.y,
        );
        if (centre.y < posList[i].y) {
            ratioPos.y = ratioPos.y + romveNum;
        } else {
            ratioPos.y = ratioPos.y - romveNum;
        }
        angleList.push(ratioPos);
    }
    posList2.push(
        v2(posList[posList.length - 1].x, posList[posList.length - 1].y),
    );
    radiusList.push(0);

    return [posList2, radiusList, angleList];
}

export function v2(x: number, y: number): Vec2 {
    return { x, y };
}

export function v22v(x: number, y: number) {
    return {
        x: x + Canvas_Width * 0.5,
        y: Canvas_Height - (y + Canvas_Height * 0.5),
    };
}

function V2Angle(a: Vec2, b: Vec2) {
    const magSqr1 = a.x * a.x + a.y * a.y;
    const magSqr2 = b.x * b.x + b.y * b.y;

    if (magSqr1 === 0 || magSqr2 === 0) {
        return 0.0;
    }

    const dot = a.x * b.x + a.y * b.y;
    let cosine = dot / Math.sqrt(magSqr1 * magSqr2);
    cosine = clamp(cosine, -1.0, 1.0);
    return Math.acos(cosine);
}

function V2Length(v1: Vec2) {
    return Math.sqrt(v1.x * v1.x + v1.y * v1.y);
}

function getAngleFromXAxis(x: number, y: number): number {
    return Math.atan2(y, x);
}

function clamp(val: number, min: number, max: number): number {
    if (min > max) {
        const temp = min;
        min = max;
        max = temp;
    }

    return val < min ? min : val > max ? max : val;
}
