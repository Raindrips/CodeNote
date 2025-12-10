# 多人游戏项目目录结构图

本文档提供了项目的完整目录结构，帮助理解项目的组织方式和文件分布。

## 📁 项目根目录结构

```
multiplayer-game-project/
│
├── 📄 README.md                    # 项目说明文档
├── 📄 PACKAGE_SUMMARY.md          # 打包摘要
├── 📄 PROJECT_STRUCTURE.md        # 项目结构文档
├── 📄 RUN_GUIDE.md                # 运行指南
├── 📄 DEPLOYMENT_GUIDE.md         # 部署指南
├── 📄 TESTING_GUIDE.md            # 测试指南
│
├── 📄 package.json                 # 项目依赖配置
├── 📄 package-lock.json           # 依赖锁定文件
├── 📄 config.json                 # 主配置文件
├── 📄 .env.example                # 环境变量模板
│
├── 🚀 start-server.js             # 服务端启动脚本
├── 🚀 start-client.js             # 客户端启动脚本
├── 🚀 deploy.sh                   # 部署脚本
├── 🚀 test-integration.js         # 集成测试脚本
│
├── 🐳 Dockerfile                  # Docker容器配置
├── 🐳 docker-compose.yml          # Docker Compose配置
├── 🐳 docker-entrypoint.sh        # Docker入口脚本
│
├── 🖥️  server/                      # 服务端代码目录
│   ├── 📄 index.js                # 主服务器文件
│   └── 📁 modules/                # 核心模块目录
│       ├── 📄 UserManager.js      # 用户管理模块
│       ├── 📄 MessageHandler.js   # 消息处理模块
│       ├── 📄 BroadcastManager.js # 广播管理模块
│       ├── 📄 GameRoom.js         # 游戏房间模块
│       ├── 📄 RoomManager.js      # 房间管理模块
│       └── 📄 SecurityManager.js  # 安全管理模块
│
├── 🎮 client/                      # 客户端代码目录
│   ├── 📄 index.html              # 主HTML文件
│   ├── 📄 package.json            # 客户端依赖配置
│   ├── 📄 package-lock.json       # 客户端依赖锁定
│   ├── ⚙️ vite.config.js           # Vite构建配置
│   ├── 📁 assets/                  # 静态资源目录
│   │   ├── 📁 images/               # 图片资源
│   │   ├── 📁 sounds/               # 音频资源
│   │   └── 📁 fonts/                # 字体资源
│   ├── 📁 src/                      # 源代码目录
│   │   ├── 📄 main.js               # 主入口文件
│   │   ├── 📄 game.js                # 游戏逻辑
│   │   ├── 📄 network.js             # 网络通信
│   │   ├── 📄 renderer.js            # 渲染引擎
│   │   ├── 📄 input.js                # 输入处理
│   │   ├── 📄 audio.js                # 音频管理
│   │   └── 📁 components/              # 组件目录
│   │       ├── 📄 player.js              # 玩家组件
│   │       ├── 📄 chat.js                 # 聊天组件
│   │       └── 📄 ui.js                   # UI组件
│   └── 📁 styles/                   # 样式文件目录
│       ├── 📄 main.css              # 主样式文件
│       ├── 📄 game.css              # 游戏样式
│       └── 📄 responsive.css        # 响应式样式
│
├── 📖 docs/                        # 项目文档目录
│   ├── 📄 API_REFERENCE.md        # API参考文档
│   ├── 📄 ARCHITECTURE.md         # 架构设计文档
│   ├── 📄 DEVELOPMENT.md          # 开发指南
│   ├── 📄 TROUBLESHOOTING.md      # 故障排除指南
│   ├── 📄 CONTRIBUTING.md         # 贡献指南
│   └── 📄 CHANGELOG.md            # 变更日志
│
├── 📊 scripts/                     # 脚本工具目录
│   ├── 📄 build.js                # 构建脚本
│   ├── 📄 deploy.js               # 部署脚本
│   ├── 📄 test.js                 # 测试脚本
│   ├── 📄 monitor.js              # 监控脚本
│   └── 📄 backup.js               # 备份脚本
│
├── 🧪 tests/                       # 测试代码目录
│   ├── 📁 unit/                     # 单元测试
│   │   ├── 📄 server.test.js         # 服务端单元测试
│   │   ├── 📄 client.test.js         # 客户端单元测试
│   │   └── 📄 modules.test.js       # 模块单元测试
│   ├── 📁 integration/              # 集成测试
│   │   ├── 📄 websocket.test.js      # WebSocket集成测试
│   │   ├── 📄 game-flow.test.js     # 游戏流程测试
│   │   └── 📄 performance.test.js    # 性能测试
│   ├── 📁 e2e/                      # 端到端测试
│   │   ├── 📄 user-journey.test.js   # 用户旅程测试
│   │   └── 📄 multiplayer.test.js    # 多人游戏测试
│   └── 📁 fixtures/                 # 测试数据
│       ├── 📄 mock-data.js          # 模拟数据
│       └── 📄 test-users.js         # 测试用户数据
│
├── 📈 logs/                        # 日志文件目录
│   ├── 📄 server.log               # 服务端日志
│   ├── 📄 client.log               # 客户端日志
│   ├── 📄 error.log                # 错误日志
│   ├── 📄 access.log               # 访问日志
│   └── 📄 performance.log          # 性能日志
│
└── 🔧 config/                      # 配置文件目录
    ├── 📄 development.json         # 开发环境配置
    ├── 📄 production.json          # 生产环境配置
    ├── 📄 test.json                # 测试环境配置
    └── 📄 staging.json             # 预发布环境配置
```

## 🔍 文件类型说明

### 📄 配置文件
- **package.json**: 项目依赖和脚本配置
- **config.json**: 主配置文件，包含服务端和客户端设置
- **.env.example**: 环境变量模板文件
- **vite.config.js**: Vite构建工具配置

### 🚀 启动脚本
- **start-server.js**: 服务端启动脚本，包含环境检查和错误处理
- **start-client.js**: 客户端启动脚本，支持开发模式和生产模式
- **deploy.sh**: 自动化部署脚本，支持多种部署方式

### 🐳 Docker相关
- **Dockerfile**: Docker镜像构建配置
- **docker-compose.yml**: 多容器应用编排配置
- **docker-entrypoint.sh**: 容器启动入口脚本

### 🖥️ 服务端代码
- **server/index.js**: 主服务器文件，处理HTTP和WebSocket连接
- **server/modules/**: 模块化服务端功能组件
  - **UserManager.js**: 用户连接管理和状态维护
  - **MessageHandler.js**: 消息解析和路由处理
  - **BroadcastManager.js**: 消息广播和推送
  - **GameRoom.js**: 游戏房间逻辑
  - **RoomManager.js**: 房间创建和管理
  - **SecurityManager.js**: 安全检查和防护

### 🎮 客户端代码
- **client/index.html**: 主HTML文件，包含游戏Canvas和UI
- **client/src/**: 客户端源代码
  - **main.js**: 应用入口点
  - **game.js**: 游戏主逻辑
  - **network.js**: WebSocket连接管理
  - **renderer.js**: Canvas渲染引擎
  - **input.js**: 键盘和鼠标输入处理
  - **audio.js**: 音效管理
  - **components/**: 可复用组件

### 📖 文档
- **README.md**: 项目概述和快速开始
- **RUN_GUIDE.md**: 详细运行指南
- **DEPLOYMENT_GUIDE.md**: 完整部署说明
- **TESTING_GUIDE.md**: 测试指南和最佳实践

### 🧪 测试
- **tests/unit/**: 单元测试文件
- **tests/integration/**: 集成测试文件
- **tests/e2e/**: 端到端测试文件
- **tests/fixtures/**: 测试数据和模拟对象

### 📊 工具脚本
- **scripts/build.js**: 项目构建脚本
- **scripts/deploy.js**: 部署自动化脚本
- **scripts/test.js**: 测试运行器
- **scripts/monitor.js**: 系统监控脚本

### 📈 日志
- **logs/server.log**: 服务端运行日志
- **logs/client.log**: 客户端运行日志
- **logs/error.log**: 错误和异常日志
- **logs/performance.log**: 性能指标日志

## 🎯 核心文件功能说明

### 服务端核心文件

#### server/index.js
```javascript
// 主服务器文件功能概览
- WebSocket服务器创建和管理
- HTTP服务器提供静态文件服务
- 客户端连接处理
- 消息路由和分发
- 错误处理和日志记录
-  graceful shutdown处理
```

#### server/modules/UserManager.js
```javascript
// 用户管理模块功能
- 用户连接生命周期管理
- 用户状态维护
- 用户位置同步
- 用户断开连接处理
- 在线用户统计
```

#### server/modules/MessageHandler.js
```javascript
// 消息处理模块功能
- 消息类型解析
- 消息验证和过滤
- 消息路由分发
- 错误消息处理
- 消息日志记录
```

#### server/modules/BroadcastManager.js
```javascript
// 广播管理模块功能
- 消息广播策略
- 目标用户筛选
- 批量消息发送
- 消息优先级处理
- 广播性能优化
```

#### server/modules/SecurityManager.js
```javascript
// 安全管理模块功能
- 输入验证和过滤
- 速率限制控制
- 异常行为检测
- 安全防护机制
- 安全日志记录
```

### 客户端核心文件

#### client/index.html
```html
<!-- 主HTML文件结构 -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>多人游戏</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <!-- 游戏Canvas -->
    <canvas id="gameCanvas"></canvas>
    
    <!-- UI界面 -->
    <div id="ui-container">
        <!-- 聊天界面 -->
        <div id="chat-container">
            <div id="chat-messages"></div>
            <input type="text" id="chat-input" placeholder="输入消息...">
        </div>
        
        <!-- 玩家列表 -->
        <div id="player-list">
            <h3>在线玩家</h3>
            <ul id="players"></ul>
        </div>
        
        <!-- 游戏状态 -->
        <div id="game-status">
            <span id="connection-status">连接中...</span>
            <span id="player-count">玩家: 0</span>
        </div>
    </div>
    
    <!-- 脚本文件 -->
    <script type="module" src="src/main.js"></script>
</body>
</html>
```

#### client/src/main.js
```javascript
// 主入口文件功能
- 应用初始化
- 模块加载和配置
- 全局错误处理
- 性能监控
- 应用生命周期管理
```

#### client/src/game.js
```javascript
// 游戏逻辑文件功能
- 游戏状态管理
- 游戏循环控制
- 玩家行为处理
- 游戏规则实现
- 游戏事件处理
```

#### client/src/network.js
```javascript
// 网络通信文件功能
- WebSocket连接管理
- 消息发送和接收
- 连接状态监控
- 自动重连机制
- 网络错误处理
```

#### client/src/renderer.js
```javascript
// 渲染引擎文件功能
- Canvas渲染管理
- 图形绘制优化
- 动画效果实现
- 视觉特效处理
- 渲染性能监控
```

## 🚀 配置文件详解

### config.json
```json
{
  "server": {
    "port": 3000,
    "host": "localhost",
    "maxUsers": 100,
    "websocket": {
      "heartbeatInterval": 30000,
      "heartbeatTimeout": 60000
    },
    "security": {
      "rateLimit": {
        "windowMs": 60000,
        "maxRequests": 100,
        "messageDelay": 100
      }
    }
  },
  "client": {
    "port": 5173,
    "canvas": {
      "width": 1200,
      "height": 800,
      "gridSize": 50
    },
    "player": {
      "avatarSize": 40,
      "speed": 3,
      "colors": {
        "myPlayer": "#FFD700",
        "otherPlayer": "#4CAF50"
      }
    }
  }
}
```

### package.json
```json
{
  "name": "multiplayer-game-project",
  "version": "1.0.0",
  "description": "A real-time multiplayer game with WebSocket communication",
  "main": "server/index.js",
  "scripts": {
    "start": "node start-server.js",
    "client": "node start-client.js",
    "dev": "NODE_ENV=development npm start",
    "test": "npm run test:unit && npm run test:integration",
    "test:unit": "mocha tests/unit/**/*.test.js",
    "test:integration": "mocha tests/integration/**/*.test.js",
    "build": "node scripts/build.js",
    "deploy": "node scripts/deploy.js",
    "setup": "npm install && cd client && npm install"
  },
  "dependencies": {
    "ws": "^8.0.0",
    "express": "^4.18.0",
    "uuid": "^9.0.0",
    "cors": "^2.8.5",
    "helmet": "^7.0.0"
  },
  "devDependencies": {
    "mocha": "^10.0.0",
    "chai": "^4.3.0",
    "sinon": "^15.0.0",
    "supertest": "^6.3.0"
  },
  "engines": {
    "node": ">=14.0.0",
    "npm": ">=6.0.0"
  }
}
```

## 🧪 测试文件结构

### 单元测试示例
```javascript
// tests/unit/server.test.js
const { expect } = require('chai');
const UserManager = require('../../server/modules/UserManager');

describe('UserManager', () => {
    let userManager;
    
    beforeEach(() => {
        userManager = new UserManager();
    });
    
    it('should add a new user', () => {
        const user = userManager.addUser('test-user', { id: '123' });
        expect(user).to.have.property('id', '123');
        expect(user).to.have.property('username', 'test-user');
    });
    
    it('should remove a user', () => {
        userManager.addUser('test-user', { id: '123' });
        userManager.removeUser('123');
        expect(userManager.getUser('123')).to.be.undefined;
    });
});
```

### 集成测试示例
```javascript
// tests/integration/websocket.test.js
const { expect } = require('chai');
const WebSocket = require('ws');

describe('WebSocket Integration', () => {
    it('should handle user login', (done) => {
        const ws = new WebSocket('ws://localhost:3000');
        
        ws.on('open', () => {
            ws.send(JSON.stringify({
                type: 'login',
                data: { username: 'test-user' }
            }));
        });
        
        ws.on('message', (data) => {
            const message = JSON.parse(data);
            expect(message.type).to.equal('login_success');
            expect(message).to.have.property('userId');
            expect(message).to.have.property('username', 'test-user');
            ws.close();
            done();
        });
    });
});
```

## 📊 日志文件结构

### 日志配置
```javascript
// logs/config.js
module.exports = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        debug: 3
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        debug: 'blue'
    },
    files: {
        server: 'logs/server.log',
        client: 'logs/client.log',
        error: 'logs/error.log',
        performance: 'logs/performance.log'
    }
};
```

### 日志轮转
```bash
# 使用logrotate进行日志轮转
# /etc/logrotate.d/multiplayer-game
/opt/games/multiplayer-game-project/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 0644 gameuser gameuser
    postrotate
        systemctl reload multiplayer-game
    endscript
}
```

## 🔧 构建和部署文件

### 构建脚本
```javascript
// scripts/build.js
const fs = require('fs');
const path = require('path');

function buildProject() {
    console.log('🏗️ 开始构建项目...');
    
    // 清理构建目录
    const buildDir = 'dist';
    if (fs.existsSync(buildDir)) {
        fs.rmSync(buildDir, { recursive: true });
    }
    fs.mkdirSync(buildDir);
    
    // 构建客户端
    console.log('📦 构建客户端...');
    buildClient();
    
    // 构建服务端
    console.log('📦 构建服务端...');
    buildServer();
    
    console.log('✅ 构建完成！');
}

function buildClient() {
    // 客户端构建逻辑
    const clientBuildDir = 'dist/client';
    fs.mkdirSync(clientBuildDir, { recursive: true });
    
    // 复制客户端文件
    fs.cpSync('client', clientBuildDir, { recursive: true });
    
    // 压缩和优化
    // ... 构建逻辑
}

function buildServer() {
    // 服务端构建逻辑
    const serverBuildDir = 'dist/server';
    fs.mkdirSync(serverBuildDir, { recursive: true });
    
    // 复制服务端文件
    fs.cpSync('server', serverBuildDir, { recursive: true });
    
    // 安装生产依赖
    // ... 构建逻辑
}

buildProject();
```

### 部署脚本
```bash
#!/bin/bash
# scripts/deploy.sh

set -e

echo "🚀 开始部署项目..."

# 检查环境
if [ -z "$NODE_ENV" ]; then
    echo "❌ NODE_ENV 未设置"
    exit 1
fi

# 构建项目
echo "🏗️ 构建项目..."
npm run build

# 停止现有服务
echo "⏹️ 停止现有服务..."
pm2 stop game-server || true

# 备份当前版本
echo "💾 备份当前版本..."
if [ -d "current" ]; then
    mv current backup-$(date +%Y%m%d-%H%M%S)
fi

# 部署新版本
echo "📦 部署新版本..."
mv dist current

# 安装依赖
echo "📥 安装依赖..."
cd current
npm install --production

# 启动服务
echo "▶️ 启动服务..."
pm2 start current/server/index.js --name game-server

# 健康检查
echo "🏥 健康检查..."
sleep 10
curl -f http://localhost:3000/health || exit 1

echo "✅ 部署完成！"
```

## 📈 监控和运维

### 监控脚本
```javascript
// scripts/monitor.js
const fs = require('fs');
const { exec } = require('child_process');

class SystemMonitor {
    constructor() {
        this.metrics = {
            cpu: 0,
            memory: 0,
            connections: 0,
            uptime: 0
        };
    }
    
    collectMetrics() {
        // 收集CPU使用率
        this.getCPUUsage();
        
        // 收集内存使用率
        this.getMemoryUsage();
        
        // 收集连接数
        this.getConnectionCount();
        
        // 记录指标
        this.logMetrics();
    }
    
    getCPUUsage() {
        exec('top -bn1 | grep "Cpu(s)" | sed "s/.*, *\\([0-9.]*\\)%* id.*/\\1/" | awk \'{print 100 - $1}\'', (error, stdout) => {
            if (!error) {
                this.metrics.cpu = parseFloat(stdout.trim());
            }
        });
    }
    
    getMemoryUsage() {
        exec('free | grep Mem | awk \'{print ($3/$2) * 100.0}\'', (error, stdout) => {
            if (!error) {
                this.metrics.memory = parseFloat(stdout.trim());
            }
        });
    }
    
    getConnectionCount() {
        exec('netstat -an | grep :3000 | wc -l', (error, stdout) => {
            if (!error) {
                this.metrics.connections = parseInt(stdout.trim());
            }
        });
    }
    
    logMetrics() {
        const logEntry = {
            timestamp: new Date().toISOString(),
            metrics: this.metrics
        };
        
        fs.appendFileSync('logs/performance.log', JSON.stringify(logEntry) + '\n');
    }
}

// 定期收集指标
const monitor = new SystemMonitor();
setInterval(() => {
    monitor.collectMetrics();
}, 60000); // 每分钟收集一次
```

这个完整的目录结构图展示了多人游戏项目的所有组成部分，帮助开发者和部署人员快速理解项目的组织结构和文件功能。