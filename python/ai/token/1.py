
from openai import OpenAI
import secrets
# 填写key
API_KEY="sk-NzAxLTIxMTEzMTY2MzU3LTE3NzMyNDA0ODczOTg="

# 填写模型
# MODEL="DeepSeek-R1-0528"
# MODEL="DeepSeek-R1-Distill-Qwen-7B"
MODEL="Qwen3-30B-A3B" 


SYSTEM='''
    你的身份：unity引擎开发专家,使用MVP设计模式
'''

USER='''添加持久化存储'''


client = OpenAI(api_key=API_KEY, base_url="https://api.scnet.cn/api/llm/v1")


response = client.chat.completions.create(
    model=MODEL,
    messages=[
        {"role": "system", "content": SYSTEM},
        {"role": "user", "content": USER},
    ],
    stream=False,
)

text=response.choices[0].message.content.strip()
print(text)
with open(f"output/{secrets.token_hex(16)}.md", "w", encoding="utf-8") as f:
            f.write(text)

