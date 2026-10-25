#!/usr/bin/env python3
"""
remove_whitespace.py
去除文本文件中的所有空白字符（空格、制表符、换行符等）
用法: python remove_whitespace.py <文件名>
"""
 
import sys
import os
 
 
def remove_whitespace(filename: str) -> None:
    """读取文件,去除所有空白字符后写回原文件"""
    if not os.path.isfile(filename):
        print(f"[错误] 文件不存在: {filename}")
        sys.exit(1)
 
    # 读取原内容
    with open(filename, 'r', encoding='utf-8') as f:
        original = f.read()
 
    # 核心: split() 不传参会按任意连续空白分割,join 后自然紧凑
    cleaned = ''.join(original.split())
 
    # 写回原文件
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(cleaned)
 
    # 统计信息
    removed = len(original) - len(cleaned)
    print(f"[完成] 已处理: {filename}")
    print(f"       原始字符数: {len(original)}")
    print(f"       清理后字符数: {len(cleaned)}")
    print(f"       移除空白数: {removed}")
 
 
def main():
    if len(sys.argv) != 2:
        print("用法: python remove_whitespace.py <文件名>")
        print("示例: python remove_whitespace.py 1.txt")
        sys.exit(1)
 
    remove_whitespace(sys.argv[1])
 
 
if __name__ == '__main__':
    main()