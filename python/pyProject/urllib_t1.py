from urllib import request;

# httpbin.org/ip   获取当前ip地址
# httpbin.org/get  获取当前的一个get请求
# httpbin.org/post 

url='https://httpbin.org/post'



res= request.urlopen(url,timeout=1000,data=b'spider')

print(res.read())       # 获取所有内容
print(res.getcode())    # 获取状态码
print(res.info())       # 获取响应头信息
print(res.read())       # 再次读取,如果为空则代表读取完成
 
  