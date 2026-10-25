#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
文件拼接程序

用法:
    python concat_files.py ./file1 ./file2 ./file3 -o ./output
    python concat_files.py ./part_*.txt -o ./merged.txt
"""

import argparse
import os
import sys
import glob


def expand_files(file_patterns):
    """展开文件列表，支持通配符，并保持顺序"""
    files = []
    for pattern in file_patterns:
        # 如果包含通配符，则展开（按文件名排序以保证顺序）
        if any(c in pattern for c in "*?["):
            matched = sorted(glob.glob(pattern))
            if not matched:
                print(f"警告: 模式 '{pattern}' 未匹配到任何文件", file=sys.stderr)
            files.extend(matched)
        else:
            files.append(pattern)
    return files


def validate_files(files):
    """检查文件是否存在且可读"""
    valid = []
    for f in files:
        if not os.path.exists(f):
            print(f"警告: 文件不存在，已跳过 -> {f}", file=sys.stderr)
            continue
        if not os.path.isfile(f):
            print(f"警告: 不是普通文件，已跳过 -> {f}", file=sys.stderr)
            continue
        if not os.access(f, os.R_OK):
            print(f"警告: 文件不可读，已跳过 -> {f}", file=sys.stderr)
            continue
        valid.append(f)
    return valid


def concat_files(files, output, chunk_size=1024 * 1024):
    """按顺序将文件拼接为 output（二进制模式，保证内容不失真）"""
    total_size = sum(os.path.getsize(f) for f in files)
    written = 0

    with open(output, "wb") as out_f:
        for idx, path in enumerate(files, 1):
            size = os.path.getsize(path)
            print(f"[{idx}/{len(files)}] 拼接: {path} ({size} 字节)")

            with open(path, "rb") as in_f:
                while True:
                    chunk = in_f.read(chunk_size)
                    if not chunk:
                        break
                    out_f.write(chunk)
                    written += len(chunk)

            # 进度显示
            if total_size > 0:
                percent = written / total_size * 100
                print(f"    进度: {percent:6.2f}%")

    print(f"\n完成! 输出文件: {output}")
    print(f"总大小: {written} 字节，共拼接 {len(files)} 个文件")


def main():
    parser = argparse.ArgumentParser(
        description="按顺序拼接多个文件",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="示例:\n"
               "  python concat_files.py ./file1 ./file2 ./file3 -o ./file\n"
               "  python concat_files.py './part_*.txt' -o ./merged.txt",
    )
    parser.add_argument("files", nargs="+", help="要拼接的文件列表（支持通配符）")
    parser.add_argument("-o", "--output", required=True, help="输出文件路径")
    parser.add_argument(
        "-f", "--force", action="store_true", help="输出文件已存在时覆盖"
    )

    args = parser.parse_args()

    # 展开通配符并保持顺序
    files = expand_files(args.files)
    if not files:
        print("错误: 没有有效的输入文件", file=sys.stderr)
        sys.exit(1)

    # 校验
    files = validate_files(files)
    if not files:
        print("错误: 所有输入文件均无效", file=sys.stderr)
        sys.exit(1)

    # 防止输出文件与输入文件重名（覆盖输入）
    out_abs = os.path.abspath(args.output)
    for f in files:
        if os.path.abspath(f) == out_abs:
            print(f"错误: 输出文件 '{args.output}' 与输入文件重名", file=sys.stderr)
            sys.exit(1)

    # 输出文件已存在的处理
    if os.path.exists(args.output) and not args.force:
        print(f"错误: 输出文件 '{args.output}' 已存在，使用 -f 覆盖", file=sys.stderr)
        sys.exit(1)

    # 确保输出目录存在
    out_dir = os.path.dirname(os.path.abspath(args.output))
    os.makedirs(out_dir, exist_ok=True)

    print(f"将按以下顺序拼接 {len(files)} 个文件:")
    for i, f in enumerate(files, 1):
        print(f"  {i}. {f}")
    print()

    concat_files(files, args.output)


if __name__ == "__main__":
    main()