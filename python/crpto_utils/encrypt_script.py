#!/usr/bin/env python3
"""
文件加密脚本
使用方法: python encrypt.py 输入文件 输出文件 密钥路径
"""

import sys
import os
from crypto_utils import CryptoUtils

def show_usage():
    """显示使用方法"""
    print("文件加密脚本")
    print("使用方法: python encrypt.py <输入文件> <输出文件> <密钥路径>")
    print()
    print("参数说明:")
    print("  输入文件: 要加密的原始文件路径")
    print("  输出文件: 加密后文件的保存路径")
    print("  密钥路径: 密钥文件的路径")
    print()
    print("示例:")
    print("  python encrypt.py data.txt encrypted_data.bin secret.key")

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
    print("=== 文件加密操作 ===")
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
        print("您需要先创建密钥文件。")
        
        # 询问是否创建新密钥
        response = input("是否要创建新的密钥文件? (y/N): ").strip().lower()
        if response in ['y', 'yes']:
            password = input("请输入密码来生成密钥: ").strip()
            if not password:
                print("错误: 密码不能为空")
                sys.exit(1)
            
            # 生成密钥
            key = CryptoUtils.generate_key_from_password(password)
            
            # 保存密钥到文件
            if CryptoUtils.save_key_to_file(key, key_file):
                print(f"密钥已保存到: {key_file}")
            else:
                print("错误: 无法保存密钥文件")
                sys.exit(1)
        else:
            print("操作取消")
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
    
    # 执行加密
    print("正在加密文件...")
    success = CryptoUtils.encrypt_file(input_file, output_file, key)
    
    if success:
        # 检查输出文件大小
        output_size = os.path.getsize(output_file)
        print("=== 解密完成 ===")
        print(f"输出文件: {output_file}")
        print(f"输出文件大小: {output_size} 字节")
        print("解密成功!")
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
