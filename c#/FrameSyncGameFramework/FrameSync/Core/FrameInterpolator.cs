using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;
using FrameSyncGameFramework.Common.Interfaces;

namespace FrameSyncGameFramework.FrameSync.Core
{
    /// <summary>
    /// 帧插值器，用于平滑渲染和预测
    /// </summary>
    public class FrameInterpolator
    {
        private readonly Dictionary<uint, IGameState> _stateHistory;
        private readonly Dictionary<uint, IInput[]> _inputHistory;
        private readonly int _maxHistorySize;
        private readonly ILogger<FrameInterpolator> _logger;
        private readonly object _lockObject = new object();

        public FrameInterpolator(int maxHistorySize = 60, ILogger<FrameInterpolator>? logger = null)
        {
            _stateHistory = new Dictionary<uint, IGameState>();
            _inputHistory = new Dictionary<uint, IInput[]>();
            _maxHistorySize = maxHistorySize;
            _logger = logger ?? Microsoft.Extensions.Logging.Abstractions.NullLogger<FrameInterpolator>.Instance;
        }

        /// <summary>
        /// 记录游戏状态
        /// </summary>
        public void RecordState(uint frame, IGameState state)
        {
            lock (_lockObject)
            {
                if (state == null)
                {
                    _logger.LogError("Cannot record null state");
                    return;
                }

                _stateHistory[frame] = state.DeepCopy();
                CleanupOldData();
                
                _logger.LogDebug($"Recorded state for frame {frame}");
            }
        }

        /// <summary>
        /// 记录输入数据
        /// </summary>
        public void RecordInputs(uint frame, IInput[] inputs)
        {
            lock (_lockObject)
            {
                if (inputs == null)
                {
                    _logger.LogError("Cannot record null inputs");
                    return;
                }

                var inputsCopy = new IInput[inputs.Length];
                for (int i = 0; i < inputs.Length; i++)
                {
                    inputsCopy[i] = inputs[i].DeepCopy();
                }

                _inputHistory[frame] = inputsCopy;
                CleanupOldData();
                
                _logger.LogDebug($"Recorded {inputs.Length} inputs for frame {frame}");
            }
        }

        /// <summary>
        /// 插值获取状态（用于平滑渲染）
        /// </summary>
        public IGameState? InterpolateState(uint targetFrame)
        {
            lock (_lockObject)
            {
                if (_stateHistory.Count == 0)
                    return null;

                // 如果正好有目标帧的状态，直接返回
                if (_stateHistory.TryGetValue(targetFrame, out var exactState))
                {
                    return exactState.DeepCopy();
                }

                // 获取最近的两个状态进行插值
                var frames = _stateHistory.Keys.OrderBy(f => f).ToArray();
                
                if (targetFrame <= frames[0])
                    return _stateHistory[frames[0]].DeepCopy();
                
                if (targetFrame >= frames[frames.Length - 1])
                    return _stateHistory[frames[frames.Length - 1]].DeepCopy();

                // 找到包围目标帧的两个状态
                uint prevFrame = frames[0];
                uint nextFrame = frames[frames.Length - 1];
                
                for (int i = 0; i < frames.Length - 1; i++)
                {
                    if (frames[i] <= targetFrame && frames[i + 1] >= targetFrame)
                    {
                        prevFrame = frames[i];
                        nextFrame = frames[i + 1];
                        break;
                    }
                }

                var prevState = _stateHistory[prevFrame];
                var nextState = _stateHistory[nextFrame];
                
                // 简单的线性插值因子
                var t = (float)(targetFrame - prevFrame) / (nextFrame - prevFrame);
                
                // 这里需要根据具体的游戏状态实现插值逻辑
                // 返回最接近的状态（简化处理）
                return t < 0.5f ? prevState.DeepCopy() : nextState.DeepCopy();
            }
        }

        /// <summary>
        /// 预测未来状态（用于网络延迟补偿）
        /// </summary>
        public IGameState? PredictState(uint currentFrame, uint targetFrame)
        {
            lock (_lockObject)
            {
                if (targetFrame <= currentFrame)
                    return InterpolateState(targetFrame);

                // 获取当前状态
                if (!_stateHistory.TryGetValue(currentFrame, out var currentState))
                {
                    _logger.LogWarning($"No state found for current frame {currentFrame}");
                    return null;
                }

                // 简单的预测：基于最近的状态变化趋势
                var stateCopy = currentState.DeepCopy();
                
                // 这里可以实现更复杂的预测算法
                // 例如基于物理速度、加速度等进行外推
                
                _logger.LogDebug($"Predicted state from frame {currentFrame} to {targetFrame}");
                return stateCopy;
            }
        }

        /// <summary>
        /// 获取最近的状态
        /// </summary>
        public IGameState? GetLatestState()
        {
            lock (_lockObject)
            {
                if (_stateHistory.Count == 0)
                    return null;

                var latestFrame = _stateHistory.Keys.Max();
                return _stateHistory[latestFrame].DeepCopy();
            }
        }

        /// <summary>
        /// 获取最近的输入
        /// </summary>
        public IInput[]? GetLatestInputs()
        {
            lock (_lockObject)
            {
                if (_inputHistory.Count == 0)
                    return null;

                var latestFrame = _inputHistory.Keys.Max();
                return _inputHistory[latestFrame];
            }
        }

        /// <summary>
        /// 获取状态历史中的所有帧号
        /// </summary>
        public uint[] GetStateFrames()
        {
            lock (_lockObject)
            {
                return _stateHistory.Keys.OrderBy(f => f).ToArray();
            }
        }

        /// <summary>
        /// 获取输入历史中的所有帧号
        /// </summary>
        public uint[] GetInputFrames()
        {
            lock (_lockObject)
            {
                return _inputHistory.Keys.OrderBy(f => f).ToArray();
            }
        }

        /// <summary>
        /// 清理指定帧之前的数据
        /// </summary>
        public void ClearDataBefore(uint frame)
        {
            lock (_lockObject)
            {
                var stateFramesToRemove = new List<uint>();
                var inputFramesToRemove = new List<uint>();

                foreach (var storedFrame in _stateHistory.Keys)
                {
                    if (storedFrame < frame)
                    {
                        stateFramesToRemove.Add(storedFrame);
                    }
                }

                foreach (var storedFrame in _inputHistory.Keys)
                {
                    if (storedFrame < frame)
                    {
                        inputFramesToRemove.Add(storedFrame);
                    }
                }

                foreach (var frameToRemove in stateFramesToRemove)
                {
                    _stateHistory.Remove(frameToRemove);
                }

                foreach (var frameToRemove in inputFramesToRemove)
                {
                    _inputHistory.Remove(frameToRemove);
                }

                if (stateFramesToRemove.Count > 0 || inputFramesToRemove.Count > 0)
                {
                    _logger.LogDebug($"Cleared {stateFramesToRemove.Count} states and {inputFramesToRemove.Count} input sets before frame {frame}");
                }
            }
        }

        /// <summary>
        /// 清空所有数据
        /// </summary>
        public void ClearAll()
        {
            lock (_lockObject)
            {
                _stateHistory.Clear();
                _inputHistory.Clear();
                _logger.LogInformation("Cleared all interpolation data");
            }
        }

        private void CleanupOldData()
        {
            // 清理最老的数据，保持历史记录在合理范围内
            while (_stateHistory.Count > _maxHistorySize)
            {
                var oldestFrame = _stateHistory.Keys.Min();
                _stateHistory.Remove(oldestFrame);
            }

            while (_inputHistory.Count > _maxHistorySize)
            {
                var oldestFrame = _inputHistory.Keys.Min();
                _inputHistory.Remove(oldestFrame);
            }
        }
    }
}