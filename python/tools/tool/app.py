"""
gui/app.py — Tkinter GUI 统一入口
与 CLI 共享同一套工具，通过 output_callback 接管输出。
"""
import sys
import threading
import argparse
import tkinter as tk
from tkinter import ttk, scrolledtext, messagebox
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from core.base import registry, BaseTool


# ──────────────────────────────────────────────────────────────
# 参数表单生成器：把 argparse 动作变成 Tk 控件
# ──────────────────────────────────────────────────────────────
class ParamForm(tk.Frame):
    """根据工具的 ArgumentParser 自动生成参数输入表单"""

    SKIP = {"help", "_tool_cls"}  # 不渲染的内置参数

    def __init__(self, parent: tk.Widget, tool_cls: type[BaseTool]):
        super().__init__(parent, bg="#1e1e2e", padx=12, pady=8)
        self._vars: dict[str, tk.Variable] = {}
        self._tool_cls = tool_cls

        # 临时 parser，仅用于提取参数定义
        tmp_parser = argparse.ArgumentParser()
        tool_cls().build_parser(tmp_parser)

        for action in tmp_parser._actions:
            if action.dest in self.SKIP:
                continue
            self._build_row(action)

    def _build_row(self, action: argparse.Action) -> None:
        row = tk.Frame(self, bg="#1e1e2e")
        row.pack(fill="x", pady=3)

        label_text = action.dest.replace("_", " ").title()
        if action.help:
            label_text += f"  ({action.help})"

        tk.Label(
            row, text=label_text,
            bg="#1e1e2e", fg="#cdd6f4",
            font=("Consolas", 10), width=28, anchor="w",
        ).pack(side="left")

        # bool flag → Checkbutton
        if isinstance(action, argparse._StoreTrueAction):
            var = tk.BooleanVar(value=False)
            tk.Checkbutton(
                row, variable=var,
                bg="#1e1e2e", fg="#cdd6f4",
                selectcolor="#313244", activebackground="#1e1e2e",
            ).pack(side="left")
        elif isinstance(action, argparse._StoreFalseAction):
            var = tk.BooleanVar(value=True)
            tk.Checkbutton(
                row, variable=var,
                bg="#1e1e2e", fg="#cdd6f4",
                selectcolor="#313244", activebackground="#1e1e2e",
            ).pack(side="left")
        # choices → Combobox
        elif action.choices:
            var = tk.StringVar(
                value=str(action.default) if action.default is not None else action.choices[0]
            )
            ttk.Combobox(
                row, textvariable=var,
                values=[str(c) for c in action.choices],
                width=28, state="readonly",
            ).pack(side="left")
        # 其余 → Entry
        else:
            default = "" if action.default in (None, argparse.SUPPRESS) else str(action.default)
            var = tk.StringVar(value=default)
            tk.Entry(
                row, textvariable=var,
                bg="#313244", fg="#cdd6f4",
                insertbackground="#cdd6f4",
                relief="flat", font=("Consolas", 10), width=32,
            ).pack(side="left", padx=(4, 0))

        self._vars[action.dest] = var

    def build_namespace(self) -> argparse.Namespace:
        """把当前表单值组装成 argparse.Namespace"""
        ns = argparse.Namespace()
        for dest, var in self._vars.items():
            val = var.get()
            # 空字符串 → None
            setattr(ns, dest, val if val != "" else None)
        return ns


# ──────────────────────────────────────────────────────────────
# 主窗口
# ──────────────────────────────────────────────────────────────
ACCENT   = "#cba6f7"
BG_DARK  = "#1e1e2e"
BG_MID   = "#181825"
BG_PANEL = "#313244"
FG       = "#cdd6f4"
GREEN    = "#a6e3a1"
RED      = "#f38ba8"


class ToolkitApp(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("🛠  Python 工具集框架")
        self.geometry("1080x700")
        self.minsize(800, 500)
        self.configure(bg=BG_DARK)
        self._current_tool: type[BaseTool] | None = None
        self._form: ParamForm | None = None
        self._build_ui()
        self._refresh_tool_list()

    # ── UI 构建 ────────────────────────────────────────────────
    def _build_ui(self) -> None:
        # ── 顶部标题栏 ──────────────────────────────────────────
        header = tk.Frame(self, bg=BG_MID, height=48)
        header.pack(fill="x")
        tk.Label(
            header, text="⚙  Toolkit",
            bg=BG_MID, fg=ACCENT,
            font=("Consolas", 16, "bold"), pady=10,
        ).pack(side="left", padx=16)

        # ── 主体：左侧工具列表 + 右侧操作区 ────────────────────
        body = tk.PanedWindow(
            self, orient="horizontal",
            bg=BG_DARK, sashwidth=4, sashrelief="flat",
        )
        body.pack(fill="both", expand=True, pady=4)

        # 左：工具列表
        left = tk.Frame(body, bg=BG_MID, width=200)
        body.add(left, minsize=160)

        tk.Label(
            left, text="工具列表",
            bg=BG_MID, fg=ACCENT,
            font=("Consolas", 11, "bold"), pady=6,
        ).pack(fill="x", padx=8)

        self._listbox = tk.Listbox(
            left,
            bg=BG_MID, fg=FG,
            selectbackground=BG_PANEL, selectforeground=ACCENT,
            relief="flat", font=("Consolas", 11),
            activestyle="none", cursor="hand2",
        )
        self._listbox.pack(fill="both", expand=True, padx=4, pady=4)
        self._listbox.bind("<<ListboxSelect>>", self._on_tool_select)

        # 右：工具操作区
        right = tk.Frame(body, bg=BG_DARK)
        body.add(right, minsize=600)

        # 工具标题
        self._tool_label = tk.Label(
            right, text="← 请选择一个工具",
            bg=BG_DARK, fg=ACCENT,
            font=("Consolas", 13, "bold"), anchor="w", padx=12,
        )
        self._tool_label.pack(fill="x", pady=(8, 2))

        self._tool_desc = tk.Label(
            right, text="",
            bg=BG_DARK, fg="#6c7086",
            font=("Consolas", 10), anchor="w", padx=14,
        )
        self._tool_desc.pack(fill="x")

        ttk.Separator(right, orient="horizontal").pack(fill="x", padx=8, pady=6)

        # 参数表单容器（可滚动）
        form_canvas = tk.Canvas(right, bg=BG_DARK, height=220,
                                highlightthickness=0)
        form_canvas.pack(fill="x", padx=8)
        self._form_inner = tk.Frame(form_canvas, bg=BG_DARK)
        form_canvas.create_window((0, 0), window=self._form_inner, anchor="nw")

        # 运行按钮
        btn_row = tk.Frame(right, bg=BG_DARK)
        btn_row.pack(fill="x", padx=8, pady=6)

        self._run_btn = tk.Button(
            btn_row, text="▶  运行",
            bg=ACCENT, fg=BG_DARK,
            font=("Consolas", 11, "bold"),
            relief="flat", cursor="hand2", padx=18, pady=6,
            command=self._on_run,
        )
        self._run_btn.pack(side="left")

        tk.Button(
            btn_row, text="⌫  清空输出",
            bg=BG_PANEL, fg=FG,
            font=("Consolas", 10),
            relief="flat", cursor="hand2", padx=12, pady=6,
            command=self._clear_output,
        ).pack(side="left", padx=8)

        ttk.Separator(right, orient="horizontal").pack(fill="x", padx=8, pady=4)

        # 输出区
        tk.Label(
            right, text="输出",
            bg=BG_DARK, fg="#6c7086",
            font=("Consolas", 9), anchor="w",
        ).pack(fill="x", padx=12)

        self._output = scrolledtext.ScrolledText(
            right,
            bg=BG_MID, fg=GREEN,
            font=("Consolas", 10),
            relief="flat", wrap="word",
            state="disabled",
        )
        self._output.pack(fill="both", expand=True, padx=8, pady=(2, 8))

        # 状态栏
        self._status = tk.Label(
            self, text="就绪",
            bg=BG_MID, fg="#6c7086",
            font=("Consolas", 9), anchor="w", padx=10,
        )
        self._status.pack(fill="x", side="bottom")

    # ── 工具列表 ───────────────────────────────────────────────
    def _refresh_tool_list(self) -> None:
        self._listbox.delete(0, "end")
        for name in registry.names():
            m = registry.get(name).meta()
            self._listbox.insert("end", f"  {m.title or name}")
        # 存一份 name 列表供下标对应
        self._tool_names = registry.names()

    # ── 事件处理 ───────────────────────────────────────────────
    def _on_tool_select(self, _event=None) -> None:
        sel = self._listbox.curselection()
        if not sel:
            return
        idx = sel[0]
        tool_name = self._tool_names[idx]
        cls = registry.get(tool_name)
        if cls is None:
            return
        self._current_tool = cls
        m = cls.meta()
        self._tool_label.config(
            text=f"⚙  {m.title}  v{m.version}"
        )
        self._tool_desc.config(text=m.description)

        # 重建参数表单
        for w in self._form_inner.winfo_children():
            w.destroy()
        self._form = ParamForm(self._form_inner, cls)
        self._form.pack(fill="x")

    def _on_run(self) -> None:
        if self._current_tool is None:
            messagebox.showwarning("提示", "请先从左侧选择一个工具")
            return

        ns = self._form.build_namespace() if self._form else None
        if ns is None:
            ns = argparse.Namespace()

        self._run_btn.config(state="disabled", text="运行中…")
        self._status.config(text=f"正在运行: {self._current_tool.meta().name} …")
        self._append_output(f"\n{'─'*56}\n▶  {self._current_tool.meta().title}\n{'─'*56}\n")

        def worker():
            try:
                code = self._current_tool().run(ns, output_callback=self._append_output)
                result_text = f"\n[退出码: {code}]\n"
                self._append_output(result_text)
                status = "✓ 完成" if code == 0 else f"✗ 失败 (code={code})"
            except Exception as exc:
                self._append_output(f"\n[错误] {exc}\n")
                status = f"✗ 异常"
            finally:
                self.after(0, lambda: (
                    self._run_btn.config(state="normal", text="▶  运行"),
                    self._status.config(text=status),
                ))

        threading.Thread(target=worker, daemon=True).start()

    def _append_output(self, text: str) -> None:
        """线程安全地追加输出文本"""
        def _do():
            self._output.config(state="normal")
            self._output.insert("end", text + "\n")
            self._output.see("end")
            self._output.config(state="disabled")
        self.after(0, _do)

    def _clear_output(self) -> None:
        self._output.config(state="normal")
        self._output.delete("1.0", "end")
        self._output.config(state="disabled")


# ──────────────────────────────────────────────────────────────
def main() -> None:
    tools_dir = ROOT / "tools"
    registry.autodiscover(tools_dir)
    app = ToolkitApp()
    app.mainloop()


if __name__ == "__main__":
    main()
