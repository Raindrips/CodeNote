# main.py
import sys
import os
from image_processor import ImageProcessor # 从 file_renamer.py 导入 ImageProcessor 类

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
        processor = ImageProcessor(input_path)
        width, height = processor.get_dimensions()
        print(f"图片尺寸: {width}x{height}")

        print("正在遍历并修改像素 Alpha 值...")
        processor.apply_alpha_from_rgb_screen()
        print("像素 Alpha 值修改完成。")

        print(f"正在保存修改后的图片到 '{output_path}' (PNG格式)...")
        processor.save_image(output_path)
        print("图片保存成功！")

        # 示例：获取特定索引的坐标（可以在这里展示给用户）
        # 如果图片像素很多，不建议全部打印
        if width * height > 0:
            sample_index = 0
            if width * height > 100: # 随机取一个中间的索引
                sample_index = (width * height) // 2
            x_coord, y_coord = processor.get_coords_from_index(sample_index)
            print(f"示例: 像素索引 {sample_index} 对应的坐标是 ({x_coord}, {y_coord})。")

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