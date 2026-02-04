from PIL import Image

# 创建一个 48x48 的透明图像
img = Image.new("RGBA", (48, 48), (0, 0, 0, 0))

# 保存为 .ico 文件
img.save("empty_48x48.ico", format="ICO")
