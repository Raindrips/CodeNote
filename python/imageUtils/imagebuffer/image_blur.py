# image_blur.py
from PIL import Image
import math
import os
from image_processor import ImageProcessor


class ImageBlur(ImageProcessor):
    """
    提供图片像素遍历、修改和保存功能。
    """

    # 复用父类的 __init__ 与通用方法

    # 复用父类的 get_dimensions/get_pixel_rgba_with_index/set_pixel_rgba/
    # get_coords_from_index/save_image

    def apply_blur(self, angle: float, distance: float, samples: int):
        """将图片进行 动态模糊 处理
        Args:
            angle (float): 模糊角度
            distance (float): 模糊强度/距离
            samples (int)采样次数
        """
        # 参数校验与快速返回
        if samples is None or samples <= 1 or distance is None or distance <= 0:
            return

        # 源图像用于读取，目标图像用于写入，避免读写同一缓冲导致串扰
        source_image = self.image
        src_pixels = source_image.load()
        output_image = Image.new("RGBA", (self.width, self.height))
        out_pixels = output_image.load()

        # 角度使用度输入，转为弧度
        rad = math.radians(angle)
        dir_x = math.cos(rad)
        dir_y = math.sin(rad)

        # 居中采样：从 -distance/2 到 +distance/2 均匀取样
        # 当 samples>1 时，步长如下；已在前面保证 samples>1
        half = distance * 0.5
        step = distance / (samples - 1)

        def bilinear_sample(px, py):
            # 边界外采用边缘像素（clamp）
            if px < 0:
                # px = 0
                return 0, 0, 0, 0
            elif px > self.width - 1:
                # px = self.width - 1
                return 0, 0, 0, 0
            if py < 0:
                # py = 0
                return 0, 0, 0, 0
            elif py > self.height - 1:
                # py = self.height - 1
                return 0, 0, 0, 0

            x0 = int(math.floor(px))
            y0 = int(math.floor(py))
            x1 = min(x0 + 1, self.width - 1)
            y1 = min(y0 + 1, self.height - 1)

            fx = px - x0
            fy = py - y0

            c00 = src_pixels[x0, y0]
            c10 = src_pixels[x1, y0]
            c01 = src_pixels[x0, y1]
            c11 = src_pixels[x1, y1]

            def lerp(a, b, t):
                return a + (b - a) * t

            r0 = lerp(c00[0], c10[0], fx)
            g0 = lerp(c00[1], c10[1], fx)
            b0 = lerp(c00[2], c10[2], fx)
            a0 = lerp(c00[3], c10[3], fx)

            r1 = lerp(c01[0], c11[0], fx)
            g1 = lerp(c01[1], c11[1], fx)
            b1 = lerp(c01[2], c11[2], fx)
            a1 = lerp(c01[3], c11[3], fx)

            r = lerp(r0, r1, fy)
            g = lerp(g0, g1, fy)
            b = lerp(b0, b1, fy)
            a = lerp(a0, a1, fy)

            return r, g, b, a

        # 主循环：对每个像素沿方向线段取样并求均值
        for y in range(self.height):
            for x in range(self.width):
                acc_r = 0.0
                acc_g = 0.0
                acc_b = 0.0
                acc_a = 0.0

                # 以居中为起点迭代样本
                for i in range(samples):
                    offset = -half + i * step
                    sx = x + dir_x * offset
                    sy = y + dir_y * offset
                    r, g, b, a = bilinear_sample(sx, sy)
                    acc_r += r
                    acc_g += g
                    acc_b += b
                    acc_a += a

                inv_n = 1.0 / samples
                r = int(max(0, min(255, round(acc_r * inv_n))))
                g = int(max(0, min(255, round(acc_g * inv_n))))
                b = int(max(0, min(255, round(acc_b * inv_n))))
                a = int(max(0, min(255, round(acc_a * inv_n))))
                out_pixels[x, y] = (r, g, b, a)

        # 将结果写回处理器
        self.image = output_image
        self.pixels = self.image.load()
