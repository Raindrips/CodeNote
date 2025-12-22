#!/usr/bin/env python3
"""
make_bitmap_font.py

将一个文件夹里的单字符图片合并成 bitmap font (BMFont text format + atlas PNG).

"""

import os
import argparse
import math
from PIL import Image


# ---- packing helpers: simple shelf algorithm ----
def pack_shelf(glyphs, max_width, padding):
    """
    glyphs: list of dicts with 'id','img','w','h','filename'
    returns: atlas_w, atlas_h, and updated glyphs with x,y
    """
    x = padding
    y = padding
    row_h = 0
    atlas_w = max_width
    placements = []
    for g in glyphs:
        gw, gh = g["w"] + padding * 2, g["h"] + padding * 2
        if x + gw > atlas_w:
            # new row
            y += row_h
            y += padding
            x = padding
            row_h = 0
        g["x"] = x
        g["y"] = y
        placements.append(g)
        x += gw
        if gh > row_h:
            row_h = gh
    atlas_h = y + row_h + padding
    return atlas_w, atlas_h, placements


def next_pow2(x):
    return 1 << (x - 1).bit_length()


# ---- util to parse filename->char mapping ----
def parse_mapping_file(mapping_path):
    mapping = {}
    with open(mapping_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            parts = line.split()
            if len(parts) >= 2:
                char_spec = parts[0]
                filename = parts[1]
                # char_spec could be 'A', '你', '0x4E2D', or decimal '65'
                if char_spec.startswith("0x") or char_spec.startswith("0X"):
                    code = int(char_spec, 16)
                    ch = chr(code)
                else:
                    try:
                        code = int(char_spec)
                        ch = chr(code)
                    except:
                        ch = char_spec
                mapping[filename] = ch
    return mapping


# ---- main function ----
def make_bitmap_font(
    input_dir, out_name, font_size, line_height, max_width, padding, mapping_path
):
    # collect image files
    files = [
        f for f in os.listdir(input_dir) if os.path.isfile(os.path.join(input_dir, f))
    ]
    # filter common image extensions
    img_files = [
        f
        for f in files
        if f.lower().endswith((".png", ".jpg", ".jpeg", ".bmp", ".gif"))
    ]
    if not img_files:
        raise RuntimeError("输入目录没有找到图片文件。")

    mapping = {}
    if mapping_path:
        mapping = parse_mapping_file(mapping_path)

    glyphs = []
    for fname in img_files:
        full = os.path.join(input_dir, fname)
        try:
            img = Image.open(full).convert("RGBA")
        except Exception as e:
            print(f"跳过无法打开的文件 {fname}: {e}")
            continue
        w, h = img.size
        # infer character:
        if fname in mapping:
            ch = mapping[fname]
        else:
            name_noext = os.path.splitext(fname)[0]
            # if the filename is a single character, use it
            if len(name_noext) == 1:
                ch = name_noext
            else:
                # hex like 0x4E2D or decimal name
                try:
                    if name_noext.startswith("0x") or name_noext.startswith("0X"):
                        ch = chr(int(name_noext, 16))
                    else:
                        ch = chr(int(name_noext))
                except:
                    # fallback: use first char of filename (may be acceptable)
                    ch = name_noext[0]
        glyphs.append(
            {"id": ord(ch), "ch": ch, "img": img, "w": w, "h": h, "filename": fname}
        )

    # sort glyphs by height desc for better packing
    glyphs.sort(key=lambda g: g["h"], reverse=True)

    # if max_width is None, try to estimate reasonable width
    if not max_width:
        total_area = sum(g["w"] * g["h"] for g in glyphs)
        est_side = int(math.sqrt(total_area)) + padding * 2
        max_width = next_pow2(max(256, est_side))  # at least 256
    else:
        # ensure power-of-two for nicer textures (optional)
        max_width = next_pow2(max_width)

    atlas_w, atlas_h, placed = pack_shelf(glyphs, max_width, padding)
    atlas_h = next_pow2(atlas_h)  # round height up to pow2

    # create atlas image
    atlas = Image.new("RGBA", (atlas_w, atlas_h), (0, 0, 0, 0))
    for g in placed:
        atlas.paste(g["img"], (g["x"], g["y"]), g["img"])

    out_png = f"{out_name}.png"
    atlas.save(out_png)
    print(f"输出 atlas: {out_png} ({atlas_w}x{atlas_h})")

    # create .fnt in text format (BMFont)
    out_fnt = f"{out_name}.fnt"
    # head: info and common
    info_line = f'info face="{out_name}" size={font_size} bold=0 italic=0 charset="" unicode=1 stretchH=100 smooth=1 aa=1 padding=0,0,0,0 spacing=1,1'
    common_line = f"common lineHeight={line_height} base=26 scaleW={atlas_w} scaleH={atlas_h} pages=1 packed=0"
    page_line = f'page id=0 file="{os.path.basename(out_png)}"'
    chars_count = len(placed)
    chars_header = f"chars count={chars_count}"

    # each char: id x y width height xoffset yoffset xadvance page chnl
    # we'll set xoffset=0, yoffset=0, xadvance = glyph width (or you can set a fixed advance)
    with open(out_fnt, "w", encoding="utf-8") as f:
        f.write(info_line + "\n")
        f.write(common_line + "\n")
        f.write(page_line + "\n")
        f.write(chars_header + "\n")
        for g in placed:
            idv = g["id"]
            x = g["x"]
            y = g["y"]
            w = g["w"]
            h = g["h"]
            xoffset = 0
            yoffset = 0
            xadvance = w  # simple: advance = glyph width
            line = f"char id={idv}   x={x}    y={y}    width={w}    height={h}    xoffset={xoffset}    yoffset={yoffset}    xadvance={xadvance}    page=0  chnl=0"
            f.write(line + "\n")
    print(f"输出 fnt: {out_fnt}")

# =========================================================
# 等宽字体版本 (monospaced bitmap font)
# =========================================================
def make_bitmap_font_monospaced(
    input_dir,
    out_name,
    font_size,
    line_height,
    max_width,
    padding,
    mapping_path,
    fixed_advance=None,
):
    """
    与 make_bitmap_font 相同，只是生成的 .fnt 文件中每个字符的 xadvance 都为固定宽度。
    如果 fixed_advance=None，则使用所有字符最大宽度作为等宽宽度。
    """
    from PIL import Image
    import os, math

    files = [
        f for f in os.listdir(input_dir) if os.path.isfile(os.path.join(input_dir, f))
    ]
    img_files = [
        f
        for f in files
        if f.lower().endswith((".png", ".jpg", ".jpeg", ".bmp", ".gif"))
    ]
    if not img_files:
        raise RuntimeError("输入目录没有找到图片文件。")

    mapping = {}
    if mapping_path:
        mapping = parse_mapping_file(mapping_path)

    glyphs = []
    for fname in img_files:
        full = os.path.join(input_dir, fname)
        img = Image.open(full).convert("RGBA")
        w, h = img.size
        if fname in mapping:
            ch = mapping[fname]
        else:
            name_noext = os.path.splitext(fname)[0]
            try:
                if name_noext.startswith("0x") or name_noext.startswith("0X"):
                    ch = chr(int(name_noext, 16))
                else:
                    ch = chr(int(name_noext))
            except:
                ch = name_noext[0]
        glyphs.append(
            {"id": ord(ch), "ch": ch, "img": img, "w": w, "h": h, "filename": fname}
        )

    glyphs.sort(key=lambda g: g["h"], reverse=True)

    if not max_width:
        total_area = sum(g["w"] * g["h"] for g in glyphs)
        est_side = int(math.sqrt(total_area)) + padding * 2
        max_width = next_pow2(max(256, est_side))
    else:
        max_width = next_pow2(max_width)

    atlas_w, atlas_h, placed = pack_shelf(glyphs, max_width, padding)
    atlas_h = next_pow2(atlas_h)

    atlas = Image.new("RGBA", (atlas_w, atlas_h), (0, 0, 0, 0))
    for g in placed:
        atlas.paste(g["img"], (g["x"], g["y"]), g["img"])

    out_png = f"{out_name}.png"
    atlas.save(out_png)

    # ---- 固定宽度计算 ----
    if fixed_advance is None:
        fixed_advance = max(g["w"] for g in placed)

    out_fnt = f"{out_name}.fnt"
    info_line = f'info face="{out_name}" size={font_size} bold=0 italic=0 charset="" unicode=1 stretchH=100 smooth=1 aa=1 padding=0,0,0,0 spacing=1,1'
    common_line = f"common lineHeight={line_height} base=26 scaleW={atlas_w} scaleH={atlas_h} pages=1 packed=0"
    page_line = f'page id=0 file="{os.path.basename(out_png)}"'
    chars_count = len(placed)
    chars_header = f"chars count={chars_count}"

    with open(out_fnt, "w", encoding="utf-8") as f:
        f.write(info_line + "\n")
        f.write(common_line + "\n")
        f.write(page_line + "\n")
        f.write(chars_header + "\n")
        for g in placed:
            line = (
                f'char id={g["id"]}   x={g["x"]}    y={g["y"]}    '
                f'width={g["w"]}    height={g["h"]}    '
                f"xoffset=0    yoffset=0    xadvance={fixed_advance}    page=0  chnl=0"
            )
            f.write(line + "\n")

    print(f"[等宽模式] 输出: {out_png}, {out_fnt}")
    print(f"所有字符的 xadvance 固定为 {fixed_advance}")

