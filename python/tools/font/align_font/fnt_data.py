from dataclasses import dataclass, field


@dataclass
class FontInfo:
    face: str = ""
    size: int = 0
    bold: int = 0
    italic: int = 0
    charset: str = ""
    unicode: int = 0
    stretchH: int = 0
    smooth: int = 0
    aa: int = 0
    padding: str = ""
    spacing: str = ""
    outline: int = 0


@dataclass
class CommonInfo:
    lineHeight: int = 0
    base: int = 0
    scaleW: int = 0
    scaleH: int = 0
    pages: int = 0
    packed: int = 0


@dataclass
class Page:
    id: int = 0
    file: str = ""


@dataclass
class Char:
    id: int = 0
    x: int = 0
    y: int = 0
    width: int = 0
    height: int = 0
    xoffset: int = 0
    yoffset: int = 0
    xadvance: int = 0
    page: int = 0
    chnl: int = 0


@dataclass
class FntData:
    info: FontInfo = field(default_factory=FontInfo)
    common: CommonInfo = field(default_factory=CommonInfo)
    pages: list[Page] = field(default_factory=list)
    chars: list[Char] = field(default_factory=list)
