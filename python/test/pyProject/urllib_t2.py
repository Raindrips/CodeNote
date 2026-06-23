from urllib import request;

# httpbin.org/ip   获取当前ip地址
# httpbin.org/get  获取当前的一个get请求
# httpbin.org/post 
# https://httpbin.org/put 

url='https://httpbin.org/put'
headers={"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0"}

req=request.Request(url,headers=headers,data=b'update',method="PUT")
res=request.urlopen(req)
print(res.read())       # 获取所有内容
print(res.getcode())    # 获取状态码
print(res.info())       # 获取响应头信息
print(res.read())       # 再次读取,如果为空则代表读取完成

 
  