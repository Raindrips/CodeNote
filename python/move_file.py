import os
import sys
import shutil


def copy_json_folders(src_root: str, out_root: str):
    """
    将:
        xxx/json/
    复制为:
        out/xxx/
    """

    if not os.path.isdir(src_root):
        raise FileNotFoundError(f"源目录不存在: {src_root}")

    os.makedirs(out_root, exist_ok=True)

    count = 0

    for name in os.listdir(src_root):
        parent_dir = os.path.join(src_root, name)

        if not os.path.isdir(parent_dir):
            continue

        json_dir = os.path.join(parent_dir, "json")

        if not os.path.isdir(json_dir):
            print(f"[跳过] 未找到 json 文件夹: {parent_dir}")
            continue

        dst_dir = os.path.join(out_root, name)

        if os.path.exists(dst_dir):
            print(f"[覆盖] {dst_dir}")
            shutil.rmtree(dst_dir)

        print(f"[复制] {json_dir}")
        print(f"      -> {dst_dir}")

        shutil.copytree(json_dir, dst_dir)

        count += 1

    print()
    print(f"完成，共复制 {count} 个 json 文件夹")


def main():
    if len(sys.argv) != 3:
        print("用法:")
        print("python main.py [源目录] [输出目录]")
        sys.exit(1)

    src_root = os.path.abspath(sys.argv[1])
    out_root = os.path.abspath(sys.argv[2])

    copy_json_folders(src_root, out_root)


if __name__ == "__main__":
    main()