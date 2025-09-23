using System;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Text.RegularExpressions;

namespace Server {
    class Program {
        private static string _ipAdress = "127.0.0.1";  //ip地址
        private static int _port = 5000;  //端口号
        private static int _maxConnect = 20;  //最大连接数
        private static Socket _serverSocket;
        private static Socket _clientSocket;

        static void Test1() {
            //1、创建一个服务端socket对象
            _serverSocket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
            //2、绑定一个ip和端口
            IPAddress ipaddress = IPAddress.Parse(_ipAdress);//将一个字符串类型的ip地址，转换成一个IPAdress对象
            EndPoint endPoint = new IPEndPoint(ipaddress, _port);

            _serverSocket.Bind(endPoint);//向操作系统申请一个可用的ip和端口号来通讯
                                         //3、开始监听客户端的连接请求
            _serverSocket.Listen(_maxConnect);//设置最大连接数
            Console.WriteLine(string.Format("开启服务端{0}...", _serverSocket.LocalEndPoint));
            _clientSocket = _serverSocket.Accept();//阻塞当前线程，直到有一个客户端连接服务器
            Console.WriteLine("接受到客户端的连接请求！");

            //4、发送、接收消息
            string message = "hello client";
            byte[] data = Encoding.UTF8.GetBytes(message);//将字符串转成字节数组
            _clientSocket.Send(data);
            Console.WriteLine("服务器向客户端发送了一条消息：" + message);
            //5、接收客户端发来的信息
            byte[] data2 = new byte[1024];//存放消息的字节数容器 1M大小
            int length = _clientSocket.Receive(data2);
            string messgae2 = Encoding.UTF8.GetString(data2, 0, length);//bytes转换成string
            Console.WriteLine("服务器接受到客户端发来的信息" + messgae2);
            Console.ReadLine();
        }


        //启动服务
        static void WebTest1() {
            TcpListener server = new TcpListener(IPAddress.Parse("127.0.0.1"), 80);

            server.Start();
            Console.WriteLine("Server has started on 127.0.0.1:80.{0}Waiting for a connection...", Environment.NewLine);

            TcpClient client = server.AcceptTcpClient();

            Console.WriteLine("A client connected.");

            NetworkStream stream = client.GetStream();

            //有客户端链接后,读取客户端发送的消息
            while (true) {
                while (!stream.DataAvailable) ;
                //while (client.Available < 3) {

                //}

                byte[] bytes = new byte[client.Available];

                stream.Read(bytes, 0, bytes.Length);
                String data = Encoding.UTF8.GetString(bytes);
                Console.WriteLine(data);
                if (Regex.IsMatch(data, "^GET")) {
                    Console.WriteLine("Get 请求");
                }
                else {
                    Console.WriteLine("没有 Get请求");
                }
                if (new Regex("^GET").IsMatch(data)) {
                    const string eol = "\r\n"; // HTTP/1.1 defines the sequence CR LF as the end-of-line marker

                    byte[] response = Encoding.UTF8.GetBytes("HTTP/1.1 101 Switching Protocols" + eol
                        + "Connection: Upgrade" + eol
                        + "Upgrade: websocket" + eol
                        + "Sec-WebSocket-Accept: " + Convert.ToBase64String(
                            System.Security.Cryptography.SHA1.Create().ComputeHash(
                                Encoding.UTF8.GetBytes(
                                    new System.Text.RegularExpressions.Regex("Sec-WebSocket-Key: (.*)").Match(data).Groups[1].Value.Trim() + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
                                )
                            )
                        ) + eol
                        + eol);

                    stream.Write(response, 0, response.Length);
                }

            }
        }
        static void Main(string[] args) {
            Test1();
        }
    }
}