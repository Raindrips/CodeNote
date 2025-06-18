# main.py
import os
from file_renamer import rename_files_by_count # 导入功能函数

def run_renamer_cli():
    """
    处理用户输入输出，执行文件批量重命名。
    """
    print("--- 文件批量重命名工具 ---")
    print("本工具将根据文件数量自动补齐编号位数。")

    directory = input("请输入要重命名文件的目录路径: ").strip()
    extension = input("请输入要重命名的文件扩展名 (例如: png, jpg, txt): ").strip()

    if not directory:
        print("错误: 目录路径不能为空。")
        return
    if not extension:
        print("错误: 文件扩展名不能为空。")
        return

    # 移除扩展名前的点号，以防用户输入 ".png"
    if extension.startswith('.'):
        extension = extension[1:]

    try:
        renamed_files = rename_files_by_count(directory, extension)
        if renamed_files:
            print("\n文件重命名成功！")
            for old_name, new_name in renamed_files:
                print(f"  '{old_name}' -> '{new_name}'")
            print(f"\n共重命名了 {len(renamed_files)} 个文件。")
        else:
            print("没有文件需要重命名或发生错误。") # 这种情况通常被异常捕获
    
    except FileNotFoundError as e:
        print(f"错误: {e}")
        print("请检查目录路径是否正确。")
    except ValueError as e:
        print(f"警告: {e}")
        print("请检查指定扩展名的文件是否存在。")
    except OSError as e:
        print(f"操作失败: {e}")
        print("请检查是否有权限访问文件或文件名是否有效。")
    except Exception as e:
        print(f"发生未知错误: {e}")

if __name__ == "__main__":
    run_renamer_cli()