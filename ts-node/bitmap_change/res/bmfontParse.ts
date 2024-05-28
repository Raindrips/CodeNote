import { FontInfo,CommonInfo,FntData } from "./FntData";

export function parseFntData(data: string): FntData {
    const fntData: FntData = {
        info: {} as FontInfo,
        common: {} as CommonInfo,
        pages: [],
        chars: []
    };
    const lines = data.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    lines.forEach(line => {
        const [type, ...rest] = line.split(' ');
        const params = rest.join(' ').split(/\s+(?=[a-z]+=)/).reduce((acc, param) => {
            const [key, value] = param.split('=');
            acc[key] = value.replace(/(^")|("$)/g, '');
            return acc;
        }, {} as { [key: string]: string });

        switch (type) {
            case 'info':
                fntData.info = {
                    face: params.face,
                    size: Number(params.size),
                    bold: Number(params.bold),
                    italic: Number(params.italic),
                    charset: params.charset,
                    unicode: Number(params.unicode),
                    stretchH: Number(params.stretchH),
                    smooth: Number(params.smooth),
                    aa: Number(params.aa),
                    padding: params.padding,
                    spacing: params.spacing,
                    outline: Number(params.outline)
                };
                break;
            case 'common':
                fntData.common = {
                    lineHeight: Number(params.lineHeight),
                    base: Number(params.base),
                    scaleW: Number(params.scaleW),
                    scaleH: Number(params.scaleH),
                    pages: Number(params.pages),
                    packed: Number(params.packed)
                };
                break;
            case 'page':
                fntData.pages.push({
                    id: Number(params.id),
                    file: params.file
                });
                break;
            case 'char':
                fntData.chars.push({
                    id: Number(params.id),
                    x: Number(params.x),
                    y: Number(params.y),
                    width: Number(params.width),
                    height: Number(params.height),
                    xoffset: Number(params.xoffset),
                    yoffset: Number(params.yoffset),
                    xadvance: Number(params.xadvance),
                    page: Number(params.page),
                    chnl: Number(params.chnl)
                });
                break;
        }
    });

    return fntData;
}

