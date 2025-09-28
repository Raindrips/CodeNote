# main.py
import os
import re
import sys
from image_blur import ImageBlur

"""_summary_
Args:
    source_dir (str): 输入目录
    output_dir (str): 输出目录
"""


def file_processing(source_dir, output_dir):
    # 匹配常见图片扩展名
    regex_pattern = r".*\.(jpg|jpeg|png)$"
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
                try:
                    image_process(source_file, target_file)
                    print(f"Processed {source_file} -> {target_file}")
                except Exception as e:
                    print(f"Error processing {source_file}: {e}")


# --- 图像处理工具 ---
def image_process(input_path, output_path):
    try:
        processor = ImageBlur(input_path)
        width, height = processor.get_dimensions()
        processor.apply_blur(90, 20, 16)
        print(f"图片尺寸: {width}x{height} 输出路径'{output_path}'.")
        processor.scale_image(0.5)
        processor.save_image(output_path)

    except FileNotFoundError as e:
        print(f"错误:请检查输入图片路径是否正确。 {e}")
    except IOError as e:
        print(f"错误: 请检查图片文件是否损坏或格式不支持。{e} ")
    except Exception as e:
        print(f"发生未知错误: {e}")


def main():
    if len(sys.argv) != 3:
        print("使用方法: python main.py <输入文件夹> <输出文件夹>")
        print("例如: python main_blur.py input/ output/")
        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2]
    file_processing(input_path, output_path)


if __name__ == "__main__":
    main()
