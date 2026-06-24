"""
core/base.py — 工具基类与插件注册中心
"""
from __future__ import annotations
import abc
import argparse
import importlib
import importlib.util
import pkgutil
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Callable


# ─────────────────────────────────────────────
# 工具元信息
# ─────────────────────────────────────────────
@dataclass
class ToolMeta:
    name: str                       # 工具唯一标识（CLI 子命令名）
    title: str                      # 展示名称
    description: str                # 简短描述
    version: str = "1.0.0"
    author: str = ""
    tags: list[str] = field(default_factory=list)


# ─────────────────────────────────────────────
# 工具基类
# ─────────────────────────────────────────────
class BaseTool(abc.ABC):
    """
    所有工具必须继承此类并实现三个方法：
      - meta()        → 返回工具元信息
      - build_parser()→ 配置 argparse（无需 add_subparsers）
      - run()         → 核心业务逻辑，接收 namespace 与回调
    """

    @classmethod
    @abc.abstractmethod
    def meta(cls) -> ToolMeta:
        """返回工具的元数据描述"""

    @abc.abstractmethod
    def build_parser(self, parser: argparse.ArgumentParser) -> None:
        """向 parser 添加本工具专属参数"""

    @abc.abstractmethod
    def run(self, args: argparse.Namespace,
            output_callback: Callable[[str], None] | None = None) -> int:
        """
        执行工具逻辑。
        output_callback: GUI/CLI 均通过此回调接收输出文本，
                         为 None 时直接 print()。
        返回值: 0 = 成功，非 0 = 失败
        """

    # ── 便捷方法 ──────────────────────────────
    def emit(self, text: str,
             output_callback: Callable[[str], None] | None = None) -> None:
        """统一输出：有回调走回调，否则 print"""
        if output_callback:
            output_callback(text)
        else:
            print(text)

    def parse_args(self, argv: list[str] | None = None) -> argparse.Namespace:
        """独立解析（不经过 ToolRegistry）"""
        parser = argparse.ArgumentParser(
            prog=self.meta().name,
            description=self.meta().description,
        )
        self.build_parser(parser)
        return parser.parse_args(argv)


# ─────────────────────────────────────────────
# 插件注册中心
# ─────────────────────────────────────────────
class ToolRegistry:
    """全局单例插件注册中心"""

    _instance: ToolRegistry | None = None
    _tools: dict[str, type[BaseTool]]

    def __new__(cls) -> ToolRegistry:
        if cls._instance is None:
            inst = super().__new__(cls)
            inst._tools = {}
            cls._instance = inst
        return cls._instance

    # ── 注册 ─────────────────────────────────
    def register(self, tool_cls: type[BaseTool]) -> type[BaseTool]:
        """可作装饰器使用：@registry.register"""
        name = tool_cls.meta().name
        if name in self._tools:
            raise ValueError(f"工具 '{name}' 已注册，请检查命名冲突")
        self._tools[name] = tool_cls
        return tool_cls

    # ── 自动发现 ──────────────────────────────
    def autodiscover(self, package_path: str | Path) -> None:
        """扫描指定包目录，自动导入所有 tool_*.py 模块"""
        package_path = Path(package_path)
        sys.path.insert(0, str(package_path.parent))
        pkg_name = package_path.name

        for finder, mod_name, _ in pkgutil.iter_modules([str(package_path)]):
            if mod_name.startswith("tool_"):
                full_name = f"{pkg_name}.{mod_name}"
                try:
                    importlib.import_module(full_name)
                except Exception as exc:
                    print(f"[警告] 加载工具模块 {full_name} 失败: {exc}",
                          file=sys.stderr)

    def load_module(self, path: str | Path) -> None:
        """按文件路径动态加载单个工具模块"""
        path = Path(path)
        spec = importlib.util.spec_from_file_location(path.stem, path)
        if spec and spec.loader:
            mod = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(mod)  # type: ignore[arg-type]

    # ── 查询 ─────────────────────────────────
    def get(self, name: str) -> type[BaseTool] | None:
        return self._tools.get(name)

    def all(self) -> dict[str, type[BaseTool]]:
        return dict(self._tools)

    def names(self) -> list[str]:
        return list(self._tools.keys())

    def __len__(self) -> int:
        return len(self._tools)


# 全局单例
registry = ToolRegistry()
