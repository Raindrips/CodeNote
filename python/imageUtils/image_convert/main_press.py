from PIL import Image
import os
import sys
import re
import subprocess

pngquant = "./app/pngquant/pngquant.exe"
jpegoptim = "./app/jpegoptim/jpegoptim.exe"


def get_image_format(file_path) -> str | None:
    try:
        with Image.open(file_path) as img:
            return img.format
    except Exception as e:
        print(f"无法识别文件格式: {e}")
        return None


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


def press_image_png(source_file: str, out_file: str, quality: int):
    # pngquant --strip --quality 0-80 --speed 1 test.png -o ./out/test.png
    result = subprocess.run(
        [
            pngquant,
            "--strip",
            "--quality",
            f"0-{quality}",
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
        creationflags=subprocess.CREATE_NO_WINDOW
    )
    if result.stderr:
        print(f"png:{result.stderr}", end="")
    if result.stdout:
        print(f"png:{result.stdout}", end="")


def press_image_jpg(source_file: str, output_dir: str, quality: int):
    # 使用jpegoptim压缩JPEG图片
    result = subprocess.run(
        [
            jpegoptim,
            "-d",
            output_dir,
            source_file,
            "-o",
            f"--max={quality}",
        ],
        capture_output=True,
        text=True,
        creationflags=subprocess.CREATE_NO_WINDOW
    )

    if result.stderr:
        print(f"jpg:{result.stderr}", end="")
    if result.stdout:
        print(f"{result.stdout}", end="")


def start_press(source_dir, output_dir, quality):
    """_summary_

    Args:
        source_dir (str): 输入目录
        output_dir (str): 输出目录
        scale (float): 缩放比
    """
    # 默认正则表达式，用于匹配常见图片扩展名
    regex_pattern = r".*\.(png|jpg)$"
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
                source_file: str = os.path.join(root, file)
                target_file: str = os.path.join(target_dir, file)

                file_type = get_image_format(source_file)
                # 根据文件后缀判断调用哪个压缩函数
                if file_type.upper().endswith("JPEG") or file_type.upper().endswith(
                    "JPG"
                ):
                    press_image_jpg(source_file, target_dir, quality)
                elif file_type.upper().endswith("PNG"):
                    press_image_png(source_file, target_file, quality)


def main():
    # 验证命令行参数
    if len(sys.argv) < 3:
        print("Usage: python main.py <source_dir> <output_dir> <quality=90>")
        sys.exit(1)

    # 解析命令行参数
    source_dir = sys.argv[1]
    output_dir = sys.argv[2]
    quality = sys.argv[3] if len(sys.argv) > 3 else 90

    start_press(source_dir, output_dir, quality)


if __name__ == "__main__":
    main()
