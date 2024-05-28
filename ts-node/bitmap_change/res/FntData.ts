export interface FontInfo {
    face: string;
    size: number;
    bold: number;
    italic: number;
    charset: string;
    unicode: number;
    stretchH: number;
    smooth: number;
    aa: number;
    padding: string;
    spacing: string;
    outline: number;
}

export interface CommonInfo {
    lineHeight: number;
    base: number;
    scaleW: number;
    scaleH: number;
    pages: number;
    packed: number;
}

export interface Page {
    id: number;
    file: string;
}

export interface Char {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    xoffset: number;
    yoffset: number;
    xadvance: number;
    page: number;
    chnl: number;
}

export interface FntData {
    info: FontInfo;
    common: CommonInfo;
    pages: Page[];
    chars: Char[];
}