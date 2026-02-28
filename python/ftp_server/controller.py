# -*- coding: utf-8 -*-
"""
WinFTP-Manager - Controller 层
充当 View 与 Model 的纽带：处理 UI 事件，调用 Model 方法，更新 View 状态。
确保 View 与 Model 解耦，业务逻辑不写入 View。
"""

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from view import FtpManagerView
    from model import FtpServerModel

from model import FtpServerModel
from view import FtpManagerView


class FtpManagerController:
    """
    控制器：响应 View 的浏览、启停等事件，调用 Model 启停服务，并同步 View 显示。
    """

    def __init__(self, model: "FtpServerModel", view: "FtpManagerView"):
        self._model = model
        self._view = view
        self._bind_events()
        self._refresh_ip()

    def _bind_events(self) -> None:
        """
        MVC 事件绑定：将 View 的 UI 事件注册到 Controller 方法。
        View 不直接调用 Model，由 Controller 作为纽带转发。
        """
        self._view.register_on_browse(self._on_browse)
        self._view.register_on_toggle_server(self._on_toggle_server)

    def _refresh_ip(self) -> None:
        """从 Model 获取本机 IP 并更新到 View。"""
        ip = self._model.get_local_ip()
        self._view.set_ip(ip)

    def _on_browse(self) -> None:
        """
        Controller 响应 View 的「浏览」事件：仅操作 View 的对话框与文本框，
        不涉及 Model，保持 View 与 Model 解耦。
        """
        current = self._view.get_path()
        path = self._view.show_browse_dialog(initial_dir=current or None)
        if path:
            self._view.set_path(path)
            self._view.set_status(f"已选择: {path}")

    def _on_toggle_server(self) -> None:
        """
        MVC 核心交互：从 View 读取用户配置 → 调用 Model 启停服务 → 根据结果更新 View。
        业务逻辑（启停、权限）在 Model，界面状态在 View，Controller 只做协调。
        """
        if self._model.is_running():
            self._model.stop_server()
            self._view.set_running_ui(False)
            self._view.set_status("服务已关闭")
            return

        root_path = self._view.get_path()
        if not root_path:
            self._view.show_error("请先选择 FTP 根目录")
            return

        def on_error(msg: str) -> None:
            self._view.show_error(msg)
            self._view.set_running_ui(False)
            self._view.set_status("")

        self._model.start_server(
            root_path=root_path,
            username=self._view.get_username() or None,
            allow_upload=self._view.get_allow_upload(),
            allow_modify_delete=self._view.get_allow_modify_delete(),
            on_error=on_error,
        )

        if self._model.is_running():
            self._view.set_running_ui(True)
            self._view.set_status(
                f"服务已开启 — ftp://{self._model.get_local_ip()}:{self._model.port}"
            )


def create_app(port: int = 2121) -> None:
    """
    组装 MVC：创建 Model、View、Controller 并启动界面。
    """
    model = FtpServerModel(port=port)
    view = FtpManagerView(title="WinFTP-Manager")
    FtpManagerController(model, view)
    view.run()
