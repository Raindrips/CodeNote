# test_renamer.py
import os
import shutil
from file_renamer import rename_files_by_count # 导入功能函数

def create_test_files(directory: str, extension: str, count: int):
    """创建指定数量的测试文件。"""
    if os.path.exists(directory):
        shutil.rmtree(directory) # 清理旧的测试目录
    os.makedirs(directory)
    print(f"创建测试目录: {directory}")
    for i in range(count):
        filename = f"original_file_{i}.{extension}"
        filepath = os.path.join(directory, filename)
        with open(filepath, "w") as f:
            f.write(f"This is test content for {filename}")
        print(f"  创建文件: {filename}")

def clean_test_directory(directory: str):
    """删除测试目录及其内容。"""
    if os.path.exists(directory):
        shutil.rmtree(directory)
        print(f"已删除测试目录: {directory}")

def run_tests():
    """运行文件重命名功能的测试。"""
    print("--- 开始文件重命名功能测试 ---")

    test_dir = "temp_rename_test"
    test_ext = "txt"

    # --- 测试用例 1: 个位数文件 ---
    print("\n--- 测试用例 1: 个位数文件 (7个) ---")
    create_test_files(test_dir, test_ext, 7)
    try:
        results = rename_files_by_count(test_dir, test_ext)
        print("重命名结果:")
        for old, new in results:
            print(f"  '{old}' -> '{new}'")
        expected_names = [f"{i}.{test_ext}" for i in range(7)]
        actual_names = sorted(os.listdir(test_dir))
        assert actual_names == expected_names, f"测试失败: 预期 {expected_names}, 实际 {actual_names}"
        print("测试通过: 文件名格式正确。")
    except Exception as e:
        print(f"测试失败: 发生异常 - {e}")
    finally:
        clean_test_directory(test_dir)

    # --- 测试用例 2: 两位数文件 ---
    print("\n--- 测试用例 2: 两位数文件 (15个) ---")
    create_test_files(test_dir, test_ext, 15)
    try:
        results = rename_files_by_count(test_dir, test_ext)
        print("重命名结果:")
        for old, new in results:
            print(f"  '{old}' -> '{new}'")
        expected_names = [f"{i:02d}.{test_ext}" for i in range(15)]
        actual_names = sorted(os.listdir(test_dir))
        assert actual_names == expected_names, f"测试失败: 预期 {expected_names}, 实际 {actual_names}"
        print("测试通过: 文件名格式正确。")
    except Exception as e:
        print(f"测试失败: 发生异常 - {e}")
    finally:
        clean_test_directory(test_dir)

    # --- 测试用例 3: 三位数文件 ---
    print("\n--- 测试用例 3: 三位数文件 (105个) ---")
    create_test_files(test_dir, test_ext, 105)
    try:
        results = rename_files_by_count(test_dir, test_ext)
        print("重命名结果:")
        for old, new in results:
            print(f"  '{old}' -> '{new}'")
        expected_names = [f"{i:03d}.{test_ext}" for i in range(105)]
        actual_names = sorted(os.listdir(test_dir))
        assert actual_names == expected_names, f"测试失败: 预期 {expected_names}, 实际 {actual_names}"
        print("测试通过: 文件名格式正确。")
    except Exception as e:
        print(f"测试失败: 发生异常 - {e}")
    finally:
        clean_test_directory(test_dir)

    # --- 测试用例 4: 目录不存在 ---
    print("\n--- 测试用例 4: 目录不存在 ---")
    non_existent_dir = "non_existent_dir"
    try:
        rename_files_by_count(non_existent_dir, test_ext)
        print("测试失败: 预期抛出 FileNotFoundError，但没有。")
    except FileNotFoundError:
        print("测试通过: 成功捕获 FileNotFoundError。")
    except Exception as e:
        print(f"测试失败: 发生意外异常 - {e}")

    # --- 测试用例 5: 没有指定扩展名的文件 ---
    print("\n--- 测试用例 5: 没有指定扩展名的文件 ---")
    create_test_files(test_dir, "bak", 5) # 创建 .bak 文件
    try:
        rename_files_by_count(test_dir, test_ext) # 尝试重命名 .txt 文件
        print("测试失败: 预期抛出 ValueError，但没有。")
    except ValueError:
        print("测试通过: 成功捕获 ValueError。")
    except Exception as e:
        print(f"测试失败: 发生意外异常 - {e}")
    finally:
        clean_test_directory(test_dir)

    print("\n--- 文件重命名功能测试完成 ---")

if __name__ == "__main__":
    run_tests()