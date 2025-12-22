using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using FrameSyncGameFramework.Networking.Interfaces;

namespace FrameSyncGameFramework.Networking.Core
{
    /// <summary>
    /// 心跳管理器，负责维护网络连接的健康状态
    /// </summary>
    public class HeartbeatManager
    {
        private readonly Dictionary<byte, HeartbeatState> _heartbeatStates;
        private readonly int _heartbeatIntervalMs;
        private readonly int _timeoutMs;
        private readonly ILogger<HeartbeatManager> _logger;
        private readonly object _lockObject = new object();
        private Timer? _heartbeatTimer;
        private bool _isRunning;

        public bool IsRunning => _isRunning;

        public event Action<byte>? HeartbeatTimeout;
        public event Action<byte, TimeSpan>? HeartbeatReceived;

        public HeartbeatManager(int heartbeatIntervalMs = 1000, int timeoutMs = 5000, ILogger<HeartbeatManager>? logger = null)
        {
            _heartbeatStates = new Dictionary<byte, HeartbeatState>();
            _heartbeatIntervalMs = heartbeatIntervalMs;
            _timeoutMs = timeoutMs;
            _logger = logger ?? Microsoft.Extensions.Logging.Abstractions.NullLogger<HeartbeatManager>.Instance;
            _isRunning = false;
        }

        /// <summary>
        /// 启动心跳管理
        /// </summary>
        public void Start()
        {
            lock (_lockObject)
            {
                if (_isRunning)
                {
                    _logger.LogWarning("Heartbeat manager is already running");
                    return;
                }

                _isRunning = true;
                _heartbeatTimer = new Timer(HeartbeatTick, null, _heartbeatIntervalMs, _heartbeatIntervalMs);
                
                _logger.LogInformation($"Heartbeat manager started with interval {_heartbeatIntervalMs}ms, timeout {_timeoutMs}ms");
            }
        }

        /// <summary>
        /// 停止心跳管理
        /// </summary>
        public void Stop()
        {
            lock (_lockObject)
            {
                if (!_isRunning)
                {
                    _logger.LogWarning("Heartbeat manager is not running");
                    return;
                }

                _isRunning = false;
                _heartbeatTimer?.Dispose();
                _heartbeatTimer = null;
                
                _logger.LogInformation("Heartbeat manager stopped");
            }
        }

        /// <summary>
        /// 注册玩家心跳
        /// </summary>
        public void RegisterPlayer(byte playerId)
        {
            lock (_lockObject)
            {
                var state = new HeartbeatState
                {
                    PlayerId = playerId,
                    LastHeartbeatTime = DateTime.UtcNow,
                    IsAlive = true,
                    MissedHeartbeats = 0
                };

                _heartbeatStates[playerId] = state;
                
                _logger.LogDebug($"Registered heartbeat for player {playerId}");
            }
        }

        /// <summary>
        /// 注销玩家心跳
        /// </summary>
        public void UnregisterPlayer(byte playerId)
        {
            lock (_lockObject)
            {
                if (_heartbeatStates.Remove(playerId))
                {
                    _logger.LogDebug($"Unregistered heartbeat for player {playerId}");
                }
                else
                {
                    _logger.LogWarning($"Player {playerId} not found in heartbeat registry");
                }
            }
        }

        /// <summary>
        /// 更新玩家心跳（收到心跳包时调用）
        /// </summary>
        public void UpdateHeartbeat(byte playerId)
        {
            lock (_lockObject)
            {
                if (!_heartbeatStates.TryGetValue(playerId, out var state))
                {
                    // 如果玩家未注册，自动注册
                    RegisterPlayer(playerId);
                    return;
                }

                var now = DateTime.UtcNow;
                var latency = now - state.LastHeartbeatTime;
                
                state.LastHeartbeatTime = now;
                state.IsAlive = true;
                state.MissedHeartbeats = 0;
                
                HeartbeatReceived?.Invoke(playerId, latency);
                
                _logger.LogDebug($"Updated heartbeat for player {playerId}, latency: {latency.TotalMilliseconds:F1}ms");
            }
        }

        /// <summary>
        /// 检查玩家是否在线
        /// </summary>
        public bool IsPlayerAlive(byte playerId)
        {
            lock (_lockObject)
            {
                return _heartbeatStates.TryGetValue(playerId, out var state) && state.IsAlive;
            }
        }

        /// <summary>
        /// 获取玩家延迟
        /// </summary>
        public TimeSpan GetPlayerLatency(byte playerId)
        {
            lock (_lockObject)
            {
                if (_heartbeatStates.TryGetValue(playerId, out var state))
                {
                    return DateTime.UtcNow - state.LastHeartbeatTime;
                }
                
                return TimeSpan.MaxValue;
            }
        }

        /// <summary>
        /// 获取所有在线玩家
        /// </summary>
        public List<byte> GetAlivePlayers()
        {
            lock (_lockObject)
            {
                var alivePlayers = new List<byte>();
                
                foreach (var kvp in _heartbeatStates)
                {
                    if (kvp.Value.IsAlive)
                    {
                        alivePlayers.Add(kvp.Key);
                    }
                }
                
                return alivePlayers;
            }
        }

        /// <summary>
        /// 获取心跳统计信息
        /// </summary>
        public HeartbeatStatistics GetStatistics()
        {
            lock (_lockObject)
            {
                var totalPlayers = _heartbeatStates.Count;
                var alivePlayers = 0;
                var totalLatency = TimeSpan.Zero;
                
                foreach (var state in _heartbeatStates.Values)
                {
                    if (state.IsAlive)
                    {
                        alivePlayers++;
                        totalLatency += DateTime.UtcNow - state.LastHeartbeatTime;
                    }
                }
                
                var averageLatency = alivePlayers > 0 ? totalLatency / alivePlayers : TimeSpan.Zero;
                
                return new HeartbeatStatistics
                {
                    TotalPlayers = totalPlayers,
                    AlivePlayers = alivePlayers,
                    DeadPlayers = totalPlayers - alivePlayers,
                    AverageLatency = averageLatency,
                    IsRunning = _isRunning
                };
            }
        }

        /// <summary>
        /// 清空所有玩家
        /// </summary>
        public void ClearAllPlayers()
        {
            lock (_lockObject)
            {
                _heartbeatStates.Clear();
                _logger.LogInformation("Cleared all players from heartbeat registry");
            }
        }

        private void HeartbeatTick(object? state)
        {
            if (!_isRunning)
                return;

            lock (_lockObject)
            {
                var now = DateTime.UtcNow;
                var timeoutPlayers = new List<byte>();
                
                foreach (var kvp in _heartbeatStates)
                {
                    var playerId = kvp.Key;
                    var heartbeatState = kvp.Value;
                    
                    var timeSinceLastHeartbeat = now - heartbeatState.LastHeartbeatTime;
                    
                    if (timeSinceLastHeartbeat.TotalMilliseconds > _timeoutMs)
                    {
                        heartbeatState.MissedHeartbeats++;
                        
                        if (heartbeatState.IsAlive)
                        {
                            heartbeatState.IsAlive = false;
                            timeoutPlayers.Add(playerId);
                            
                            _logger.LogWarning($"Player {playerId} heartbeat timeout after {timeSinceLastHeartbeat.TotalMilliseconds:F1}ms");
                        }
                    }
                }
                
                // 触发超时事件
                foreach (var playerId in timeoutPlayers)
                {
                    HeartbeatTimeout?.Invoke(playerId);
                }
            }
        }

        private class HeartbeatState
        {
            public byte PlayerId { get; set; }
            public DateTime LastHeartbeatTime { get; set; }
            public bool IsAlive { get; set; }
            public int MissedHeartbeats { get; set; }
        }
    }

    /// <summary>
    /// 心跳统计信息
    /// </summary>
    public class HeartbeatStatistics
    {
        public int TotalPlayers { get; set; }
        public int AlivePlayers { get; set; }
        public int DeadPlayers { get; set; }
        public TimeSpan AverageLatency { get; set; }
        public bool IsRunning { get; set; }
    }
}