#!/usr/bin/env python3
"""
遍历当前目录下所有 .png 图片，获取最大宽度，
将 1.png 居中扩展到该宽度，并在左下角和右上角添加半透明像素，
输出覆盖 1.png，原文件备份为 1-bak.png。
"""

import os
import shutil
from pathlib import Path
import sys
from PIL import Image
from numpy import average


def scan_png_files(folder: str = ".") -> list[Path]:
    """遍历文件夹，收集所有 .png 文件（不递归）。"""
    folder_path = Path(folder)
    files = [f for f in folder_path.iterdir() if f.is_file() and f.suffix.lower() == ".png"]
    if not files:
        raise FileNotFoundError(f"在 {folder_path.resolve()} 中未找到任何 .png 文件")
    print(f"[扫描] 找到 {len(files)} 个 PNG 文件")
    return files

def get_average(files:list[Path])->int:
    """获取所有 PNG 图片中的平均值。"""
    sum_width = 0
    for f in files:
        with Image.open(f) as img:
            w, _ = img.size
            sum_width+=w
            print(f"  {f.name}: {w}px")
    average_width=int(sum_width/len(files))
    print(f"平均宽度 = {average_width}px")
    return average_width

def get_max_width(files: list[Path]) -> int:
    """获取所有 PNG 图片中的最大宽度。"""
    max_width = 0
    sum_width = 0
    for f in files:
        with Image.open(f) as img:
            w, _ = img.size
            if w > max_width:
                max_width = w
                sum_width+=w
            print(f"  {f.name}: {w}px")
    print(f"[分析] 最大宽度 = {max_width}px")
    return max_width


def find_target_file(files: list[Path], name: str = "1.png") -> Path:
    """在文件列表中查找目标文件。"""
    target = None
    for f in files:
        if f.name == name:
            target = f
            break
    if target is None:
        raise FileNotFoundError(f"未找到目标文件 {name}")
    print(f"[定位] 目标文件: {target}")
    return target


def expand_image_centered(img: Image.Image, target_width: int) -> Image.Image:
    """将图片居中扩展到指定宽度，背景透明。"""
    orig_w, orig_h = img.size
    if orig_w >= target_width:
        print(f"[扩展] 图片宽度 {orig_w}px 已 >= 目标宽度 {target_width}px，无需扩展")
        return img.copy()

    new_img = Image.new("RGBA", (target_width, orig_h), (0, 0, 0, 0))
    offset_x = (target_width - orig_w) // 2
    new_img.paste(img, (offset_x, 0))
    print(f"[扩展] {orig_w}x{orig_h} -> {target_width}x{orig_h}  (偏移 x={offset_x})")
    return new_img


def add_corner_pixels(img: Image.Image) -> Image.Image:
    """在左下角和右上角各添加一个半透明像素（避免裁剪）。"""
    w, h = img.size
    semi_transparent = (0, 0, 0, 1)  # 几乎全透明的像素

    img.putpixel((0, h - 1), semi_transparent)  # 左下角
    img.putpixel((w - 1, 0), semi_transparent)  # 右上角
    print(f"[标记] 已在左下角 (0, {h - 1}) 和右上角 ({w - 1}, 0) 添加半透明像素")
    return img


def backup(original_path: Path ) -> None:
    """备份原文件为 -bak，然后保存新图片。"""
    backup_path = original_path.with_name(original_path.stem + "-bak" + original_path.suffix)
    shutil.copy2(original_path, backup_path)
    print(f"[备份] {original_path.name} -> {backup_path.name}")

def save(original_path: Path,new_image: Image.Image):
    new_image.save(original_path)
    print(f"[保存] 已覆盖写入 {original_path.name}")


def main(folder: str = "."):
    """主流程入口。"""
   
    files = scan_png_files(folder)
    max_width = get_average(files)
    target_file = find_target_file(files)

    with Image.open(target_file) as img:
        rgba_img = img.convert("RGBA")
        expanded = expand_image_centered(rgba_img, max_width)
        marked = add_corner_pixels(expanded)

    backup(target_file)
    save(target_file, marked)
    print("[完成]")


if __name__ == "__main__":
    if len(sys.argv)<2:
        print('input path')
    main(sys.argv[1])
