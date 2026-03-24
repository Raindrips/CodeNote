import json
from openai import OpenAI


def load_config(config_path: str) -> dict:
    """读取本地JSON配置文件"""
    with open(config_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def chat_with_llm(config_path: str) -> str:
    """
    使用本地JSON配置文件与LLM进行对话
    
    Args:
        config_path: JSON配置文件路径
        
    Returns:
        LLM的回复内容
    """
    # 读取配置
    config = load_config(config_path)
    
    # 创建客户端
    client = OpenAI(
        api_key=config['api_key'],
        base_url=config['base_url']
    )
    
    # 发送请求
    response = client.chat.completions.create(
        model=config['model'],
        messages=[
            {"role": "system", "content": config['system']},
            {"role": "user", "content": config['user']},
        ],
        stream=False,
    )
    
    return response.choices[0].message.content


if __name__ == "__main__":
    # 使用默认配置文件路径
    config_path = "config.json"
    
    result = chat_with_llm(config_path)
    print(result)
