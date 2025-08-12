import os
import requests  # pip install requests

import argparse

def download_files(urls, output_dir):
    # 确保输出目录存在
    os.makedirs(output_dir, exist_ok=True)

    for i, url in enumerate(urls):
        try:
            # 获取文件名
            filename = os.path.join(output_dir, f"file_{i}.ts")

            # 下载文件
            response = requests.get(url)
            response.raise_for_status()  # 检查请求是否成功

            # 保存文件
            with open(filename, 'wb') as f:
                f.write(response.content)

            print(f"Downloaded {url} to {filename}")
        except Exception as e:
            print(f"Failed to download {url}: {e}")

def get_file_extension(url):
    # 从 URL 中提取文件扩展名
    return os.path.splitext(url)[1] or '.bin'

def genList():
    urlList=[]
    for r in range(150,400):
        url =f'https://abre-videos.cdn1122.com/_hls/videos/a/a/3/5/a/aa35a65659ca78d1870d173dce0d03f71635677406-1280-720-976-h264.mp4/seg-{r}-v1-a1.ts?validfrom=1752765319&validto=1752938119&rate=187392&hdl=-1&hash=zQIp%2FgQSxMZb1xYBZBZalWua%2Bo8%3D'
        urlList.append(url)
    return urlList

# print()
path=".\\output"
download_files(genList(), path)


# if __name__ == "__main__":
#     # 设置命令行参数
#     parser = argparse.ArgumentParser(description='Batch download files from URLs.')
#     parser.add_argument('--urls', nargs='+', type=str, required=True, help='List of URLs to download')
#     parser.add_argument('--output_dir', type=str, required=True, help='Directory to save downloaded files')

#     args = parser.parse_args()

#     # 调用下载函数
#     download_files(args.urls, args.output_dir)
