import os
import hashlib
import shutil


def get_all_files(root_dir):
    """递归获取所有文件路径"""
    all_files = []
    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            full_path = os.path.join(dirpath, filename)
            all_files.append(full_path)
    return all_files


def calculate_md5(file_path, chunk_size=8192):
    """计算文件的 MD5 值"""
    md5 = hashlib.md5()
    try:
        with open(file_path, "rb") as f:
            while chunk := f.read(chunk_size):
                md5.update(chunk)
        return md5.hexdigest()
    except Exception as e:
        print(f"❌ 无法读取文件: {file_path}, 错误: {e}")
        return None


def deduplicate_files(file_paths):
    """去重文件，返回唯一文件路径列表"""
    seen_hashes = {}
    unique_files = []
    for path in file_paths:
        file_hash = calculate_md5(path)
        if file_hash and file_hash not in seen_hashes:
            seen_hashes[file_hash] = path
            unique_files.append(path)
    return unique_files


def copy_files(file_paths, output_dir):
    """将文件复制到新目录，保持原始文件名"""
    os.makedirs(output_dir, exist_ok=True)
    for src_path in file_paths:
        filename = os.path.basename(src_path)
        dst_path = os.path.join(output_dir, filename)
        # 避免文件名冲突
        counter = 1
        while os.path.exists(dst_path):
            name, ext = os.path.splitext(filename)
            dst_path = os.path.join(output_dir, f"{name}_{counter}{ext}")
            counter += 1
        shutil.copy2(src_path, dst_path)


def main(input_dir, output_dir):
    """主函数：执行去重流程"""
    print("📁 正在扫描文件...")
    all_files = get_all_files(input_dir)
    print(f"🔍 共找到 {len(all_files)} 个文件")

    print("🧠 正在去重...")
    unique_files = deduplicate_files(all_files)
    print(f"✅ 去重后剩余 {len(unique_files)} 个文件")

    print("📦 正在复制文件到新目录...")
    copy_files(unique_files, output_dir)
    print(f"🎉 完成！文件已复制到: {output_dir}")


# 示例调用方式
if __name__ == "__main__":
    import sys

    if len(sys.argv) != 3:
        print("用法: python dedup.py <输入目录> <输出目录>")
    else:
        input_path = sys.argv[1]
        output_path = sys.argv[2]
        main(input_path, output_path)
