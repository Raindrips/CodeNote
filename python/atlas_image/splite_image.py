from PIL import Image
import os
import sys
from collections import deque

""" 
    可以拆分出间距小于0的图片
"""


def find_connected_components(image):
    """查找所有四邻域连通的非透明区域"""
    pixels = image.load()
    width, height = image.size
    visited = [[False for _ in range(height)] for _ in range(width)]
    components = []

    for x in range(width):
        for y in range(height):
            if pixels[x, y][3] > 0 and not visited[x][y]:
                queue = deque([(x, y)])
                visited[x][y] = True
                min_x = max_x = x
                min_y = max_y = y

                while queue:
                    cx, cy = queue.popleft()
                    for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                        nx, ny = cx + dx, cy + dy
                        if 0 <= nx < width and 0 <= ny < height:
                            if not visited[nx][ny] and pixels[nx, ny][3] > 0:
                                visited[nx][ny] = True
                                queue.append((nx, ny))
                                min_x = min(min_x, nx)
                                max_x = max(max_x, nx)
                                min_y = min(min_y, ny)
                                max_y = max(max_y, ny)
                components.append((min_x, min_y, max_x + 1, max_y + 1))
    return components


def split_image(input_path, output_dir):
    img = Image.open(input_path).convert("RGBA")
    components = find_connected_components(img)

    # 按从上到下，从左到右排序
    components.sort(key=lambda rect: (rect[1], rect[0]))

    # 计算需要补零的位数
    num = len(components)
    digits = len(str(num)) if num > 0 else 1

    for idx, (left, upper, right, lower) in enumerate(components):
        sub_img = img.crop((left, upper, right, lower))
        format_str = f"{{:0{digits}d}}.png"
        output_path = os.path.join(output_dir, format_str.format(idx))
        sub_img.save(output_path)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python splitter.py <input_image> <output_dir>")
        sys.exit(1)

    input_path = sys.argv[1]
    output_dir = sys.argv[2]

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    split_image(input_path, output_dir)
