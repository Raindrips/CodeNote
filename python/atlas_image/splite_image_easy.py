from PIL import Image
import os
import sys

def is_transparent_row(im, y, width):
    """检查一行是否全为透明像素"""
    return all(im.getpixel((x, y))[3] == 0 for x in range(width))

def is_transparent_col(im, x, height):
    """检查一列是否全为透明像素"""
    return all(im.getpixel((x, y))[3] == 0 for y in range(height))

def find_grid(im):
    """
    扫描图片，找到透明行/列，确定网格边界
    返回：水平分割点列表，垂直分割点列表
    """
    width, height = im.size
    h_splits = [0]  # 水平分割点
    v_splits = [0]  # 垂直分割点
    
    # 扫描透明行
    for y in range(height):
        if is_transparent_row(im, y, width):
            if y > h_splits[-1]:  # 确保不重复添加
                h_splits.append(y)
    h_splits.append(height)  # 添加图片底部边界
    
    # 扫描透明列
    for x in range(width):
        if is_transparent_col(im, x, height):
            if x > v_splits[-1]:
                v_splits.append(x)
    v_splits.append(width)  # 添加图片右侧边界
    
    return h_splits, v_splits

def split_sprite_sheet(input_path, output_folder):
    """
    自动分割精灵表，基于透明像素间距
    :param input_path: 输入精灵表图片路径
    :param output_folder: 保存拆分图片的输出文件夹路径
    """
    try:
        # 加载图片并转换为RGBA以支持透明通道
        im = Image.open(input_path).convert('RGBA')
    except Exception as e:
        print(f"错误：无法打开图片 - {e}")
        sys.exit(1)
    
    # 创建输出文件夹
    os.makedirs(output_folder, exist_ok=True)
    
    # 找到网格分割点
    h_splits, v_splits = find_grid(im)
    
    # 计算子图片数量
    rows = len(h_splits) - 1
    cols = len(v_splits) - 1
    N = 0  # 实际有效子图片数量
    boxes = []
    
    # 遍历网格，提取非空子图片
    for i in range(rows - 1):
        for j in range(cols - 1):
            x1, y1 = v_splits[j], h_splits[i]
            x2, y2 = v_splits[j + 1], h_splits[i + 1]
            # 检查区域是否包含非透明像素
            sub_im = im.crop((x1, y1, x2, y2))
            pixels = sub_im.getdata()
            if any(pixel[3] > 0 for pixel in pixels):  # 有非透明像素
                boxes.append((x1, y1, x2, y2))
                N += 1
    
    if N == 0:
        print("错误：未检测到有效子图片")
        sys.exit(1)
    
    # 确定命名位数
    D = max(1, len(str(N)))
    
    # 裁剪并保存子图片
    for i, (x1, y1, x2, y2) in enumerate(boxes):
        sub_im = im.crop((x1, y1, x2, y2))
        filename = f"{i:0{D}d}.png"
        sub_im.save(os.path.join(output_folder, filename))
        print(f"已保存 {filename}")
    
    print(f"共保存 {N} 张图片到 {output_folder}")

if __name__ == "__main__":
    # 检查命令行参数
    if len(sys.argv) != 3:
        print("用法：python sprite_splitter.py <输入图片> <输出文件夹>")
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_folder = sys.argv[2]
    split_sprite_sheet(input_path, output_folder)