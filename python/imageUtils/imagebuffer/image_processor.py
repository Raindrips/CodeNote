# image_processor.py
from PIL import Image
import os


class ImageProcessor:
    """
    提供图片的通用加载、像素访问与保存能力，供具体效果类继承。
    """

    def __init__(self, image_path: str):
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"图片文件 '{image_path}' 不存在。")
        try:
            self.image = Image.open(image_path)
            if self.image.mode != "RGBA":
                self.image = self.image.convert("RGBA")
            self.width, self.height = self.image.size
            self.pixels = self.image.load()
        except Exception as e:
            raise IOError(f"无法打开或处理图片 '{image_path}': {e}")

    def get_dimensions(self) -> tuple[int, int]:
        return self.width, self.height

    def get_pixel_rgba_with_index(self):
        index = 0
        for y in range(self.height):
            for x in range(self.width):
                r, g, b, a = self.pixels[x, y]
                yield r, g, b, a, index
                index += 1

    def set_pixel_rgba(self, x: int, y: int, r: int, g: int, b: int, a: int):
        if not (0 <= x < self.width and 0 <= y < self.height):
            raise IndexError(
                f"坐标 ({x}, {y}) 超出图片范围 ({self.width}, {self.height})。"
            )
        self.pixels[x, y] = (r, g, b, a)

    def get_coords_from_index(self, index: int) -> tuple[int, int]:
        if not (0 <= index < self.width * self.height):
            raise IndexError(
                f"索引 {index} 超出图片像素总数 {self.width * self.height}。"
            )
        y = index // self.width
        x = index % self.width
        return x, y

    def save_image(self, output_path: str):
        try:
            self.image.save(output_path, "PNG")
        except Exception as e:
            raise IOError(f"保存图片到 '{output_path}' 失败: {e}")


