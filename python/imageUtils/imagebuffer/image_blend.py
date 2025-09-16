from PIL import Image
import os
from image_processor import ImageProcessor

class ImageBlend(ImageProcessor):
    """
    提供图片像素遍历、修改和保存功能。
    """

    # 复用父类通用方法

    # 继承 get_dimensions

    # 继承 get_pixel_rgba_with_index

    # 继承 set_pixel_rgba

    # 继承 get_coords_from_index

    # 继承 save_image

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



