"""
tools/tool_json_fmt.py — 示例工具：JSON 格式化 / 验证
演示「整合已有命令行工具而不修改原始代码」的模式：
  将原始脚本作为子进程调用，或直接导入其函数。
"""
import argparse
import json
import subprocess
import sys
from pathlib import Path
from typing import Callable

from core.base import BaseTool, ToolMeta, registry


# ════════════════════════════════════════════════════════
# 假设这是「已有的旧脚本」的核心函数（原始代码，不修改）
# ════════════════════════════════════════════════════════
def _legacy_format_json(text: str, indent: int = 2,
                         sort_keys: bool = False) -> tuple[bool, str]:
    """原始业务逻辑（模拟已有代码）"""
    try:
        obj = json.loads(text)
        return True, json.dumps(obj, indent=indent,
                                sort_keys=sort_keys,
                                ensure_ascii=False)
    except json.JSONDecodeError as e:
        return False, f"JSON 解析失败: {e}"


# ════════════════════════════════════════════════════════
# 插件适配层
# ════════════════════════════════════════════════════════
@registry.register
class JsonFmtTool(BaseTool):

    @classmethod
    def meta(cls) -> ToolMeta:
        return ToolMeta(
            name="json_fmt",
            title="JSON 格式化",
            description="格式化或验证 JSON 文件/字符串",
            version="1.1.0",
            author="示例",
            tags=["json", "format", "validate"],
        )

    def build_parser(self, parser: argparse.ArgumentParser) -> None:
        src = parser.add_mutually_exclusive_group(required=False)
        src.add_argument("--file", "-f", metavar="PATH", help="JSON 文件路径")
        src.add_argument("--text", "-t", metavar="JSON",  help="JSON 字符串")
        parser.add_argument("--indent", type=int, default=2,
                            help="缩进空格数（默认 2）")
        parser.add_argument("--sort-keys", action="store_true",
                            help="按键名排序")
        parser.add_argument("--validate-only", action="store_true",
                            help="只验证，不输出格式化结果")

    def run(self, args: argparse.Namespace,
            output_callback: Callable[[str], None] | None = None) -> int:
        # 获取输入
        if getattr(args, "file", None):
            p = Path(args.file)
            if not p.exists():
                self.emit(f"错误：文件不存在 → {p}", output_callback)
                return 1
            raw = p.read_text(encoding="utf-8")
        elif getattr(args, "text", None):
            raw = args.text
        else:
            raw = '{"name":"toolkit","version":"1.0","features":["cli","gui","plugin"]}'

        indent    = getattr(args, "indent", 2) or 2
        sort_keys = getattr(args, "sort_keys", False)
        val_only  = getattr(args, "validate_only", False)

        # ── 调用原始（不修改）逻辑 ────────────────────────────
        ok, result = _legacy_format_json(raw, indent=indent,
                                         sort_keys=bool(sort_keys))

        if not ok:
            self.emit(result, output_callback)
            return 1

        if val_only:
            self.emit("✓ JSON 合法", output_callback)
        else:
            self.emit(result, output_callback)

        return 0
