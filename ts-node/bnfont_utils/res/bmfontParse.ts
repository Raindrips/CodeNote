
import { FontInfo, CommonInfo, FntData } from './FntData';

export function parseFntData(data: string): FntData {
    const fntData: FntData = {
        info: {} as FontInfo,
        common: {} as CommonInfo,
        pages: [],
        chars: [],
    };
    const lines = data
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
    lines.forEach((line) => {
        const [type, ...rest] = line.split(' ');
        const params = rest
            .join(' ')
            .split(/\s+(?=[a-z]+=)/)
            .reduce((acc, param) => {
                const [key, value] = param.split('=');
                acc[key] = value.replace(/(^")|("$)/g, '');
                return acc;
            }, {} as { [key: string]: string });

        switch (type) {
            case 'info':
                fntData.info = {
                    face: params.face,
                    size: toInt(params.size),
                    bold: toInt(params.bold),
                    italic: toInt(params.italic),
                    charset: params.charset,
                    unicode: toInt(params.unicode),
                    stretchH: toInt(params.stretchH),
                    smooth: toInt(params.smooth),
                    aa: toInt(params.aa),
                    padding: params.padding,
                    spacing: params.spacing,
                    outline: toInt(params.outline),
                };
                break;
            case 'common':
                fntData.common = {
                    lineHeight: toInt(params.lineHeight),
                    base: toInt(params.base),
                    scaleW: toInt(params.scaleW),
                    scaleH: toInt(params.scaleH),
                    pages: toInt(params.pages),
                    packed: toInt(params.packed),
                };
                break;
            case 'page':
                fntData.pages.push({
                    id: toInt(params.id),
                    file: params.file,
                });
                break;
            case 'char':
                fntData.chars.push({
                    id: toInt(params.id),
                    x: toInt(params.x),
                    y: toInt(params.y),
                    width: toInt(params.width),
                    height: toInt(params.height),
                    xoffset: toInt(params.xoffset),
                    yoffset: toInt(params.yoffset),
                    xadvance: toInt(params.xadvance),
                    page: toInt(params.page),
                    chnl: toInt(params.chnl),
                });
                break;
        }
    });

    return fntData;
}

function toInt(s: string | number | undefined) {
    if (typeof s === 'number') return s;
    if (typeof s === 'undefined') return 0;
    if (s === '') return 0;
    return parseInt(s) || 0;
}

