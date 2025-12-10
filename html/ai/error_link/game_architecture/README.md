# 多人游戏服务端架构

一个支持100位用户的多人游戏服务端，使用Node.js和WebSocket开发。

## 功能特性

### 核心功能
- ✅ WebSocket连接管理
- ✅ 用户登录和状态管理
- ✅ 实时位置同步
- ✅ 聊天系统
- ✅ 广播机制
- ✅ 房间管理
- ✅ 安全防护

### 技术特点
- 模块化架构设计
- 内存数据存储（无数据库依赖）
- 支持100个并发用户
- 实时消息广播
- 速率限制和安全验证
- 心跳检测和超时处理

## 项目结构

```
game_architecture/
├── package.json              # 项目配置和依赖
├── server.js                 # 主服务器文件
├── client-demo.html          # 客户端演示页面
├── modules/                  # 核心模块
│   ├── UserManager.js        # 用户管理模块
│   ├── MessageHandler.js     # 消息处理模块
│   ├── BroadcastManager.js   # 广播管理模块
│   ├── GameRoom.js          # 游戏房间模块
│   ├── RoomManager.js       # 房间管理模块
│   └── SecurityManager.js   # 安全管理模块
└── README.md                # 项目文档
```

## 快速开始

### 安装依赖
```bash
npm install
```

### 启动服务器
```bash
# 开发模式（支持热重载）
npm run dev

# 生产模式
npm start
```

### 测试客户端
1. 打开 `client-demo.html` 文件
2. 输入服务器地址（默认：ws://localhost:8080）
3. 输入用户名并点击连接
4. 使用移动控制和聊天功能

## 核心模块说明

### UserManager（用户管理）
- 管理用户连接状态
- 维护在线用户列表
- 处理用户位置信息
- 支持用户搜索和统计

### MessageHandler（消息处理）
- 处理客户端消息
- 支持多种消息类型（登录、移动、聊天等）
- 消息验证和错误处理
- 业务逻辑处理

### BroadcastManager（广播管理）
- 消息广播机制
- 批量消息处理
- 系统消息发送
- 性能优化（消息合并）

### GameRoom（游戏房间）
- 房间创建和管理
- 玩家加入/离开
- 房间状态管理
- 房间内广播

### RoomManager（房间管理）
- 多房间支持
- 房间推荐算法
- 负载均衡
- 房间统计

### SecurityManager（安全管理）
- 速率限制
- 消息过滤
- 用户封锁
- 安全检查

## 消息协议

### 客户端发送消息
```javascript
// 登录
{ type: 'login', data: { username: '玩家名称' } }

// 移动
{ type: 'move', data: { position: { x: 0, y: 0, z: 0 } } }

// 旋转
{ type: 'rotate', data: { rotation: { x: 0, y: 0, z: 0 } } }

// 聊天
{ type: 'chat', data: { message: '聊天消息' } }

// 心跳
{ type: 'heartbeat', data: {} }
```

### 服务端发送消息
```javascript
// 连接成功
{ type: 'connected', userId: 'uuid', message: '连接成功' }

// 登录成功
{ type: 'login_success', userId: 'uuid', username: '玩家名称' }

// 用户加入
{ type: 'user_joined', user: { id: 'uuid', username: '名称', position: {...} } }

// 用户离开
{ type: 'user_left', userId: 'uuid', username: '名称' }

// 用户移动
{ type: 'user_moved', userId: 'uuid', position: { x: 0, y: 0, z: 0 } }

// 聊天消息
{ type: 'chat_message', userId: 'uuid', username: '名称', message: '消息' }
```

## 性能配置

### 服务器配置
- 最大用户数：100
- 心跳间隔：30秒
- 超时时间：5分钟
- 消息速率限制：10条/秒，100条/分钟

### 消息限制
- 聊天消息：最大200字符
- 用户名：2-20字符
- 位置数据：±10000范围

## 扩展功能

### 可扩展模块
- 数据库集成（MongoDB、Redis）
- 游戏逻辑扩展
- 高级房间系统
- 权限管理
- 日志系统
- 监控和统计

### 部署建议
- 使用PM2进行进程管理
- 配置Nginx反向代理
- 启用SSL/TLS加密
- 设置防火墙规则
- 监控服务器性能

## 开发团队
- 开发者：尹云剑
- 企业：深圳市墨霖网络有限公司
- 部门：产研部

## 许可证
MIT License