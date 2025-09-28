# image_processor.py
from PIL import Image, ImageFile
import os


class ImageProcessor:
    """
    提供图片的通用加载、像素访问与保存能力，供具体效果类继承。
    """

    image: ImageFile = None

    def __init__(self, image_path: str):
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"图片文件 '{image_path}' 不存在。")
        try:
            self.image = Image.open(image_path)
            # 保存原始格式信息
            self.original_format = self.image.format
            self.original_path = image_path
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

    def scale_image(self, scale: float):
        (x, y) = self.image.size  # read image size
        x_s = int(x * scale)  # define standard width
        y_s = int(y * scale)  # calc height based on standard width
        self.image.resize((x_s, y_s))  # resize image with high-quality

    def save_image(self, output_path: str):
        try:
            # 使用原始格式保存
            if hasattr(self, "original_format") and self.original_format:
                format_to_use = self.original_format
            else:
                # 从文件扩展名推断格式
                _, ext = os.path.splitext(output_path)
                format_to_use = ext[1:].upper() if ext else "PNG"

            # 如果原始格式不支持RGBA，转换为RGB
            if format_to_use in ["JPEG", "JPG"] and self.image.mode == "RGBA":
                # 创建黑色背景
                background = Image.new("RGB", self.image.size, (0, 0, 0))
                background.paste(
                    self.image, mask=self.image.split()[-1]
                )  # 使用alpha通道作为mask
                background.save(output_path, format=format_to_use)
            else:
                self.image.save(output_path, format=format_to_use)
        except Exception as e:
            raise IOError(f"保存图片到 '{output_path}' 失败: {e}")
