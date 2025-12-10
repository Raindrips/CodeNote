const WebSocket = require('ws');
const http = require('http');

// 游戏服务器配置
const CONFIG = {
  PORT: 8080,
  SYNC_INTERVAL: 100, // 位置同步间隔（毫秒）
  MAX_PLAYERS: 50,    // 最大玩家数
  WORLD_WIDTH: 1000,  // 游戏世界宽度
  WORLD_HEIGHT: 1000  // 游戏世界高度
};

// 玩家管理器
class PlayerManager {
  constructor() {
    this.players = new Map(); // 存储玩家数据
    this.playerIdCounter = 1;
  }

  // 添加玩家
  addPlayer(ws) {
    const playerId = `player_${this.playerIdCounter++}`;
    const player = {
      id: playerId,
      ws: ws,
      x: Math.random() * CONFIG.WORLD_WIDTH,
      y: Math.random() * CONFIG.WORLD_HEIGHT,
      connectedAt: Date.now()
    };
    
    this.players.set(playerId, player);
    return player;
  }

  // 移除玩家
  removePlayer(playerId) {
    const player = this.players.get(playerId);
    if (player) {
      this.players.delete(playerId);
      return player;
    }
    return null;
  }

  // 获取玩家
  getPlayer(playerId) {
    return this.players.get(playerId);
  }

  // 更新玩家位置
  updatePlayerPosition(playerId, x, y) {
    const player = this.players.get(playerId);
    if (player) {
      // 边界检查
      player.x = Math.max(0, Math.min(CONFIG.WORLD_WIDTH, x));
      player.y = Math.max(0, Math.min(CONFIG.WORLD_HEIGHT, y));
      return true;
    }
    return false;
  }

  // 获取所有玩家位置
  getAllPlayersPositions() {
    const positions = {};
    this.players.forEach((player, id) => {
      positions[id] = {
        x: player.x,
        y: player.y
      };
    });
    return positions;
  }

  // 获取在线玩家数量
  getOnlineCount() {
    return this.players.size;
  }

  // 广播消息给所有玩家
  broadcast(message, excludePlayerId = null) {
    const messageStr = JSON.stringify(message);
    this.players.forEach((player, id) => {
      if (id !== excludePlayerId && player.ws.readyState === WebSocket.OPEN) {
        player.ws.send(messageStr);
      }
    });
  }

  // 发送消息给特定玩家
  sendToPlayer(playerId, message) {
    const player = this.players.get(playerId);
    if (player && player.ws.readyState === WebSocket.OPEN) {
      player.ws.send(JSON.stringify(message));
    }
  }
}

// 游戏服务器
class GameServer {
  constructor() {
    this.playerManager = new PlayerManager();
    this.server = null;
    this.wss = null;
    this.syncInterval = null;
  }

  // 启动服务器
  start() {
    // 创建HTTP服务器
    this.server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Simple Multiplayer Game Server is running!\n');
    });

    // 创建WebSocket服务器
    this.wss = new WebSocket.Server({ server: this.server });

    // 处理WebSocket连接
    this.wss.on('connection', (ws) => {
      this.handleConnection(ws);
    });

    // 启动位置同步
    this.startPositionSync();

    // 启动HTTP服务器
    this.server.listen(CONFIG.PORT, () => {
      console.log(`游戏服务器启动成功！`);
      console.log(`监听端口: ${CONFIG.PORT}`);
      console.log(`位置同步间隔: ${CONFIG.SYNC_INTERVAL}ms`);
      console.log(`最大玩家数: ${CONFIG.MAX_PLAYERS}`);
      console.log(`游戏世界大小: ${CONFIG.WORLD_WIDTH}x${CONFIG.WORLD_HEIGHT}`);
    });
  }

  // 处理玩家连接
  handleConnection(ws) {
    // 检查玩家数量限制
    if (this.playerManager.getOnlineCount() >= CONFIG.MAX_PLAYERS) {
      ws.send(JSON.stringify({
        type: 'error',
        message: '服务器已满员'
      }));
      ws.close();
      return;
    }

    // 添加新玩家
    const player = this.playerManager.addPlayer(ws);
    console.log(`玩家 ${player.id} 加入游戏，当前在线: ${this.playerManager.getOnlineCount()}`);

    // 发送欢迎消息和玩家信息
    ws.send(JSON.stringify({
      type: 'welcome',
      playerId: player.id,
      position: { x: player.x, y: player.y },
      worldSize: {
        width: CONFIG.WORLD_WIDTH,
        height: CONFIG.WORLD_HEIGHT
      }
    }));

    // 广播玩家加入消息
    this.playerManager.broadcast({
      type: 'playerJoined',
      playerId: player.id,
      position: { x: player.x, y: player.y }
    }, player.id);

    // 发送当前所有玩家位置
    ws.send(JSON.stringify({
      type: 'allPlayers',
      players: this.playerManager.getAllPlayersPositions()
    }));

    // 处理消息
    ws.on('message', (data) => {
      this.handleMessage(player.id, data);
    });

    // 处理连接关闭
    ws.on('close', () => {
      this.handleDisconnection(player.id);
    });

    // 处理错误
    ws.on('error', (error) => {
      console.error(`玩家 ${player.id} 连接错误:`, error);
    });
  }

  // 处理玩家消息
  handleMessage(playerId, data) {
    try {
      const message = JSON.parse(data.toString());
      
      switch (message.type) {
        case 'move':
          this.handleMove(playerId, message);
          break;
        
        case 'ping':
          this.playerManager.sendToPlayer(playerId, {
            type: 'pong',
            timestamp: message.timestamp
          });
          break;
        
        default:
          console.warn(`未知消息类型: ${message.type}`);
      }
    } catch (error) {
      console.error(`处理玩家 ${playerId} 消息时出错:`, error);
    }
  }

  // 处理玩家移动
  handleMove(playerId, message) {
    const { x, y } = message;
    
    if (typeof x === 'number' && typeof y === 'number') {
      if (this.playerManager.updatePlayerPosition(playerId, x, y)) {
        // 广播位置更新（将在同步间隔中统一处理）
        console.log(`玩家 ${playerId} 移动到: (${x}, ${y})`);
      }
    }
  }

  // 处理玩家断开连接
  handleDisconnection(playerId) {
    const player = this.playerManager.removePlayer(playerId);
    if (player) {
      console.log(`玩家 ${playerId} 离开游戏，当前在线: ${this.playerManager.getOnlineCount()}`);
      
      // 广播玩家离开消息
      this.playerManager.broadcast({
        type: 'playerLeft',
        playerId: playerId
      });
    }
  }

  // 启动位置同步
  startPositionSync() {
    this.syncInterval = setInterval(() => {
      if (this.playerManager.getOnlineCount() > 0) {
        const positions = this.playerManager.getAllPlayersPositions();
        this.playerManager.broadcast({
          type: 'positions',
          positions: positions
        });
      }
    }, CONFIG.SYNC_INTERVAL);
  }

  // 停止服务器
  stop() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    
    if (this.wss) {
      this.wss.close();
    }
    
    if (this.server) {
      this.server.close();
    }
    
    console.log('游戏服务器已停止');
  }
}

// 创建并启动游戏服务器
const gameServer = new GameServer();

// 处理进程退出
process.on('SIGINT', () => {
  console.log('\n正在关闭服务器...');
  gameServer.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n正在关闭服务器...');
  gameServer.stop();
  process.exit(0);
});

// 启动服务器
gameServer.start();