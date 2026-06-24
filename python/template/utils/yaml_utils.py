import yaml #pip install pyyaml
import os

def save_to_yaml(data_dict, filename):
    """将字典（含长段落）保存为 YAML 文件"""
    with open(filename, 'w', encoding='utf-8') as f:
        # sort_keys=False 保持插入顺序
        # allow_unicode=True 确保中文不被转义成 \u 编码
        yaml.dump(data_dict, f, allow_unicode=True, sort_keys=False, default_flow_style=False)

def load_from_yaml(filename):
    """从 YAML 文件读取并还原为字典"""
    if not os.path.exists(filename):
        return None
    with open(filename, 'r', encoding='utf-8') as f:
        return yaml.safe_load(f)


def main():
    # 1. 准备测试数据，包含复杂换行的长文本
    my_content = {
        "project_name": "YAML长文本测试",
        "description": "YAML 非常适合配置项和文档存储。",
        "long_text_content": """
这里是第一段内容。
这是第三段，直接粘贴进来即可。""",
        "status": "active"
    }

    file_path = "data_storage.yaml"

    # 2. 执行保存
    print(f"--- 正在保存数据到 {file_path} ---")
    save_to_yaml(my_content, file_path)

    # 3. 执行读取并验证
    print("--- 正在从文件读取数据 ---")
    data = load_from_yaml(file_path)
    
    if data:
        print("\n解析后的长文本内容如下：")
        print("-" * 30)
        print(data["long_text_content"])
        print("-" * 30)
        print(f"\n完整字典对象: {data}")

if __name__ == "__main__":
    main()
