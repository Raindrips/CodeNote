import sys
import os
from PIL import Image
import make_bitmap_font


def _max_image_height(input_dir):
    """扫描目录中所有图片，返回最大高度。"""
    max_h = 0
    for fname in os.listdir(input_dir):
        fpath = os.path.join(input_dir, fname)
        if not os.path.isfile(fpath):
            continue
        if not fname.lower().endswith((".png", ".jpg", ".jpeg", ".bmp", ".gif")):
            continue
        try:
            with Image.open(fpath) as img:
                _, h = img.size
                if h > max_h:
                    max_h = h
        except Exception:
            pass
    if max_h == 0:
        raise RuntimeError("输入目录没有找到图片文件。")
    return max_h


def main():
    if len(sys.argv) < 2:
        print("用法: python main2.py <dir> [font=name] [output_dir]")
        print("示例: python main2.py ./chars MyFont")
        print("示例: python main2.py ./chars MyFont ./output")
        sys.exit(1)

    input_dir = sys.argv[1]
    font_name = sys.argv[2] if len(sys.argv) > 2 else "BitmapFont"
    output_dir = sys.argv[3] if len(sys.argv) > 3 else None

    size = _max_image_height(input_dir)
    print(f"自动检测 font-size/line-height = {size} (图片最大高度)")

    make_bitmap_font.make_bitmap_font(
        input_dir=input_dir,
        out_name=font_name,
        font_size=size,
        line_height=size,
        max_width=0,
        padding=2,
        mapping_path=None,
        output_dir=output_dir,
    )


if __name__ == "__main__":
    main()
