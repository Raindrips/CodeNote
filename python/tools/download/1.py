import requests
import os

# 替换为你的 .m3u8 文件的 URL
m3u8_url = 'https://example.com/path/to/your/playlist.m3u8'

# 下载 .m3u8 文件
response = requests.get(m3u8_url)
m3u8_content = response.text

# 解析 .m3u8 文件并获取视频片段的 URL
video_urls = []
base_url = '/'.join(m3u8_url.split('/')[:-1]) + '/'
for line in m3u8_content.split('\n'):
    if line and not line.startswith('#'):
        video_urls.append(base_url + line)

# 下载视频片段
output_dir = 'video_segments'
os.makedirs(output_dir, exist_ok=True)

for i, url in enumerate(video_urls):
    response = requests.get(url)
    with open(f'{output_dir}/segment_{i}.ts', 'wb') as f:
        f.write(response.content)

print(f'Downloaded {len(video_urls)} video segments.')
