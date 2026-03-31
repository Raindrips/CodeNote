import xml.etree.ElementTree as ET
from xml.dom import minidom

def save_to_xml(data_dict, filename):
    """将字典保存为 XML 文件"""
    root = ET.Element("data")
    for key, value in data_dict.items():
        child = ET.SubElement(root, key)
        child.text = value  # 直接写入长文本，无需手动换行符
    
    # 格式化美化 XML
    xml_str = ET.tostring(root, encoding='utf-8')
    pretty_xml = minidom.parseString(xml_str).toprettyxml(indent="  ")
    
    with open(filename, "w", encoding="utf-8") as f:
        f.write(pretty_xml)

def load_from_xml(filename):
    """从 XML 文件读取并还原为字典"""
    tree = ET.parse(filename)
    root = tree.getroot()
    return {child.tag: child.text.strip() if child.text else "" for child in root}


def main():
    my_content = {
        "title": "关于长文本存储的建议",
        "content": "",
        "author": "AI Assistant"
    }

    # 保存
    save_to_xml(my_content, "storage.xml")
    
    # 读取
    loaded_data = load_from_xml("storage.xml")
    print(f"读取到的内容:\n{loaded_data['content']}")
# --- 使用示例 ---
if __name__ == "__main__":
    main()
