from openai import OpenAI
import time
import os
import json
import secrets


# ====================== 仅需修改这里 ======================
API_KEY = "sk-NzAxLTIxMTEzMTY2MzU3LTE3NzMyNDA0ODczOTg="  # 你的密钥
MODEL = "Qwen3-30B-A3B"  # 你的模型

SYSTEM='''
你是商业游戏开发顶级导师，精通Unity、Unreal Engine 5、Godot 4、C#、C++、GDScript、Blueprints、Shader等全栈技术。你回答永远结构清晰（分步骤、代码+解释+优化+坑点+实战案例），用中文回复，输出尽量详细，必须包含可直接复制运行的完整代码、性能优化技巧、常见Bug排查和进阶扩展建议。你的目标是让用户真正掌握游戏开发，从零到商业级项目.目标用户已经具备扎实的编程语言基础,数据结构,基础算法,较简单的编程内容不用注释。
'''
# ==========================================================

# 完全复用你的配置
client = OpenAI(
    api_key=API_KEY,
    base_url="https://api.scnet.cn/api/llm/v1"
)

# 创建输入/输出文件夹
os.makedirs("input", exist_ok=True)
os.makedirs("output", exist_ok=True)

# 核心处理函数（防限流 + 自动重试，解决你的报错问题）
def ai_process(content:str):
    # 重试3次，应对请求频率超限
    for retry in range(3):
        try:
            # 延迟2.5秒，彻底解决 Rate Reaches Maximum Limit 报错
            time.sleep(2.5)
            response = client.chat.completions.create(
                model=MODEL,
                messages=[
                    {"role": "system", "content": SYSTEM},
                    {"role": "user", "content": content}
                    ],
                # max_tokens=1024
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            error = str(e)
            if "Rate Reaches Maximum Limit" in error:
                wait_time = 30 * (retry + 1)
                print(f"触发限流，等待{wait_time}秒后重试...")
                time.sleep(wait_time)
            else:
                print(f"报错：{error}")
                return f"处理失败：{error}"
    return "多次重试失败"

# 读取json文件
def read_file(filepath:str):
    with open(filepath,"r",encoding="utf-8") as f:
        data = json.load(f)
    
    return data
    

def batch_run():
    print("读取json文件")
    txt_list=read_file("1.json")   
    for text in txt_list:
        # AI处理
        print(">>>",text)
        result = ai_process(text)
        
        # 保存结果
        with open(f"output/{secrets.token_hex(16)}", "w", encoding="utf-8") as f:
            f.write(result)
        print(f"处理完成！结果已保存至 output 文件夹")
        

# 批量处理 input 文件夹下所有 txt 文件
def batch_run_bak():
    # 获取所有文本文件
    file_list = [f for f in os.listdir("input") if f.endswith(".txt")]
    if not file_list:
        print("请把需要处理的 .txt 文件放入 input 文件夹中！")
        return

    print(f"共找到 {len(file_list)} 个文件，开始批量处理...")
    for file in file_list:
        print(f"\n正在处理：{file}")
        # 读取文件内容
        with open(f"input/{file}", "r", encoding="utf-8") as f:
            text = f.read()
        
        # AI处理
        result = ai_process(text)
        
        # 保存结果
        with open(f"output/已处理_{file}", "w", encoding="utf-8") as f:
            f.write(result)
        print(f"处理完成！结果已保存至 output 文件夹")

if __name__ == "__main__":
    batch_run()