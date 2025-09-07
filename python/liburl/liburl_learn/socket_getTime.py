import socket

img_url=""

client.connect(("www.baidu.com",80))


# 构造请求报文
data=b"Get / HTTP/1.0\r\nHost:www.baidu.com\r\n"

# 发送请求
client.send(data)

temp =client.recv(4096)

res =""
# 输出报文
while temp:
    res+=temp
    temp =client.recv(4096)
    print(temp.decode())

client.close()
print("end") 