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
                    size: parseInt(params.size),
                    bold: parseInt(params.bold),
                    italic: parseInt(params.italic),
                    charset: params.charset,
                    unicode: parseInt(params.unicode),
                    stretchH: parseInt(params.stretchH),
                    smooth: parseInt(params.smooth),
                    aa: parseInt(params.aa),
                    padding: params.padding,
                    spacing: params.spacing,
                    outline: parseInt(params.outline)
                };
                break;
            case 'common':
                fntData.common = {
                    lineHeight: parseInt(params.lineHeight),
                    base: parseInt(params.base),
                    scaleW: parseInt(params.scaleW),
                    scaleH: parseInt(params.scaleH),
                    pages: parseInt(params.pages),
                    packed: parseInt(params.packed)
                };
                break;
            case 'page':
                fntData.pages.push({
                    id: parseInt(params.id),
                    file: params.file
                });
                break;
            case 'char':
                fntData.chars.push({
                    id: parseInt(params.id),
                    x: parseInt(params.x),
                    y: parseInt(params.y),
                    width: parseInt(params.width),
                    height: parseInt(params.height),
                    xoffset: parseInt(params.xoffset),
                    yoffset: parseInt(params.yoffset),
                    xadvance: parseInt(params.xadvance),
                    page: parseInt(params.page),
                    chnl: parseInt(params.chnl)
                });
                break;
        }
    });

    return fntData;
}

