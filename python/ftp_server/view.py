# -*- coding: utf-8 -*-
"""
WinFTP-Manager - View 层
负责 UI 布局、目录选择对话框、权限复选框及状态显示。
不包含业务逻辑，通过回调与 Controller 交互。
"""

import tkinter as tk
from tkinter import ttk, filedialog, messagebox
from typing import Optional, Callable


class FtpManagerView:
    """
    FTP 管理器界面：目录选择、用户名、权限勾选、本机 IP 显示、启停按钮。
    所有业务响应通过回调交给 Controller，View 与 Model 解耦。
    """

    def __init__(self, title: str = "WinFTP-Manager"):
        self._root = tk.Tk()
        self._root.title(title)
        self._root.resizable(True, True)
        self._root.minsize(420, 320)

        # 回调：由 Controller 注册
        self._on_browse: Optional[Callable[[], None]] = None
        self._on_toggle_server: Optional[Callable[[], None]] = None
        self._on_path_changed: Optional[Callable[[], None]] = None
        self._on_perm_changed: Optional[Callable[[], None]] = None

        self._build_ui()

    def _build_ui(self) -> None:
        main = ttk.Frame(self._root, padding=12)
        main.pack(fill=tk.BOTH, expand=True)

        # ---------- 目录选择 ----------
        ttk.Label(main, text="根目录:").grid(row=0, column=0, sticky=tk.W, pady=(0, 4))
        self._path_var = tk.StringVar(value="")
        path_entry = ttk.Entry(main, textvariable=self._path_var, width=40)
        path_entry.grid(row=1, column=0, sticky=tk.EW, pady=(0, 8))
        browse_btn = ttk.Button(main, text="浏览…", command=self._do_browse)
        browse_btn.grid(row=1, column=1, padx=(8, 0), pady=(0, 8))
        main.columnconfigure(0, weight=1)

        # ---------- 身份验证 ----------
        ttk.Label(main, text="用户名 (留空为匿名):").grid(row=2, column=0, sticky=tk.W, pady=(4, 4))
        self._username_var = tk.StringVar(value="")
        ttk.Entry(main, textvariable=self._username_var, width=30).grid(
            row=3, column=0, columnspan=2, sticky=tk.EW, pady=(0, 4)
        )
        ttk.Label(main, text="密码 (明文):").grid(row=4, column=0, sticky=tk.W, pady=(4, 4))
        self._password_var = tk.StringVar(value="")
        ttk.Entry(main, textvariable=self._password_var, width=30, show="").grid(
            row=5, column=0, columnspan=2, sticky=tk.EW, pady=(0, 8)
        )

        # ---------- 权限控制 ----------
        ttk.Label(main, text="权限:").grid(row=6, column=0, sticky=tk.W, pady=(4, 4))
        perm_frame = ttk.Frame(main)
        perm_frame.grid(row=7, column=0, columnspan=2, sticky=tk.W, pady=(0, 8))
        # 下载：默认选中且强制开启，禁用
        self._perm_download_var = tk.BooleanVar(value=True)
        cb_download = ttk.Checkbutton(
            perm_frame,
            text="下载 (elr)",
            variable=self._perm_download_var,
            state=tk.DISABLED,
        )
        cb_download.pack(side=tk.LEFT, padx=(0, 16))
        self._perm_upload_var = tk.BooleanVar(value=False)
        cb_upload = ttk.Checkbutton(
            perm_frame,
            text="上传 (mw)",
            variable=self._perm_upload_var,
            command=self._do_perm_changed,
        )
        cb_upload.pack(side=tk.LEFT, padx=(0, 16))
        self._perm_modify_var = tk.BooleanVar(value=False)
        ttk.Checkbutton(
            perm_frame,
            text="修改/删除 (adMT)",
            variable=self._perm_modify_var,
            command=self._do_perm_changed,
        ).pack(side=tk.LEFT)

        # ---------- 本机 IP ----------
        ip_frame = ttk.Frame(main)
        ip_frame.grid(row=8, column=0, columnspan=2, sticky=tk.W, pady=(4, 4))
        ttk.Label(ip_frame, text="本机局域网 IP:").pack(side=tk.LEFT)
        self._ip_value = ""
        self._ip_label = ttk.Label(ip_frame, text="--", font=("Consolas", 10))
        self._ip_label.pack(side=tk.LEFT, padx=(8, 0))
        self._ip_copy_btn = ttk.Button(ip_frame, text="复制", command=self._do_copy_ip)
        self._ip_copy_btn.pack(side=tk.LEFT, padx=(8, 0))

        # ---------- 状态信息 ----------
        self._status_var = tk.StringVar(value="")
        status_label = ttk.Label(main, textvariable=self._status_var, foreground="gray")
        status_label.grid(row=9, column=0, columnspan=2, sticky=tk.W, pady=(8, 4))

        # ---------- 运行控制按钮 ----------
        self._toggle_btn = tk.Button(
            main,
            text="开启服务",
            font=("Segoe UI", 11, "bold"),
            fg="#0a6b0a",
            bg="#c8e6c9",
            activeforeground="#0a6b0a",
            activebackground="#a5d6a7",
            relief=tk.FLAT,
            padx=24,
            pady=10,
            cursor="hand2",
            command=self._do_toggle,
        )
        self._toggle_btn.grid(row=10, column=0, columnspan=2, pady=(12, 0))

        # 路径输入框失去焦点时通知 Controller（用于运行中更新根目录）
        path_entry.bind("<FocusOut>", lambda e: self._on_path_changed and self._on_path_changed())

    def _do_browse(self) -> None:
        """用户点击「浏览」时触发，由 Controller 处理目录选择与回填。"""
        if self._on_browse:
            self._on_browse()

    def _do_toggle(self) -> None:
        """用户点击启停按钮时触发。"""
        if self._on_toggle_server:
            self._on_toggle_server()

    def _do_perm_changed(self) -> None:
        """权限勾选变更时触发，供 Controller 刷新服务器。"""
        if self._on_perm_changed:
            self._on_perm_changed()

    def _do_copy_ip(self) -> None:
        """将本机 IP 复制到剪贴板。"""
        if self._ip_value:
            self._root.clipboard_clear()
            self._root.clipboard_append(self._ip_value)
            self._root.update()
            self._status_var.set("已复制到剪贴板")

    def register_on_browse(self, callback: Callable[[], None]) -> None:
        self._on_browse = callback

    def register_on_toggle_server(self, callback: Callable[[], None]) -> None:
        self._on_toggle_server = callback

    def register_on_path_changed(self, callback: Callable[[], None]) -> None:
        self._on_path_changed = callback

    def register_on_perm_changed(self, callback: Callable[[], None]) -> None:
        self._on_perm_changed = callback

    def show_browse_dialog(self, initial_dir: Optional[str] = None) -> Optional[str]:
        """
        弹出系统目录选择对话框，返回用户选择的路径；取消则返回 None。
        """
        path = filedialog.askdirectory(
            parent=self._root,
            title="选择 FTP 根目录",
            initialdir=initial_dir or "",
        )
        return path if path else None

    def set_path(self, path: str) -> None:
        self._path_var.set(path)

    def get_path(self) -> str:
        return (self._path_var.get() or "").strip()

    def get_username(self) -> str:
        return (self._username_var.get() or "").strip()

    def get_password(self) -> str:
        return (self._password_var.get() or "").strip()

    def get_allow_upload(self) -> bool:
        return self._perm_upload_var.get()

    def get_allow_modify_delete(self) -> bool:
        return self._perm_modify_var.get()

    def set_ip(self, ip: str) -> None:
        self._ip_value = ip
        self._ip_label.config(text=ip)

    def get_ip(self) -> str:
        return self._ip_value

    def set_status(self, text: str) -> None:
        self._status_var.set(text)

    def set_running_ui(self, running: bool) -> None:
        """根据运行状态更新按钮文案与颜色。"""
        if running:
            self._toggle_btn.config(
                text="关闭服务",
                fg="#b71c1c",
                bg="#ffcdd2",
                activeforeground="#b71c1c",
                activebackground="#ef9a9a",
            )
        else:
            self._toggle_btn.config(
                text="开启服务",
                fg="#0a6b0a",
                bg="#c8e6c9",
                activeforeground="#0a6b0a",
                activebackground="#a5d6a7",
            )

    def show_error(self, message: str) -> None:
        """弹窗显示错误信息。"""
        messagebox.showerror("错误", message, parent=self._root)

    def run(self) -> None:
        self._root.mainloop()

    @property
    def root(self) -> tk.Tk:
        return self._root
