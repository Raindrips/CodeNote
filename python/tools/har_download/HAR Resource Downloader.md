# HAR Resource Downloader

一个高效的 Python 脚本，用于从 Chrome 控制台导出的 `.har` 文件中提取并分类下载资源。

## 项目结构
- `har_downloader.py`: 核心脚本文件。
- `downloads/`: 默认下载保存目录（按后缀分类）。
- `all_urls.txt`: 记录 HAR 中提取的所有 URL。
- `failed_urls.txt`: 记录下载失败的 URL。

## 使用方法

1. **安装依赖** (可选安装 `ijson` 以支持超大文件流式读取):
   ```bash
   pip install requests ijson
   ```

2. **配置参数**:
   打开 `har_downloader.py`，修改末尾的配置：
   ```python
   HAR_PATH = "example.har"  # 你的 .har 文件路径
   EXTENSIONS_TO_DOWNLOAD = ["jpg", "png", "js"]  # 指定要下载的后缀
   ```

3. **运行脚本**:
   ```bash
   python har_downloader.py
   ```

## 功能特点
- **大文件支持**: 优先使用 `ijson` 流式解析，避免 100MB+ 文件导致内存溢出。
- **分类存放**: 自动根据文件后缀（如 jpg, css, js）创建文件夹并归档。
- **多线程下载**: 提高下载效率。
- **日志记录**: 自动生成全量 URL 列表和失败 URL 列表。
