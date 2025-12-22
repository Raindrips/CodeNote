using System;
using System.Net;
using System.Net.Sockets;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using FrameSyncGameFramework.Networking.Interfaces;

namespace FrameSyncGameFramework.Networking.Transports
{
    /// <summary>
    /// UDP网络传输实现
    /// </summary>
    public class UdpTransport : INetworkTransport
    {
        private UdpClient? _udpClient;
        private readonly ILogger<UdpTransport> _logger;
        private readonly object _lockObject = new object();
        private bool _disposed;
        private bool _isListening;

        public bool IsConnected => _udpClient != null;
        public IPEndPoint? LocalEndPoint => _udpClient?.Client?.LocalEndPoint as IPEndPoint;
        public IPEndPoint? RemoteEndPoint { get; private set; }

        public event EventHandler<DataReceivedEventArgs>? DataReceived;
        public event EventHandler<ConnectionStateEventArgs>? ConnectionStateChanged;

        public UdpTransport(ILogger<UdpTransport>? logger = null)
        {
            _logger = logger ?? Microsoft.Extensions.Logging.Abstractions.NullLogger<UdpTransport>.Instance;
            _disposed = false;
            _isListening = false;
        }

        public async Task<bool> ConnectAsync(IPEndPoint remoteEndPoint)
        {
            if (remoteEndPoint == null)
                throw new ArgumentNullException(nameof(remoteEndPoint));

            lock (_lockObject)
            {
                if (IsConnected)
                {
                    _logger.LogWarning("Already connected");
                    return false;
                }
            }

            try
            {
                _logger.LogInformation($"Connecting UDP to {remoteEndPoint}");
                
                _udpClient = new UdpClient();
                await _udpClient.ConnectAsync(remoteEndPoint.Address, remoteEndPoint.Port);
                RemoteEndPoint = remoteEndPoint;
                
                _logger.LogInformation($"UDP connected to {remoteEndPoint}");
                
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
                _logger.LogError(ex, $"Failed to connect UDP to {remoteEndPoint}");
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

                _logger.LogInformation("Disconnecting UDP");
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
                if (!IsConnected || _udpClient == null)
                {
                    _logger.LogError("Cannot send data: not connected");
                    return false;
                }
            }

            try
            {
                var bytesSent = await _udpClient.SendAsync(data, data.Length);
                
                if (bytesSent == data.Length)
                {
                    _logger.LogDebug($"Sent {bytesSent} bytes via UDP");
                    return true;
                }
                else
                {
                    _logger.LogWarning($"Incomplete send: {bytesSent}/{data.Length} bytes");
                    return false;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send UDP data");
                return false;
            }
        }

        public async Task<bool> SendAsync(byte[] data, IPEndPoint remoteEndPoint)
        {
            if (data == null)
                throw new ArgumentNullException(nameof(data));
            
            if (remoteEndPoint == null)
                throw new ArgumentNullException(nameof(remoteEndPoint));

            lock (_lockObject)
            {
                if (_udpClient == null)
                {
                    _logger.LogError("Cannot send data: UDP client not initialized");
                    return false;
                }
            }

            try
            {
                var bytesSent = await _udpClient.SendAsync(data, data.Length, remoteEndPoint);
                
                if (bytesSent == data.Length)
                {
                    _logger.LogDebug($"Sent {bytesSent} bytes to {remoteEndPoint}");
                    return true;
                }
                else
                {
                    _logger.LogWarning($"Incomplete send: {bytesSent}/{data.Length} bytes");
                    return false;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send UDP data to {remoteEndPoint}");
                return false;
            }
        }

        public async Task<bool> StartListeningAsync(IPEndPoint localEndPoint)
        {
            if (localEndPoint == null)
                throw new ArgumentNullException(nameof(localEndPoint));

            lock (_lockObject)
            {
                if (_isListening)
                {
                    _logger.LogWarning("Already listening");
                    return false;
                }
            }

            try
            {
                _logger.LogInformation($"Starting UDP listener on {localEndPoint}");
                
                _udpClient = new UdpClient(localEndPoint);
                _isListening = true;
                
                // 开始接收数据
                BeginReceive();
                
                _logger.LogInformation($"UDP listener started on {localEndPoint}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to start UDP listener on {localEndPoint}");
                Cleanup();
                return false;
            }
        }

        public void StopListening()
        {
            lock (_lockObject)
            {
                if (!_isListening)
                {
                    _logger.LogWarning("Not listening");
                    return;
                }

                _logger.LogInformation("Stopping UDP listener");
                _isListening = false;
                Cleanup();
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

        private void BeginReceive()
        {
            if (_udpClient == null)
                return;

            try
            {
                _udpClient.BeginReceive(ReceiveCallback, null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error starting UDP receive operation");
                Cleanup();
            }
        }

        private void ReceiveCallback(IAsyncResult ar)
        {
            if (_udpClient == null)
                return;

            try
            {
                var remoteEndPoint = new IPEndPoint(IPAddress.Any, 0);
                var data = _udpClient.EndReceive(ar, ref remoteEndPoint);
                
                if (data != null && data.Length > 0)
                {
                    // 触发数据接收事件
                    DataReceived?.Invoke(this, new DataReceivedEventArgs
                    {
                        Data = data,
                        RemoteEndPoint = remoteEndPoint,
                        Timestamp = DateTime.UtcNow
                    });
                }
                
                // 继续接收
                if (_isListening || IsConnected)
                {
                    BeginReceive();
                }
            }
            catch (ObjectDisposedException)
            {
                // UDP客户端已释放
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in UDP receive callback");
                Cleanup();
            }
        }

        private void Cleanup()
        {
            try
            {
                _udpClient?.Close();
                _udpClient?.Dispose();
                _udpClient = null;
                RemoteEndPoint = null;
                _isListening = false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during UDP cleanup");
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

        ~UdpTransport()
        {
            Dispose(false);
        }
    }
}