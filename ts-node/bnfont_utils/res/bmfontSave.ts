import { FontInfo, CommonInfo, FntData } from './FntData';

export function generateFntContent(fntData: FntData): string {
    const info = fntData.info;
    const common = fntData.common;
    const pages = fntData.pages;
    const chars = fntData.chars;

    const infoStr = `info face="${info.face}" size=${info.size} bold=${info.bold} italic=${info.italic} charset="${info.charset}" unicode=${info.unicode} stretchH=${info.stretchH} smooth=${info.smooth} aa=${info.aa} padding=${info.padding} spacing=${info.spacing} outline=${info.outline}`;
    const commonStr = `common lineHeight=${common.lineHeight} base=${common.base} scaleW=${common.scaleW} scaleH=${common.scaleH} pages=${common.pages} packed=${common.packed}`;
    const pagesStr = pages
        .map((page) => `page id=${page.id} file="${page.file}"`)
        .join('\n');
    const charsStr = chars
        .map(
            (char) =>
                `char id=${char.id} x=${char.x} y=${char.y} width=${char.width} height=${char.height} xoffset=${char.xoffset} yoffset=${char.yoffset} xadvance=${char.xadvance} page=${char.page} chnl=${char.chnl}`,
        )
        .join('\n');

    return `${infoStr}\n${commonStr}\n${pagesStr}\nchars count=${chars.length}\n${charsStr}`;
}
