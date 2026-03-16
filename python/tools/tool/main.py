"""
cli/main.py — 命令行统一入口
用法：
  python -m cli.main <tool_name> [tool_args...]
  python -m cli.main list
  python -m cli.main info <tool_name>
"""
import argparse
import sys
from pathlib import Path

# 确保包根在 sys.path
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from core.base import registry


def build_root_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="toolkit",
        description="🛠  Python 工具集框架",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "示例:\n"
            "  toolkit list\n"
            "  toolkit info word_count\n"
            "  toolkit word_count --file README.md\n"
        ),
    )
    sub = parser.add_subparsers(dest="command", metavar="<command>")
    sub.add_parser("list", help="列出所有已注册工具")
    info_p = sub.add_parser("info", help="查看某个工具的详细信息")
    info_p.add_argument("tool", help="工具名称")
    return parser, sub


def cmd_list() -> None:
    tools = registry.all()
    if not tools:
        print("（暂无已注册工具）")
        return
    print(f"\n{'名称':<18} {'标题':<20} {'描述'}")
    print("─" * 72)
    for name, cls in tools.items():
        m = cls.meta()
        print(f"{name:<18} {m.title:<20} {m.description}")
    print()


def cmd_info(tool_name: str) -> None:
    cls = registry.get(tool_name)
    if cls is None:
        print(f"错误：找不到工具 '{tool_name}'", file=sys.stderr)
        sys.exit(1)
    m = cls.meta()
    print(f"\n  工具：  {m.name}")
    print(f"  标题：  {m.title}")
    print(f"  版本：  {m.version}")
    print(f"  作者：  {m.author or '—'}")
    print(f"  标签：  {', '.join(m.tags) or '—'}")
    print(f"  描述：  {m.description}\n")


def main(argv: list[str] | None = None) -> int:
    # 1. 自动发现 tools/ 目录下所有 tool_*.py
    tools_dir = ROOT / "tools"
    registry.autodiscover(tools_dir)

    root_parser, sub = build_root_parser()

    # 2. 动态为每个已注册工具添加子命令
    for name, cls in registry.all().items():
        tool_parser = sub.add_parser(name, help=cls.meta().description)
        cls().build_parser(tool_parser)
        tool_parser.set_defaults(_tool_cls=cls)

    # 3. 解析
    ns = root_parser.parse_args(argv)

    if ns.command is None:
        root_parser.print_help()
        return 0

    if ns.command == "list":
        cmd_list()
        return 0

    if ns.command == "info":
        cmd_info(ns.tool)
        return 0

    # 4. 运行对应工具
    tool_cls = getattr(ns, "_tool_cls", None)
    if tool_cls is None:
        print(f"未知命令: {ns.command}", file=sys.stderr)
        return 1

    return tool_cls().run(ns)


if __name__ == "__main__":
    sys.exit(main())
