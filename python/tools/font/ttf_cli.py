import argparse
import sys
from typing import Iterable

from font_filter import (
	filter_font_unicodes,
	make_predicate_from_rules,
	cjk_ideograph_ranges,
	cjk_all_ranges,
)


def parse_hex_range(range_text: str) -> tuple[int, int]:
	"""
	解析形如 "4E00-9FFF" 的十六进制范围（闭区间）。
	"""
	parts = range_text.split("-")
	if len(parts) != 2:
		raise argparse.ArgumentTypeError(
			f"无效的范围: {range_text}，应为形如 4E00-9FFF"
		)
	try:
		start = int(parts[0], 16)
		end = int(parts[1], 16)
		if start > end:
			raise ValueError
		return start, end
	except ValueError as exc:
		raise argparse.ArgumentTypeError(
			f"无效的范围: {range_text}，起止应为十六进制且 start<=end"
		) from exc

def parse_args(argv: list[str]) -> argparse.Namespace:
	parser = argparse.ArgumentParser(
		description=(
			"移除 TTF/OTF 中的中文字符并导出（支持自定义移除规则）。"
		)
	)
	parser.add_argument("input", help="输入 TTF/OTF 字体文件路径")
	parser.add_argument("output", help="输出 TTF/OTF/WOFF/WOFF2 文件路径")
	parser.add_argument(
		"--preset",
		choices=["cjk_ideographs", "cjk_all"],
		help=(
			"预设移除范围：cjk_ideographs=仅表意文字；cjk_all=含标点/兼容等"
		),
		default="cjk_ideographs",
	)
	parser.add_argument(
		"--remove-range",
		action="append",
		type=parse_hex_range,
		help=(
			"额外移除的 Unicode 十六进制范围（闭区间），可多次，例如 4E00-9FFF"
		),
	)
	parser.add_argument(
		"--remove-chars",
		help="额外移除的字符字面量，例如 \"中文，标点\"",
	)
	parser.add_argument(
		"--flavor",
		choices=["woff", "woff2"],
		help="输出格式（不选则保持原生 TTF/OTF）",
	)
	return parser.parse_args(argv)


def build_ranges_from_preset(preset: str) -> list[tuple[int, int]]:
	if preset == "cjk_all":
		return cjk_all_ranges()
	# 默认
	return cjk_ideograph_ranges()


def main(argv: list[str]) -> int:
	args = parse_args(argv)

	# 预设范围
	remove_ranges: list[tuple[int, int]] = build_ranges_from_preset(args.preset)

	# 额外范围
	if args.remove_range:
		remove_ranges.extend(args.remove_range)

	# 单点字符
	remove_points: list[int] = []
	if args.remove_chars:
		remove_points = [ord(ch) for ch in args.remove_chars]

	predicate = make_predicate_from_rules(
		remove_ranges=remove_ranges,
		remove_points=remove_points,
	)

	filter_font_unicodes(
		input_ttf_path=args.input,
		output_ttf_path=args.output,
		should_remove_codepoint=predicate,
		flavor=args.flavor,
	)

	return 0


if __name__ == "__main__":
	sys.exit(main(sys.argv[1:]))


