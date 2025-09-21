using System;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace EchoServer
{
    class Program
    {
        static async Task Main(string[] args)
        {
            const int port = 13000;
            TcpListener server = null;

            try
            {
                // 设置TCP监听器，使用本地IP和指定端口
                server = new TcpListener(IPAddress.Any, port);
                server.Start();

                Console.WriteLine($"回显服务器已启动，正在监听端口 {port}...");
                Console.WriteLine("按Ctrl+C停止服务器...");

                // 持续接受客户端连接
                while (true)
                {
                    // 等待客户端连接
                    TcpClient client = await server.AcceptTcpClientAsync();
                    Console.WriteLine($"客户端已连接: {((IPEndPoint)client.Client.RemoteEndPoint).Address}");

                    // 为每个客户端创建一个新的任务处理连接
                    _ = Task.Run(() => HandleClient(client));
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"服务器错误: {ex.Message}");
            }
            finally
            {
                server?.Stop();
            }
        }

        static async Task HandleClient(TcpClient client)
        {
            NetworkStream stream = null;
            try
            {
                stream = client.GetStream();
                byte[] buffer = new byte[1024];
                int bytesRead;

                // 持续读取客户端发送的数据
                while ((bytesRead = await stream.ReadAsync(buffer, 0, buffer.Length)) > 0)
                {
                    // 将接收到的数据转换为字符串并显示
                    string receivedData = Encoding.UTF8.GetString(buffer, 0, bytesRead);
                    Console.WriteLine($"收到: {receivedData}");

                    // 将接收到的数据原样返回给客户端
                    await stream.WriteAsync(buffer, 0, bytesRead);
                    Console.WriteLine($"已回显: {receivedData}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"处理客户端时出错: {ex.Message}");
            }
            finally
            {
                stream?.Close();
                client.Close();
                Console.WriteLine("客户端连接已关闭");
            }
        }
    }
}