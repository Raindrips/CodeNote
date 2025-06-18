# image_processor.py
from PIL import Image


class ImageProcessor:
    """
    提供图片像素遍历、修改和保存功能。
    """

    def __init__(self, image_path: str):
        """
        初始化 ImageProcessor。

        Args:
            image_path (str): 图片文件的路径。

        Raises:
            FileNotFoundError: 如果图片文件不存在。
            IOError: 如果图片文件无法打开或识别。
        """
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"图片文件 '{image_path}' 不存在。")
        try:
            self.image = Image.open(image_path)
            # 确保图片有RGBA通道，如果没有，则转换为RGBA
            if self.image.mode != "RGBA":
                self.image = self.image.convert("RGBA")
            self.width, self.height = self.image.size
            self.pixels = self.image.load()  # 获取像素访问对象
        except Exception as e:
            raise IOError(f"无法打开或处理图片 '{image_path}': {e}")

    def get_dimensions(self) -> tuple[int, int]:
        """
        获取图片的宽度和高度。

        Returns:
            tuple[int, int]: (宽度, 高度)。
        """
        return self.width, self.height

    def get_pixel_rgba_with_index(self):
        """
        遍历所有像素，返回 R, G, B, A 值和索引。
        如果原始图片没有 A 通道，默认 A 为 255。

        Yields:
            tuple[int, int, int, int, int]: (r, g, b, a, index)。
        """
        index = 0
        for y in range(self.height):
            for x in range(self.width):
                r, g, b, a = self.pixels[x, y]
                yield r, g, b, a, index
                index += 1

    def set_pixel_rgba(self, x: int, y: int, r: int, g: int, b: int, a: int):
        """
        修改指定坐标的像素 R, G, B, A 值。

        Args:
            x (int): 像素的 X 坐标。
            y (int): 像素的 Y 坐标。
            r (int): 红色值 (0-255)。
            g (int): 绿色值 (0-255)。
            b (int): 蓝色值 (0-255)。
            a (int): Alpha 值 (0-255)。

        Raises:
            IndexError: 如果 x 或 y 超出图片范围。
        """
        if not (0 <= x < self.width and 0 <= y < self.height):
            raise IndexError(
                f"坐标 ({x}, {y}) 超出图片范围 ({self.width}, {self.height})。"
            )
        self.pixels[x, y] = (r, g, b, a)

    def get_coords_from_index(self, index: int) -> tuple[int, int]:
        """
        根据像素索引返回其 (x, y) 坐标。

        Args:
            index (int): 像素的线性索引。

        Returns:
            tuple[int, int]: 像素的 (x, y) 坐标。

        Raises:
            IndexError: 如果索引超出图片像素总数。
        """
        if not (0 <= index < self.width * self.height):
            raise IndexError(
                f"索引 {index} 超出图片像素总数 {self.width * self.height}。"
            )
        y = index // self.width
        x = index % self.width
        return x, y

    def save_image(self, output_path: str):
        """
        将修改后的图片保存为 PNG 格式。

        Args:
            output_path (str): 输出图片的文件路径。

        Raises:
            IOError: 如果保存图片失败。
        """
        try:
            self.image.save(output_path, "PNG")
        except Exception as e:
            raise IOError(f"保存图片到 '{output_path}' 失败: {e}")

    def apply_alpha_from_rgb_average(self):
        """
        根据业务需求，修改每个像素的 alpha 值：alpha = (r + g + b) / 3。
        """
        for y in range(self.height):
            for x in range(self.width):
                r, g, b, _ = self.pixels[x, y]  # 获取当前像素的 R, G, B 值
                new_alpha = int((r + g + b) / 3)
                self.pixels[x, y] = (r, g, b, new_alpha)

    def apply_alpha_from_rgb_max(self):
        """
        根据业务需求，修改每个像素的 alpha 值：alpha = max(r,g , b)
        """
        for y in range(self.height):
            for x in range(self.width):
                r, g, b, _ = self.pixels[x, y]  # 获取当前像素的 R, G, B 值
                new_alpha = max(r, g, b)
                self.pixels[x, y] = (r, g, b, new_alpha)

    def apply_alpha_from_rgb_blend(self):
        """
        根据业务需求，修改每个像素的 alpha 值：alpha = max(r+b+g,1)
        """
        for y in range(self.height):
            for x in range(self.width):
                r, g, b, _ = self.pixels[x, y]  # 获取当前像素的 R, G, B 值
                new_alpha = min(r + g + b, 255)
                self.pixels[x, y] = (r, g, b, new_alpha)

    def apply_alpha_from_rgb_screen(self):
        """
        根据业务需求，修改每个像素的 alpha 值：alpha = max(r+b+g,1)
        """
        for y in range(self.height):
            for x in range(self.width):
                r, g, b, _ = self.pixels[x, y]  # 获取当前像素的 R, G, B 值
                new_alpha = self.screen(self.screen(r, g), b)
                self.pixels[x, y] = (r, g, b, new_alpha)

    def screen(self,a: int, b: int) -> int:
        return 1 - (1 - a) * (1 - b)


import os
from PIL import Image
