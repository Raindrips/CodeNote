import argparse
import make_bitmap_font

"""
用法示例:
python main.py --input ./chars --font-name MyBitmap --font-size 48 --line-height 56 --max-width 1024

映射文件 mapping.txt (可选) 格式:
# 注释行以 # 开头
A A.png
你 你.png
0x0041 65.png     # 也可以用十六进制 unicode
"""


# ---- CLI ----
def arg_main():
    p = argparse.ArgumentParser(
        description="从单字符图片创建 bitmap font (BMFont text) 与 atlas PNG。"
    )
    p.add_argument("--input", "-i", required=True, help="包含单字符图片的目录")
    p.add_argument(
        "--font-name", "-n", default="BitmapFont", help="输出 font 名称 (文件名前缀)"
    )
    p.add_argument(
        "--font-size",
        "-s",
        type=int,
        default=32,
        help="font size (meta, not影响图像大小)",
    )
    p.add_argument(
        "--line-height", "-l", type=int, default=36, help="lineHeight 写入 .fnt"
    )
    p.add_argument(
        "--max-width", "-w", type=int, default=0, help="atlas 最大宽度，0 表示自动"
    )
    p.add_argument(
        "--padding", "-p", type=int, default=2, help="每个字形周围的空白 padding (像素)"
    )
    p.add_argument(
        "--mapping", "-m", type=str, default="", help="可选的映射文件路径 (mapping.txt)"
    )
    p.add_argument(
        "--output", "-o", type=str, default="", help="输出目录，默认为当前目录"
    )
    args = p.parse_args()

    make_bitmap_font.make_bitmap_font(
        args.input,
        args.font_name,
        args.font_size,
        args.font_size,
        args.max_width,
        args.padding,
        args.mapping if args.mapping else None,
        args.output if args.output else None,
    )

    # 等宽版本
    # make_bitmap_font.make_bitmap_font_monospaced(
    #     input_dir="./chars",
    #     out_name="MyMonoFont",
    #     font_size=48,
    #     line_height=56,
    #     max_width=1024,
    #     padding=2,
    #     mapping_path=None,
    #     fixed_advance=60,  # 可选，不设则自动取最大宽度
    # )


if __name__ == "__main__":
    arg_main()
