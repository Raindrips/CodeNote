# main.py
import sys
from image_blur import ImageBlur


def main():
    """
    主函数，处理命令行输入并执行图片处理业务逻辑。
    使用方法: python main.py <输入图片路径> <输出图片路径>
    """
    if len(sys.argv) != 3:
        print("使用方法: python main.py <输入图片路径> <输出图片路径>")
        print("例如: python main.py input.jpg output.png")
        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2]

    print(f"--- 图像处理工具 ---")
    print(f"输入图片路径: {input_path}")
    print(f"输出图片路径: {output_path}")

    try:
        processor = ImageBlur(input_path)
        width, height = processor.get_dimensions()
        print(f"图片尺寸: {width}x{height}")

        processor.apply_blur(90, 20, 16)
        print(f"正在保存修改后的图片到 '{output_path}' (PNG格式)...")

        processor.scale_image(0.5)
        processor.save_image(output_path)
        print("图片保存成功！")

    except FileNotFoundError as e:
        print(f"错误: {e}")
        print("请检查输入图片路径是否正确。")
    except IOError as e:
        print(f"错误: {e}")
        print("请检查图片文件是否损坏或格式不支持。")
    # except Exception as e:
    #     print(f"发生未知错误: {e}")


if __name__ == "__main__":
    main()
