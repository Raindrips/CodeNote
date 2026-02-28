from __future__ import annotations

import threading
from argparse import Namespace
from pathlib import Path
from tkinter import Tk, StringVar, Text, END, ttk, filedialog, messagebox

from models import CopyConfig, CopyRule, CopyStats, CopyProgress, OverwriteMode
from views.base_view import ICopyView
from presenter import CopyPresenter


def _parse_patterns(text: str) -> list[str]:
    lines = [line.strip() for line in text.replace(";", "\n").splitlines()]
    return [line for line in lines if line]


class GuiView(ICopyView):
    def __init__(self, root: Tk) -> None:
        self.root = root
        self.src_var = StringVar()
        self.dst_var = StringVar()
        self.overwrite_var = StringVar(value="always")
        self.include_text: Text
        self.exclude_text: Text
        self.log_text: Text
        self.progress_bar: ttk.Progressbar
        self._presenter: CopyPresenter | None = None
        self._build_ui()

    def attach_presenter(self, presenter: CopyPresenter) -> None:
        self._presenter = presenter

    def _build_ui(self) -> None:
        self.root.title("文件复制工具 (MVP)")

        frame = ttk.Frame(self.root, padding=10)
        frame.grid(row=0, column=0, sticky="nsew")

        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)

        for i in range(6):
            frame.rowconfigure(i, weight=0)
        frame.rowconfigure(6, weight=1)
        frame.columnconfigure(1, weight=1)

        ttk.Label(frame, text="源目录:").grid(row=0, column=0, sticky="w")
        src_entry = ttk.Entry(frame, textvariable=self.src_var)
        src_entry.grid(row=0, column=1, sticky="ew")
        ttk.Button(frame, text="浏览...", command=self._choose_src).grid(row=0, column=2)

        ttk.Label(frame, text="目标目录:").grid(row=1, column=0, sticky="w")
        dst_entry = ttk.Entry(frame, textvariable=self.dst_var)
        dst_entry.grid(row=1, column=1, sticky="ew")
        ttk.Button(frame, text="浏览...", command=self._choose_dst).grid(row=1, column=2)

        ttk.Label(frame, text="白名单(include):").grid(row=2, column=0, sticky="nw")
        self.include_text = Text(frame, height=4, width=40)
        self.include_text.grid(row=2, column=1, columnspan=2, sticky="ew")

        ttk.Label(frame, text="黑名单(exclude):").grid(row=3, column=0, sticky="nw")
        self.exclude_text = Text(frame, height=4, width=40)
        self.exclude_text.grid(row=3, column=1, columnspan=2, sticky="ew")

        ttk.Label(frame, text="覆盖策略:").grid(row=4, column=0, sticky="w")
        overwrite_combo = ttk.Combobox(
            frame,
            textvariable=self.overwrite_var,
            values=["always", "skip"],
            state="readonly",
        )
        overwrite_combo.grid(row=4, column=1, sticky="w")

        ttk.Button(frame, text="开始复制", command=self._on_start_clicked).grid(
            row=5,
            column=0,
            columnspan=3,
            pady=5,
        )

        self.progress_bar = ttk.Progressbar(frame, mode="indeterminate")
        self.progress_bar.grid(row=6, column=0, columnspan=3, sticky="ew")

        self.log_text = Text(frame, height=10)
        self.log_text.grid(row=7, column=0, columnspan=3, sticky="nsew", pady=(5, 0))
        frame.rowconfigure(7, weight=1)

    def _choose_src(self) -> None:
        path = filedialog.askdirectory()
        if path:
            self.src_var.set(path)

    def _choose_dst(self) -> None:
        path = filedialog.askdirectory()
        if path:
            self.dst_var.set(path)

    def _on_start_clicked(self) -> None:
        if not self._presenter:
            messagebox.showerror("错误", "内部错误：Presenter 未初始化")
            return

        self.log_text.delete("1.0", END)
        self.progress_bar.start(10)

        cli_args = Namespace(src=None, dst=None, include=None, exclude=None, overwrite=None)

        def worker() -> None:
            try:
                self._presenter.run(cli_args)
            finally:
                self.root.after(0, self.progress_bar.stop)

        threading.Thread(target=worker, daemon=True).start()

    def get_initial_config(self, cli_args: Namespace) -> CopyConfig | None:  # noqa: ARG002
        src = Path(self.src_var.get().strip())
        dst = Path(self.dst_var.get().strip())
        if not src:
            messagebox.showerror("错误", "请先选择源目录")
            return None
        if not dst:
            messagebox.showerror("错误", "请先选择目标目录")
            return None

        include = _parse_patterns(self.include_text.get("1.0", END))
        exclude = _parse_patterns(self.exclude_text.get("1.0", END))
        overwrite: OverwriteMode = self.overwrite_var.get() or "always"

        rules = CopyRule(include_patterns=include, exclude_patterns=exclude)
        return CopyConfig(src_dir=src, dst_dir=dst, rules=rules, overwrite_mode=overwrite)

    def on_progress(self, progress: CopyProgress, stats: CopyStats) -> None:
        def _append() -> None:
            status = "COPIED" if progress.copied else "SKIPPED"
            if progress.reason:
                status += f" ({progress.reason})"
            self.log_text.insert(END, f"[{status}] {progress.src_path}\n")
            self.log_text.see(END)

        self.root.after(0, _append)

    def show_summary(self, stats: CopyStats) -> None:
        def _show() -> None:
            msg = (
                f"总文件数: {stats.total_files}\n"
                f"已复制: {stats.copied_files}\n"
                f"已跳过: {stats.skipped_files}\n"
            )
            messagebox.showinfo("复制完成", msg)

        self.root.after(0, _show)

    def show_error(self, message: str) -> None:
        def _show() -> None:
            messagebox.showerror("错误", message)

        self.root.after(0, _show)

