"""
文件加密解密核心模块
提供加密和解密的核心功能，可以作为模块被其他程序导入使用
"""

import os
import hashlib
from typing import Union

class CryptoUtils:
    """加密解密工具类"""
    
    @staticmethod
    def generate_key_from_password(password: str, salt: bytes = None, key_length: int = 32) -> bytes:
        """
        从密码生成固定长度的密钥
        
        参数:
            password: 用户输入的密码
            salt: 盐值，如果为None则使用默认盐值
            key_length: 生成密钥的长度
            
        返回:
            生成的密钥字节序列
        """
        if salt is None:
            salt = b'default_salt_12345678'  # 默认盐值
        
        # 使用PBKDF2生成密钥
        key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000, key_length)
        return key
    
    @staticmethod
    def encrypt_data(data: bytes, key: bytes) -> bytes:
        """
        使用XOR加密数据
        
        参数:
            data: 要加密的原始数据
            key: 加密密钥
            
        返回:
            加密后的数据
        """
        if not data:
            return b''
        
        if not key:
            raise ValueError("密钥不能为空")
        
        encrypted_data = bytearray()
        key_length = len(key)
        
        for i, byte in enumerate(data):
            # 使用密钥循环进行XOR加密
            encrypted_byte = byte ^ key[i % key_length]
            encrypted_data.append(encrypted_byte)
        
        return bytes(encrypted_data)
    
    @staticmethod
    def decrypt_data(encrypted_data: bytes, key: bytes) -> bytes:
        """
        使用XOR解密数据
        
        参数:
            encrypted_data: 要解密的加密数据
            key: 解密密钥
            
        返回:
            解密后的原始数据
        """
        if not encrypted_data:
            return b''
        
        if not key:
            raise ValueError("密钥不能为空")
        
        # XOR加密和解密是相同的操作
        return CryptoUtils.encrypt_data(encrypted_data, key)
    
    @staticmethod
    def encrypt_file(input_file_path: str, output_file_path: str, key: bytes) -> bool:
        """
        加密文件
        
        参数:
            input_file_path: 输入文件路径
            output_file_path: 输出文件路径
            key: 加密密钥
            
        返回:
            加密是否成功
        """
        try:
            # 检查输入文件是否存在
            if not os.path.exists(input_file_path):
                raise FileNotFoundError(f"输入文件不存在: {input_file_path}")
            
            # 读取原始文件
            with open(input_file_path, 'rb') as input_file:
                data = input_file.read()
            
            # 加密数据
            encrypted_data = CryptoUtils.encrypt_data(data, key)
            
            # 写入加密文件
            with open(output_file_path, 'wb') as output_file:
                output_file.write(encrypted_data)
            
            return True
            
        except Exception as e:
            print(f"加密文件时出错: {e}")
            return False
    
    @staticmethod
    def decrypt_file(input_file_path: str, output_file_path: str, key: bytes) -> bool:
        """
        解密文件
        
        参数:
            input_file_path: 输入文件路径
            output_file_path: 输出文件路径
            key: 解密密钥
            
        返回:
            解密是否成功
        """
        try:
            # 检查输入文件是否存在
            if not os.path.exists(input_file_path):
                raise FileNotFoundError(f"输入文件不存在: {input_file_path}")
            
            # 读取加密文件
            with open(input_file_path, 'rb') as input_file:
                encrypted_data = input_file.read()
            
            # 解密数据
            decrypted_data = CryptoUtils.decrypt_data(encrypted_data, key)
            
            # 写入解密文件
            with open(output_file_path, 'wb') as output_file:
                output_file.write(decrypted_data)
            
            return True
            
        except Exception as e:
            print(f"解密文件时出错: {e}")
            return False
    
    @staticmethod
    def decrypt_file_to_data(input_file_path: str, key: bytes) -> Union[bytes, None]:
        """
        解密文件并将内容作为数据返回（不写入文件）
        
        参数:
            input_file_path: 输入文件路径
            key: 解密密钥
            
        返回:
            解密后的数据，如果失败返回None
        """
        try:
            # 检查输入文件是否存在
            if not os.path.exists(input_file_path):
                raise FileNotFoundError(f"输入文件不存在: {input_file_path}")
            
            # 读取加密文件
            with open(input_file_path, 'rb') as input_file:
                encrypted_data = input_file.read()
            
            # 解密数据并返回
            decrypted_data = CryptoUtils.decrypt_data(encrypted_data, key)
            return decrypted_data
            
        except Exception as e:
            print(f"解密文件时出错: {e}")
            return None
    
    @staticmethod
    def load_key_from_file(key_file_path: str) -> Union[bytes, None]:
        """
        从文件加载密钥
        
        参数:
            key_file_path: 密钥文件路径
            
        返回:
            密钥数据，如果失败返回None
        """
        try:
            if not os.path.exists(key_file_path):
                raise FileNotFoundError(f"密钥文件不存在: {key_file_path}")
            
            with open(key_file_path, 'rb') as key_file:
                key = key_file.read()
            
            if not key:
                raise ValueError("密钥文件为空")
            
            return key
            
        except Exception as e:
            print(f"加载密钥文件时出错: {e}")
            return None
    
    @staticmethod
    def save_key_to_file(key: bytes, key_file_path: str) -> bool:
        """
        将密钥保存到文件
        
        参数:
            key: 要保存的密钥
            key_file_path: 密钥文件路径
            
        返回:
            保存是否成功
        """
        try:
            with open(key_file_path, 'wb') as key_file:
                key_file.write(key)
            return True
            
        except Exception as e:
            print(f"保存密钥文件时出错: {e}")
            return False


# 便捷函数，用于直接调用
def encrypt_file(input_file: str, output_file: str, key_file: str) -> bool:
    """
    便捷的文件加密函数
    
    参数:
        input_file: 输入文件路径
        output_file: 输出文件路径
        key_file: 密钥文件路径
        
    返回:
        加密是否成功
    """
    key = CryptoUtils.load_key_from_file(key_file)
    if key is None:
        return False
    
    return CryptoUtils.encrypt_file(input_file, output_file, key)


def decrypt_file(input_file: str, output_file: str, key_file: str) -> bool:
    """
    便捷的文件解密函数
    
    参数:
        input_file: 输入文件路径
        output_file: 输出文件路径
        key_file: 密钥文件路径
        
    返回:
        解密是否成功
    """
    key = CryptoUtils.load_key_from_file(key_file)
    if key is None:
        return False
    
    return CryptoUtils.decrypt_file(input_file, output_file, key)


def decrypt_file_to_data(input_file: str, key_file: str) -> Union[bytes, None]:
    """
    便捷的文件解密到数据函数
    
    参数:
        input_file: 输入文件路径
        key_file: 密钥文件路径
        
    返回:
        解密后的数据，如果失败返回None
    """
    key = CryptoUtils.load_key_from_file(key_file)
    if key is None:
        return None
    
    return CryptoUtils.decrypt_file_to_data(input_file, key)


if __name__ == "__main__":
    # 测试代码
    print("加密解密核心模块测试")
    
    # 创建测试数据
    test_data = b"Hello, World! This is a test message for encryption."
    test_key = CryptoUtils.generate_key_from_password("test_password")
    
    # 测试数据加密解密
    encrypted = CryptoUtils.encrypt_data(test_data, test_key)
    decrypted = CryptoUtils.decrypt_data(encrypted, test_key)
    
    print(f"原始数据: {test_data}")
    print(f"加密数据: {encrypted.hex()}")
    print(f"解密数据: {decrypted}")
    print(f"解密成功: {test_data == decrypted}")
