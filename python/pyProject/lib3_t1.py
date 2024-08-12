import urllib3
import re
http=urllib3.PoolManager()

web_url='https://image.baidu.com/search/index?tn=baiduimage&ps=1&ct=201326592&lm=-1&cl=2&nc=1&ie=utf-8&dyTabStr=MCwzLDEsMiw2LDQsNSw4LDcsOQ%3D%3D&word=%E7%8C%AB'
img_url='https://img0.baidu.com/it/u=3964498289,3325501414&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=679'
headers={"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0"}

res=http.request("GET",img_url,headers=headers)

text=res.data

# img2_url=re.findall('src="(.*?)"',text)
# print(img2_url)

# 保存图片

file_name='./1.jpg'

with open(file_name,"wb") as f:
  f.write(res.data)
  
  
http.clear()