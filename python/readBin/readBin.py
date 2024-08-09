import time
from PIL import Image  # pip install pillow
import math

def read_binary_file(file_path):
    with open(file_path, "rb") as f:
        return f.read()

def create_image_from_binary_data(data):
    # 计算图像的尺寸，尽量使其接近正方形
    length = len(data)
    side = math.isqrt(length)
    
    if side * side < length:
        side += 1

    # 创建一个 RGB 图像
    img = Image.new('RGB', (side, side), "black")
    pixels = img.load()

    # 将二进制数据转换为图像像素
    for i in range(length):
        value = data[i]
        color = (value, 0, 0)  # 红色通道根据数据值设置
        if value==0:
            color=(64,255,64)
        x = i % side
        y = i // side
        pixels[x, y] = color

    return img

def main():
   
    start = time.time()

    file_path = "E:/mp3/111/output.wav"  # 替换为你的二进制文件路径
    print('start',file_path)
    data = read_binary_file(file_path)
    img = create_image_from_binary_data(data)
    img.show()  # 显示图像
    img.save("E:/out/output.png")  # 保存图像
    end = time.time()
    print('out time:',end-start)

main()