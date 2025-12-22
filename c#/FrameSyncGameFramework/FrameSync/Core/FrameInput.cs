using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;
using FrameSyncGameFramework.Common.Interfaces;
using FrameSyncGameFramework.FrameSync.Interfaces;

namespace FrameSyncGameFramework.FrameSync.Core
{
    /// <summary>
    /// 帧输入管理器实现，负责收集和管理玩家输入
    /// </summary>
    public class FrameInput : IFrameInput
    {
        private readonly Dictionary<uint, Dictionary<byte, IInput>> _frameInputs;
        private readonly Queue<uint> _frameQueue;
        private readonly int _maxStoredFrames;
        private readonly ILogger<FrameInput> _logger;
        private readonly object _lockObject = new object();

        public FrameInput(int maxStoredFrames = 300, ILogger<FrameInput>? logger = null)
        {
            _frameInputs = new Dictionary<uint, Dictionary<byte, IInput>>();
            _frameQueue = new Queue<uint>();
            _maxStoredFrames = maxStoredFrames;
            _logger = logger ?? Microsoft.Extensions.Logging.Abstractions.NullLogger<FrameInput>.Instance;
        }

        public void AddInput(IInput input)
        {
            if (input == null)
            {
                _logger.LogError("Cannot add null input");
                return;
            }

            lock (_lockObject)
            {
                var frame = input.Frame;
                var playerId = input.PlayerId;

                if (!_frameInputs.TryGetValue(frame, out var playerInputs))
                {
                    playerInputs = new Dictionary<byte, IInput>();
                    _frameInputs[frame] = playerInputs;
                    _frameQueue.Enqueue(frame);
                }

                if (playerInputs.ContainsKey(playerId))
                {
                    _logger.LogWarning($"Input already exists for player {playerId} at frame {frame}, replacing");
                }

                playerInputs[playerId] = input.DeepCopy();
                
                // 清理过期的帧数据
                CleanupOldFrames();
                
                _logger.LogDebug($"Added input for player {playerId} at frame {frame}");
            }
        }

        public IInput[] GetInputs(uint frame)
        {
            lock (_lockObject)
            {
                if (!_frameInputs.TryGetValue(frame, out var playerInputs))
                {
                    return Array.Empty<IInput>();
                }

                return playerInputs.Values.ToArray();
            }
        }

        public IInput? GetInput(uint frame, byte playerId)
        {
            lock (_lockObject)
            {
                if (!_frameInputs.TryGetValue(frame, out var playerInputs))
                {
                    return null;
                }

                return playerInputs.TryGetValue(playerId, out var input) ? input.DeepCopy() : null;
            }
        }

        public void ClearInputsBefore(uint frame)
        {
            lock (_lockObject)
            {
                var framesToRemove = new List<uint>();
                
                foreach (var storedFrame in _frameQueue)
                {
                    if (storedFrame < frame)
                    {
                        framesToRemove.Add(storedFrame);
                    }
                    else
                    {
                        break;
                    }
                }

                foreach (var frameToRemove in framesToRemove)
                {
                    _frameInputs.Remove(frameToRemove);
                    _frameQueue.Dequeue();
                }

                if (framesToRemove.Count > 0)
                {
                    _logger.LogDebug($"Cleared {framesToRemove.Count} frames before frame {frame}");
                }
            }
        }

        public bool HasAllInputs(uint frame, int playerCount)
        {
            lock (_lockObject)
            {
                if (!_frameInputs.TryGetValue(frame, out var playerInputs))
                {
                    return false;
                }

                return playerInputs.Count == playerCount;
            }
        }

        private void CleanupOldFrames()
        {
            while (_frameQueue.Count > _maxStoredFrames)
            {
                var oldestFrame = _frameQueue.Dequeue();
                _frameInputs.Remove(oldestFrame);
                _logger.LogDebug($"Removed old frame {oldestFrame} from storage");
            }
        }

        /// <summary>
        /// 获取所有存储的帧号（用于调试和序列化）
        /// </summary>
        public uint[] GetStoredFrames()
        {
            lock (_lockObject)
            {
                return _frameQueue.ToArray();
            }
        }

        /// <summary>
        /// 清空所有输入数据
        /// </summary>
        public void ClearAll()
        {
            lock (_lockObject)
            {
                _frameInputs.Clear();
                _frameQueue.Clear();
                _logger.LogInformation("Cleared all frame inputs");
            }
        }
    }
}