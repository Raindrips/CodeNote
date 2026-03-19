import requests
import json

# 你的请求URL
url = "http://localhost:11434/api/chat"

# 你的请求头
headers = {
    "Content-Type": "application/json"
}

# 你的请求体，包含你想要提问的问题
data = {
    "model": "qwen2.5:7b",
     "messages": [
        {"role": "user", "content": "你好，介绍一下自己"}
    ],
    "stream": False,  # 一次性返回结果，不用流式输出
    "prompt": "你好，本地模型能做到什么程度？"
}

# 发送POST请求
response = requests.post(url, headers=headers, data=json.dumps(data))

# 检查响应状态码
if response.status_code == 200:
    # 获取并打印响应内容
    result = response.json()
    print(json.dumps(result, ensure_ascii=False, indent=4))
else:
    print(f"请求失败，状态码: {response.status_code}")
