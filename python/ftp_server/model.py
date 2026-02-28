# -*- coding: utf-8 -*-
"""
WinFTP-Manager - Model 层
负责 FTP 服务器的生命周期（启动/停止）、权限逻辑处理及本机 IP 获取。
与 View 完全解耦，不依赖任何 GUI 组件。
"""

import os
import socket
import threading
from typing import Optional, Callable

from pyftpdlib.authorizers import DummyAuthorizer
from pyftpdlib.handlers import FTPHandler
from pyftpdlib.servers import FTPServer


# 默认 FTP 端口
DEFAULT_FTP_PORT = 2121


class GBKFTPHandler(FTPHandler):
    """
    针对 Windows 环境优化的 FTP 处理器。
    强制使用 gbk 编码，防止资源管理器及老旧 FTP 客户端乱码。
    """

    # encoding = "gbk"
    pass


class FtpServerModel:
    """
    FTP 服务器模型：管理服务生命周期、权限计算、本机 IP。
    """

    def __init__(self, port: int = DEFAULT_FTP_PORT):
        self._port = port
        self._server: Optional[FTPServer] = None
        self._thread: Optional[threading.Thread] = None
        self._lock = threading.Lock()

    @staticmethod
    def get_local_ip() -> str:
        """
        获取本机局域网 IP（用于在界面展示）。
        若获取失败则返回友好提示。
        """
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.settimeout(1.0)
            s.connect(("8.8.8.8", 80))
            ip = s.getsockname()[0]
            s.close()
            return ip
        except Exception:
            return "无法获取"

    def _build_perm(self, allow_upload: bool, allow_modify_delete: bool) -> str:
        """
        根据业务权限勾选构建 pyftpdlib 权限字符串。
        - 下载：固定为 elr（列表、进入目录、下载）
        - 上传：勾选时追加 mw（建目录、上传）
        - 修改/删除：勾选时追加 M（修改、删除）
        - 完全控制：perm="elradfmwMT"
        """
        perm = "elr"
        if allow_upload:
            perm += "mw"
        if allow_modify_delete:
            perm += "adMT"
        return perm

    def start_server(
        self,
        root_path: str,
        username: Optional[str],
        password: str = "",
        allow_upload: bool = False,
        allow_modify_delete: bool = False,
        on_error: Optional[Callable[[str], None]] = None,
    ) -> None:
        """
        在独立守护线程中启动 FTP 服务。
        :param root_path: 根目录路径
        :param username: 用户名，为空则仅匿名访问
        :param password: 用户密码（仅当 username 非空时生效）
        :param allow_upload: 是否允许上传
        :param allow_modify_delete: 是否允许修改/删除
        :param on_error: 出错时的回调，传入错误信息字符串
        """
        with self._lock:
            if self._server is not None:
                if on_error:
                    on_error("服务已在运行中")
                return

        root_path = os.path.abspath(root_path)
        if not os.path.isdir(root_path):
            if on_error:
                on_error(f"目录不存在: {root_path}")
            return

        perm = self._build_perm(allow_upload, allow_modify_delete)
        authorizer = DummyAuthorizer()

        if username and username.strip():
            # 指定用户名：添加具名用户；此时不再添加匿名用户
            authorizer.add_user(
                username.strip(),
                password if password is not None else "",
                root_path,
                perm=perm,
            )
        else:
            # 仅当用户名为空时允许匿名访问
            authorizer.add_anonymous(root_path, perm=perm)

        handler = GBKFTPHandler
        handler.authorizer = authorizer

        try:
            server = FTPServer(("0.0.0.0", self._port), handler)
        except OSError as e:
            if "10048" in str(e) or "Address already in use" in str(e):
                if on_error:
                    on_error(f"端口 {self._port} 已被占用，请更换或关闭占用程序")
            else:
                if on_error:
                    on_error(str(e))
            return

        def serve():
            try:
                server.serve_forever()
            except Exception as e:
                if on_error:
                    on_error(str(e))
            finally:
                try:
                    server.close_all()
                except Exception:
                    pass

        self._server = server
        self._thread = threading.Thread(target=serve, daemon=True)
        self._thread.start()

    def stop_server(self) -> None:
        """关闭 FTP 服务。"""
        with self._lock:
            if self._server is None:
                return
            try:
                self._server.close_all()
            except Exception:
                pass
            self._server = None
        self._thread = None

    def is_running(self) -> bool:
        """当前服务是否正在运行。"""
        with self._lock:
            return self._server is not None

    @property
    def port(self) -> int:
        return self._port
