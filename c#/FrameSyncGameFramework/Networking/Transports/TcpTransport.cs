using System;
using System.Net;
using System.Net.Sockets;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using FrameSyncGameFramework.Networking.Interfaces;

namespace FrameSyncGameFramework.Networking.Transports
{
    /// <summary>
    /// TCP网络传输实现
    /// </summary>
    public class TcpTransport : INetworkTransport
    {
        private TcpClient? _tcpClient;
        private TcpListener? _tcpListener;
        private NetworkStream? _stream;
        private readonly byte[] _receiveBuffer;
        private readonly ILogger<TcpTransport> _logger;
        private readonly object _lockObject = new object();
        private bool _disposed;

        public bool IsConnected => _tcpClient?.Connected ?? false;
        public IPEndPoint? LocalEndPoint => _tcpClient?.Client?.LocalEndPoint as IPEndPoint;
        public IPEndPoint? RemoteEndPoint => _tcpClient?.Client?.RemoteEndPoint as IPEndPoint;

        public event EventHandler<DataReceivedEventArgs>? DataReceived;
        public event EventHandler<ConnectionStateEventArgs>? ConnectionStateChanged;

        public TcpTransport(int bufferSize = 4096, ILogger<TcpTransport>? logger = null)
        {
            _receiveBuffer = new byte[bufferSize];
            _logger = logger ?? Microsoft.Extensions.Logging.Abstractions.NullLogger<TcpTransport>.Instance;
            _disposed = false;
        }

        public async Task<bool> ConnectAsync(IPEndPoint remoteEndPoint)
        {
            if (remoteEndPoint == null)
                throw new ArgumentNullException(nameof(remoteEndPoint));

            lock (_lockObject)
            {
                if (IsConnected)
                {
                    _logger.LogWarning("Already connected to a remote host");
                    return false;
                }
            }

            try
            {
                _logger.LogInformation($"Connecting to {remoteEndPoint}");
                
                _tcpClient = new TcpClient();
                await _tcpClient.ConnectAsync(remoteEndPoint.Address, remoteEndPoint.Port);
                _stream = _tcpClient.GetStream();
                
                _logger.LogInformation($"Connected to {remoteEndPoint}");
                
                // 开始接收数据
                BeginReceive();
                
                ConnectionStateChanged?.Invoke(this, new ConnectionStateEventArgs 
                { 
                    IsConnected = true, 
                    Reason = "Connected successfully" 
                });
                
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to connect to {remoteEndPoint}");
                Cleanup();
                
                ConnectionStateChanged?.Invoke(this, new ConnectionStateEventArgs 
                { 
                    IsConnected = false, 
                    Reason = "Connection failed",
                    Exception = ex 
                });
                
                return false;
            }
        }

        public void Disconnect()
        {
            lock (_lockObject)
            {
                if (!IsConnected)
                {
                    _logger.LogWarning("Not connected");
                    return;
                }

                _logger.LogInformation("Disconnecting");
                Cleanup();
                
                ConnectionStateChanged?.Invoke(this, new ConnectionStateEventArgs 
                { 
                    IsConnected = false, 
                    Reason = "Disconnected by user" 
                });
            }
        }

        public async Task<bool> SendAsync(byte[] data)
        {
            if (data == null)
                throw new ArgumentNullException(nameof(data));

            lock (_lockObject)
            {
                if (!IsConnected || _stream == null)
                {
                    _logger.LogError("Cannot send data: not connected");
                    return false;
                }
            }

            try
            {
                // 发送数据长度（4字节）+ 数据
                var lengthBytes = BitConverter.GetBytes(data.Length);
                await _stream.WriteAsync(lengthBytes, 0, lengthBytes.Length);
                await _stream.WriteAsync(data, 0, data.Length);
                await _stream.FlushAsync();
                
                _logger.LogDebug($"Sent {data.Length} bytes");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send data");
                Disconnect();
                return false;
            }
        }

        public Task<bool> SendAsync(byte[] data, IPEndPoint remoteEndPoint)
        {
            // TCP不支持发送到指定终结点，忽略remoteEndPoint参数
            return SendAsync(data);
        }

        public async Task<bool> StartListeningAsync(IPEndPoint localEndPoint)
        {
            if (localEndPoint == null)
                throw new ArgumentNullException(nameof(localEndPoint));

            lock (_lockObject)
            {
                if (_tcpListener != null)
                {
                    _logger.LogWarning("Already listening");
                    return false;
                }
            }

            try
            {
                _logger.LogInformation($"Starting TCP listener on {localEndPoint}");
                
                _tcpListener = new TcpListener(localEndPoint);
                _tcpListener.Start();
                
                // 开始接受连接
                _ = Task.Run(async () => await AcceptConnectionsAsync());
                
                _logger.LogInformation($"TCP listener started on {localEndPoint}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to start TCP listener on {localEndPoint}");
                Cleanup();
                return false;
            }
        }

        public void StopListening()
        {
            lock (_lockObject)
            {
                if (_tcpListener == null)
                {
                    _logger.LogWarning("Not listening");
                    return;
                }

                _logger.LogInformation("Stopping TCP listener");
                _tcpListener.Stop();
                _tcpListener = null;
            }
        }

        public NetworkStatistics GetStatistics()
        {
            // 简化实现，实际项目中应该跟踪详细的统计信息
            return new NetworkStatistics
            {
                BytesSent = 0,
                BytesReceived = 0,
                PacketsSent = 0,
                PacketsReceived = 0,
                FailedSends = 0,
                FailedReceives = 0,
                ConnectionDuration = TimeSpan.Zero,
                AverageLatency = 0,
                LatencySamples = 0
            };
        }

        private async Task AcceptConnectionsAsync()
        {
            while (_tcpListener != null)
            {
                try
                {
                    var client = await _tcpListener.AcceptTcpClientAsync();
                    _logger.LogInformation($"Accepted connection from {client.Client.RemoteEndPoint}");
                    
                    // 处理新连接
                    _ = Task.Run(async () => await HandleClientAsync(client));
                }
                catch (ObjectDisposedException)
                {
                    // 监听器已停止
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error accepting connection");
                }
            }
        }

        private async Task HandleClientAsync(TcpClient client)
        {
            try
            {
                var stream = client.GetStream();
                var buffer = new byte[_receiveBuffer.Length];
                
                while (client.Connected)
                {
                    try
                    {
                        // 读取数据长度
                        var lengthBytes = new byte[4];
                        var bytesRead = await stream.ReadAsync(lengthBytes, 0, 4);
                        
                        if (bytesRead < 4)
                        {
                            // 连接已关闭
                            break;
                        }
                        
                        var dataLength = BitConverter.ToInt32(lengthBytes, 0);
                        
                        if (dataLength <= 0 || dataLength > 1024 * 1024) // 限制最大数据大小为1MB
                        {
                            _logger.LogWarning($"Invalid data length: {dataLength}");
                            break;
                        }
                        
                        // 读取数据
                        var data = new byte[dataLength];
                        var totalRead = 0;
                        
                        while (totalRead < dataLength)
                        {
                            bytesRead = await stream.ReadAsync(data, totalRead, dataLength - totalRead);
                            if (bytesRead <= 0)
                            {
                                // 连接已关闭
                                break;
                            }
                            totalRead += bytesRead;
                        }
                        
                        if (totalRead == dataLength)
                        {
                            // 触发数据接收事件
                            DataReceived?.Invoke(this, new DataReceivedEventArgs
                            {
                                Data = data,
                                RemoteEndPoint = client.Client.RemoteEndPoint as IPEndPoint,
                                Timestamp = DateTime.UtcNow
                            });
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error handling client data");
                        break;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in client handler");
            }
            finally
            {
                client.Close();
                _logger.LogInformation($"Client disconnected: {client.Client.RemoteEndPoint}");
            }
        }

        private void BeginReceive()
        {
            if (_stream == null)
                return;

            try
            {
                _stream.BeginRead(_receiveBuffer, 0, _receiveBuffer.Length, ReceiveCallback, null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error starting receive operation");
                Disconnect();
            }
        }

        private void ReceiveCallback(IAsyncResult ar)
        {
            if (_stream == null)
                return;

            try
            {
                var bytesRead = _stream.EndRead(ar);
                
                if (bytesRead > 0)
                {
                    var data = new byte[bytesRead];
                    Array.Copy(_receiveBuffer, data, bytesRead);
                    
                    // 触发数据接收事件
                    DataReceived?.Invoke(this, new DataReceivedEventArgs
                    {
                        Data = data,
                        RemoteEndPoint = RemoteEndPoint,
                        Timestamp = DateTime.UtcNow
                    });
                    
                    // 继续接收
                    BeginReceive();
                }
                else
                {
                    // 连接已关闭
                    _logger.LogInformation("Connection closed by remote host");
                    Disconnect();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in receive callback");
                Disconnect();
            }
        }

        private void Cleanup()
        {
            try
            {
                _stream?.Close();
                _stream?.Dispose();
                _tcpClient?.Close();
                _tcpClient?.Dispose();
                
                _stream = null;
                _tcpClient = null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during cleanup");
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    StopListening();
                    Disconnect();
                }
                _disposed = true;
            }
        }

        ~TcpTransport()
        {
            Dispose(false);
        }
    }
}