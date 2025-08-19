from PIL import Image
import os
import sys
import re
import subprocess

pngquad = "./pngquant/pngquant.exe"


def process_image(im, scale):
    """
    Resizes the image by the given scaling factor.

    :param im: PIL Image object
    :param scale: Scaling factor (float)
    :return: Resized PIL Image object
    """
    new_width = max(1, int(im.width * scale))
    new_height = max(1, int(im.height * scale))
    return im.resize((new_width, new_height), Image.LANCZOS)


def press_image(source_file, out_file):
    # pngquant --strip --quality 0-80 --speed 1 test.png -o ./out/test.png
    result = subprocess.run(
        [
            pngquad,
            "--strip",
            "--quality",
            "50-100",
            "--speed",
            "1",
            "--force",
            # "--verbose",
            "--skip-if-larger",
            source_file,
            "-o",
            out_file,
        ],
        capture_output=True,
        text=True,
    )
    print(f"{result.stderr}", end="")
    print(f"{result.stdout}", end="")


def start_press(source_dir, output_dir):
    """_summary_

    Args:
        source_dir (str): 输入目录
        output_dir (str): 输出目录
        scale (float): 缩放比
    """
    # 默认正则表达式，用于匹配常见图片扩展名
    regex_pattern = r".*\.(png)$"
    regex = re.compile(regex_pattern, re.IGNORECASE)

    # 递归遍历源文件夹
    for root, dirs, files in os.walk(source_dir):
        # 计算相对路径并创建对应的输出目录
        rel_path = os.path.relpath(root, source_dir)
        target_dir = os.path.join(output_dir, rel_path)
        os.makedirs(target_dir, exist_ok=True)

        # 处理每个文件
        for file in files:
            if regex.search(file):
                source_file = os.path.join(root, file)
                target_file = os.path.join(target_dir, file)
                press_image(source_file, target_file)


if __name__ == "__main__":
    # 验证命令行参数
    if len(sys.argv) != 3:
        print("Usage: python main.py <source_dir> <output_dir>")
        sys.exit(1)

    # 解析命令行参数
    source_dir = sys.argv[1]
    output_dir = sys.argv[2]

    start_press(source_dir, output_dir)
