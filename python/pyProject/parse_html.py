from urllib import request

from lxml import etree

# httpbin.org/ip   获取当前ip地址
# httpbin.org/get  获取当前的一个get请求
# httpbin.org/post 
# https://httpbin.org/put 

url='https://img0.baidu.com/it/u=3964498289,3325501414&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=679'
headers={"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0"}

req=request.Request(url,headers=headers,data=b'update',method="PUT")
res=request.urlopen(req)

data=res.data
js= json.loads()



 
  