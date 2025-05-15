from PIL import Image
import os
import sys

def split_sprite_sheet(input_path, output_folder, cell_width, cell_height):
    """
    将精灵表拆分为单独图片，基于规则网格。
    
    :param input_path: 输入精灵表图片路径
    :param output_folder: 保存拆分图片的输出文件夹路径
    :param cell_width: 每个单元格（单独图片）的像素宽度
    :param cell_height: 每个单元格（单独图片）的像素高度
    """
    # 加载输入图片
    try:
        im = Image.open(input_path)
    except Exception as e:
        print(f"错误：无法打开图片 - {e}")
        sys.exit(1)
    
    # 获取图片尺寸
    IW, IH = im.size
    
    # 检查图片尺寸是否可被单元格尺寸整除
    if IW % cell_width != 0 or IH % cell_height != 0:
        print("错误：图片尺寸不可被指定的单元格尺寸整除。")
        sys.exit(1)
    
    # 计算列数和行数
    C = IW // cell_width
    R = IH // cell_height
    N = R * C  # 总图片数量
    
    # 确定命名所需的数字位数
    D = len(str(N))
    
    # 如果输出文件夹不存在，则创建
    os.makedirs(output_folder, exist_ok=True)
    
    # 拆分并保存每个子图片
    for i in range(N):
        row = i // C
        col = i % C
        x = col * cell_width
        y = row * cell_height
        
        # 提取子图片
        sub_im = im.crop((x, y, x + cell_width, y + cell_height))
        
        # 生成带前导零的文件名
        filename = f"{i:0{D}d}.png"
        
        # 保存子图片
        sub_im.save(os.path.join(output_folder, filename))
        print(f"已保存 {filename}")

if __name__ == "__main__":
    # 检查命令行参数
    if len(sys.argv) != 5:
        print("用法：python script.py <输入图片> <输出文件夹> <单元格宽度> <单元格高度>")
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_folder = sys.argv[2]
    
    try:
        cell_width = int(sys.argv[3])
        cell_height = int(sys.argv[4])
    except ValueError:
        print("错误：单元格宽度和高度必须为整数。")
        sys.exit(1)
    
    # 调用拆分函数
    split_sprite_sheet(input_path, output_folder, cell_width, cell_height)