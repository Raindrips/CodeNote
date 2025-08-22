
export enum FileType{
    png = ".png",
    jpg = ".jpg",
    jpeg = ".jpeg",
    webp = ".webp",
    json = ".json",
    txt = ".txt",
    /** cocos 图集配置文件 */
    plist = ".plist",
    /** spine动画图片配置文件 */
    atlas = ".atlas",
}

/**
 * 判断是否是图片文件
 * @param fileType 
 * @returns 
 */
export function isImageFile(fileType:string) : boolean{
    switch (fileType) {
        case FileType.png:
        case FileType.jpg:
        case FileType.jpeg:
        case FileType.webp:
            return true;
        default:
            return false;
    }
}
