using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using FrameSyncGameFramework.Networking.Interfaces;
using FrameSyncGameFramework.Networking.Transports;

namespace FrameSyncGameFramework.Networking.Core
{
    /// <summary>
    /// 网络管理器，负责管理网络连接和数据传输
    /// </summary>
    public class NetworkManager
    {
        private readonly Dictionary<byte, INetworkTransport> _connections;
        private readonly ILogger<NetworkManager> _logger;
        private readonly object _lockObject = new object();

        public IReadOnlyDictionary<byte, INetworkTransport> Connections => _connections;
        public int ConnectionCount => _connections.Count;

        public event Action<byte, byte[]>? DataReceived;
        public event Action<byte, bool>? ConnectionStateChanged;

        public NetworkManager(ILogger<NetworkManager>? logger = null)
        {
            _connections = new Dictionary<byte, INetworkTransport>();
            _logger = logger ?? Microsoft.Extensions.Logging.Abstractions.NullLogger<NetworkManager>.Instance;
        }

        /// <summary>
        /// 添加连接
        /// </summary>
        public bool AddConnection(byte playerId, INetworkTransport transport)
        {
            if (transport == null)
                throw new ArgumentNullException(nameof(transport));

            lock (_lockObject)
            {
                if (_connections.ContainsKey(playerId))
                {
                    _logger.LogWarning($"Connection for player {playerId} already exists");
                    return false;
                }

                // 订阅事件
                transport.DataReceived += OnDataReceived;
                transport.ConnectionStateChanged += OnConnectionStateChanged;
                
                _connections[playerId] = transport;
                
                _logger.LogInformation($"Added connection for player {playerId}");
                return true;
            }
        }

        /// <summary>
        /// 移除连接
        /// </summary>
        public bool RemoveConnection(byte playerId)
        {
            lock (_lockObject)
            {
                if (!_connections.TryGetValue(playerId, out var transport))
                {
                    _logger.LogWarning($"Connection for player {playerId} not found");
                    return false;
                }

                // 取消订阅事件
                transport.DataReceived -= OnDataReceived;
                transport.ConnectionStateChanged -= OnConnectionStateChanged;
                
                // 释放资源
                transport.Dispose();
                
                _connections.Remove(playerId);
                
                _logger.LogInformation($"Removed connection for player {playerId}");
                return true;
            }
        }

        /// <summary>
        /// 获取连接
        /// </summary>
        public INetworkTransport? GetConnection(byte playerId)
        {
            lock (_lockObject)
            {
                return _connections.TryGetValue(playerId, out var transport) ? transport : null;
            }
        }

        /// <summary>
        /// 向指定玩家发送数据
        /// </summary>
        public async Task<bool> SendToPlayerAsync(byte playerId, byte[] data)
        {
            if (data == null)
                throw new ArgumentNullException(nameof(data));

            var transport = GetConnection(playerId);
            if (transport == null)
            {
                _logger.LogError($"No connection found for player {playerId}");
                return false;
            }

            if (!transport.IsConnected)
            {
                _logger.LogError($"Connection for player {playerId} is not connected");
                return false;
            }

            try
            {
                var success = await transport.SendAsync(data);
                if (!success)
                {
                    _logger.LogWarning($"Failed to send data to player {playerId}");
                }
                return success;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error sending data to player {playerId}");
                return false;
            }
        }

        /// <summary>
        /// 向所有玩家广播数据
        /// </summary>
        public async Task BroadcastAsync(byte[] data)
        {
            if (data == null)
                throw new ArgumentNullException(nameof(data));

            var tasks = new List<Task<bool>>();
            
            lock (_lockObject)
            {
                foreach (var kvp in _connections)
                {
                    var task = SendToPlayerAsync(kvp.Key, data);
                    tasks.Add(task);
                }
            }

            var results = await Task.WhenAll(tasks);
            var successCount = 0;
            
            foreach (var result in results)
            {
                if (result)
                    successCount++;
            }

            _logger.LogDebug($"Broadcast completed: {successCount}/{results.Length} successful");
        }

        /// <summary>
        /// 向所有玩家广播数据（排除指定玩家）
        /// </summary>
        public async Task BroadcastExceptAsync(byte excludedPlayerId, byte[] data)
        {
            if (data == null)
                throw new ArgumentNullException(nameof(data));

            var tasks = new List<Task<bool>>();
            
            lock (_lockObject)
            {
                foreach (var kvp in _connections)
                {
                    if (kvp.Key != excludedPlayerId)
                    {
                        var task = SendToPlayerAsync(kvp.Key, data);
                        tasks.Add(task);
                    }
                }
            }

            var results = await Task.WhenAll(tasks);
            var successCount = 0;
            
            foreach (var result in results)
            {
                if (result)
                    successCount++;
            }

            _logger.LogDebug($"Broadcast except player {excludedPlayerId} completed: {successCount}/{results.Length} successful");
        }

        /// <summary>
        /// 检查玩家是否连接
        /// </summary>
        public bool IsPlayerConnected(byte playerId)
        {
            var transport = GetConnection(playerId);
            return transport?.IsConnected ?? false;
        }

        /// <summary>
        /// 获取所有已连接的玩家
        /// </summary>
        public List<byte> GetConnectedPlayers()
        {
            lock (_lockObject)
            {
                var connectedPlayers = new List<byte>();
                
                foreach (var kvp in _connections)
                {
                    if (kvp.Value.IsConnected)
                    {
                        connectedPlayers.Add(kvp.Key);
                    }
                }
                
                return connectedPlayers;
            }
        }

        /// <summary>
        /// 断开所有连接
        /// </summary>
        public void DisconnectAll()
        {
            lock (_lockObject)
            {
                var playerIds = new List<byte>(_connections.Keys);
                
                foreach (var playerId in playerIds)
                {
                    RemoveConnection(playerId);
                }
            }
        }

        /// <summary>
        /// 创建TCP连接
        /// </summary>
        public async Task<bool> CreateTcpConnection(byte playerId, IPEndPoint remoteEndPoint)
        {
            var transport = new TcpTransport(logger: 
                Microsoft.Extensions.Logging.Abstractions.NullLogger<TcpTransport>.Instance);
            
            var connected = await transport.ConnectAsync(remoteEndPoint);
            if (connected)
            {
                return AddConnection(playerId, transport);
            }
            else
            {
                transport.Dispose();
                return false;
            }
        }

        /// <summary>
        /// 创建UDP连接
        /// </summary>
        public async Task<bool> CreateUdpConnection(byte playerId, IPEndPoint remoteEndPoint)
        {
            var transport = new UdpTransport(logger: 
                Microsoft.Extensions.Logging.Abstractions.NullLogger<UdpTransport>.Instance);
            
            var connected = await transport.ConnectAsync(remoteEndPoint);
            if (connected)
            {
                return AddConnection(playerId, transport);
            }
            else
            {
                transport.Dispose();
                return false;
            }
        }

        /// <summary>
        /// 启动TCP服务器
        /// </summary>
        public async Task<bool> StartTcpServer(IPEndPoint localEndPoint)
        {
            var transport = new TcpTransport(logger: 
                Microsoft.Extensions.Logging.Abstractions.NullLogger<TcpTransport>.Instance);
            
            var started = await transport.StartListeningAsync(localEndPoint);
            if (started)
            {
                // 服务器不需要特定的玩家ID，使用0表示服务器
                return AddConnection(0, transport);
            }
            else
            {
                transport.Dispose();
                return false;
            }
        }

        /// <summary>
        /// 启动UDP服务器
        /// </summary>
        public async Task<bool> StartUdpServer(IPEndPoint localEndPoint)
        {
            var transport = new UdpTransport(logger: 
                Microsoft.Extensions.Logging.Abstractions.NullLogger<UdpTransport>.Instance);
            
            var started = await transport.StartListeningAsync(localEndPoint);
            if (started)
            {
                // 服务器不需要特定的玩家ID，使用0表示服务器
                return AddConnection(0, transport);
            }
            else
            {
                transport.Dispose();
                return false;
            }
        }

        private void OnDataReceived(object? sender, DataReceivedEventArgs e)
        {
            if (sender is INetworkTransport transport)
            {
                // 找到对应的玩家ID
                byte? playerId = null;
                
                lock (_lockObject)
                {
                    foreach (var kvp in _connections)
                    {
                        if (kvp.Value == transport)
                        {
                            playerId = kvp.Key;
                            break;
                        }
                    }
                }

                if (playerId.HasValue)
                {
                    DataReceived?.Invoke(playerId.Value, e.Data);
                }
                else
                {
                    _logger.LogWarning("Received data from unknown transport");
                }
            }
        }

        private void OnConnectionStateChanged(object? sender, ConnectionStateEventArgs e)
        {
            if (sender is INetworkTransport transport)
            {
                // 找到对应的玩家ID
                byte? playerId = null;
                
                lock (_lockObject)
                {
                    foreach (var kvp in _connections)
                    {
                        if (kvp.Value == transport)
                        {
                            playerId = kvp.Key;
                            break;
                        }
                    }
                }

                if (playerId.HasValue)
                {
                    ConnectionStateChanged?.Invoke(playerId.Value, e.IsConnected);
                    
                    if (!e.IsConnected)
                    {
                        _logger.LogWarning($"Player {playerId} disconnected: {e.Reason}");
                    }
                }
            }
        }

        public void Dispose()
        {
            DisconnectAll();
        }
    }
}