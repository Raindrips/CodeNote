import socket

server=socket.socket()

server.bind(("0.0.0.0",8800))

server.listen(5)

while True:
    conn,addr=server.accept()
    data=conn.recv(1024)
    print(data) 
    response="HTTP/1.1 200 OK\r\n Conetent-Type: text/html;charset=uft-8;\r\n\r\n<h1 style='color red'>1234567890</h1>"
    conn.send(response.encode())
    print("connect")
 
#  server.close()

# http请求方法
 