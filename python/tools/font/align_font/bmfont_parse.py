import re
from fnt_data import FntData, FontInfo, CommonInfo, Page, Char


def _to_int(s: str | None) -> int:
    if s is None or s == "":
        return 0
    try:
        return int(s)
    except (ValueError, TypeError):
        return 0


def parse_fnt_data(data: str) -> FntData:
    fnt_data = FntData()
    lines = [line.strip() for line in data.split("\n") if line.strip()]

    for line in lines:
        parts = line.split(" ", 1)
        type_ = parts[0]
        rest = parts[1] if len(parts) > 1 else ""

        params: dict[str, str] = {}
        for param in re.split(r'\s+(?=[a-z][a-zA-Z]*=)', rest):
            if "=" in param:
                key, value = param.split("=", 1)
                params[key] = value.strip('"')

        if type_ == "info":
            fnt_data.info = FontInfo(
                face=params.get("face", ""),
                size=_to_int(params.get("size")),
                bold=_to_int(params.get("bold")),
                italic=_to_int(params.get("italic")),
                charset=params.get("charset", ""),
                unicode=_to_int(params.get("unicode")),
                stretchH=_to_int(params.get("stretchH")),
                smooth=_to_int(params.get("smooth")),
                aa=_to_int(params.get("aa")),
                padding=params.get("padding", ""),
                spacing=params.get("spacing", ""),
                outline=_to_int(params.get("outline")),
            )
        elif type_ == "common":
            fnt_data.common = CommonInfo(
                lineHeight=_to_int(params.get("lineHeight")),
                base=_to_int(params.get("base")),
                scaleW=_to_int(params.get("scaleW")),
                scaleH=_to_int(params.get("scaleH")),
                pages=_to_int(params.get("pages")),
                packed=_to_int(params.get("packed")),
            )
        elif type_ == "page":
            fnt_data.pages.append(Page(
                id=_to_int(params.get("id")),
                file=params.get("file", ""),
            ))
        elif type_ == "char":
            fnt_data.chars.append(Char(
                id=_to_int(params.get("id")),
                x=_to_int(params.get("x")),
                y=_to_int(params.get("y")),
                width=_to_int(params.get("width")),
                height=_to_int(params.get("height")),
                xoffset=_to_int(params.get("xoffset")),
                yoffset=_to_int(params.get("yoffset")),
                xadvance=_to_int(params.get("xadvance")),
                page=_to_int(params.get("page")),
                chnl=_to_int(params.get("chnl")),
            ))

    return fnt_data
