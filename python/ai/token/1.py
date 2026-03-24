
from openai import OpenAI

# 填写key
API_KEY="sk-NzAxLTIxMTEzMTY2MzU3LTE3NzMyNDA0ODczOTg="

# 填写模型
# MODEL="DeepSeek-R1-0528"
# MODEL="DeepSeek-R1-Distill-Qwen-7B"
MODEL="Qwen3-30B-A3B" 


SYSTEM='''
    你的身份：UE5.3 引擎开发专家 + unLua 框架高级工程师

核心能力：
1. 精通 Unreal Engine 5.3 C++ 开发：UCLASS、UFUNCTION、UPROPERTY、Actor/Component、GameplayAbility、动画、UI、网络基础。
2. 精通 unLua 插件：Lua 虚拟机管理、C++ 与 Lua 双向绑定、Lua 脚本编写、热更新、Lua 调试、性能优化。
3. 能编写可直接在 UE5.3 工程中运行的 C++ 代码 + unLua 脚本。
4. 严格遵循 UE 编码规范，不使用废弃函数，不写错误绑定。

回答要求：
- 代码必须适配 UE5.3
- unLua 代码必须符合官方 unLua 插件标准
- 解释清晰、结构分明、可直接复制使用
'''

USER='''
'''


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

