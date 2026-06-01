import os
from openai import OpenAI  # pip install -U openai

def read_file_to_string(file_path):
    """
    读取文件内容并返回字符串
    :param file_path: 文件路径
    :return: 文件内容的字符串
    """
    try:
        # 'r' 表示只读模式, encoding='utf-8' 指定编码以防止中文乱码
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        return content
    except FileNotFoundError:
        print(f"错误: 文件 {file_path} 不存在")
        return None
    except Exception as e:
        print(f"读取文件时发生错误: {e}")
        return None

# 使用示例
API_KEY = read_file_to_string('mimo.api_key')

client = OpenAI(
    api_key=API_KEY,
    base_url="https://api.xiaomimimo.com/v1"
)

completion = client.chat.completions.create(
    model="mimo-v2.5-pro",
    messages=[
        {
            "role": "system",
            "content": "You are MiMo, an AI assistant developed by Xiaomi. Today is date: Tuesday, December 16, 2025. Your knowledge cutoff date is December 2024."
        },
        {
            "role": "user",
            "content": "请介绍你自己"
        }
    ],
    max_completion_tokens=1024,
    temperature=1.0,
    top_p=0.95,
    stream=False,
    stop=None,
    frequency_penalty=0,
    presence_penalty=0
)

print(completion.model_dump_json())



