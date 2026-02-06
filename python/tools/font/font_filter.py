from typing import Callable, Iterable, Set

from fontTools import subset


def filter_font_unicodes(
	input_ttf_path: str,
	output_ttf_path: str,
	should_remove_codepoint: Callable[[int], bool],
	*,
	flavor: str | None = None,
) -> None:
	"""
	根据传入的过滤规则函数 should_remove_codepoint(codepoint) 移除字体中的字符并导出。

	- input_ttf_path: 输入 TTF/OTF 文件路径
	- output_ttf_path: 输出 TTF/OTF 文件路径
	- should_remove_codepoint: 返回 True 表示该码位需要被移除
	- flavor: 可选，传入 "woff" 或 "woff2" 以导出相应格式；默认 None 表示 TTF/OTF
	"""
	# 读取字体
	options = subset.Options()
	if flavor:
		options.flavor = flavor

	font = subset.load_font(input_ttf_path, options)

	# 获取现有的 unicode 码位集合
	best_cmap = getattr(font, "getBestCmap", None)
	if best_cmap is None:
		# 兼容旧版本 API：通过 cmap 表构造
		cmap_table = font["cmap"]
		unicodes: Set[int] = set()
		for table in cmap_table.tables:
			if table.isUnicode():
				unicodes.update(table.cmap.keys())
	else:
		unicodes = set(font.getBestCmap().keys())

	# 计算保留的码位集合（移除 should_remove_codepoint 返回 True 的码位）
	keep_unicodes = {cp for cp in unicodes if not should_remove_codepoint(cp)}

	# 子集化
	subsetter = subset.Subsetter(options=options)
	subsetter.populate(unicodes=keep_unicodes)
	subsetter.subset(font)

	# 写出结果
	subset.save_font(font, output_ttf_path, options)


def make_predicate_from_rules(
	remove_ranges: Iterable[tuple[int, int]] | None = None,
	remove_points: Iterable[int] | None = None,
) -> Callable[[int], bool]:
	"""
	根据移除的范围与单点集合构造过滤函数。

	- remove_ranges: 形如 [(start, end), ...]，闭区间，包含两端
	- remove_points: 形如 [0x4E2D, 0x56FD, ...]
	"""
	remove_ranges = list(remove_ranges or [])
	remove_points = set(remove_points or [])

	def _predicate(codepoint: int) -> bool:
		if codepoint in remove_points:
			return True
		for start, end in remove_ranges:
			if start <= codepoint <= end:
				return True
		return False

	return _predicate


def cjk_ideograph_ranges() -> list[tuple[int, int]]:
	"""仅 CJK 统一表意文字（不含标点/部首/兼容等）。"""
	return [
		(0x3400, 0x4DBF),   # CJK Unified Ideographs Extension A
		(0x4E00, 0x9FFF),   # CJK Unified Ideographs
		(0x20000, 0x2A6DF), # Extension B
		(0x2A700, 0x2B73F), # Extension C
		(0x2B740, 0x2B81F), # Extension D
		(0x2B820, 0x2CEAF), # Extension E
		(0x2CEB0, 0x2EBEF), # Extension F
		(0x30000, 0x3134F), # Extension G
	]


def cjk_all_ranges() -> list[tuple[int, int]]:
	"""较广义的与中文相关的范围（含标点、兼容表意文字等）。"""
	ranges = cjk_ideograph_ranges()
	ranges.extend(
		[
			(0xF900, 0xFAFF),   # CJK Compatibility Ideographs
			(0x2F800, 0x2FA1F), # CJK Compatibility Ideographs Supplement
			(0x2E80, 0x2EFF),   # CJK Radicals Supplement
			(0x2F00, 0x2FDF),   # Kangxi Radicals
			(0x3000, 0x303F),   # CJK Symbols and Punctuation
		]
	)
	return ranges


