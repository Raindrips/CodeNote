# FrameSync Game Framework

一个功能完整的C#帧同步游戏框架，支持帧同步、网络联机、快照保存/加载、游戏回放等核心功能。

## 功能特性

### 核心功能
- **帧同步核心**: 完整的帧驱动系统，支持确定性帧逻辑
- **输入同步**: 多玩家输入收集和管理
- **帧验证**: 确保不同客户端的帧一致性
- **帧插值**: 支持平滑渲染和网络延迟补偿

### 快照系统
- **二进制序列化**: 高性能二进制快照格式
- **JSON序列化**: 可读性强的JSON快照格式
- **压缩支持**: 支持GZip压缩减少存储空间
- **缓存机制**: 智能缓存最近使用的快照

### 回放系统
- **完整录制**: 记录所有帧数据和玩家输入
- **倍速播放**: 支持不同速度的播放
- **关键帧**: 智能关键帧记录优化存储
- **事件系统**: 支持自定义事件记录

### 网络系统
- **TCP/UDP传输**: 支持两种传输协议
- **心跳检测**: 自动心跳维持连接
- **断线重连**: 支持断线后的重连机制
- **网络管理**: 集中化的连接管理

### 其他特性
- **定点数系统**: 避免浮点数精度问题
- **模块化设计**: 清晰的模块划分和接口设计
- **高性能**: 优化的序列化和网络传输
- **跨平台**: 支持.NET 6/7，兼容Unity

## 项目结构

```
FrameSyncGameFramework/
├── FrameSync/              # 帧同步核心模块
│   ├── Core/              # 核心实现
│   └── Interfaces/        # 接口定义
├── Snapshot/              # 快照模块
│   ├── Core/              # 快照管理器
│   └── Serializers/       # 序列化器
├── Replay/                # 回放模块
│   └── Core/              # 回放录制和播放
├── Networking/            # 网络模块
│   ├── Core/              # 网络管理器
│   ├── Interfaces/        # 网络接口
│   └── Transports/        # 传输实现
├── Common/                # 公共模块
│   ├── Interfaces/        # 通用接口
│   └── Math/              # 数学工具
├── Demo/                  # 演示程序
│   └── Console/           # 控制台演示
└── Tests/                 # 测试程序
```

## 快速开始

### 环境要求
- .NET 6.0 或更高版本
- Visual Studio 2022 或 VS Code

### 编译运行

1. **克隆项目**
```bash
git clone <repository-url>
cd FrameSyncGameFramework
```

2. **编译项目**
```bash
dotnet build
```

3. **运行演示程序**
```bash
dotnet run
```

### 基本使用

#### 1. 创建帧同步系统
```csharp
// 创建帧驱动器
var frameDriver = new FrameDriver(60); // 60 FPS

// 创建输入管理器
var frameInput = new FrameInput();

// 创建游戏状态
var gameState = new GameState();
```

#### 2. 处理游戏输入
```csharp
// 收集玩家输入
var input = new GameInput
{
    PlayerId = playerId,
    Frame = currentFrame,
    MoveX = moveX,
    MoveY = moveY,
    Shoot = isShooting
};

// 添加输入到管理器
frameInput.AddInput(input);
```

#### 3. 更新游戏逻辑
```csharp
// 检查是否所有玩家都已输入
if (frameInput.HasAllInputs(currentFrame, playerCount))
{
    // 获取所有输入
    var inputs = frameInput.GetInputs(currentFrame);
    
    // 更新游戏状态
    gameLogic.UpdateGame(gameState, inputs);
}
```

#### 4. 保存快照
```csharp
// 创建快照管理器
var snapshotManager = new SnapshotManager();

// 创建快照
var snapshot = snapshotManager.CreateSnapshot(frame, gameState, inputs);

// 保存到文件
snapshotManager.SaveSnapshot("snapshot.bin", snapshot, true);
```

#### 5. 录制回放
```csharp
// 开始录制
replayRecorder.StartRecording(0);

// 录制每一帧
replayRecorder.RecordFrame(frame, gameState, inputs);

// 停止录制并保存
replayRecorder.StopRecording();
replayRecorder.SaveToFile("replay.bin", true);
```

#### 6. 网络联机
```csharp
// 创建网络管理器
var networkManager = new NetworkManager();

// 启动服务器
await networkManager.StartTcpServer(localEndPoint);

// 客户端连接
await networkManager.CreateTcpConnection(playerId, serverEndPoint);

// 发送数据
await networkManager.SendToPlayerAsync(playerId, data);

// 广播数据
await networkManager.BroadcastAsync(data);
```

## 高级用法

### 自定义游戏状态
```csharp
public class MyGameState : IGameState, ISnapshotable
{
    public uint Frame { get; set; }
    
    // 实现深拷贝
    public IGameState DeepCopy()
    {
        return new MyGameState 
        { 
            Frame = Frame,
            // 拷贝其他字段
        };
    }
    
    // 实现快照化
    public void Serialize(BinaryWriter writer)
    {
        writer.Write(Frame);
        // 序列化其他字段
    }
    
    public void Deserialize(BinaryReader reader)
    {
        Frame = reader.ReadUInt32();
        // 反序列化其他字段
    }
}
```

### 自定义输入
```csharp
public class MyInput : IInput
{
    public byte PlayerId { get; set; }
    public uint Frame { get; set; }
    
    // 自定义输入数据
    public float MoveX { get; set; }
    public float MoveY { get; set; }
    
    public IInput DeepCopy()
    {
        return new MyInput 
        { 
            PlayerId = PlayerId,
            Frame = Frame,
            MoveX = MoveX,
            MoveY = MoveY
        };
    }
    
    public int GetHash()
    {
        return PlayerId.GetHashCode() ^ Frame.GetHashCode() ^ 
               MoveX.GetHashCode() ^ MoveY.GetHashCode();
    }
}
```

### 定点数使用
```csharp
// 创建定点数
var fixedValue = FixedPoint.FromFloat(3.14f);

// 数学运算
var result = fixedValue * FixedPoint.FromFloat(2.0f);
var distance = FixedVector2.Distance(pos1, pos2);

// 转换回浮点数
float floatValue = fixedValue.ToFloat();
```

## 性能优化

### 序列化优化
- 使用二进制序列化器获得最佳性能
- 启用压缩减少网络传输和存储大小
- 合理使用关键帧减少数据量

### 网络优化
- UDP适合实时性要求高的游戏
- TCP适合需要可靠传输的场景
- 心跳机制保持连接稳定

### 内存优化
- 及时清理旧的帧数据
- 合理设置缓存大小
- 使用对象池减少GC压力

## 测试功能

演示程序包含以下测试功能：

1. **本地游戏**: 运行完整的本地帧同步游戏
2. **快照系统**: 测试快照创建、保存、加载
3. **回放系统**: 测试录制和播放功能
4. **网络模拟**: 测试TCP/UDP连接和心跳
5. **性能测试**: 运行性能基准测试
6. **帧验证**: 测试帧一致性验证
7. **插值系统**: 测试状态插值和预测

## 最佳实践

### 确定性编程
- 使用定点数替代浮点数
- 避免使用非确定性函数
- 确保所有客户端使用相同的随机种子
- 保持更新顺序一致

### 网络编程
- 合理设置心跳间隔
- 处理网络异常和超时
- 实现断线重连机制
- 优化数据包大小

### 性能考虑
- 及时清理过期数据
- 使用合适的缓存策略
- 避免频繁的内存分配
- 合理使用多线程

## 故障排除

### 常见问题

**帧不同步问题**
- 检查是否使用了确定性算法
- 确保所有客户端使用相同的输入
- 验证定点数计算的一致性

**网络连接问题**
- 检查防火墙设置
- 验证端口是否开放
- 检查网络地址配置

**性能问题**
- 监控内存使用情况
- 检查序列化效率
- 优化网络传输频率

## 扩展开发

### 添加新传输协议
1. 实现 `INetworkTransport` 接口
2. 在 `NetworkManager` 中注册新协议
3. 处理连接、数据传输、断开等逻辑

### 添加新序列化格式
1. 实现序列化/反序列化方法
2. 在 `SnapshotManager` 中添加支持
3. 处理版本兼容性问题

### 集成到Unity
1. 将框架编译为DLL
2. 在Unity项目中引用DLL
3. 创建MonoBehaviour包装器
4. 处理Unity的生命周期

## 贡献指南

欢迎提交Issue和Pull Request来改进框架。

### 开发规范
- 遵循C#编码规范
- 添加完整的XML文档注释
- 编写单元测试
- 保持向后兼容性

### 测试要求
- 所有核心功能必须有测试覆盖
- 性能测试需要包含基准数据
- 网络测试需要模拟真实环境

## 许可证

MIT License - 详见 LICENSE 文件

## 联系方式

如有问题或建议，请通过以下方式联系：
- 提交GitHub Issue
- 发送邮件到开发者邮箱

## 更新日志

### v1.0.0 (2024-01-01)
- 初始版本发布
- 完整的帧同步核心功能
- 快照和回放系统
- 网络联机支持
- 控制台演示程序