using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using Microsoft.Extensions.Logging;
using FrameSyncGameFramework.Common.Interfaces;
using FrameSyncGameFramework.Snapshot.Interfaces;

namespace FrameSyncGameFramework.Snapshot.Core
{
    /// <summary>
    /// 快照管理器，负责游戏状态的保存和加载
    /// </summary>
    public class SnapshotManager
    {
        private readonly Dictionary<uint, byte[]> _snapshotCache;
        private readonly int _maxCacheSize;
        private readonly ILogger<SnapshotManager> _logger;
        private readonly object _lockObject = new object();

        public SnapshotManager(int maxCacheSize = 10, ILogger<SnapshotManager>? logger = null)
        {
            _snapshotCache = new Dictionary<uint, byte[]>();
            _maxCacheSize = maxCacheSize;
            _logger = logger ?? Microsoft.Extensions.Logging.Abstractions.NullLogger<SnapshotManager>.Instance;
        }

        /// <summary>
        /// 创建快照
        /// </summary>
        public SnapshotData CreateSnapshot(uint frame, IGameState state, IInput[] inputs)
        {
            if (state == null)
                throw new ArgumentNullException(nameof(state));

            lock (_lockObject)
            {
                var snapshot = new SnapshotData
                {
                    Frame = frame,
                    Timestamp = DateTime.UtcNow,
                    StateData = SerializeState(state),
                    InputData = SerializeInputs(inputs),
                    StateHash = CalculateHash(state),
                    InputHash = CalculateHash(inputs)
                };

                _logger.LogDebug($"Created snapshot for frame {frame}, size: {snapshot.StateData.Length + snapshot.InputData.Length} bytes");
                return snapshot;
            }
        }

        /// <summary>
        /// 保存快照到文件
        /// </summary>
        public void SaveSnapshot(string filePath, SnapshotData snapshot, bool compress = true)
        {
            if (string.IsNullOrEmpty(filePath))
                throw new ArgumentException("File path cannot be null or empty", nameof(filePath));

            if (snapshot == null)
                throw new ArgumentNullException(nameof(snapshot));

            try
            {
                var directory = Path.GetDirectoryName(filePath);
                if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }

                using var fileStream = new FileStream(filePath, FileMode.Create, FileAccess.Write);
                
                if (compress)
                {
                    using var compressionStream = new GZipStream(fileStream, CompressionMode.Compress);
                    SerializeSnapshot(compressionStream, snapshot);
                }
                else
                {
                    SerializeSnapshot(fileStream, snapshot);
                }

                _logger.LogInformation($"Saved snapshot to {filePath}, frame: {snapshot.Frame}, compressed: {compress}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to save snapshot to {filePath}");
                throw;
            }
        }

        /// <summary>
        /// 从文件加载快照
        /// </summary>
        public SnapshotData LoadSnapshot(string filePath, bool compressed = true)
        {
            if (string.IsNullOrEmpty(filePath))
                throw new ArgumentException("File path cannot be null or empty", nameof(filePath));

            if (!File.Exists(filePath))
                throw new FileNotFoundException($"Snapshot file not found: {filePath}");

            try
            {
                using var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
                SnapshotData snapshot;
                
                if (compressed)
                {
                    using var compressionStream = new GZipStream(fileStream, CompressionMode.Decompress);
                    snapshot = DeserializeSnapshot(compressionStream);
                }
                else
                {
                    snapshot = DeserializeSnapshot(fileStream);
                }

                _logger.LogInformation($"Loaded snapshot from {filePath}, frame: {snapshot.Frame}");
                return snapshot;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to load snapshot from {filePath}");
                throw;
            }
        }

        /// <summary>
        /// 验证快照完整性
        /// </summary>
        public bool ValidateSnapshot(SnapshotData snapshot)
        {
            if (snapshot == null)
                return false;

            try
            {
                var stateValid = VerifyHash(snapshot.StateData, snapshot.StateHash);
                var inputValid = VerifyHash(snapshot.InputData, snapshot.InputHash);
                
                var isValid = stateValid && inputValid;
                
                if (isValid)
                {
                    _logger.LogDebug($"Snapshot validation passed for frame {snapshot.Frame}");
                }
                else
                {
                    _logger.LogError($"Snapshot validation failed for frame {snapshot.Frame}: stateValid={stateValid}, inputValid={inputValid}");
                }
                
                return isValid;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error validating snapshot for frame {snapshot.Frame}");
                return false;
            }
        }

        /// <summary>
        /// 缓存快照
        /// </summary>
        public void CacheSnapshot(uint frame, SnapshotData snapshot)
        {
            if (snapshot == null)
                return;

            lock (_lockObject)
            {
                var serializedSnapshot = SerializeSnapshotToBytes(snapshot);
                _snapshotCache[frame] = serializedSnapshot;
                
                // 清理最老的缓存
                while (_snapshotCache.Count > _maxCacheSize)
                {
                    var oldestFrame = _snapshotCache.Keys.Min();
                    _snapshotCache.Remove(oldestFrame);
                }
                
                _logger.LogDebug($"Cached snapshot for frame {frame}, cache size: {_snapshotCache.Count}");
            }
        }

        /// <summary>
        /// 从缓存获取快照
        /// </summary>
        public SnapshotData? GetCachedSnapshot(uint frame)
        {
            lock (_lockObject)
            {
                if (_snapshotCache.TryGetValue(frame, out var serializedSnapshot))
                {
                    var snapshot = DeserializeSnapshotFromBytes(serializedSnapshot);
                    _logger.LogDebug($"Retrieved cached snapshot for frame {frame}");
                    return snapshot;
                }
                
                return null;
            }
        }

        /// <summary>
        /// 清理缓存
        /// </summary>
        public void ClearCache()
        {
            lock (_lockObject)
            {
                _snapshotCache.Clear();
                _logger.LogInformation("Cleared snapshot cache");
            }
        }

        /// <summary>
        /// 获取缓存统计信息
        /// </summary>
        public (int Count, long TotalSize) GetCacheStats()
        {
            lock (_lockObject)
            {
                var totalSize = _snapshotCache.Values.Sum(data => data.Length);
                return (_snapshotCache.Count, totalSize);
            }
        }

        private byte[] SerializeState(IGameState state)
        {
            using var stream = new MemoryStream();
            using var writer = new BinaryWriter(stream);
            
            if (state is ISnapshotable snapshotable)
            {
                snapshotable.Serialize(writer);
            }
            else
            {
                // 默认序列化实现
                writer.Write(state.Frame);
            }
            
            return stream.ToArray();
        }

        private byte[] SerializeInputs(IInput[] inputs)
        {
            using var stream = new MemoryStream();
            using var writer = new BinaryWriter(stream);
            
            writer.Write(inputs?.Length ?? 0);
            
            if (inputs != null)
            {
                foreach (var input in inputs)
                {
                    if (input is ISnapshotable snapshotable)
                    {
                        snapshotable.Serialize(writer);
                    }
                    else
                    {
                        // 默认序列化实现
                        writer.Write(input.PlayerId);
                        writer.Write(input.Frame);
                        writer.Write(input.GetHash());
                    }
                }
            }
            
            return stream.ToArray();
        }

        private void SerializeSnapshot(Stream stream, SnapshotData snapshot)
        {
            using var writer = new BinaryWriter(stream);
            
            writer.Write(snapshot.Frame);
            writer.Write(snapshot.Timestamp.ToBinary());
            writer.Write(snapshot.StateData.Length);
            writer.Write(snapshot.StateData);
            writer.Write(snapshot.InputData.Length);
            writer.Write(snapshot.InputData);
            writer.Write(snapshot.StateHash);
            writer.Write(snapshot.InputHash);
        }

        private SnapshotData DeserializeSnapshot(Stream stream)
        {
            using var reader = new BinaryReader(stream);
            
            var snapshot = new SnapshotData
            {
                Frame = reader.ReadUInt32(),
                Timestamp = DateTime.FromBinary(reader.ReadInt64()),
                StateData = reader.ReadBytes(reader.ReadInt32()),
                InputData = reader.ReadBytes(reader.ReadInt32()),
                StateHash = reader.ReadInt32(),
                InputHash = reader.ReadInt32()
            };
            
            return snapshot;
        }

        private byte[] SerializeSnapshotToBytes(SnapshotData snapshot)
        {
            using var stream = new MemoryStream();
            SerializeSnapshot(stream, snapshot);
            return stream.ToArray();
        }

        private SnapshotData DeserializeSnapshotFromBytes(byte[] data)
        {
            using var stream = new MemoryStream(data);
            return DeserializeSnapshot(stream);
        }

        private int CalculateHash(IGameState state)
        {
            var data = SerializeState(state);
            return CalculateHash(data);
        }

        private int CalculateHash(IInput[] inputs)
        {
            var data = SerializeInputs(inputs);
            return CalculateHash(data);
        }

        private int CalculateHash(byte[] data)
        {
            if (data == null || data.Length == 0)
                return 0;

            // 简单的哈希算法
            var hash = 0;
            foreach (var b in data)
            {
                hash = ((hash << 5) + hash) ^ b;
            }
            return hash;
        }

        private bool VerifyHash(byte[] data, int expectedHash)
        {
            var actualHash = CalculateHash(data);
            return actualHash == expectedHash;
        }
    }

    /// <summary>
    /// 快照数据
    /// </summary>
    public class SnapshotData
    {
        public uint Frame { get; set; }
        public DateTime Timestamp { get; set; }
        public byte[] StateData { get; set; } = Array.Empty<byte>();
        public byte[] InputData { get; set; } = Array.Empty<byte>();
        public int StateHash { get; set; }
        public int InputHash { get; set; }

        public long GetTotalSize()
        {
            return StateData.Length + InputData.Length;
        }
    }
}