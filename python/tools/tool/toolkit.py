#!/usr/bin/env python3
"""
toolkit — 统一入口
  python toolkit.py           → GUI 模式（若有 --cli 则 CLI 模式）
  python toolkit.py --cli ... → CLI 模式
  python toolkit.py --gui     → 强制 GUI 模式
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

def main():
    args = sys.argv[1:]

    # 强制 GUI
    if "--gui" in args:
        args.remove("--gui")
        from gui.app import main as gui_main
        gui_main()
        return

    # 强制 CLI 或有子命令
    if "--cli" in args or args:
        if "--cli" in args:
            args.remove("--cli")
        from cli.main import main as cli_main
        sys.exit(cli_main(args or None))
        return

    # 无参数：默认 GUI
    from gui.app import main as gui_main
    gui_main()


if __name__ == "__main__":
    main()
