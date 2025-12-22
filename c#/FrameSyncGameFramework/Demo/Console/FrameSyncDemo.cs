using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using FrameSyncGameFramework.FrameSync.Core;
using FrameSyncGameFramework.Snapshot.Core;
using FrameSyncGameFramework.Replay.Core;
using FrameSyncGameFramework.Networking.Core;

namespace FrameSyncGameFramework.Demo.Console
{
    /// <summary>
    /// 帧同步演示程序
    /// </summary>
    public class FrameSyncDemo
    {
        private readonly ILogger<FrameSyncDemo> _logger;
        private readonly FrameDriver _frameDriver;
        private readonly FrameInput _frameInput;
        private readonly FrameValidator _frameValidator;
        private readonly FrameInterpolator _frameInterpolator;
        private readonly SnapshotManager _snapshotManager;
        private readonly ReplayRecorder _replayRecorder;
        private readonly ReplayPlayer _replayPlayer;
        private readonly NetworkManager _networkManager;
        private readonly HeartbeatManager _heartbeatManager;
        private readonly GameLogic _gameLogic;
        
        private GameState _gameState;
        private bool _isRunning;
        private int _playerCount;
        private readonly Dictionary<byte, GameInput> _pendingInputs;

        public FrameSyncDemo(IServiceProvider serviceProvider)
        {
            _logger = serviceProvider.GetRequiredService<ILogger<FrameSyncDemo>>();
            
            // 初始化核心组件
            _frameDriver = new FrameDriver(60, serviceProvider.GetRequiredService<ILogger<FrameDriver>>());
            _frameInput = new FrameInput(300, serviceProvider.GetRequiredService<ILogger<FrameInput>>());
            _frameValidator = new FrameValidator(serviceProvider.GetRequiredService<ILogger<FrameValidator>>());
            _frameInterpolator = new FrameInterpolator(60, serviceProvider.GetRequiredService<ILogger<FrameInterpolator>>());
            _snapshotManager = new SnapshotManager(10, serviceProvider.GetRequiredService<ILogger<SnapshotManager>>());
            _replayRecorder = new ReplayRecorder(serviceProvider.GetRequiredService<ILogger<ReplayRecorder>>());
            _replayPlayer = new ReplayPlayer(serviceProvider.GetRequiredService<ILogger<ReplayPlayer>>());
            _networkManager = new NetworkManager(serviceProvider.GetRequiredService<ILogger<NetworkManager>>());
            _heartbeatManager = new HeartbeatManager(1000, 5000, serviceProvider.GetRequiredService<ILogger<HeartbeatManager>>());
            _gameLogic = new GameLogic();
            
            // 初始化游戏状态
            _gameState = new GameState();
            _isRunning = false;
            _playerCount = 2; // 默认2个玩家
            _pendingInputs = new Dictionary<byte, GameInput>();

            // 注册事件
            SetupEventHandlers();
        }

        /// <summary>
        /// 运行演示
        /// </summary>
        public async Task RunDemoAsync()
        {
            _logger.LogInformation("=== FrameSync Game Framework Demo ===");
            
            ShowMenu();
            
            while (true)
            {
                Console.Write("\n选择操作 (1-9): ");
                var key = Console.ReadKey();
                Console.WriteLine();
                
                switch (key.KeyChar)
                {
                    case '1':
                        await RunLocalGameAsync();
                        break;
                    case '2':
                        TestSnapshotSystem();
                        break;
                    case '3':
                        TestReplaySystem();
                        break;
                    case '4':
                        TestNetworkSimulation();
                        break;
                    case '5':
                        ShowSystemInfo();
                        break;
                    case '6':
                        await RunPerformanceTestAsync();
                        break;
                    case '7':
                        TestFrameValidation();
                        break;
                    case '8':
                        TestInterpolation();
                        break;
                    case '9':
                        _logger.LogInformation("退出演示程序");
                        return;
                    default:
                        Console.WriteLine("无效选择，请重试");
                        break;
                }
                
                if (key.KeyChar != '9')
                {
                    ShowMenu();
                }
            }
        }

        private void ShowMenu()
        {
            Console.WriteLine("\n=== 帧同步游戏框架演示菜单 ===");
            Console.WriteLine("1. 运行本地游戏");
            Console.WriteLine("2. 测试快照系统");
            Console.WriteLine("3. 测试回放系统");
            Console.WriteLine("4. 测试网络模拟");
            Console.WriteLine("5. 显示系统信息");
            Console.WriteLine("6. 运行性能测试");
            Console.WriteLine("7. 测试帧验证");
            Console.WriteLine("8. 测试插值系统");
            Console.WriteLine("9. 退出");
        }

        /// <summary>
        /// 运行本地游戏
        /// </summary>
        private async Task RunLocalGameAsync()
        {
            _logger.LogInformation("开始本地游戏演示");
            
            // 初始化游戏
            InitializeGame();
            
            // 开始录制
            _replayRecorder.StartRecording(0, new Dictionary<string, string>
            {
                ["GameMode"] = "Local",
                ["PlayerCount"] = _playerCount.ToString()
            });
            
            // 开始帧循环
            _frameDriver.Start();
            _isRunning = true;
            
            Console.WriteLine("游戏进行中... 按任意键停止");
            Console.WriteLine("玩家1: WASD移动, 空格射击");
            Console.WriteLine("玩家2: 方向键移动, Enter射击");
            
            // 模拟游戏输入
            var gameTask = SimulateGameAsync();
            
            // 等待用户输入停止
            await Task.Run(() => Console.ReadKey(true));
            
            // 停止游戏
            _isRunning = false;
            _frameDriver.Stop();
            _replayRecorder.StopRecording();
            
            await gameTask;
            
            // 保存回放
            SaveReplay();
            
            _logger.LogInformation("本地游戏演示完成");
        }

        /// <summary>
        /// 模拟游戏
        /// </summary>
        private async Task SimulateGameAsync()
        {
            var random = new Random();
            var frameCount = 0;
            
            while (_isRunning && frameCount < 600) // 最多10秒
            {
                // 生成随机输入
                for (byte playerId = 1; playerId <= _playerCount; playerId++)
                {
                    var input = _gameLogic.GenerateRandomInput(playerId, (uint)frameCount);
                    _pendingInputs[playerId] = input;
                }
                
                // 等待下一帧
                await Task.Delay(16); // ~60 FPS
                frameCount++;
            }
            
            _logger.LogInformation($"模拟游戏完成，共运行 {frameCount} 帧");
        }

        /// <summary>
        /// 初始化游戏
        /// </summary>
        private void InitializeGame()
        {
            _gameState.Reset();
            _gameLogic.Reset();
            _frameInput.ClearAll();
            _frameValidator.ClearAll();
            _frameInterpolator.ClearAll();
            _pendingInputs.Clear();
            
            // 添加玩家
            for (byte i = 1; i <= _playerCount; i++)
            {
                _gameState.AddPlayer(i, $"Player{i}");
            }
            
            _logger.LogInformation($"游戏初始化完成，玩家数量: {_playerCount}");
        }

        /// <summary>
        /// 设置事件处理器
        /// </summary>
        private void SetupEventHandlers()
        {
            // 帧更新事件
            _frameDriver.RegisterFrameCallback(OnFrameUpdate);
            
            // 回放播放器事件
            _replayPlayer.FramePlayed += OnReplayFramePlayed;
            _replayPlayer.PlaybackCompleted += OnReplayCompleted;
        }

        /// <summary>
        /// 帧更新处理
        /// </summary>
        private void OnFrameUpdate(uint frame)
        {
            if (!_isRunning)
                return;
            
            // 收集输入
            foreach (var kvp in _pendingInputs)
            {
                _frameInput.AddInput(kvp.Value);
            }
            _pendingInputs.Clear();
            
            // 检查是否所有玩家都已输入
            if (_frameInput.HasAllInputs(frame, _playerCount))
            {
                var inputs = _frameInput.GetInputs(frame);
                
                // 记录插值数据
                _frameInterpolator.RecordState(frame, _gameState);
                _frameInterpolator.RecordInputs(frame, inputs);
                
                // 验证帧哈希
                var stateHash = _frameValidator.CalculateStateHash(_gameState);
                var inputHash = _frameValidator.CalculateInputsHash(inputs);
                _frameValidator.RecordFrameHash(frame, stateHash, inputHash);
                
                // 录制回放
                if (_replayRecorder.IsRecording)
                {
                    if (frame % 60 == 0) // 每60帧记录一个关键帧
                    {
                        _replayRecorder.RecordKeyFrame(frame, _gameState, inputs);
                    }
                    else
                    {
                        _replayRecorder.RecordFrame(frame, _gameState, inputs);
                    }
                }
                
                // 更新游戏逻辑
                _gameLogic.UpdateGame(_gameState, inputs);
                
                _logger.LogDebug($"Frame {frame} 更新完成");
            }
            else
            {
                _logger.LogWarning($"Frame {frame} 缺少输入，等待中...");
            }
        }

        /// <summary>
        /// 测试快照系统
        /// </summary>
        private void TestSnapshotSystem()
        {
            _logger.LogInformation("=== 测试快照系统 ===");
            
            // 初始化游戏状态
            InitializeGame();
            _gameState.Frame = 100;
            
            // 创建快照
            var snapshot = _snapshotManager.CreateSnapshot(_gameState.Frame, _gameState, Array.Empty<IInput>());
            _logger.LogInformation($"创建快照: Frame={snapshot.Frame}, Size={snapshot.GetTotalSize()} bytes");
            
            // 保存快照
            var snapshotPath = "test_snapshot.bin";
            _snapshotManager.SaveSnapshot(snapshotPath, snapshot, true);
            _logger.LogInformation($"快照已保存到: {snapshotPath}");
            
            // 加载快照
            var loadedSnapshot = _snapshotManager.LoadSnapshot(snapshotPath, true);
            _logger.LogInformation($"加载快照: Frame={loadedSnapshot.Frame}, Valid={_snapshotManager.ValidateSnapshot(loadedSnapshot)}");
            
            // 测试缓存
            _snapshotManager.CacheSnapshot(snapshot.Frame, snapshot);
            var cachedSnapshot = _snapshotManager.GetCachedSnapshot(snapshot.Frame);
            _logger.LogInformation($"缓存快照: Found={cachedSnapshot != null}");
            
            var stats = _snapshotManager.GetCacheStats();
            _logger.LogInformation($"缓存统计: Count={stats.Count}, TotalSize={stats.TotalSize} bytes");
            
            _logger.LogInformation("快照系统测试完成");
        }

        /// <summary>
        /// 测试回放系统
        /// </summary>
        private void TestReplaySystem()
        {
            _logger.LogInformation("=== 测试回放系统 ===");
            
            // 运行短游戏来生成回放
            _logger.LogInformation("生成测试回放数据...");
            InitializeGame();
            
            _replayRecorder.StartRecording(0, new Dictionary<string, string> { ["Test"] = "Replay" });
            
            // 模拟几帧
            for (uint frame = 0; frame < 120; frame++)
            {
                var inputs = new List<IInput>();
                for (byte playerId = 1; playerId <= _playerCount; playerId++)
                {
                    var input = _gameLogic.GenerateRandomInput(playerId, frame);
                    inputs.Add(input);
                }
                
                if (frame % 60 == 0)
                {
                    _replayRecorder.RecordKeyFrame(frame, _gameState, inputs.ToArray());
                }
                else
                {
                    _replayRecorder.RecordFrame(frame, _gameState, inputs.ToArray());
                }
                
                _gameLogic.UpdateGame(_gameState, inputs.ToArray());
            }
            
            _replayRecorder.StopRecording();
            
            // 保存回放
            var replayPath = "test_replay.bin";
            _replayRecorder.SaveToFile(replayPath, true);
            _logger.LogInformation($"回放已保存到: {replayPath}");
            
            // 加载并播放回放
            _replayPlayer.LoadReplay(replayPath, true);
            var info = _replayPlayer.GetReplayInfo();
            _logger.LogInformation($"回放信息: Frames={info?.TotalFrames}, Duration={info?.Duration.TotalSeconds:F2}s, KeyFrames={info?.KeyFrames}");
            
            _logger.LogInformation("回放系统测试完成");
        }

        /// <summary>
        /// 测试网络模拟
        /// </summary>
        private void TestNetworkSimulation()
        {
            _logger.LogInformation("=== 测试网络模拟 ===");
            
            // 测试TCP连接
            TestTcpConnection();
            
            // 测试UDP连接
            TestUdpConnection();
            
            // 测试心跳管理
            TestHeartbeatManager();
            
            _logger.LogInformation("网络模拟测试完成");
        }

        /// <summary>
        /// 测试TCP连接
        /// </summary>
        private async void TestTcpConnection()
        {
            _logger.LogInformation("测试TCP连接...");
            
            var serverEndPoint = new System.Net.IPEndPoint(System.Net.IPAddress.Loopback, 12345);
            var clientEndPoint = new System.Net.IPEndPoint(System.Net.IPAddress.Loopback, 12346);
            
            // 启动服务器
            var serverStarted = await _networkManager.StartTcpServer(serverEndPoint);
            _logger.LogInformation($"TCP服务器启动: {serverStarted}");
            
            // 创建客户端连接
            var clientConnected = await _networkManager.CreateTcpConnection(1, serverEndPoint);
            _logger.LogInformation($"TCP客户端连接: {clientConnected}");
            
            // 获取统计信息
            var connections = _networkManager.GetConnectedPlayers();
            _logger.LogInformation($"已连接玩家: {string.Join(", ", connections)}");
            
            // 清理
            _networkManager.DisconnectAll();
        }

        /// <summary>
        /// 测试UDP连接
        /// </summary>
        private async void TestUdpConnection()
        {
            _logger.LogInformation("测试UDP连接...");
            
            var serverEndPoint = new System.Net.IPEndPoint(System.Net.IPAddress.Loopback, 12347);
            var clientEndPoint = new System.Net.IPEndPoint(System.Net.IPAddress.Loopback, 12348);
            
            // 启动服务器
            var serverStarted = await _networkManager.StartUdpServer(serverEndPoint);
            _logger.LogInformation($"UDP服务器启动: {serverStarted}");
            
            // 创建客户端连接
            var clientConnected = await _networkManager.CreateUdpConnection(2, serverEndPoint);
            _logger.LogInformation($"UDP客户端连接: {clientConnected}");
            
            // 获取统计信息
            var connections = _networkManager.GetConnectedPlayers();
            _logger.LogInformation($"已连接玩家: {string.Join(", ", connections)}");
            
            // 清理
            _networkManager.DisconnectAll();
        }

        /// <summary>
        /// 测试心跳管理
        /// </summary>
        private void TestHeartbeatManager()
        {
            _logger.LogInformation("测试心跳管理器...");
            
            _heartbeatManager.Start();
            
            // 注册玩家
            _heartbeatManager.RegisterPlayer(1);
            _heartbeatManager.RegisterPlayer(2);
            
            // 模拟心跳
            _heartbeatManager.UpdateHeartbeat(1);
            _heartbeatManager.UpdateHeartbeat(2);
            
            // 检查状态
            var isAlive1 = _heartbeatManager.IsPlayerAlive(1);
            var isAlive2 = _heartbeatManager.IsPlayerAlive(2);
            _logger.LogInformation($"玩家状态 - Player1: {isAlive1}, Player2: {isAlive2}");
            
            var stats = _heartbeatManager.GetStatistics();
            _logger.LogInformation($"心跳统计: Total={stats.TotalPlayers}, Alive={stats.AlivePlayers}, Dead={stats.DeadPlayers}");
            
            // 停止
            _heartbeatManager.Stop();
        }

        /// <summary>
        /// 显示系统信息
        /// </summary>
        private void ShowSystemInfo()
        {
            _logger.LogInformation("=== 系统信息 ===");
            
            var snapshotStats = _snapshotManager.GetCacheStats();
            _logger.LogInformation($"快照缓存: {snapshotStats.Count} 个, 总大小: {snapshotStats.TotalSize} bytes");
            
            if (_replayRecorder.IsRecording)
            {
                var stats = _replayRecorder.GetStatistics();
                _logger.LogInformation($"录制状态: 已录制 {stats.TotalFrames} 帧, {stats.TotalEvents} 个事件");
            }
            
            if (_replayPlayer.HasReplay)
            {
                var info = _replayPlayer.GetReplayInfo();
                _logger.LogInformation($"回放状态: 总帧数 {info?.TotalFrames}, 关键帧 {info?.KeyFrames}");
            }
            
            var connections = _networkManager.GetConnectedPlayers();
            _logger.LogInformation($"网络连接: {connections.Count} 个玩家已连接");
            
            var heartbeatStats = _heartbeatManager.GetStatistics();
            _logger.LogInformation($"心跳管理: {heartbeatStats.TotalPlayers} 个玩家, {heartbeatStats.AlivePlayers} 个在线");
        }

        /// <summary>
        /// 运行性能测试
        /// </summary>
        private async Task RunPerformanceTestAsync()
        {
            _logger.LogInformation("=== 性能测试 ===");
            
            const int testFrames = 1000;
            const int playerCount = 4;
            
            InitializeGame();
            
            var startTime = DateTime.UtcNow;
            
            for (uint frame = 0; frame < testFrames; frame++)
            {
                // 生成输入
                var inputs = new List<IInput>();
                for (byte playerId = 1; playerId <= playerCount; playerId++)
                {
                    var input = _gameLogic.GenerateRandomInput(playerId, frame);
                    inputs.Add(input);
                }
                
                // 处理帧
                _gameLogic.UpdateGame(_gameState, inputs.ToArray());
                
                // 记录状态（每10帧）
                if (frame % 10 == 0)
                {
                    _frameInterpolator.RecordState(frame, _gameState);
                    _frameInterpolator.RecordInputs(frame, inputs.ToArray());
                }
                
                // 创建快照（每100帧）
                if (frame % 100 == 0)
                {
                    var snapshot = _snapshotManager.CreateSnapshot(frame, _gameState, inputs.ToArray());
                    _snapshotManager.CacheSnapshot(frame, snapshot);
                }
            }
            
            var endTime = DateTime.UtcNow;
            var duration = endTime - startTime;
            var fps = testFrames / duration.TotalSeconds;
            
            _logger.LogInformation($"性能测试结果:");
            _logger.LogInformation($"  测试帧数: {testFrames}");
            _logger.LogInformation($"  总耗时: {duration.TotalMilliseconds:F2}ms");
            _logger.LogInformation($"  平均FPS: {fps:F2}");
            _logger.LogInformation($"  每帧耗时: {duration.TotalMilliseconds / testFrames:F2}ms");
            
            // 内存使用统计
            var snapshotStats = _snapshotManager.GetCacheStats();
            var interpolationFrames = _frameInterpolator.GetStateFrames().Length;
            _logger.LogInformation($"  快照缓存: {snapshotStats.Count} 个, {snapshotStats.TotalSize} bytes");
            _logger.LogInformation($"  插值缓存: {interpolationFrames} 帧");
        }

        /// <summary>
        /// 测试帧验证
        /// </summary>
        private void TestFrameValidation()
        {
            _logger.LogInformation("=== 测试帧验证 ===");
            
            InitializeGame();
            
            // 模拟几帧并记录哈希
            for (uint frame = 0; frame < 10; frame++)
            {
                var inputs = new List<IInput>();
                for (byte playerId = 1; playerId <= _playerCount; playerId++)
                {
                    var input = _gameLogic.GenerateRandomInput(playerId, frame);
                    inputs.Add(input);
                }
                
                var stateHash = _frameValidator.CalculateStateHash(_gameState);
                var inputHash = _frameValidator.CalculateInputsHash(inputs.ToArray());
                _frameValidator.RecordFrameHash(frame, stateHash, inputHash);
                
                _gameLogic.UpdateGame(_gameState, inputs.ToArray());
            }
            
            // 验证哈希
            var testFrame = 5u;
            var testStateHash = _frameValidator.CalculateStateHash(_gameState);
            var testInputHash = _frameValidator.CalculateInputsHash(Array.Empty<IInput>());
            var isValid = _frameValidator.ValidateFrameHash(testFrame, testStateHash, testInputHash);
            
            _logger.LogInformation($"帧验证结果: Frame={testFrame}, Valid={isValid}");
            
            // 显示所有记录的哈希
            for (uint frame = 0; frame < 10; frame++)
            {
                var hash = _frameValidator.GetFrameHash(frame);
                _logger.LogInformation($"  Frame {frame}: Hash=0x{hash:X8}");
            }
        }

        /// <summary>
        /// 测试插值系统
        /// </summary>
        private void TestInterpolation()
        {
            _logger.LogInformation("=== 测试插值系统 ===");
            
            InitializeGame();
            
            // 记录一些状态
            for (uint frame = 0; frame < 30; frame += 10)
            {
                var inputs = new List<IInput>();
                for (byte playerId = 1; playerId <= _playerCount; playerId++)
                {
                    var input = _gameLogic.GenerateRandomInput(playerId, frame);
                    inputs.Add(input);
                }
                
                _frameInterpolator.RecordState(frame, _gameState);
                _frameInterpolator.RecordInputs(frame, inputs.ToArray());
                
                _gameLogic.UpdateGame(_gameState, inputs.ToArray());
            }
            
            // 测试插值
            var interpolatedState = _frameInterpolator.InterpolateState(15);
            var predictedState = _frameInterpolator.PredictState(20, 25);
            
            _logger.LogInformation($"插值测试: Frame 15 interpolated={interpolatedState != null}");
            _logger.LogInformation($"预测测试: Frame 25 predicted={predictedState != null}");
            
            // 显示状态帧
            var stateFrames = _frameInterpolator.GetStateFrames();
            _logger.LogInformation($"记录的状态帧: {string.Join(", ", stateFrames)}");
        }

        /// <summary>
        /// 回放帧播放处理
        /// </summary>
        private void OnReplayFramePlayed(ReplayFrame frame)
        {
            _logger.LogDebug($"回放帧 {frame.Frame} 播放完成");
        }

        /// <summary>
        /// 回放完成处理
        /// </summary>
        private void OnReplayCompleted()
        {
            _logger.LogInformation("回放播放完成");
        }

        /// <summary>
        /// 保存回放
        /// </summary>
        private void SaveReplay()
        {
            try
            {
                var replayPath = $"replay_{DateTime.Now:yyyyMMdd_HHmmss}.bin";
                _replayRecorder.SaveToFile(replayPath, true);
                _logger.LogInformation($"回放已保存到: {replayPath}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "保存回放失败");
            }
        }
    }
}