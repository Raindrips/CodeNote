# 1. 获取图片url
# 2. 请求方式 GET/ 
# 3. 获取数据

import urllib3

http=urllib3.PoolManager()

img_url='https://img0.baidu.com/it/u=3964498289,3325501414&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=679'
headers={"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0"}
 