# pip install pyftpdlib

from pyftpdlib.authorizers import DummyAuthorizer
from pyftpdlib.handlers import FTPHandler
from pyftpdlib.servers import FTPServer


def start_ftp_server():
    path="E:/"
    # 创建一个用户认证系统
    authorizer = DummyAuthorizer()

    # 添加用户 (用户名, 密码, 目录, 权限)
    authorizer.add_user("user", "12345", path, perm="elradfmw")  # 拥有所有权限
    authorizer.add_anonymous(path, perm="elradfmw")  # 匿名用户

    # 创建一个FTP处理器
    handler = FTPHandler
    handler.authorizer = authorizer

    # 创建并启动FTP服务器
    server = FTPServer(("0.0.0.0", 2121), handler)
    print("Starting FTP server on 0.0.0.0:2121...")
    server.serve_forever()

if __name__ == "__main__":
    start_ftp_server()