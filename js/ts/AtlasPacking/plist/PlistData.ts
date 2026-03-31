
export class Vec2 {
    x: number;
    y: number;
    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }


    toString(): string {
        return `{${this.x}, ${this.y}}`;
    };

}

export interface PlistData {
    /**
     * 图片中心偏移量
     */
    spriteOffset?: Vec2;
    /** 前裁剪后图像的尺寸 */
    spriteSize?: Vec2;
    /** 原始图片的尺寸 */
    spriteSourceSize?: Vec2;
    /** 在大图中的位置和尺寸 */
    textureRect?: [Vec2, Vec2]
    /** 是否旋转了90度 */
    textureRotated?: boolean;

}

export interface FreeRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface PackResult {
    plistData: PlistData[];
    boundingWidth: number;
    boundingHeight: number;
    aspectRatio: number;
}