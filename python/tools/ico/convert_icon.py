import sys
from pathlib import Path
from PIL import Image

def convert_to_icon(input_file: str):
    path = Path(input_file)

    if not path.exists():
        print(f"文件不存在: {input_file}")
        return

    # 输出文件名：同名但扩展名为 .ico
    output_file = path.with_suffix(".ico")

    # 打开图片
    img = Image.open(path)

    # 转换为 ICO（自动处理尺寸）
    img.save(output_file, format="ICO")

    print(f"已生成: {output_file}")

def main():
    if len(sys.argv) <= 1:
        print("用法: python main.py 1.png 2.jpg")
        return

    for file in sys.argv[1:]:
        convert_to_icon(file)

if __name__ == "__main__":
    main()
