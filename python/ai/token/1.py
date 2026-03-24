
from openai import OpenAI

# 填写key
API_KEY="sk-NzAxLTIxMTEzMTY2MzU3LTE3NzMyNDA0ODczOTg="

# 填写模型
# MODEL="DeepSeek-R1-0528"
# MODEL="DeepSeek-R1-Distill-Qwen-7B"
MODEL="Qwen3-30B-A3B" 

client = OpenAI(api_key=API_KEY, base_url="https://api.scnet.cn/api/llm/v1")

response = client.chat.completions.create(
    model=MODEL,
    messages=[
        # {"role": "system", "content": ""},
        {"role": "user", "content": "我第一次使用Token请求，成功了你回答一个“是”就行"},
    ],
    # stream=False,
    max_tokens=1024
)

print(response.choices[0].message.content)