from __future__ import annotations

import argparse

from presenter import CopyPresenter
from services import FileCopyService
from views.console_view import ConsoleView
from views.gui_view import GuiView


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="递归复制文件（支持黑/白名单过滤）的工具")
    parser.add_argument(
        "--mode",
        choices=["console", "gui"],
        help="运行模式（console 或 gui），默认 gui",
    )
    parser.add_argument("--src", help="源目录路径")
    parser.add_argument("--dst", help="目标目录路径")
    parser.add_argument(
        "--include",
        help='白名单模式，使用 ; 或 , 分隔，如: "*.py;data/**/*.csv"',
    )
    parser.add_argument(
        "--exclude",
        help='黑名单模式，使用 ; 或 , 分隔，如: "*.log;__pycache__/**"',
    )
    parser.add_argument(
        "--overwrite",
        choices=["always", "skip"],
        help="覆盖策略：always=总是覆盖，skip=已存在则跳过",
    )
    return parser


def run_console(args: argparse.Namespace) -> None:
    view = ConsoleView()
    service = FileCopyService()
    presenter = CopyPresenter(view=view, service=service)
    presenter.run(args)


def run_gui(args: argparse.Namespace) -> None:  # noqa: ARG001
    import tkinter as tk

    root = tk.Tk()
    view = GuiView(root)
    service = FileCopyService()
    presenter = CopyPresenter(view=view, service=service)
    view.attach_presenter(presenter)
    root.mainloop()


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    mode = args.mode or "gui"
    if mode == "console":
        run_console(args)
    else:
        run_gui(args)


if __name__ == "__main__":
    main()

