"""
tools/tool_sys_info.py — 示例工具：系统信息
演示「通过 subprocess 调用已有命令行工具」的模式。
完全不修改底层命令，只做参数组装与输出路由。
"""
import argparse
import os
import platform
import subprocess
import sys
from typing import Callable

from core.base import BaseTool, ToolMeta, registry


@registry.register
class SysInfoTool(BaseTool):

    @classmethod
    def meta(cls) -> ToolMeta:
        return ToolMeta(
            name="sys_info",
            title="系统信息",
            description="显示系统/Python 环境信息，或调用外部命令获取信息",
            version="1.0.0",
            author="示例",
            tags=["system", "info", "debug"],
        )

    def build_parser(self, parser: argparse.ArgumentParser) -> None:
        parser.add_argument(
            "--mode", choices=["python", "os", "pip", "custom"],
            default="python", help="信息来源模式（默认 python）",
        )
        parser.add_argument(
            "--cmd", metavar="CMD",
            help="自定义命令（mode=custom 时使用）",
        )

    def run(self, args: argparse.Namespace,
            output_callback: Callable[[str], None] | None = None) -> int:
        mode = getattr(args, "mode", "python") or "python"

        if mode == "python":
            return self._show_python_info(output_callback)
        elif mode == "os":
            return self._show_os_info(output_callback)
        elif mode == "pip":
            return self._run_subprocess(
                [sys.executable, "-m", "pip", "list"],
                output_callback,
            )
        elif mode == "custom":
            cmd = getattr(args, "cmd", None)
            if not cmd:
                self.emit("错误：--mode custom 需配合 --cmd 指定命令", output_callback)
                return 1
            return self._run_subprocess(cmd.split(), output_callback)
        return 0

    # ── 子功能 ────────────────────────────────────────────────
    def _show_python_info(self, cb) -> int:
        import sysconfig
        info = {
            "Python 版本":    platform.python_version(),
            "实现":           platform.python_implementation(),
            "可执行文件":      sys.executable,
            "平台":           sys.platform,
            "架构":           platform.machine(),
            "编译器":         platform.python_compiler(),
        }
        for k, v in info.items():
            self.emit(f"{k:<16}: {v}", cb)
        return 0

    def _show_os_info(self, cb) -> int:
        info = {
            "操作系统":   platform.system(),
            "版本":       platform.version(),
            "发行版":     platform.release(),
            "主机名":     platform.node(),
            "CPU 核心":   str(os.cpu_count()),
        }
        for k, v in info.items():
            self.emit(f"{k:<12}: {v}", cb)
        return 0

    def _run_subprocess(self, cmd: list[str], cb) -> int:
        """包装外部命令：把 stdout/stderr 路由到 output_callback"""
        self.emit(f"$ {' '.join(cmd)}", cb)
        try:
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=30,
            )
            if result.stdout:
                self.emit(result.stdout.rstrip(), cb)
            if result.stderr:
                self.emit(result.stderr.rstrip(), cb)
            return result.returncode
        except FileNotFoundError:
            self.emit(f"错误：命令未找到 → {cmd[0]}", cb)
            return 127
        except subprocess.TimeoutExpired:
            self.emit("错误：命令执行超时", cb)
            return 124
