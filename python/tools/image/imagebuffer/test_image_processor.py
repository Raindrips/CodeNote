# test_image_processor.py
import os
import shutil
from PIL import Image
from image_processor import ImageBlend # 导入 ImageProcessor 类

def create_test_image(path: str, size: tuple[int, int], color: tuple[int, int, int]):
    """创建一张纯色的测试图片。"""
    img = Image.new('RGB', size, color)
    img.save(path)
    print(f"创建测试图片: {path} ({size[0]}x{size[1]}, RGB: {color})")

def run_tests():
    """运行 ImageProcessor 的测试用例。"""
    print("--- 开始 ImageProcessor 功能测试 ---")

    test_dir = "test_images_temp"
    if os.path.exists(test_dir):
        shutil.rmtree(test_dir) # 清理旧的测试目录
    os.makedirs(test_dir)

    input_img_path = os.path.join(test_dir, "input_test.png")
    output_img_path = os.path.join(test_dir, "output_test.png")

    # --- 测试用例 1: 基本功能和 RGB 转 Alpha ---
    print("\n--- 测试用例 1: 基本功能和 RGB 转 Alpha ---")
    create_test_image(input_img_path, (10, 10), (150, 150, 150)) # 灰色图片，预期alpha=150
    try:
        processor = ImageBlend(input_img_path)
        width, height = processor.get_dimensions()
        print(f"获取图片尺寸: {width}x{height}")
        assert width == 10 and height == 10, "尺寸获取错误"

        # 遍历像素并检查初始值
        print("遍历初始像素 (部分示例):")
        count = 0
        for r, g, b, a, index in processor.get_pixel_rgba_with_index():
            if count < 5 or count > 95: # 只打印开头和结尾的几个
                x, y = processor.get_coords_from_index(index)
                print(f"  像素 ({x},{y}) Index {index}: ({r},{g},{b},{a})")
            assert r == 150 and g == 150 and b == 150 and a == 255, "初始像素值或默认Alpha错误"
            count += 1
        print(f"总像素数: {count}")
        assert count == width * height, "像素遍历数量错误"

        # 测试索引转坐标
        x_check, y_check = processor.get_coords_from_index(5) # (0,5)
        print(f"索引 5 对应的坐标: ({x_check},{y_check})")
        assert x_check == 5 and y_check == 0, "索引转坐标错误"

        # 应用 Alpha 修改
        print("应用 Alpha 修改...")
        processor.apply_alpha_from_rgb_average()
        processor.save_image(output_img_path)
        print(f"图片保存至: {output_img_path}")

        # 重新加载输出图片并验证 Alpha 值
        output_image = Image.open(output_img_path)
        output_image = output_image.convert('RGBA')
        output_pixels = output_image.load()
        print("验证修改后的 Alpha (部分示例):")
        for y in range(height):
            for x in range(width):
                r, g, b, a = output_pixels[x, y]
                expected_alpha = int((r + g + b) / 3)
                if x < 5 and y < 1: # 只打印一小部分
                    print(f"  像素 ({x},{y}): R{r}, G{g}, B{b}, A{a} (预期Alpha: {expected_alpha})")
                assert a == expected_alpha, f"Alpha值修改错误在 ({x},{y}): 预期 {expected_alpha}, 实际 {a}"
        print("测试通过: Alpha 值修改和保存功能正常。")

    except Exception as e:
        print(f"测试用例 1 失败: {e}")
    finally:
        clean_test_directory(test_dir)


    # --- 测试用例 2: 文件不存在 ---
    print("\n--- 测试用例 2: 文件不存在 ---")
    try:
        ImageBlend("non_existent_image.png")
        print("测试失败: 预期抛出 FileNotFoundError，但没有。")
    except FileNotFoundError:
        print("测试通过: 成功捕获 FileNotFoundError。")
    except Exception as e:
        print(f"测试失败: 发生意外异常 - {e}")

    # --- 测试用例 3: 无效图片格式 (模拟) ---
    print("\n--- 测试用例 3: 无效图片格式 (模拟) ---")
    invalid_img_path = os.path.join(test_dir, "invalid.txt")
    os.makedirs(test_dir, exist_ok=True)
    with open(invalid_img_path, "w") as f:
        f.write("This is not a valid image file content.")
    try:
        ImageBlend(invalid_img_path)
        print("测试失败: 预期抛出 IOError，但没有。")
    except IOError:
        print("测试通过: 成功捕获 IOError (无法识别的图片格式)。")
    except Exception as e:
        print(f"测试失败: 发生意外异常 - {e}")
    finally:
        clean_test_directory(test_dir)


    print("\n--- ImageProcessor 功能测试完成 ---")

def clean_test_directory(directory: str):
    """删除测试目录及其内容。"""
    if os.path.exists(directory):
        shutil.rmtree(directory)
        print(f"已删除测试目录: {directory}")

if __name__ == "__main__":
    run_tests()