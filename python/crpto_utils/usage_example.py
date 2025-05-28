#!/usr/bin/env python3
"""
使用示例和测试脚本
演示如何作为模块使用加密解密功能
"""

import os
from crypto_utils import CryptoUtils, encrypt_file, decrypt_file, decrypt_file_to_data

def create_test_files():
    """创建测试文件"""
    print("=== 创建测试文件 ===")
    
    # 创建测试文件
    test_content = """这是一个测试文件。
This is a test file.
包含中文和英文内容。
Contains both Chinese and English content.

一些数字: 12345
Some numbers: 67890

特殊字符: !@#$%^&*()
Special characters: <>?:"{}[]
"""
    
    with open('test_file.txt', 'w', encoding='utf-8') as f:
        f.write(test_content)
    
    print("测试文件 'test_file.txt' 已创建")
    
    # 创建密钥文件
    password = "my_secret_password_123"
    key = CryptoUtils.generate_key_from_password(password)
    CryptoUtils.save_key_to_file(key, 'test.key')
    
    print("密钥文件 'test.key' 已创建")
    print(f"密钥长度: {len(key)} 字节")

def test_command_line_style():
    """测试命令行风格的使用方法"""
    print("\n=== 测试命令行风格使用 ===")
    
    # 使用便捷函数进行加密
    print("正在加密文件...")
    success = encrypt_file('test_file.txt', 'encrypted_file.bin', 'test.key')
    if success:
        print("加密成功!")
        print(f"加密文件大小: {os.path.getsize('encrypted_file.bin')} 字节")
    else:
        print("加密失败!")
        return
    
    # 使用便捷函数进行解密
    print("\n正在解密文件...")
    success = decrypt_file('encrypted_file.bin', 'decrypted_file.txt', 'test.key')
    if success:
        print("解密成功!")
        print(f"解密文件大小: {os.path.getsize('decrypted_file.txt')} 字节")
        
        # 验证内容是否一致
        with open('test_file.txt', 'r', encoding='utf-8') as f:
            original = f.read()
        with open('decrypted_file.txt', 'r', encoding='utf-8') as f:
            decrypted = f.read()
        
        if original == decrypted:
            print("✓ 解密内容与原文件完全一致!")
        else:
            print("✗ 解密内容与原文件不一致!")
    else:
        print("解密失败!")

def test_data_return_style():
    """测试返回数据风格的使用方法"""
    print("\n=== 测试返回数据风格使用 ===")
    
    # 解密文件并返回数据（不保存到文件）
    print("正在解密文件到内存...")
    decrypted_data = decrypt_file_to_data('encrypted_file.bin', 'test.key')
    
    if decrypted_data is not None:
        print(f"解密成功! 数据长度: {len(decrypted_data)} 字节")
        
        # 将数据转换为字符串并显示
        try:
            content = decrypted_data.decode('utf-8')
            print("\n=== 解密内容预览 ===")
            lines = content.split('\n')
            for i, line in enumerate(lines[:5]):  # 只显示前5行
                print(f"{i+1}: {line}")
            if len(lines) > 5:
                print("...")
        except UnicodeDecodeError:
            print("解密的数据不是文本格式")
    else:
        print("解密失败!")

def test_module_usage():
    """测试作为模块使用的方法"""
    print("\n=== 测试模块化使用 ===")
    
    # 直接使用CryptoUtils类
    key = CryptoUtils.load_key_from_file('test.key')
    if key is None:
        print("无法加载密钥")
        return
    
    # 加密一些数据
    test_data = "这是要加密的数据 This is data to encrypt 123!@#".encode('utf-8')
    print(f"原始数据: {test_data}")
    
    encrypted_data = CryptoUtils.encrypt_data(test_data, key)
    print(f"加密数据 (hex): {encrypted_data.hex()}")
    
    decrypted_data = CryptoUtils.decrypt_data(encrypted_data, key)
    print(f"解密数据: {decrypted_data}")
    
    # 验证
    if test_data == decrypted_data:
        print("✓ 数据加密解密验证成功!")
    else:
        print("✗ 数据加密解密验证失败!")

def test_different_file_types():
    """测试不同类型的文件"""
    print("\n=== 测试不同文件类型 ===")
    
    # 创建二进制测试文件
    binary_data = bytes(range(256))  # 包含所有可能的字节值
    with open('test_binary.bin', 'wb') as f:
        f.write(binary_data)
    
    print("创建了二进制测试文件")
    
    # 加密二进制文件
    success = encrypt_file('test_binary.bin', 'encrypted_binary.bin', 'test.key')
    if success:
        print("二进制文件加密成功")
        
        # 解密并返回数据
        decrypted_data = decrypt_file_to_data('encrypted_binary.bin', 'test.key')
        if decrypted_data is not None and decrypted_data == binary_data:
            print("✓ 二进制文件加密解密验证成功!")
        else:
            print("✗ 二进制文件加密解密验证失败!")
    else:
        print("二进制文件加密失败")

def cleanup_test_files():
    """清理测试文件"""
    print("\n=== 清理测试文件 ===")
    
    test_files = [
        'test_file.txt',
        'test.key',
        'encrypted_file.bin',
        'decrypted_file.txt',
        'test_binary.bin',
        'encrypted_binary.bin'
    ]
    
    for filename in test_files:
        if os.path.exists(filename):
            os.remove(filename)
            print(f"已删除: {filename}")

def main():
    """主函数"""
    print("=== 加密解密系统测试 ===")
    
    try:
        # 创建测试环境
        create_test_files()
        
        # 测试各种使用方式
        test_command_line_style()
        test_data_return_style()
        test_module_usage()
        test_different_file_types()
        
        print("\n=== 所有测试完成 ===")
        
        # 询问是否清理测试文件
        response = input("\n是否要清理测试文件? (y/N): ").strip().lower()
        if response in ['y', 'yes']:
            cleanup_test_files()
        else:
            print("测试文件已保留，您可以手动检查它们")
    
    except Exception as e:
        print(f"测试过程中发生错误: {e}")

if __name__ == "__main__":
    main()
