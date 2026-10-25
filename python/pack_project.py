import os
import base64

MODE = "unpack"  # pack/unpack

# 核心配置项
YOUR_PROJECT_ROOT = "./example"
PACK_OUTPUT_FILE = "project_pack.txt"  # 打包后的单个文本文件名
UNPACK_TARGET_DIR = "unpacked_project"  # 解包后的项目存放目录
USE_BASE64 = True  # 是否启用Base64编码（避免特殊字符、二进制文件错乱，推荐True）
# 可配置的过滤目录列表：需要排除的冗余文件夹，新增/删除直接修改该列表即可
EXCLUDE_DIRS = [
    "node_modules",  # Node.js项目依赖（核心冗余，优先过滤）
    ".git",          # Git版本控制目录
    "dist",          # 项目构建产物目录
    "build",         # 另一种构建产物目录
    ".cache",        # 缓存目录
    "tmp",           # 临时文件目录
    "vendor"         # 第三方依赖目录（可选，根据项目情况调整）
]

def pack_project(project_root, output_file=PACK_OUTPUT_FILE):
    """
    打包项目：递归遍历project_root目录，将所有文件打包到单个文本文件（自动过滤冗余目录）
    :param project_root: 待打包的项目根目录路径（绝对路径/相对路径均可）
    :param output_file: 打包后的文本文件路径
    """
    # 验证项目根目录是否存在
    if not os.path.isdir(project_root):
        raise FileNotFoundError(f"项目根目录不存在：{project_root}")
    
    # 打开输出文本文件（以UTF-8编码写入，支持中文）
    with open(output_file, 'w', encoding='utf-8') as f:
        # 递归遍历项目目录（topdown=True：从上到下遍历，支持修改dirs实现过滤）
        for root, dirs, files in os.walk(project_root):
            # 核心：过滤冗余目录（原地修改dirs列表，os.walk会跳过被过滤的目录）
            # 保留不在EXCLUDE_DIRS中的目录，实现递归过滤（子目录也会被校验）
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
            
            for file_name in files:
                # 1. 获取文件的完整路径和相对路径（相对项目根目录）
                file_full_path = os.path.join(root, file_name)
                file_relative_path = os.path.relpath(file_full_path, project_root)
                # 处理Windows路径分隔符（统一为/，避免跨平台解析问题）
                file_relative_path = file_relative_path.replace("\\", "/")
                
                # 2. 读取文件内容
                with open(file_full_path, 'rb') as file_handle:
                    file_content = file_handle.read()
                
                # 3. 可选：Base64编码（避免特殊字符、换行符导致解析错乱）
                if USE_BASE64:
                    file_content = base64.b64encode(file_content).decode('utf-8')
                else:
                    file_content = file_content.decode('utf-8', errors='ignore')
                
                # 4. 按约定格式写入文本文件（分隔符确保解析时不冲突）
                f.write("===FILE_START===\n")
                f.write(f"{file_relative_path}\n")
                f.write("===CONTENT_START===\n")
                f.write(f"{file_content}\n")
                f.write("===FILE_END===\n\n")
    
    print(f"项目打包完成！打包文件保存至：{os.path.abspath(output_file)}")
    print(f"本次过滤的冗余目录：{', '.join(EXCLUDE_DIRS)}")

def unpack_project(pack_file=PACK_OUTPUT_FILE, target_dir=UNPACK_TARGET_DIR):
    """
    解包项目：从单个文本文件中解析内容，还原项目的文件结构和内容
    :param pack_file: 打包后的文本文件路径
    :param target_dir: 解包后项目的存放目录
    """
    # 验证打包文件是否存在
    if not os.path.isfile(pack_file):
        raise FileNotFoundError(f"打包文件不存在：{pack_file}")
    
    # 创建解包目标目录（如果不存在）
    os.makedirs(target_dir, exist_ok=True)
    
    # 读取打包文本文件内容
    with open(pack_file, 'r', encoding='utf-8') as f:
        pack_content = f.read()
    
    # 按文件分隔符拆分内容（提取每个文件的信息）
    file_blocks = pack_content.split("===FILE_START===")[1:]  # 跳过第一个空元素
    
    for block in file_blocks:
        if not block.strip():
            continue
        
        # 1. 解析块内内容，提取路径和文件内容
        try:
            # 拆分路径、内容
            path_part, content_part = block.split("===CONTENT_START===")
            file_relative_path = path_part.strip().replace("/", os.sep)  # 还原当前系统路径分隔符
            file_content = content_part.split("===FILE_END===")[0].strip()
            
            # 2. 构建解包后的文件完整路径
            file_full_path = os.path.join(target_dir, file_relative_path)
            file_dir = os.path.dirname(file_full_path)
            
            # 3. 创建文件所在的目录（如果不存在）
            os.makedirs(file_dir, exist_ok=True)
            
            # 4. 还原文件内容（反向Base64解码）
            if USE_BASE64:
                file_content_bytes = base64.b64decode(file_content)
            else:
                file_content_bytes = file_content.encode('utf-8')
            
            # 5. 写入文件（二进制模式，支持所有文件类型）
            with open(file_full_path, 'wb') as file_handle:
                file_handle.write(file_content_bytes)
        
        except Exception as e:
            print(f"解析文件块失败，跳过该块：{e}")
            continue
    
    print(f"项目解包完成！解包文件保存至：{os.path.abspath(target_dir)}")

# 测试使用示例（直接运行该脚本即可体验打包和解包）
if __name__ == "__main__":
    try:
        # 第一步：打包项目（自动过滤EXCLUDE_DIRS中的冗余目录）
        if MODE == "pack":
            pack_project(YOUR_PROJECT_ROOT)
        
        # 第二步：解包项目（可选，注释掉可只执行打包）
        if MODE == "unpack":
            unpack_project()
    except Exception as e:
        print(f"操作失败：{e}")