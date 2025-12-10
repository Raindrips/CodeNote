# 简易联机游戏服务端

基于Node.js和WebSocket实现的简易联机游戏服务端，支持多玩家实时位置同步。

## 功能特性

- ✅ 支持10个以上玩家同时连接（最大支持50人）
- ✅ 玩家位置实时同步（可配置同步间隔）
- ✅ 玩家加入/离开事件处理
- ✅ 玩家移动事件处理
- ✅ 内存存储玩家数据，无需数据库
- ✅ 使用原生Node.js和WebSocket，无复杂框架依赖
- ✅ 简单的世界边界管理
- ✅ 玩家数量限制和连接管理

## 快速开始

### 1. 安装依赖
```bash
cd game-server
npm install
```

### 2. 启动服务器
```bash
npm start
```

### 3. 服务器配置
在 `server.js` 文件中可以修改以下配置：

```javascript
const CONFIG = {
  PORT: 8080,              // 服务器端口
  SYNC_INTERVAL: 100,      // 位置同步间隔（毫秒）
  MAX_PLAYERS: 50,         // 最大玩家数
  WORLD_WIDTH: 1000,       // 游戏世界宽度
  WORLD_HEIGHT: 1000       // 游戏世界高度
};
```

## 通信协议

### 客户端 -> 服务器消息

#### 移动消息
```json
{
  "type": "move",
  "x": 100,
  "y": 200
}
```

#### 心跳消息
```json
{
  "type": "ping",
  "timestamp": 1634567890123
}
```

### 服务器 -> 客户端消息

#### 欢迎消息
```json
{
  "type": "welcome",
  "playerId": "player_1",
  "position": {
    "x": 500,
    "y": 300
  },
  "worldSize": {
    "width": 1000,
    "height": 1000
  }
}
```

#### 所有玩家位置
```json
{
  "type": "allPlayers",
  "players": {
    "player_1": { "x": 100, "y": 200 },
    "player_2": { "x": 300, "y": 400 }
  }
}
```

#### 位置同步
```json
{
  "type": "positions",
  "positions": {
    "player_1": { "x": 150, "y": 250 },
    "player_2": { "x": 350, "y": 450 }
  }
}
```

#### 玩家加入
```json
{
  "type": "playerJoined",
  "playerId": "player_3",
  "position": { "x": 200, "y": 300 }
}
```

#### 玩家离开
```json
{
  "type": "playerLeft",
  "playerId": "player_2"
}
```

#### 心跳响应
```json
{
  "type": "pong",
  "timestamp": 1634567890123
}
```

#### 错误消息
```json
{
  "type": "error",
  "message": "服务器已满员"
}
```

## 使用示例

### 简单的HTML客户端
```html
<!DOCTYPE html>
<html>
<head>
    <title>游戏客户端</title>
</head>
<body>
    <h1>简易联机游戏客户端</h1>
    <div id="status">连接中...</div>
    <div id="players"></div>
    
    <script>
        const ws = new WebSocket('ws://localhost:8080');
        
        ws.onopen = () => {
            document.getElementById('status').textContent = '已连接';
        };
        
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('收到消息:', data);
            
            switch(data.type) {
                case 'welcome':
                    console.log('欢迎! 你的ID:', data.playerId);
                    break;
                case 'positions':
                    updatePlayers(data.positions);
                    break;
            }
        };
        
        function updatePlayers(positions) {
            const playersDiv = document.getElementById('players');
            playersDiv.innerHTML = '<h3>在线玩家:</h3>';
            
            for(const [playerId, pos] of Object.entries(positions)) {
                playersDiv.innerHTML += `<div>${playerId}: (${pos.x}, ${pos.y})</div>`;
            }
        }
        
        // 发送移动消息示例
        function moveTo(x, y) {
            ws.send(JSON.stringify({
                type: 'move',
                x: x,
                y: y
            }));
        }
    </script>
</body>
</html>
```

## 运行测试

1. 启动服务器：`npm start`
2. 打开多个浏览器窗口，访问包含上述客户端代码的HTML页面
3. 观察玩家位置同步效果

## 注意事项

- 服务器使用内存存储，重启后玩家数据会丢失
- 建议在生产环境中添加更多的错误处理和日志记录
- 可以根据需要调整同步间隔来平衡实时性和性能
- 当前实现为演示版本，生产环境建议添加身份验证和数据持久化

## 关闭服务器

在服务器运行界面按 `Ctrl+C` 即可安全关闭服务器。