using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using FrameSyncGameFramework.Common.Interfaces;

namespace FrameSyncGameFramework.Replay.Core
{
    /// <summary>
    /// 回放播放器，负责播放录制的游戏过程
    /// </summary>
    public class ReplayPlayer
    {
        private ReplayData? _replayData;
        private int _currentFrameIndex;
        private bool _isPlaying;
        private bool _isPaused;
        private float _playbackSpeed;
        private CancellationTokenSource? _cancellationTokenSource;
        private readonly ILogger<ReplayPlayer> _logger;
        private readonly object _lockObject = new object();

        public bool IsPlaying => _isPlaying;
        public bool IsPaused => _isPaused;
        public float PlaybackSpeed => _playbackSpeed;
        public uint CurrentFrame => _replayData?.Frames[_currentFrameIndex].Frame ?? 0;
        public uint TotalFrames => _replayData?.Frames.Count ?? 0;
        public bool HasReplay => _replayData != null;

        public event Action<ReplayFrame>? FramePlayed;
        public event Action? PlaybackCompleted;
        public event Action<uint>? FrameChanged;

        public ReplayPlayer(ILogger<ReplayPlayer>? logger = null)
        {
            _logger = logger ?? Microsoft.Extensions.Logging.Abstractions.NullLogger<ReplayPlayer>.Instance;
            _currentFrameIndex = 0;
            _isPlaying = false;
            _isPaused = false;
            _playbackSpeed = 1.0f;
        }

        /// <summary>
        /// 从文件加载回放
        /// </summary>
        public void LoadReplay(string filePath, bool compressed = true)
        {
            if (string.IsNullOrEmpty(filePath))
                throw new ArgumentException("File path cannot be null or empty", nameof(filePath));

            if (!File.Exists(filePath))
                throw new FileNotFoundException($"Replay file not found: {filePath}");

            try
            {
                StopPlayback();

                using var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
                
                ReplayData replayData;
                if (compressed)
                {
                    using var compressionStream = new GZipStream(fileStream, CompressionMode.Decompress);
                    replayData = DeserializeReplayData(compressionStream);
                }
                else
                {
                    replayData = DeserializeReplayData(fileStream);
                }

                lock (_lockObject)
                {
                    _replayData = replayData;
                    _currentFrameIndex = 0;
                }

                _logger.LogInformation($"Loaded replay from {filePath}, frames: {replayData.Frames.Count}, duration: {replayData.Statistics.Duration.TotalSeconds:F2}s");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to load replay from {filePath}");
                throw;
            }
        }

        /// <summary>
        /// 开始播放
        /// </summary>
        public void StartPlayback(float speed = 1.0f)
        {
            if (_replayData == null)
            {
                _logger.LogError("Cannot start playback: no replay loaded");
                return;
            }

            if (_isPlaying && !_isPaused)
            {
                _logger.LogWarning("Playback is already in progress");
                return;
            }

            lock (_lockObject)
            {
                _playbackSpeed = Math.Max(0.1f, speed);
                _isPaused = false;
                
                if (!_isPlaying)
                {
                    _isPlaying = true;
                    _cancellationTokenSource = new CancellationTokenSource();
                    Task.Run(() => PlaybackLoop(_cancellationTokenSource.Token));
                }
            }

            _logger.LogInformation($"Started playback at speed {speed}x");
        }

        /// <summary>
        /// 暂停播放
        /// </summary>
        public void PausePlayback()
        {
            if (!_isPlaying)
            {
                _logger.LogWarning("Cannot pause: playback is not in progress");
                return;
            }

            lock (_lockObject)
            {
                _isPaused = true;
            }

            _logger.LogInformation("Paused playback");
        }

        /// <summary>
        /// 恢复播放
        /// </summary>
        public void ResumePlayback()
        {
            if (!_isPlaying)
            {
                _logger.LogWarning("Cannot resume: playback is not in progress");
                return;
            }

            lock (_lockObject)
            {
                _isPaused = false;
            }

            _logger.LogInformation("Resumed playback");
        }

        /// <summary>
        /// 停止播放
        /// </summary>
        public void StopPlayback()
        {
            if (!_isPlaying)
            {
                return;
            }

            lock (_lockObject)
            {
                _isPlaying = false;
                _isPaused = false;
                _cancellationTokenSource?.Cancel();
            }

            _logger.LogInformation("Stopped playback");
        }

        /// <summary>
        /// 跳转到指定帧
        /// </summary>
        public void SeekToFrame(uint frame)
        {
            if (_replayData == null)
            {
                _logger.LogError("Cannot seek: no replay loaded");
                return;
            }

            lock (_lockObject)
            {
                var targetIndex = _replayData.Frames.FindIndex(f => f.Frame >= frame);
                if (targetIndex >= 0)
                {
                    _currentFrameIndex = targetIndex;
                    FrameChanged?.Invoke(CurrentFrame);
                    _logger.LogInformation($"Seeked to frame {frame} (index {targetIndex})");
                }
                else
                {
                    _logger.LogWarning($"Frame {frame} not found in replay");
                }
            }
        }

        /// <summary>
        /// 跳转到开始
        /// </summary>
        public void SeekToStart()
        {
            SeekToFrame(0);
        }

        /// <summary>
        /// 跳转到结束
        /// </summary>
        public void SeekToEnd()
        {
            if (_replayData != null && _replayData.Frames.Count > 0)
            {
                lock (_lockObject)
                {
                    _currentFrameIndex = _replayData.Frames.Count - 1;
                    FrameChanged?.Invoke(CurrentFrame);
                }
                _logger.LogInformation("Seeked to end of replay");
            }
        }

        /// <summary>
        /// 设置播放速度
        /// </summary>
        public void SetPlaybackSpeed(float speed)
        {
            lock (_lockObject)
            {
                _playbackSpeed = Math.Max(0.1f, speed);
            }
            
            _logger.LogInformation($"Set playback speed to {speed}x");
        }

        /// <summary>
        /// 获取回放信息
        /// </summary>
        public ReplayInfo? GetReplayInfo()
        {
            if (_replayData == null)
                return null;

            return new ReplayInfo
            {
                Version = _replayData.Version,
                TotalFrames = (uint)_replayData.Frames.Count,
                Duration = _replayData.Statistics.Duration,
                KeyFrames = (uint)_replayData.Statistics.KeyFrames,
                TotalEvents = _replayData.Statistics.TotalEvents,
                Metadata = new Dictionary<string, string>(_replayData.Metadata),
                StartFrame = _replayData.Statistics.StartFrame,
                EndFrame = _replayData.Statistics.EndFrame
            };
        }

        /// <summary>
        /// 获取当前帧数据
        /// </summary>
        public ReplayFrame? GetCurrentFrame()
        {
            lock (_lockObject)
            {
                if (_replayData == null || _currentFrameIndex >= _replayData.Frames.Count)
                    return null;

                return _replayData.Frames[_currentFrameIndex];
            }
        }

        /// <summary>
        /// 获取指定帧的数据
        /// </summary>
        public ReplayFrame? GetFrame(uint frame)
        {
            if (_replayData == null)
                return null;

            lock (_lockObject)
            {
                return _replayData.Frames.Find(f => f.Frame == frame);
            }
        }

        /// <summary>
        /// 获取所有关键帧
        /// </summary>
        public List<ReplayFrame> GetKeyFrames()
        {
            if (_replayData == null)
                return new List<ReplayFrame>();

            lock (_lockObject)
            {
                return _replayData.Frames.Where(f => f.IsKeyFrame).ToList();
            }
        }

        /// <summary>
        /// 卸载回放
        /// </summary>
        public void UnloadReplay()
        {
            StopPlayback();
            
            lock (_lockObject)
            {
                _replayData = null;
                _currentFrameIndex = 0;
            }

            _logger.LogInformation("Unloaded replay");
        }

        private async Task PlaybackLoop(CancellationToken cancellationToken)
        {
            if (_replayData == null)
                return;

            try
            {
                var baseFrameInterval = 1000.0 / 60.0; // 假设60FPS

                while (_isPlaying && _currentFrameIndex < _replayData.Frames.Count)
                {
                    if (cancellationToken.IsCancellationRequested)
                        break;

                    if (_isPaused)
                    {
                        await Task.Delay(100, cancellationToken);
                        continue;
                    }

                    var currentFrame = _replayData.Frames[_currentFrameIndex];
                    
                    // 触发帧播放事件
                    FramePlayed?.Invoke(currentFrame);
                    FrameChanged?.Invoke(currentFrame.Frame);

                    _logger.LogDebug($"Played frame {currentFrame.Frame} (index {_currentFrameIndex})");

                    // 移动到下一帧
                    _currentFrameIndex++;

                    // 计算帧间隔时间
                    var frameInterval = baseFrameInterval / _playbackSpeed;
                    
                    if (_currentFrameIndex < _replayData.Frames.Count)
                    {
                        await Task.Delay((int)frameInterval, cancellationToken);
                    }
                }

                // 播放完成
                if (_currentFrameIndex >= _replayData.Frames.Count)
                {
                    _logger.LogInformation("Playback completed");
                    PlaybackCompleted?.Invoke();
                }
            }
            catch (OperationCanceledException)
            {
                _logger.LogDebug("Playback loop cancelled");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in playback loop");
            }
            finally
            {
                lock (_lockObject)
                {
                    _isPlaying = false;
                    _isPaused = false;
                }
            }
        }

        private ReplayData DeserializeReplayData(Stream stream)
        {
            using var reader = new BinaryReader(stream);
            
            // 读取头部信息
            var version = reader.ReadInt32();
            var metadataCount = reader.ReadInt32();
            
            // 读取元数据
            var metadata = new Dictionary<string, string>();
            for (int i = 0; i < metadataCount; i++)
            {
                var key = reader.ReadString();
                var value = reader.ReadString();
                metadata[key] = value;
            }
            
            // 读取帧数据
            var frameCount = reader.ReadInt32();
            var frames = new List<ReplayFrame>(frameCount);
            
            for (int i = 0; i < frameCount; i++)
            {
                frames.Add(DeserializeFrame(reader));
            }

            return new ReplayData
            {
                Version = version,
                Metadata = metadata,
                Frames = frames,
                Statistics = new ReplayStatistics()
            };
        }

        private ReplayFrame DeserializeFrame(BinaryReader reader)
        {
            var frame = new ReplayFrame
            {
                Frame = reader.ReadUInt32(),
                Timestamp = DateTime.FromBinary(reader.ReadInt64()),
                IsKeyFrame = reader.ReadBoolean(),
                StateHash = reader.ReadInt32(),
                InputHash = reader.ReadInt32()
            };

            // 状态数据
            var stateDataLength = reader.ReadInt32();
            if (stateDataLength > 0)
                frame.StateData = reader.ReadBytes(stateDataLength);
            
            // 输入数据
            var inputDataLength = reader.ReadInt32();
            if (inputDataLength > 0)
                frame.InputData = reader.ReadBytes(inputDataLength);
            
            // 完整状态数据
            var fullStateDataLength = reader.ReadInt32();
            if (fullStateDataLength > 0)
                frame.FullStateData = reader.ReadBytes(fullStateDataLength);
            
            // 事件
            var eventCount = reader.ReadInt32();
            if (eventCount > 0)
            {
                frame.Events = new List<ReplayEvent>(eventCount);
                for (int i = 0; i < eventCount; i++)
                {
                    var evt = new ReplayEvent
                    {
                        Frame = reader.ReadUInt32(),
                        Timestamp = DateTime.FromBinary(reader.ReadInt64()),
                        EventType = reader.ReadString(),
                        EventData = reader.ReadString()
                    };
                    frame.Events.Add(evt);
                }
            }

            return frame;
        }
    }

    /// <summary>
    /// 回放信息
    /// </summary>
    public class ReplayInfo
    {
        public int Version { get; set; }
        public uint TotalFrames { get; set; }
        public TimeSpan Duration { get; set; }
        public uint KeyFrames { get; set; }
        public int TotalEvents { get; set; }
        public Dictionary<string, string> Metadata { get; set; } = new();
        public uint StartFrame { get; set; }
        public uint EndFrame { get; set; }
    }
}