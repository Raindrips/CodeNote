#!/usr/bin/env python3
"""遍历当前目录下的 JSON 文件，提取 client 字段并输出为新 JSON 文件。"""

import argparse
import json
import sys
from pathlib import Path


def extract_client(input_dir: Path, output_dir: Path) -> None:
    json_files = sorted(input_dir.glob("*.json"))

    if not json_files:
        print(f"目录中未找到 JSON 文件: {input_dir}")
        return

    output_dir.mkdir(parents=True, exist_ok=True)
    success_count = 0
    skip_count = 0

    for json_path in json_files:
        try:
            with json_path.open("r", encoding="utf-8") as f:
                data = json.load(f)
        except json.JSONDecodeError as e:
            print(f"[跳过] {json_path.name}: JSON 解析失败 - {e}")
            skip_count += 1
            continue

        if "client" not in data:
            print(f"[跳过] {json_path.name}: 未找到 client 字段")
            skip_count += 1
            continue

        output_path = output_dir / json_path.name
        with output_path.open("w", encoding="utf-8") as f:
            json.dump(data["client"], f, ensure_ascii=False, indent=4)
            f.write("\n")

        print(f"[完成] {json_path.name} -> {output_path}")
        success_count += 1

    print(f"\n处理完成: 成功 {success_count} 个, 跳过 {skip_count} 个")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="提取 JSON 文件中的 client 字段并输出为新 JSON 文件"
    )
    parser.add_argument(
        "-i",
        "--input",
        type=Path,
        default=Path("."),
        help="输入目录（默认: 当前目录）",
    )
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        default=Path("client"),
        help="输出目录（默认: client/）",
    )
    args = parser.parse_args()

    input_dir = args.input.resolve()
    if not input_dir.is_dir():
        print(f"错误: 输入目录不存在 - {input_dir}", file=sys.stderr)
        sys.exit(1)

    extract_client(input_dir, args.output.resolve())


if __name__ == "__main__":
    main()
