# 数值表示
a=100_00_00
print(a)

# 快速交换
a=10
b=5
a,b=b,a
print('a={} b={}'.format(a,b))

# 判断变量范围
a=97

# 字符串乘法
print('-'*100)

# 列表拼接
l1=[1,2,3]
l2=[4,5,6]
ln=l1+l2
print(ln)

#列表切片
print(ln[:3])
print(ln[-3:])
print(ln[1:3])
print(ln[-3:-1])

# 元组解包
a=(1,2,3)
x,y,z=a
# 打包
b=(x,y,z)
print(b)

# with关键字 能自动调用close
with open('test.txt','r') as file:
  data=file.read()

print(data)

# 列表推导式
ln2 =[e+1 for e in ln]
print(ln2)
  