using System;
using System.Collections.Generic;
using System.Threading;
using Microsoft.Extensions.Logging;
using FrameSyncGameFramework.FrameSync.Interfaces;

namespace FrameSyncGameFramework.FrameSync.Core
{
    /// <summary>
    /// 帧驱动器实现，负责驱动游戏帧循环
    /// </summary>
    public class FrameDriver : IFrameDriver, IDisposable
    {
        private uint _currentFrame;
        private bool _isRunning;
        private readonly int _frameRate;
        private readonly int _frameIntervalMs;
        private Thread? _frameThread;
        private readonly List<Action<uint>> _frameCallbacks;
        private readonly ILogger<FrameDriver> _logger;
        private readonly object _lockObject = new object();
        private bool _disposed;

        public uint CurrentFrame => _currentFrame;
        public int FrameRate => _frameRate;
        public bool IsRunning => _isRunning;

        public FrameDriver(int frameRate = 60, ILogger<FrameDriver>? logger = null)
        {
            _frameRate = frameRate;
            _frameIntervalMs = 1000 / frameRate;
            _frameCallbacks = new List<Action<uint>>();
            _logger = logger ?? Microsoft.Extensions.Logging.Abstractions.NullLogger<FrameDriver>.Instance;
            _currentFrame = 0;
            _isRunning = false;
            _disposed = false;
        }

        public void Start()
        {
            lock (_lockObject)
            {
                if (_isRunning)
                {
                    _logger.LogWarning("Frame driver is already running");
                    return;
                }

                _isRunning = true;
                _currentFrame = 0;
                _frameThread = new Thread(FrameLoop)
                {
                    Name = "FrameSyncLoop",
                    IsBackground = true
                };
                _frameThread.Start();
                _logger.LogInformation($"Frame driver started with {FrameRate} FPS");
            }
        }

        public void Stop()
        {
            lock (_lockObject)
            {
                if (!_isRunning)
                {
                    _logger.LogWarning("Frame driver is not running");
                    return;
                }

                _isRunning = false;
                _frameThread?.Join(1000); // 等待最多1秒
                _logger.LogInformation("Frame driver stopped");
            }
        }

        public void Update()
        {
            if (!_isRunning)
            {
                _logger.LogWarning("Cannot update frame when driver is not running");
                return;
            }

            lock (_lockObject)
            {
                _currentFrame++;
                
                // 执行所有注册的回调
                foreach (var callback in _frameCallbacks)
                {
                    try
                    {
                        callback(_currentFrame);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"Error in frame callback at frame {_currentFrame}");
                    }
                }
            }
        }

        public void RegisterFrameCallback(Action<uint> callback)
        {
            lock (_lockObject)
            {
                if (!_frameCallbacks.Contains(callback))
                {
                    _frameCallbacks.Add(callback);
                }
            }
        }

        public void UnregisterFrameCallback(Action<uint> callback)
        {
            lock (_lockObject)
            {
                _frameCallbacks.Remove(callback);
            }
        }

        private void FrameLoop()
        {
            var lastFrameTime = DateTime.UtcNow;
            
            while (_isRunning)
            {
                var currentTime = DateTime.UtcNow;
                var elapsedMs = (currentTime - lastFrameTime).TotalMilliseconds;
                
                if (elapsedMs >= _frameIntervalMs)
                {
                    Update();
                    lastFrameTime = currentTime;
                }
                else
                {
                    // 精确控制帧率
                    var sleepTime = (int)(_frameIntervalMs - elapsedMs);
                    if (sleepTime > 1)
                    {
                        Thread.Sleep(sleepTime - 1); // 稍微提前唤醒
                    }
                    else
                    {
                        Thread.Yield();
                    }
                }
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
                    Stop();
                    _frameCallbacks.Clear();
                }
                _disposed = true;
            }
        }

        ~FrameDriver()
        {
            Dispose(false);
        }
    }
}