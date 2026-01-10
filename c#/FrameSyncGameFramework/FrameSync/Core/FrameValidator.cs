using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Logging;
using FrameSyncGameFramework.Common.Interfaces;

namespace FrameSyncGameFramework.FrameSync.Core
{
    /// <summary>
    /// 帧验证器，用于验证不同客户端的帧一致性
    /// </summary>
    public class FrameValidator
    {
        private readonly Dictionary<uint, int> _frameHashes;
        private readonly ILogger<FrameValidator> _logger;
        private readonly object _lockObject = new object();

        public FrameValidator(ILogger<FrameValidator>? logger = null)
        {
            _frameHashes = new Dictionary<uint, int>();
            _logger = logger ?? Microsoft.Extensions.Logging.Abstractions.NullLogger<FrameValidator>.Instance;
        }

        /// <summary>
        /// 计算游戏状态的哈希值
        /// </summary>
        public int CalculateStateHash(IGameState state)
        {
            if (state == null)
                return 0;

            // 使用简单的哈希算法，确保确定性
            var hash = state.Frame.GetHashCode();
            hash = HashCombine(hash, state.GetType().Name.GetHashCode());
            
            // 这里可以根据具体的游戏状态实现更详细的哈希计算
            // 例如序列化关键状态数据并计算哈希
            
            return hash;
        }

        /// <summary>
        /// 计算输入数据的哈希值
        /// </summary>
        public int CalculateInputsHash(IInput[] inputs)
        {
            if (inputs == null || inputs.Length == 0)
                return 0;

            var sortedInputs = inputs.OrderBy(i => i.PlayerId).ToArray();
            var hash = 0;
            
            foreach (var input in sortedInputs)
            {
                hash = HashCombine(hash, input.GetHash());
                hash = HashCombine(hash, input.PlayerId.GetHashCode());
                hash = HashCombine(hash, input.Frame.GetHashCode());
            }
            
            return hash;
        }

        /// <summary>
        /// 记录帧哈希值
        /// </summary>
        public void RecordFrameHash(uint frame, int stateHash, int inputsHash)
        {
            lock (_lockObject)
            {
                var combinedHash = HashCombine(stateHash, inputsHash);
                _frameHashes[frame] = combinedHash;
                _logger.LogDebug($"Recorded hash for frame {frame}: {combinedHash:X8}");
            }
        }

        /// <summary>
        /// 验证帧哈希值
        /// </summary>
        public bool ValidateFrameHash(uint frame, int stateHash, int inputsHash)
        {
            lock (_lockObject)
            {
                if (!_frameHashes.TryGetValue(frame, out var recordedHash))
                {
                    _logger.LogWarning($"No recorded hash found for frame {frame}");
                    return true; // 如果没有记录，认为验证通过
                }

                var combinedHash = HashCombine(stateHash, inputsHash);
                var isValid = recordedHash == combinedHash;
                
                if (!isValid)
                {
                    _logger.LogError($"Frame hash mismatch at frame {frame}: expected {recordedHash:X8}, got {combinedHash:X8}");
                }
                else
                {
                    _logger.LogDebug($"Frame hash validated for frame {frame}: {combinedHash:X8}");
                }
                
                return isValid;
            }
        }

        /// <summary>
        /// 获取帧哈希值
        /// </summary>
        public int? GetFrameHash(uint frame)
        {
            lock (_lockObject)
            {
                return _frameHashes.TryGetValue(frame, out var hash) ? hash : null;
            }
        }

        /// <summary>
        /// 清理指定帧之前的哈希数据
        /// </summary>
        public void ClearHashesBefore(uint frame)
        {
            lock (_lockObject)
            {
                var framesToRemove = new List<uint>();
                foreach (var storedFrame in _frameHashes.Keys)
                {
                    if (storedFrame < frame)
                    {
                        framesToRemove.Add(storedFrame);
                    }
                }

                foreach (var frameToRemove in framesToRemove)
                {
                    _frameHashes.Remove(frameToRemove);
                }

                if (framesToRemove.Count > 0)
                {
                    _logger.LogDebug($"Cleared {framesToRemove.Count} frame hashes before frame {frame}");
                }
            }
        }

        /// <summary>
        /// 清空所有哈希数据
        /// </summary>
        public void ClearAll()
        {
            lock (_lockObject)
            {
                _frameHashes.Clear();
                _logger.LogInformation("Cleared all frame hashes");
            }
        }

        /// <summary>
        /// 组合两个哈希值
        /// </summary>
        private int HashCombine(int h1, int h2)
        {
            unchecked
            {
                int hash = 17;
                hash = hash * 31 + h1;
                hash = hash * 31 + h2;
                return hash;
            }
        }
    }
}