# 多人游戏项目运行指南

本指南提供了完整的项目运行步骤，确保您能够顺利启动和运行多人游戏项目。

## 🚀 快速开始（5分钟）

### 前提条件
确保您的系统已安装：
- Node.js ≥ 14.0.0
- npm ≥ 6.0.0
- Git

### 一键启动
```bash
# 1. 克隆项目（如果尚未克隆）
git clone <your-repo-url> multiplayer-game-project
cd multiplayer-game-project

# 2. 安装依赖
npm run setup

# 3. 启动服务端
npm start

# 4. 启动客户端（新终端）
npm run client
```

### 访问游戏
- 服务端地址: http://localhost:3000
- 客户端地址: http://localhost:5173
- WebSocket地址: ws://localhost:3000

## 📋 详细安装步骤

### 1. 环境准备

#### 检查Node.js版本
```bash
node --version
# 应该显示 v14.0.0 或更高版本

npm --version
# 应该显示 6.0.0 或更高版本
```

#### 安装Node.js（如需要）
**Windows/macOS:**
访问 https://nodejs.org/ 下载并安装LTS版本

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Linux (CentOS/RHEL/Fedora):**
```bash
curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
sudo yum install -y nodejs
```

### 2. 项目安装

#### 克隆项目
```bash
git clone <your-repo-url> multiplayer-game-project
cd multiplayer-game-project
```

#### 安装依赖
```bash
# 安装所有依赖（推荐）
npm run setup

# 或者手动安装
npm install
cd client && npm install && cd ..
```

#### 验证安装
```bash
# 检查依赖安装
npm list --depth=0

# 检查客户端依赖
cd client && npm list --depth=0 && cd ..
```

### 3. 配置项目

#### 基础配置
编辑 `config.json` 文件：
```json
{
  "server": {
    "port": 3000,
    "host": "localhost",
    "maxUsers": 100
  },
  "client": {
    "port": 5173,
    "host": "localhost"
  }
}
```

#### 环境变量配置
复制环境变量示例：
```bash
cp .env.example .env
```

编辑 `.env` 文件：
```bash
# 基础配置
NODE_ENV=development
PORT=3000
CLIENT_PORT=5173
MAX_USERS=100
```

## 🎯 运行模式

### 开发模式
适合开发调试，支持热重载：

```bash
# 启动服务端（开发模式）
npm run dev

# 启动客户端（开发模式）
npm run client
```

特点：
- 自动重启服务
- 实时编译
- 详细日志
- 调试信息

### 生产模式
适合正式环境，性能优化：

```bash
# 构建项目
npm run build

# 启动服务端（生产模式）
NODE_ENV=production npm start

# 启动客户端（生产模式）
NODE_ENV=production npm run client
```

特点：
- 代码压缩
- 性能优化
- 错误处理
- 日志记录

## 🔧 高级运行选项

### 使用启动脚本

#### 服务端启动选项
```bash
# 基础启动
node start-server.js

# 指定端口
node start-server.js --port 8080

# 指定环境
node start-server.js --env production

# 指定最大用户数
node start-server.js --max-users 200

# 查看帮助
node start-server.js --help
```

#### 客户端启动选项
```bash
# 基础启动
node start-client.js

# 指定端口
node start-client.js --port 8080

# 指定服务端地址
node start-client.js --server-host example.com --server-port 3000

# 不自动打开浏览器
node start-client.js --no-open

# 查看帮助
node start-client.js --help
```

### 使用PM2进程管理

#### 安装PM2
```bash
npm install -g pm2
```

#### 启动服务
```bash
# 启动服务端
pm2 start start-server.js --name "game-server"

# 启动客户端
pm2 start start-client.js --name "game-client"

# 查看状态
pm2 status

# 查看日志
pm2 logs

# 停止服务
pm2 stop game-server
pm2 stop game-client

# 重启服务
pm2 restart game-server
pm2 restart game-client
```

#### PM2配置文件
创建 `ecosystem.config.js`：
```javascript
module.exports = {
  apps: [
    {
      name: 'game-server',
      script: 'start-server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        MAX_USERS: 100
      },
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '500M',
      log_file: 'logs/server.log',
      error_file: 'logs/server-error.log',
      out_file: 'logs/server-out.log'
    },
    {
      name: 'game-client',
      script: 'start-client.js',
      env: {
        NODE_ENV: 'production',
        CLIENT_PORT: 5173,
        SERVER_PORT: 3000
      },
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '300M',
      log_file: 'logs/client.log',
      error_file: 'logs/client-error.log',
      out_file: 'logs/client-out.log'
    }
  ]
};
```

使用配置文件启动：
```bash
pm2 start ecosystem.config.js
```

### Docker容器化部署

#### 使用Docker Compose
```bash
# 启动所有服务
docker-compose up -d

# 查看状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 重新构建
docker-compose build --no-cache
```

#### Docker部署选项
```bash
# 基础部署
docker-compose up -d

# 带Nginx的部署
docker-compose --profile with-nginx up -d

# 带Redis的部署
docker-compose --profile with-redis up -d

# 带监控的部署
docker-compose --profile with-monitoring up -d

# 完整部署
docker-compose --profile with-nginx --profile with-redis --profile with-monitoring up -d
```

## 🧪 测试运行

### 集成测试
```bash
# 运行完整测试
node test-integration.js

# 测试特定功能
node test-integration.js --test websocket
node test-integration.js --test login
node test-integration.js --test movement
```

### 性能测试
```bash
# 使用Apache Bench测试HTTP性能
ab -n 1000 -c 10 http://localhost:3000/

# 使用wrk测试WebSocket性能
wrk -t12 -c400 -d30s --latency ws://localhost:3000
```

### 负载测试
```bash
# 使用自定义负载测试脚本
node test-load.js --users 50 --duration 60
```

## 🔍 故障排除

### 常见问题

#### 端口被占用
```bash
# 查找占用进程
lsof -i :3000
netstat -tulpn | grep :3000

# 终止进程
kill -9 <PID>
```

#### 依赖安装失败
```bash
# 清除npm缓存
npm cache clean --force

# 删除node_modules
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

#### WebSocket连接失败
```bash
# 检查防火墙
sudo ufw status
sudo iptables -L

# 检查网络连通性
ping localhost
curl -v ws://localhost:3000
```

#### 内存不足
```bash
# 检查内存使用
free -h
top

# 增加Node.js内存限制
node --max-old-space-size=4096 start-server.js
```

### 日志查看

#### 服务端日志
```bash
# 实时查看日志
tail -f logs/server.log

# 查看错误日志
tail -f logs/server-error.log

# 查看最近100行日志
tail -n 100 logs/server.log
```

#### 客户端日志
```bash
# 查看客户端日志
tail -f logs/client.log

# 查看浏览器控制台（Chrome）
# 按F12打开开发者工具，查看Console标签
```

#### PM2日志
```bash
# 查看所有日志
pm2 logs

# 查看特定应用日志
pm2 logs game-server
pm2 logs game-client

# 清空日志
pm2 flush
```

### 调试模式

#### 服务端调试
```bash
# 使用Node.js调试器
node --inspect start-server.js

# 使用VS Code调试
# 在VS Code中按F5启动调试
```

#### 客户端调试
```bash
# 启动开发服务器（带调试信息）
npm run client -- --debug

# 在浏览器中调试
# 打开开发者工具，设置断点
```

## 📊 性能监控

### 基础监控
```bash
# 查看系统资源
htop
iotop
netstat -tulpn
```

### 应用监控
```bash
# 查看Node.js进程
ps aux | grep node

# 查看内存使用
node -e "console.log(process.memoryUsage())"

# 查看CPU使用
node -e "console.log(process.cpuUsage())"
```

### 网络监控
```bash
# 查看网络连接
ss -tulpn

# 查看网络流量
iftop

# 查看WebSocket连接
websocat ws://localhost:3000
```

## 🔄 自动化运行

### 使用systemd（Linux）

创建服务文件 `/etc/systemd/system/multiplayer-game.service`：
```ini
[Unit]
Description=Multiplayer Game Server
After=network.target

[Service]
Type=simple
User=nodejs
WorkingDirectory=/path/to/multiplayer-game-project
ExecStart=/usr/bin/node start-server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

启用和启动服务：
```bash
sudo systemctl enable multiplayer-game
sudo systemctl start multiplayer-game
sudo systemctl status multiplayer-game
```

### 使用Windows服务
使用 `nssm` (Non-Sucking Service Manager)：
```cmd
# 安装服务
nssm install MultiplayerGame "C:\Program Files\nodejs\node.exe" "C:\path\to\start-server.js"

# 配置服务
nssm edit MultiplayerGame

# 启动服务
net start MultiplayerGame
```

### 使用macOS LaunchAgent
创建 `~/Library/LaunchAgents/com.multiplayer.game.plist`：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.multiplayer.game</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>/path/to/start-server.js</string>
    </array>
    <key>WorkingDirectory</key>
    <string>/path/to/multiplayer-game-project</string>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>EnvironmentVariables</key>
    <dict>
        <key>NODE_ENV</key>
        <string>production</string>
        <key>PORT</key>
        <string>3000</string>
    </dict>
</dict>
</plist>
```

加载和启动：
```bash
launchctl load ~/Library/LaunchAgents/com.multiplayer.game.plist
launchctl start com.multiplayer.game
```

## 📞 获取帮助

### 查看文档
- [README.md](README.md) - 项目概述
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - 项目结构
- [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) - 故障排除

### 在线资源
- GitHub Issues: https://github.com/your-username/multiplayer-game-project/issues
- 项目Wiki: https://github.com/your-username/multiplayer-game-project/wiki

### 社区支持
- 加入Discord服务器: [邀请链接]
- 发送邮件: support@example.com

---

**💡 提示**: 如果在运行过程中遇到任何问题，请先查看日志文件，然后参考故障排除指南。大部分问题都可以通过查看日志找到原因。