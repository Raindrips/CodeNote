from fnt_data import FntData


def generate_fnt_content(fnt_data: FntData) -> str:
    info = fnt_data.info
    common = fnt_data.common

    info_str = (
        f'info face="{info.face}" size={info.size} bold={info.bold} '
        f'italic={info.italic} charset="{info.charset}" unicode={info.unicode} '
        f'stretchH={info.stretchH} smooth={info.smooth} aa={info.aa} '
        f'padding={info.padding} spacing={info.spacing} outline={info.outline}'
    )
    common_str = (
        f"common lineHeight={common.lineHeight} base={common.base} "
        f"scaleW={common.scaleW} scaleH={common.scaleH} "
        f"pages={common.pages} packed={common.packed}"
    )
    pages_str = "\n".join(
        f'page id={p.id} file="{p.file}"' for p in fnt_data.pages
    )
    chars_str = "\n".join(
        f"char id={c.id} x={c.x} y={c.y} width={c.width} "
        f"height={c.height} xoffset={c.xoffset} yoffset={c.yoffset} "
        f"xadvance={c.xadvance} page={c.page} chnl={c.chnl}"
        for c in fnt_data.chars
    )

    return f"{info_str}\n{common_str}\n{pages_str}\nchars count={len(fnt_data.chars)}\n{chars_str}"
