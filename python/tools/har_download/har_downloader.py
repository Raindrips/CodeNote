import os
import json
import sys
import requests
from urllib.parse import urlparse
from concurrent.futures import ThreadPoolExecutor

# 建议安装 ijson 以处理超大 JSON 文件: pip install ijson
# 如果没有 ijson，脚本将回退到标准 json 库（对于 100MB 文件，标准库通常也能处理，但内存占用较高）
try:
    import ijson
    HAS_IJSON = True
except ImportError:
    HAS_IJSON = False

class HarDownloader:
    def __init__(self, har_file, target_extensions=None, output_dir="downloads", max_workers=5):
        self.har_file = har_file
        self.target_extensions = [ext.lower().strip('.') for ext in (target_extensions or [])]
        self.output_dir = output_dir
        self.max_workers = max_workers
        self.all_urls_file = "all_urls.txt"
        self.failed_urls_file = "failed_urls.txt"
        
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)

    def get_urls_from_har(self):
        """从 HAR 文件中提取 URL"""
        urls = []
        try:
            if HAS_IJSON:
                with open(self.har_file, 'rb') as f:
                    # 使用 ijson 流式解析 entries 中的 request url
                    parser = ijson.items(f, 'log.entries.item.request.url')
                    for url in parser:
                        urls.append(url)
            else:
                with open(self.har_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    for entry in data.get('log', {}).get('entries', []):
                        url = entry.get('request', {}).get('url')
                        if url:
                            urls.append(url)
        except Exception as e:
            print(f"读取 HAR 文件出错: {e}")
        return list(set(urls))  # 去重

    def download_file(self, url):
        """下载单个文件并按后缀分类"""
        try:
            parsed_url = urlparse(url)
            path = parsed_url.path
            filename = os.path.basename(path)
            
            if not filename:
                return url, False

            ext = os.path.splitext(filename)[1].lower().strip('.')
            
            # 如果指定了后缀过滤，且当前文件后缀不在列表中，则跳过
            if self.target_extensions and ext not in self.target_extensions:
                return url, "skipped"

            # 按后缀创建子目录
            sub_dir = os.path.join(self.output_dir, ext if ext else "no_extension")
            if not os.path.exists(sub_dir):
                os.makedirs(sub_dir)

            save_path = os.path.join(sub_dir, filename)
            
            response = requests.get(url, timeout=10, stream=True)
            if response.status_code == 200:
                with open(save_path, 'wb') as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        f.write(chunk)
                return url, True
            else:
                return url, False
        except Exception as e:
            print(f"下载失败 {url}: {e}")
            return url, False

    def run(self):
        print(f"正在从 {self.har_file} 提取 URL...")
        urls = self.get_urls_from_har()
        print(f"共提取到 {len(urls)} 个唯一 URL。")

        # 写入所有 URL
        with open(self.all_urls_file, 'w', encoding='utf-8') as f:
            for url in urls:
                f.write(url + '\n')

        failed_urls = []
        print(f"开始下载 (线程数: {self.max_workers})...")
        
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            results = list(executor.map(self.download_file, urls))

        for url, status in results:
            if status is False:
                failed_urls.append(url)

        # 写入失败的 URL
        with open(self.failed_urls_file, 'w', encoding='utf-8') as f:
            for url in failed_urls:
                f.write(url + '\n')

        print(f"\n任务完成！")
        print(f"所有 URL 已写入: {self.all_urls_file}")
        print(f"失败 URL 已写入: {self.failed_urls_file}")
        print(f"文件保存目录: {self.output_dir}")

if __name__ == "__main__":
    # 参数配置
    if len(sys.argv) < 2:
        print("用法: python har_downloader.py <har文件路径>")
        sys.exit(1)

    HAR_PATH = sys.argv[1]
    EXTENSIONS_TO_DOWNLOAD = ["jpg", "mp4"]  # 要下载的后缀列表
    
    if os.path.exists(HAR_PATH):
        downloader = HarDownloader(
            har_file=HAR_PATH, 
            target_extensions=EXTENSIONS_TO_DOWNLOAD,
            max_workers=10
        )
        downloader.run()
    else:
        print(f"未找到文件: {HAR_PATH}，请确保命令行传入的路径正确。")
