#!/usr/bin/env python3
"""
文件解密脚本
使用方法: python decrypt.py 输入文件 输出文件 密钥路径
"""

import sys
import os
from crypto_utils import CryptoUtils

def show_usage():
    """显示使用方法"""
    print("文件解密脚本")
    print("使用方法: python decrypt.py <输入文件> <输出文件> <密钥路径>")
    print()
    print("参数说明:")
    print("  输入文件: 要解密的加密文件路径")
    print("  输出文件: 解密后文件的保存路径")
    print("  密钥路径: 密钥文件的路径")
    print()
    print("示例:")
    print("  python decrypt.py encrypted_data.bin decrypted_data.txt secret.key")

def main():
    """主函数"""
    # 检查命令行参数
    if len(sys.argv) != 4:
        print("错误: 参数数量不正确")
        show_usage()
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    key_file = sys.argv[3]
    
    # 显示操作信息
    print("=== 文件解密操作 ===")
    print(f"输入文件: {input_file}")
    print(f"输出文件: {output_file}")
    print(f"密钥文件: {key_file}")
    print()
    
    # 检查输入文件是否存在
    if not os.path.exists(input_file):
        print(f"错误: 输入文件不存在: {input_file}")
        sys.exit(1)
    
    # 检查密钥文件是否存在
    if not os.path.exists(key_file):
        print(f"错误: 密钥文件不存在: {key_file}")
        sys.exit(1)
    
    # 加载密钥
    print("正在加载密钥...")
    key = CryptoUtils.load_key_from_file(key_file)
    if key is None:
        print("错误: 无法加载密钥文件")
        sys.exit(1)
    
    print(f"密钥长度: {len(key)} 字节")
    
    # 获取输入文件大小
    file_size = os.path.getsize(input_file)
    print(f"输入文件大小: {file_size} 字节")
    
    # 执行解密
    print("正在解密文件...")
    success = CryptoUtils.decrypt_file(input_file, output_file, key)
    
    if success:
        # 检查输出文件大小
        output_size = os.path.getsize(output_file)
        print("=== 解密完成 ===")
        print(f"输出文件: {output_file}")
        print(f"输出文件大小: {output_size} 字节")
        print("解密成功!")
        
        # 如果输出文件是文本文件，尝试显示前几行内容
        if output_file.endswith(('.txt', '.log', '.md', '.py', '.json', '.xml', '.html')):
            try:
                with open(output_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if len(content) > 200:
                        print("\n=== 文件内容预览 ===")
                        print(content[:200] + "...")
                    else:
                        print("\n=== 文件内容 ===")
                        print(content)
            except:
                print("(无法预览文件内容，可能不是文本文件)")
    else:
        print("解密失败!")
        sys.exit(1)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n操作被用户中断")
        sys.exit(1)
    except Exception as e:
        print(f"发生未预期的错误: {e}")
        sys.exit(1)
