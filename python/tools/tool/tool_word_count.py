"""
tools/tool_word_count.py — 示例工具：文本统计
演示如何包装一个现有的文本处理脚本。
"""
import argparse
import re
from pathlib import Path
from typing import Callable

from core.base import BaseTool, ToolMeta, registry


@registry.register
class WordCountTool(BaseTool):

    @classmethod
    def meta(cls) -> ToolMeta:
        return ToolMeta(
            name="word_count",
            title="文本统计",
            description="统计文件或文本的字数、行数、字符数",
            version="1.0.0",
            author="示例",
            tags=["text", "stats"],
        )

    def build_parser(self, parser: argparse.ArgumentParser) -> None:
        src = parser.add_mutually_exclusive_group(required=False)
        src.add_argument("--file", "-f", metavar="PATH", help="输入文件路径")
        src.add_argument("--text", "-t", metavar="TEXT", help="直接输入文本")
        parser.add_argument(
            "--format", choices=["plain", "table"], default="plain",
            help="输出格式（默认 plain）",
        )

    def run(self, args: argparse.Namespace,
            output_callback: Callable[[str], None] | None = None) -> int:
        # ── 获取原始文本 ──────────────────────────────────────
        if getattr(args, "file", None):
            p = Path(args.file)
            if not p.exists():
                self.emit(f"错误：文件不存在 → {p}", output_callback)
                return 1
            content = p.read_text(encoding="utf-8", errors="replace")
        elif getattr(args, "text", None):
            content = args.text
        else:
            content = "Hello World!\n这是一段示例文本，用于演示工具框架。\nLine 3."

        # ── 统计 ──────────────────────────────────────────────
        lines  = content.splitlines()
        chars  = len(content)
        words  = len(re.findall(r"\S+", content))
        zh     = len(re.findall(r"[\u4e00-\u9fff]", content))

        fmt = getattr(args, "format", "plain")
        if fmt == "table":
            self.emit("┌──────────┬────────┐", output_callback)
            self.emit(f"│ {'行数':<8} │ {len(lines):>6} │", output_callback)
            self.emit(f"│ {'词/单词':<8} │ {words:>6} │", output_callback)
            self.emit(f"│ {'字符数':<8} │ {chars:>6} │", output_callback)
            self.emit(f"│ {'中文字数':<8} │ {zh:>6} │", output_callback)
            self.emit("└──────────┴────────┘", output_callback)
        else:
            self.emit(f"行数:   {len(lines)}", output_callback)
            self.emit(f"词数:   {words}", output_callback)
            self.emit(f"字符数: {chars}", output_callback)
            self.emit(f"中文字: {zh}", output_callback)

        return 0
