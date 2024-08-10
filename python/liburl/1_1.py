import urllib.request   #导入http请求库

req=urllib.request.Request('http://www.baidu.com',
headers={'User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:87.0) Gecko/20100101 Firefox/87.0'})

data=urllib.request.urlopen()

print(data.read().decode())