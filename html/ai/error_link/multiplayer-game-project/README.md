# 多人游戏项目

一个完整的多人游戏项目，包含服务端和客户端代码，支持实时多人在线游戏。

## 🎮 项目特性

### 核心功能
- ✅ **实时多人在线**: 支持最多100个玩家同时在线
- ✅ **WebSocket通信**: 低延迟、双向实时通信
- ✅ **Canvas渲染**: 高性能2D图形渲染
- ✅ **键盘控制**: 支持WASD和方向键移动控制
- ✅ **玩家头像**: 自动生成彩色圆形头像
- ✅ **实时同步**: 玩家位置和状态实时同步
- ✅ **聊天系统**: 支持玩家间实时聊天
- ✅ **房间管理**: 支持多房间游戏模式

### 技术特点
- 🏗️ **模块化架构**: 清晰的代码结构和模块划分
- 🔒 **安全防护**: 速率限制、消息过滤、安全检查
- 📊 **性能优化**: 内存管理、批量消息处理、渲染优化
- 🔄 **自动重连**: 网络断开自动重连机制
- 📱 **响应式设计**: 适配不同屏幕尺寸
- 🎯 **高亮显示**: 当前玩家特殊高亮标识

## 📁 项目结构

```
multiplayer-game-project/
├── server/                    # 服务端代码
│   ├── index.js              # 主服务器文件
│   └── modules/              # 核心模块
│       ├── UserManager.js    # 用户管理模块
│       ├── MessageHandler.js # 消息处理模块
│       ├── BroadcastManager.js # 广播管理模块
│       ├── GameRoom.js       # 游戏房间模块
│       ├── RoomManager.js    # 房间管理模块
│       └── SecurityManager.js # 安全管理模块
├── client/                    # 客户端代码
│   ├── index.html            # 主HTML文件
│   ├── package.json          # 客户端依赖配置
│   └── vite.config.js        # Vite构建配置
├── docs/                      # 项目文档
├── start-server.js           # 服务端启动脚本
├── start-client.js           # 客户端启动脚本
├── config.json               # 项目配置文件
├── package.json              # 项目依赖配置
└── README.md                 # 项目说明文档
```

## 🚀 快速开始

### 环境要求
- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装依赖
```bash
# 安装所有依赖
npm run setup

# 或者手动安装
npm install
cd client && npm install
```

### 启动服务端
```bash
# 使用启动脚本
node start-server.js

# 或者使用npm脚本
npm start

# 开发模式（支持热重载）
npm run dev
```

### 启动客户端
```bash
# 使用启动脚本
node start-client.js

# 或者使用npm脚本
npm run client
```

### 一键启动
```bash
# 启动服务端和客户端
npm start & npm run client
```

## ⚙️ 配置说明

### 服务端配置
编辑 `config.json` 文件来自定义服务端设置：

```json
{
  "server": {
    "port": 3000,              // 服务器端口
    "host": "localhost",       // 服务器主机
    "maxUsers": 100,           // 最大用户数
    "websocket": {
      "heartbeatInterval": 30000,  // 心跳间隔（毫秒）
      "heartbeatTimeout": 60000     // 心跳超时（毫秒）
    },
    "security": {
      "rateLimit": {
        "windowMs": 60000,     // 速率限制时间窗口
        "maxRequests": 100,    // 最大请求数
        "messageDelay": 100      // 消息延迟（毫秒）
      }
    }
  }
}
```

### 客户端配置
```json
{
  "client": {
    "port": 5173,              // 客户端端口
    "canvas": {
      "width": 1200,           // Canvas宽度
      "height": 800,           // Canvas高度
      "gridSize": 50           // 网格大小
    },
    "player": {
      "avatarSize": 40,        // 头像大小
      "speed": 3,              // 移动速度
      "colors": {
        "myPlayer": "#FFD700",   // 当前玩家颜色
        "otherPlayer": "#4CAF50" // 其他玩家颜色
      }
    }
  }
}
```

## 🎮 游戏玩法

### 基本操作
- **移动**: 使用 WASD 键或方向键控制角色移动
- **聊天**: 按 Enter 键打开聊天输入框
- **缩放**: 使用鼠标滚轮缩放视角

### 游戏目标
- 与其他玩家互动
- 探索游戏世界
- 参与聊天交流
- 体验实时多人游戏

## 🔧 开发指南

### 消息协议

#### 客户端发送消息
```javascript
// 登录
{ type: 'login', data: { username: '玩家名称' } }

// 移动
{ type: 'move', data: { position: { x: 0, y: 0, z: 0 } } }

// 聊天
{ type: 'chat', data: { message: '聊天消息' } }

// 心跳
{ type: 'heartbeat', data: {} }
```

#### 服务端发送消息
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

### 模块开发

#### 创建新模块
```javascript
// modules/MyModule.js
class MyModule {
    constructor(gameServer) {
        this.gameServer = gameServer;
    }
    
    initialize() {
        // 初始化逻辑
    }
    
    handleMessage(userId, message) {
        // 处理消息
    }
}

module.exports = MyModule;
```

#### 集成新模块
```javascript
// server/index.js
const MyModule = require('./modules/MyModule');

class GameServer {
    constructor() {
        // ... 其他初始化
        this.myModule = new MyModule(this);
    }
}
```

## 📊 性能优化

### 服务端优化
- **内存管理**: 及时清理断开连接的用户数据
- **消息批处理**: 合并多个消息减少网络开销
- **速率限制**: 防止恶意用户发送过多消息
- **心跳检测**: 及时清理超时连接

### 客户端优化
- **Canvas优化**: 使用离屏Canvas减少重绘
- **渲染优化**: 只渲染可视区域内的玩家
- **网络优化**: 消息压缩和批量发送
- **资源管理**: 及时释放不用的资源

## 🛡️ 安全特性

### 输入验证
- 用户名长度限制（2-20字符）
- 消息内容过滤
- 位置数据范围检查
- 消息频率限制

### 安全防护
- WebSocket连接验证
- 消息格式验证
- 速率限制
- 异常处理

## 🚀 部署指南

### 生产环境部署

#### 使用PM2进程管理
```bash
# 安装PM2
npm install -g pm2

# 启动服务端
pm2 start server/index.js --name "game-server"

# 启动客户端
pm2 start "npm run client" --name "game-client"

# 查看状态
pm2 status

# 停止服务
pm2 stop game-server
pm2 stop game-client
```

#### 使用Docker
```dockerfile
# Dockerfile
FROM node:14-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "server/index.js"]
```

#### 使用Nginx反向代理
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /ws {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 环境变量
```bash
# 服务端配置
export PORT=3000
export HOST=0.0.0.0
export MAX_USERS=100
export NODE_ENV=production

# 客户端配置
export CLIENT_PORT=5173
export CLIENT_HOST=localhost
export SERVER_PORT=3000
export SERVER_HOST=your-domain.com
```

## 🐛 故障排除

### 常见问题

#### 端口被占用
```bash
# 查找占用端口的进程
lsof -i :3000

# 杀死进程
kill -9 <PID>
```

#### WebSocket连接失败
- 检查防火墙设置
- 确认端口开放
- 检查Nginx配置
- 验证WebSocket协议支持

#### 性能问题
- 检查服务器资源使用情况
- 优化消息发送频率
- 减少同时在线玩家数量
- 启用CDN加速

### 调试工具
```bash
# 查看服务器日志
tail -f logs/server.log

# 网络调试
ping your-domain.com
tracert your-domain.com

# WebSocket调试
wscat -c ws://your-domain.com:3000
```

## 📈 监控和统计

### 服务器监控
- CPU使用率
- 内存使用情况
- 网络流量
- 在线用户数量

### 游戏统计
- 日活跃用户
- 平均游戏时长
- 消息发送频率
- 错误率统计

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 👥 开发团队

- **开发者**: 尹云剑
- **企业**: 深圳市墨霖网络有限公司
- **部门**: 产研部

## 📞 联系方式

- **邮箱**: yinyunjian@example.com
- **GitHub**: https://github.com/your-username
- **Issues**: https://github.com/your-username/multiplayer-game-project/issues

## 🙏 致谢

- 感谢所有贡献者和支持者
- 感谢开源社区提供的优秀工具和库
- 感谢测试用户的反馈和建议

---

**⭐ 如果这个项目对你有帮助，请给它一个星标！**