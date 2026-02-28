# -*- coding: utf-8 -*-
"""
WinFTP-Manager 入口
基于 MVC 架构的 FTP 服务器管理器，使用 pyftpdlib 提供 FTP 服务，tkinter 提供 GUI。
"""

from controller import create_app

# 默认端口，与 model 中 DEFAULT_FTP_PORT 一致
DEFAULT_PORT = 2121


def main() -> None:
    create_app(port=DEFAULT_PORT)


if __name__ == "__main__":
    main()
