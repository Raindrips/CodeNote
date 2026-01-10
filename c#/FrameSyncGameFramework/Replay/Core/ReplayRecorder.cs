using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using Microsoft.Extensions.Logging;
using FrameSyncGameFramework.Common.Interfaces;
using FrameSyncGameFramework.Snapshot.Core;

namespace FrameSyncGameFramework.Replay.Core
{
    /// <summary>
    /// 回放录制器，负责记录游戏过程
    /// </summary>
    public class ReplayRecorder
    {
        private readonly List<ReplayFrame> _frames;
        private readonly Dictionary<string, string> _metadata;
        private readonly ILogger<ReplayRecorder> _logger;
        private bool _isRecording;
        private DateTime _startTime;
        private uint _startFrame;

        public bool IsRecording => _isRecording;
        public uint RecordedFrames => (uint)_frames.Count;
        public TimeSpan RecordedDuration => _isRecording ? DateTime.UtcNow - _startTime : TimeSpan.Zero;

        public ReplayRecorder(ILogger<ReplayRecorder>? logger = null)
        {
            _frames = new List<ReplayFrame>();
            _metadata = new Dictionary<string, string>();
            _logger = logger ?? Microsoft.Extensions.Logging.Abstractions.NullLogger<ReplayRecorder>.Instance;
            _isRecording = false;
        }

        /// <summary>
        /// 开始录制
        /// </summary>
        public void StartRecording(uint startFrame, Dictionary<string, string>? metadata = null)
        {
            if (_isRecording)
            {
                _logger.LogWarning("Recording is already in progress");
                return;
            }

            _frames.Clear();
            _metadata.Clear();
            
            _startFrame = startFrame;
            _startTime = DateTime.UtcNow;
            _isRecording = true;

            // 添加元数据
            _metadata["StartFrame"] = startFrame.ToString();
            _metadata["StartTime"] = _startTime.ToString("O");
            _metadata["Version"] = "1.0";

            if (metadata != null)
            {
                foreach (var kvp in metadata)
                {
                    _metadata[kvp.Key] = kvp.Value;
                }
            }

            _logger.LogInformation($"Started recording from frame {startFrame}");
        }

        /// <summary>
        /// 停止录制
        /// </summary>
        public void StopRecording()
        {
            if (!_isRecording)
            {
                _logger.LogWarning("Recording is not in progress");
                return;
            }

            _isRecording = false;
            var endTime = DateTime.UtcNow;
            var duration = endTime - _startTime;

            // 更新元数据
            _metadata["EndTime"] = endTime.ToString("O");
            _metadata["Duration"] = duration.TotalSeconds.ToString("F2");
            _metadata["TotalFrames"] = _frames.Count.ToString();

            _logger.LogInformation($"Stopped recording. Total frames: {_frames.Count}, Duration: {duration.TotalSeconds:F2}s");
        }

        /// <summary>
        /// 记录一帧
        /// </summary>
        public void RecordFrame(uint frame, IGameState state, IInput[] inputs)
        {
            if (!_isRecording)
            {
                _logger.LogWarning("Cannot record frame when not recording");
                return;
            }

            if (state == null)
            {
                _logger.LogError("Cannot record null state");
                return;
            }

            var replayFrame = new ReplayFrame
            {
                Frame = frame,
                Timestamp = DateTime.UtcNow,
                StateHash = CalculateStateHash(state),
                InputHash = CalculateInputsHash(inputs),
                StateData = SerializeState(state),
                InputData = SerializeInputs(inputs)
            };

            _frames.Add(replayFrame);
            
            _logger.LogDebug($"Recorded frame {frame}, inputs: {inputs?.Length ?? 0}");
        }

        /// <summary>
        /// 记录关键帧（完整状态）
        /// </summary>
        public void RecordKeyFrame(uint frame, IGameState state, IInput[] inputs)
        {
            if (!_isRecording)
            {
                _logger.LogWarning("Cannot record key frame when not recording");
                return;
            }

            if (state == null)
            {
                _logger.LogError("Cannot record null state");
                return;
            }

            var replayFrame = new ReplayFrame
            {
                Frame = frame,
                Timestamp = DateTime.UtcNow,
                IsKeyFrame = true,
                StateHash = CalculateStateHash(state),
                InputHash = CalculateInputsHash(inputs),
                StateData = SerializeState(state),
                InputData = SerializeInputs(inputs),
                FullStateData = SerializeFullState(state)
            };

            _frames.Add(replayFrame);
            
            _logger.LogInformation($"Recorded key frame {frame}, size: {replayFrame.GetTotalSize()} bytes");
        }

        /// <summary>
        /// 添加自定义事件
        /// </summary>
        public void AddEvent(string eventType, string eventData, uint frame)
        {
            if (!_isRecording)
            {
                _logger.LogWarning("Cannot add event when not recording");
                return;
            }

            if (string.IsNullOrEmpty(eventType))
            {
                _logger.LogError("Event type cannot be null or empty");
                return;
            }

            var replayEvent = new ReplayEvent
            {
                Frame = frame,
                Timestamp = DateTime.UtcNow,
                EventType = eventType,
                EventData = eventData ?? string.Empty
            };

            // 找到对应的帧或创建新的事件帧
            var targetFrame = _frames.Find(f => f.Frame == frame);
            if (targetFrame != null)
            {
                targetFrame.Events ??= new List<ReplayEvent>();
                targetFrame.Events.Add(replayEvent);
            }
            else
            {
                // 创建只包含事件的特殊帧
                var eventFrame = new ReplayFrame
                {
                    Frame = frame,
                    Timestamp = DateTime.UtcNow,
                    Events = new List<ReplayEvent> { replayEvent }
                };
                _frames.Add(eventFrame);
            }

            _logger.LogDebug($"Added event '{eventType}' at frame {frame}");
        }

        /// <summary>
        /// 保存录制到文件
        /// </summary>
        public void SaveToFile(string filePath, bool compress = true)
        {
            if (_isRecording)
            {
                _logger.LogWarning("Cannot save replay while recording is in progress");
                return;
            }

            if (_frames.Count == 0)
            {
                _logger.LogWarning("No frames to save");
                return;
            }

            try
            {
                var replayData = CreateReplayData();
                
                var directory = Path.GetDirectoryName(filePath);
                if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }

                using var fileStream = new FileStream(filePath, FileMode.Create, FileAccess.Write);
                
                if (compress)
                {
                    using var compressionStream = new GZipStream(fileStream, CompressionLevel.Optimal);
                    SerializeReplayData(compressionStream, replayData);
                }
                else
                {
                    SerializeReplayData(fileStream, replayData);
                }

                var fileSize = new FileInfo(filePath).Length;
                _logger.LogInformation($"Saved replay to {filePath}, frames: {_frames.Count}, size: {fileSize} bytes, compressed: {compress}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to save replay to {filePath}");
                throw;
            }
        }

        /// <summary>
        /// 获取录制统计信息
        /// </summary>
        public ReplayStatistics GetStatistics()
        {
            var keyFrames = _frames.Count(f => f.IsKeyFrame);
            var totalEvents = _frames.Sum(f => f.Events?.Count ?? 0);
            var totalSize = _frames.Sum(f => f.GetTotalSize());
            var avgFrameSize = _frames.Count > 0 ? totalSize / _frames.Count : 0;

            return new ReplayStatistics
            {
                TotalFrames = _frames.Count,
                KeyFrames = keyFrames,
                TotalEvents = totalEvents,
                TotalSize = totalSize,
                AverageFrameSize = avgFrameSize,
                Duration = _isRecording ? DateTime.UtcNow - _startTime : TimeSpan.Zero,
                StartFrame = _startFrame,
                EndFrame = _frames.Count > 0 ? _frames[_frames.Count - 1].Frame : _startFrame
            };
        }

        /// <summary>
        /// 清空录制数据
        /// </summary>
        public void Clear()
        {
            _frames.Clear();
            _metadata.Clear();
            _isRecording = false;
            
            _logger.LogInformation("Cleared all replay data");
        }

        private ReplayData CreateReplayData()
        {
            return new ReplayData
            {
                Version = 1,
                Metadata = new Dictionary<string, string>(_metadata),
                Frames = new List<ReplayFrame>(_frames),
                Statistics = GetStatistics()
            };
        }

        private void SerializeReplayData(Stream stream, ReplayData replayData)
        {
            using var writer = new BinaryWriter(stream);
            
            // 写入头部信息
            writer.Write(replayData.Version);
            writer.Write(replayData.Metadata.Count);
            
            // 写入元数据
            foreach (var kvp in replayData.Metadata)
            {
                writer.Write(kvp.Key);
                writer.Write(kvp.Value);
            }
            
            // 写入帧数据
            writer.Write(replayData.Frames.Count);
            foreach (var frame in replayData.Frames)
            {
                SerializeFrame(writer, frame);
            }
        }

        private void SerializeFrame(BinaryWriter writer, ReplayFrame frame)
        {
            writer.Write(frame.Frame);
            writer.Write(frame.Timestamp.ToBinary());
            writer.Write(frame.IsKeyFrame);
            writer.Write(frame.StateHash);
            writer.Write(frame.InputHash);
            
            // 状态数据
            writer.Write(frame.StateData?.Length ?? 0);
            if (frame.StateData != null)
                writer.Write(frame.StateData);
            
            // 输入数据
            writer.Write(frame.InputData?.Length ?? 0);
            if (frame.InputData != null)
                writer.Write(frame.InputData);
            
            // 完整状态数据（关键帧）
            writer.Write(frame.FullStateData?.Length ?? 0);
            if (frame.FullStateData != null)
                writer.Write(frame.FullStateData);
            
            // 事件
            writer.Write(frame.Events?.Count ?? 0);
            if (frame.Events != null)
            {
                foreach (var evt in frame.Events)
                {
                    writer.Write(evt.Frame);
                    writer.Write(evt.Timestamp.ToBinary());
                    writer.Write(evt.EventType);
                    writer.Write(evt.EventData);
                }
            }
        }

        private int CalculateStateHash(IGameState state)
        {
            // 简化的哈希计算
            return state.Frame.GetHashCode() ^ state.GetType().Name.GetHashCode();
        }

        private int CalculateInputsHash(IInput[] inputs)
        {
            if (inputs == null || inputs.Length == 0)
                return 0;

            var hash = 0;
            foreach (var input in inputs)
            {
                hash ^= input.GetHash();
                hash ^= input.PlayerId.GetHashCode();
            }
            return hash;
        }

        private byte[] SerializeState(IGameState state)
        {
            // 简化的序列化，实际项目中应该使用更完整的序列化
            using var stream = new MemoryStream();
            using var writer = new BinaryWriter(stream);
            writer.Write(state.Frame);
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
                    writer.Write(input.PlayerId);
                    writer.Write(input.Frame);
                    writer.Write(input.GetHash());
                }
            }
            
            return stream.ToArray();
        }

        private byte[] SerializeFullState(IGameState state)
        {
            // 完整状态序列化，包含所有游戏数据
            return SerializeState(state);
        }
    }

    /// <summary>
    /// 回放数据
    /// </summary>
    public class ReplayData
    {
        public int Version { get; set; }
        public Dictionary<string, string> Metadata { get; set; } = new();
        public List<ReplayFrame> Frames { get; set; } = new();
        public ReplayStatistics Statistics { get; set; } = new();
    }

    /// <summary>
    /// 回放帧
    /// </summary>
    public class ReplayFrame
    {
        public uint Frame { get; set; }
        public DateTime Timestamp { get; set; }
        public bool IsKeyFrame { get; set; }
        public int StateHash { get; set; }
        public int InputHash { get; set; }
        public byte[]? StateData { get; set; }
        public byte[]? InputData { get; set; }
        public byte[]? FullStateData { get; set; }
        public List<ReplayEvent>? Events { get; set; }

        public int GetTotalSize()
        {
            return (StateData?.Length ?? 0) + 
                   (InputData?.Length ?? 0) + 
                   (FullStateData?.Length ?? 0) +
                   (Events?.Sum(e => e.EventData?.Length ?? 0) ?? 0);
        }
    }

    /// <summary>
    /// 回放事件
    /// </summary>
    public class ReplayEvent
    {
        public uint Frame { get; set; }
        public DateTime Timestamp { get; set; }
        public string EventType { get; set; } = string.Empty;
        public string EventData { get; set; } = string.Empty;
    }

    /// <summary>
    /// 回放统计信息
    /// </summary>
    public class ReplayStatistics
    {
        public int TotalFrames { get; set; }
        public int KeyFrames { get; set; }
        public int TotalEvents { get; set; }
        public long TotalSize { get; set; }
        public double AverageFrameSize { get; set; }
        public TimeSpan Duration { get; set; }
        public uint StartFrame { get; set; }
        public uint EndFrame { get; set; }
    }
}