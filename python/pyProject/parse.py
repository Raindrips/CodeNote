from urllib import request,parse;
 

name='cat'
ascii_name=parse.quote(name)
#name=parse.unquote(ascii_name) # 反向转化

params={"name":"cat","lang":"en"}

# 转化成url参数
urlParams= parse.urlencode(params)
print(urlParams)

test_url='http://httpbin.org/get?name={}'.format(ascii_name )

res=request.urlopen(test_url)
print(res.read())