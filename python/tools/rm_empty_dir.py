import os
import sys
import shutil


def delete_empty_folders(path):
    # 遍历目录下的所有子项
    for item in os.listdir(path):
        item_path = os.path.join(path, item)
        # 如果是目录，递归处理
        if os.path.isdir(item_path):
            delete_empty_folders(item_path)
    
    # 检查当前目录是否为空（没有文件和子目录）
    if not os.listdir(path):
        try:
            os.rmdir(path)
            # 获取系统回收站路径（Windows）
            # recycle_bin = os.path.join(os.environ['SYSTEMDRIVE'], '$RECYCLE.BIN')
            # 移动到回收站
            # shutil.move(path, recycle_bin)
            print(f"已删除空目录: {path}")
        except Exception as e:
            print(f"无法删除目录 {path}: {e}")

def main():
    # 检查命令行参数
    if len(sys.argv) != 2:
        print("使用方法: python main.py <dir_path>")
        return
    
    dir_path = sys.argv[1]
    
    # 检查路径是否存在且是目录
    if not os.path.exists(dir_path):
        print("错误: 路径不存在")
        return
    if not os.path.isdir(dir_path):
        print("错误: 指定的路径不是目录")
        return
    
    # 开始处理
    print(f"开始处理目录: {dir_path}")
    delete_empty_folders(dir_path)
    print("处理完成")

if __name__ == "__main__":
    main()


