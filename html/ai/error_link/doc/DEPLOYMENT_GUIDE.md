# 多人游戏项目部署指南

本指南提供了完整的项目部署步骤，涵盖从基础部署到生产环境配置的所有内容。

## 🚀 部署方式概览

### 部署选项对比
| 部署方式 | 复杂度 | 适用场景 | 优点 | 缺点 |
|---------|--------|----------|------|------|
| **直接部署** | ⭐ | 开发测试 | 简单快速 | 不适合生产 |
| **PM2部署** | ⭐⭐ | 小型生产 | 进程管理 | 单点故障 |
| **Docker部署** | ⭐⭐⭐ | 容器化 | 环境隔离 | 资源占用 |
| **K8s部署** | ⭐⭐⭐⭐⭐ | 大型生产 | 高可用 | 复杂度高 |
| **云部署** | ⭐⭐⭐⭐ | 企业级 | 弹性伸缩 | 成本高 |

## 📋 部署前准备

### 1. 系统要求
```bash
# 检查系统版本
lsb_release -a  # Ubuntu/Debian
cat /etc/redhat-release  # CentOS/RHEL
uname -a  # 内核版本

# 检查资源
free -h  # 内存
df -h  # 磁盘空间
nproc  # CPU核心数
```

### 2. 环境检查清单
- [ ] Node.js ≥ 14.0.0
- [ ] npm ≥ 6.0.0 或 yarn ≥ 1.22.0
- [ ] Git ≥ 2.0.0
- [ ] 端口 3000, 5173 可用
- [ ] 防火墙配置正确
- [ ] 域名解析（如需要）

### 3. 安全设置
```bash
# 创建专用用户
sudo useradd -m -s /bin/bash gameuser
sudo passwd gameuser

# 设置文件权限
chmod 755 /home/gameuser
chown -R gameuser:gameuser /path/to/project

# 配置防火墙
sudo ufw allow 3000/tcp
sudo ufw allow 5173/tcp
sudo ufw enable
```

## 🎯 部署方式详解

### 方式一：直接部署（推荐用于开发测试）

#### 步骤1：下载项目包
```bash
# 创建项目目录
mkdir -p /opt/games
cd /opt/games

# 下载项目包（假设已上传到服务器）
wget https://your-domain.com/releases/multiplayer-game-project-v1.0.0.zip

# 解压
unzip multiplayer-game-project-v1.0.0.zip
cd multiplayer-game-project
```

#### 步骤2：安装依赖
```bash
# 安装项目依赖
npm install --production

# 安装客户端依赖
cd client && npm install --production && cd ..

# 验证安装
npm list --depth=0
```

#### 步骤3：配置环境
```bash
# 复制环境配置
cp .env.example .env

# 编辑配置文件
nano .env
```

#### 步骤4：启动服务
```bash
# 启动服务端
node start-server.js &

# 启动客户端（可选）
node start-client.js &

# 检查服务状态
netstat -tulpn | grep :3000
netstat -tulpn | grep :5173
```

#### 步骤5：设置开机自启
```bash
# 创建systemd服务
sudo nano /etc/systemd/system/multiplayer-game.service
```

服务文件内容：
```ini
[Unit]
Description=Multiplayer Game Server
After=network.target

[Service]
Type=simple
User=gameuser
WorkingDirectory=/opt/games/multiplayer-game-project
ExecStart=/usr/bin/node start-server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

启用服务：
```bash
sudo systemctl daemon-reload
sudo systemctl enable multiplayer-game
sudo systemctl start multiplayer-game
sudo systemctl status multiplayer-game
```

### 方式二：PM2部署（推荐用于小型生产）

#### 安装PM2
```bash
# 全局安装PM2
npm install -g pm2

# 检查安装
pm2 --version
```

#### 配置PM2
```bash
# 创建ecosystem配置文件
nano ecosystem.config.js
```

配置文件内容：
```javascript
module.exports = {
  apps: [
    {
      name: 'game-server',
      script: 'start-server.js',
      cwd: '/opt/games/multiplayer-game-project',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        MAX_USERS: 100
      },
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '500M',
      log_file: '/var/log/pm2/game-server.log',
      error_file: '/var/log/pm2/game-server-error.log',
      out_file: '/var/log/pm2/game-server-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      min_uptime: '10s',
      max_restarts: 5
    },
    {
      name: 'game-client',
      script: 'start-client.js',
      cwd: '/opt/games/multiplayer-game-project',
      env: {
        NODE_ENV: 'production',
        CLIENT_PORT: 5173,
        SERVER_PORT: 3000
      },
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '300M',
      log_file: '/var/log/pm2/game-client.log',
      error_file: '/var/log/pm2/game-client-error.log',
      out_file: '/var/log/pm2/game-client-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      min_uptime: '10s',
      max_restarts: 5
    }
  ]
};
```

#### 启动PM2服务
```bash
# 创建日志目录
sudo mkdir -p /var/log/pm2
sudo chown -R gameuser:gameuser /var/log/pm2

# 启动应用
pm2 start ecosystem.config.js

# 查看状态
pm2 status
pm2 logs

# 保存PM2配置
pm2 save

# 设置开机自启
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u gameuser --hp /home/gameuser
```

### 方式三：Docker部署（推荐用于容器化）

#### 安装Docker
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker gameuser

# CentOS/RHEL
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker

# 验证安装
docker --version
docker-compose --version
```

#### Docker部署步骤
```bash
# 1. 下载项目包
cd /opt/games
wget https://your-domain.com/releases/multiplayer-game-project-v1.0.0.zip
unzip multiplayer-game-project-v1.0.0.zip
cd multiplayer-game-project

# 2. 构建镜像
docker build -t multiplayer-game:latest .

# 3. 运行容器
docker run -d \
  --name game-server \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -v /opt/games/logs:/app/logs \
  --restart=always \
  multiplayer-game:latest

# 4. 运行客户端容器（可选）
docker run -d \
  --name game-client \
  -p 5173:5173 \
  -e NODE_ENV=production \
  -e CLIENT_PORT=5173 \
  -e SERVER_PORT=3000 \
  -v /opt/games/logs:/app/logs \
  --restart=always \
  multiplayer-game:latest \
  node start-client.js
```

#### Docker Compose部署
```bash
# 使用Docker Compose
docker-compose up -d

# 查看状态
docker-compose ps
docker-compose logs -f

# 停止服务
docker-compose down
```

### 方式四：Kubernetes部署（企业级）

#### 创建Deployment配置
```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: multiplayer-game
  labels:
    app: multiplayer-game
spec:
  replicas: 3
  selector:
    matchLabels:
      app: multiplayer-game
  template:
    metadata:
      labels:
        app: multiplayer-game
    spec:
      containers:
      - name: game-server
        image: multiplayer-game:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "3000"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: multiplayer-game-service
spec:
  selector:
    app: multiplayer-game
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

#### 部署到K8s
```bash
# 应用配置
kubectl apply -f k8s-deployment.yaml

# 查看状态
kubectl get pods
kubectl get services
kubectl get deployments

# 查看日志
kubectl logs -f deployment/multiplayer-game
```

## 🔧 高级配置

### 1. Nginx反向代理配置
```nginx
# /etc/nginx/sites-available/multiplayer-game
server {
    listen 80;
    server_name your-domain.com;
    
    # 客户端静态文件
    location / {
        proxy_pass http://localhost:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # WebSocket连接
    location /ws {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket超时设置
        proxy_connect_timeout 7d;
        proxy_send_timeout 7d;
        proxy_read_timeout 7d;
    }
    
    # API接口
    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # 健康检查
    location /health {
        proxy_pass http://localhost:3000/health;
        access_log off;
    }
}

# 启用配置
sudo ln -s /etc/nginx/sites-available/multiplayer-game /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 2. SSL证书配置
```bash
# 使用Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo crontab -e
# 添加：0 12 * * * /usr/bin/certbot renew --quiet
```

### 3. 数据库配置（如果需要）
```bash
# 安装Redis（用于会话存储）
sudo apt install redis-server
sudo systemctl enable redis-server

# 安装PostgreSQL（用于数据持久化）
sudo apt install postgresql postgresql-contrib
sudo systemctl enable postgresql

# 创建数据库和用户
sudo -u postgres psql
CREATE DATABASE multiplayer_game;
CREATE USER gameuser WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE multiplayer_game TO gameuser;
\q
```

### 4. 监控配置
```bash
# 安装Node Exporter（Prometheus监控）
wget https://github.com/prometheus/node_exporter/releases/download/v1.6.1/node_exporter-1.6.1.linux-amd64.tar.gz
tar xvfz node_exporter-1.6.1.linux-amd64.tar.gz
sudo cp node_exporter-1.6.1.linux-amd64/node_exporter /usr/local/bin/
sudo useradd --no-create-home --shell /bin/false nodeusr
sudo chown nodeusr:nodeusr /usr/local/bin/node_exporter

# 创建systemd服务
sudo nano /etc/systemd/system/node_exporter.service
```

服务文件：
```ini
[Unit]
Description=Node Exporter
Wants=network-online.target
After=network-online.target

[Service]
User=nodeusr
Group=nodeusr
Type=simple
ExecStart=/usr/local/bin/node_exporter

[Install]
WantedBy=default.target
```

启动服务：
```bash
sudo systemctl daemon-reload
sudo systemctl enable node_exporter
sudo systemctl start node_exporter
```

## 🔍 部署验证

### 1. 服务状态检查
```bash
# 检查服务状态
sudo systemctl status multiplayer-game
pm2 status
docker ps

# 检查端口监听
netstat -tulpn | grep :3000
ss -tulpn | grep :3000

# 检查进程
ps aux | grep node
```

### 2. 功能测试
```bash
# 运行集成测试
cd /opt/games/multiplayer-game-project
node test-integration.js

# 测试WebSocket连接
websocat ws://localhost:3000

# 测试HTTP接口
curl http://localhost:3000/health
curl http://localhost:3000/api/status
```

### 3. 性能测试
```bash
# 使用Apache Bench
ab -n 1000 -c 10 http://localhost:3000/

# 使用wrk测试WebSocket
wrk -t12 -c400 -d30s --latency ws://localhost:3000

# 使用自定义负载测试
node test-load.js --users 50 --duration 60
```

### 4. 日志监控
```bash
# 查看实时日志
tail -f /var/log/pm2/game-server.log
tail -f /var/log/pm2/game-server-error.log

# 查看系统日志
journalctl -u multiplayer-game -f

# 查看Docker日志
docker logs -f game-server
```

## 🛠️ 故障排除

### 常见问题

#### 1. 端口被占用
```bash
# 查找占用进程
sudo lsof -i :3000
sudo netstat -tulpn | grep :3000

# 终止进程
sudo kill -9 <PID>

# 或者更换端口
export PORT=3001
node start-server.js
```

#### 2. 权限问题
```bash
# 修复文件权限
sudo chown -R gameuser:gameuser /opt/games/multiplayer-game-project
sudo chmod -R 755 /opt/games/multiplayer-game-project

# 修复npm权限
sudo chown -R $(whoami) ~/.npm
```

#### 3. 内存不足
```bash
# 检查内存使用
free -h
top

# 增加Node.js内存限制
node --max-old-space-size=4096 start-server.js

# 优化PM2内存限制
# 在ecosystem.config.js中设置 max_memory_restart: '1G'
```

#### 4. WebSocket连接失败
```bash
# 检查防火墙
sudo ufw status
sudo iptables -L

# 检查Nginx配置
sudo nginx -t

# 测试网络连通性
ping your-domain.com
tracert your-domain.com
```

#### 5. 依赖安装失败
```bash
# 清除npm缓存
npm cache clean --force

# 删除node_modules
rm -rf node_modules package-lock.json

# 重新安装
npm install --production
```

## 📊 性能优化

### 1. 系统优化
```bash
# 增加文件描述符限制
echo "fs.file-max = 65536" >> /etc/sysctl.conf
sysctl -p

# 优化TCP设置
echo "net.core.somaxconn = 65535" >> /etc/sysctl.conf
echo "net.ipv4.tcp_max_syn_backlog = 65535" >> /etc/sysctl.conf
sysctl -p
```

### 2. Node.js优化
```javascript
// 在start-server.js中添加优化
process.env.UV_THREADPOOL_SIZE = 128;
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

// 优化事件监听器限制
process.setMaxListeners(0);

// 优化内存使用
if (global.gc) {
  setInterval(() => {
    global.gc();
  }, 60000); // 每分钟执行一次垃圾回收
}
```

### 3. 数据库优化（如果使用）
```bash
# Redis优化
sudo nano /etc/redis/redis.conf
```

优化配置：
```conf
maxmemory 256mb
maxmemory-policy allkeys-lru
tcp-keepalive 60
timeout 300
```

## 🔐 安全加固

### 1. 网络安全
```bash
# 配置防火墙
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# 配置fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban
```

### 2. 应用安全
```bash
# 设置环境变量
export NODE_ENV=production
export SESSION_SECRET=your-strong-secret-key
export JWT_SECRET=your-jwt-secret-key

# 配置HTTPS
# 在Nginx中配置SSL证书
```

### 3. 文件权限
```bash
# 设置严格的文件权限
chmod 600 .env
chmod 755 start-server.js
chmod 644 package.json
chmod 700 logs/
```

## 📈 监控告警

### 1. 应用监控
```bash
# 创建监控脚本
nano /opt/games/monitor.sh
```

监控脚本：
```bash
#!/bin/bash
# 监控游戏服务状态

SERVER_PORT=3000
CLIENT_PORT=5173
LOG_FILE="/var/log/game-monitor.log"

# 检查端口
if ! netstat -tulpn | grep -q :$SERVER_PORT; then
    echo "$(date): Server port $SERVER_PORT is not listening" >> $LOG_FILE
    # 发送告警邮件或短信
fi

# 检查进程
if ! pgrep -f "start-server.js"; then
    echo "$(date): Server process is not running" >> $LOG_FILE
    # 发送告警邮件或短信
fi

# 检查内存使用
MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.2f", $3/$2 * 100.0}')
if (( $(echo "$MEMORY_USAGE > 90" | bc -l) )); then
    echo "$(date): Memory usage is high: $MEMORY_USAGE%" >> $LOG_FILE
fi
```

### 2. 设置定时任务
```bash
# 添加监控任务
crontab -e
# 添加：*/5 * * * * /opt/games/monitor.sh
```

## 🔄 升级维护

### 1. 热更新
```bash
# 使用PM2零停机更新
pm2 reload game-server

# 使用Docker滚动更新
docker-compose up -d --no-deps game-server
```

### 2. 备份策略
```bash
# 创建备份脚本
nano /opt/games/backup.sh
```

备份脚本：
```bash
#!/bin/bash
# 备份游戏数据和配置

BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)
PROJECT_DIR="/opt/games/multiplayer-game-project"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份配置文件
tar -czf $BACKUP_DIR/config_$DATE.tar.gz $PROJECT_DIR/config.json $PROJECT_DIR/.env

# 备份日志文件
tar -czf $BACKUP_DIR/logs_$DATE.tar.gz $PROJECT_DIR/logs/

# 备份数据库（如果使用）
pg_dump multiplayer_game > $BACKUP_DIR/database_$DATE.sql

# 清理旧备份（保留最近7天）
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
```

### 3. 回滚策略
```bash
# 创建回滚脚本
nano /opt/games/rollback.sh
```

回滚脚本：
```bash
#!/bin/bash
# 回滚到上一个版本

BACKUP_DIR="/opt/backups"
PROJECT_DIR="/opt/games/multiplayer-game-project"

# 停止服务
pm2 stop game-server

# 恢复配置
latest_config=$(ls -t $BACKUP_DIR/config_*.tar.gz | head -1)
tar -xzf $latest_config -C /

# 恢复数据库（如果需要）
latest_db=$(ls -t $BACKUP_DIR/database_*.sql | head -1)
psql multiplayer_game < $latest_db

# 重启服务
pm2 start game-server
```

## 📞 技术支持

### 获取帮助
1. **查看日志**: 首先检查应用日志和系统日志
2. **验证配置**: 确认所有配置文件正确
3. **网络测试**: 使用网络工具测试连通性
4. **性能监控**: 检查系统资源使用情况
5. **社区支持**: 寻求社区或技术支持帮助

### 紧急联系
- **技术支持邮箱**: support@your-company.com
- **紧急联系电话**: +86-xxx-xxxx-xxxx
- **在线支持**: https://support.your-company.com
- **文档中心**: https://docs.your-company.com

---

**💡 提示**: 部署前务必在测试环境验证所有配置，确保生产环境部署的稳定性。建议先在staging环境进行完整测试。