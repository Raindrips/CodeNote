from __future__ import annotations

from argparse import Namespace
from pathlib import Path

from models import CopyConfig, CopyRule, CopyStats, CopyProgress, OverwriteMode
from views.base_view import ICopyView


def _parse_patterns(value: str | None) -> list[str]:
    if not value:
        return []
    raw = value.replace(";", ",")
    parts = [p.strip() for p in raw.split(",")]
    return [p for p in parts if p]


class ConsoleView(ICopyView):
    def get_initial_config(self, cli_args: Namespace) -> CopyConfig | None:
        src = Path(cli_args.src) if getattr(cli_args, "src", None) else None
        dst = Path(cli_args.dst) if getattr(cli_args, "dst", None) else None
        include = _parse_patterns(getattr(cli_args, "include", None))
        exclude = _parse_patterns(getattr(cli_args, "exclude", None))
        overwrite: OverwriteMode | None = getattr(cli_args, "overwrite", None)

        if src is None:
            src_str = input("请输入源目录路径: ").strip()
            if not src_str:
                return None
            src = Path(src_str)

        if dst is None:
            dst_str = input("请输入目标目录路径: ").strip()
            if not dst_str:
                return None
            dst = Path(dst_str)

        if overwrite is None:
            print("请选择覆盖策略: 1=always(总是覆盖), 2=skip(已存在则跳过)")
            choice = input("输入 1 或 2 (默认 1): ").strip()
            if choice == "2":
                overwrite = "skip"
            else:
                overwrite = "always"

        rules = CopyRule(include_patterns=include, exclude_patterns=exclude)
        return CopyConfig(src_dir=src, dst_dir=dst, rules=rules, overwrite_mode=overwrite)

    def on_progress(self, progress: CopyProgress, stats: CopyStats) -> None:
        rel = progress.src_path
        status = "COPIED" if progress.copied else "SKIPPED"
        if progress.reason:
            status += f" ({progress.reason})"
        print(f"[{status}] {rel}")

    def show_summary(self, stats: CopyStats) -> None:
        print("\n=== 复制完成 ===")
        print(f"总文件数: {stats.total_files}")
        print(f"已复制:   {stats.copied_files}")
        print(f"已跳过:   {stats.skipped_files}")
        print(f"总字节数: {stats.total_bytes}")
        print(f"已复制字节数: {stats.copied_bytes}")

    def show_error(self, message: str) -> None:
        print(f"[ERROR] {message}")

