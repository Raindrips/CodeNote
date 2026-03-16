"""
tools/tool_TEMPLATE.py — 新工具模板
复制此文件，替换 TEMPLATE 为你的工具名，填写 TODO 即可。
"""
import argparse
from typing import Callable

from core.base import BaseTool, ToolMeta, registry


@registry.register
class TemplateTool(BaseTool):

    @classmethod
    def meta(cls) -> ToolMeta:
        return ToolMeta(
            name="my_tool",             # TODO: 工具唯一 ID（用于 CLI 子命令）
            title="我的工具",            # TODO: 展示名称
            description="工具功能简介",  # TODO: 一句话描述
            version="1.0.0",
            author="你的名字",
            tags=["tag1", "tag2"],      # TODO: 分类标签
        )

    def build_parser(self, parser: argparse.ArgumentParser) -> None:
        # TODO: 添加你的参数
        parser.add_argument("--input",  "-i", help="输入内容")
        parser.add_argument("--output", "-o", help="输出文件路径（可选）")
        parser.add_argument("--verbose", "-v", action="store_true",
                            help="显示详细日志")

    def run(self, args: argparse.Namespace,
            output_callback: Callable[[str], None] | None = None) -> int:
        """
        核心逻辑。
        - 使用 self.emit(text, output_callback) 输出结果
        - 返回 0 表示成功，非 0 表示失败
        """
        # TODO: 实现你的工具逻辑
        verbose = getattr(args, "verbose", False)
        if verbose:
            self.emit("[DEBUG] 工具已启动", output_callback)

        input_val = getattr(args, "input", None) or "（无输入）"
        self.emit(f"处理输入: {input_val}", output_callback)

        # ── 如果要调用已有脚本，有两种方式：────────────────
        #
        # 方式 A：直接导入函数（推荐）
        #   from my_existing_script import process
        #   result = process(input_val)
        #
        # 方式 B：子进程调用
        #   import subprocess
        #   ret = subprocess.run(["python", "old_script.py", "--arg", input_val],
        #                        capture_output=True, text=True)
        #   self.emit(ret.stdout, output_callback)
        #   return ret.returncode
        # ────────────────────────────────────────────────────

        self.emit("✓ 完成", output_callback)
        return 0
