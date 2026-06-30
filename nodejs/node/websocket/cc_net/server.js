const { WebSocketServer, WebSocket } = require('ws');

// ws://localhost:8080
const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

// 1. 数据存储
// 存储所有玩家的持久化数据 (即使断开连接也保留，用于重连)
const players = new Map(); 
// 存储当前在线的玩家连接 (id -> ws)
const activeConnections = new Map();

// 辅助函数：生成随机坐标
function getRandomCoord(min = -1024, max = 1024) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

console.log(`🎮 多人游戏 WebSocket 服务器正在运行在端口: ${PORT}`);

// 2. WebSocket 连接处理
wss.on('connection', (ws) => {
    let currentPlayerId = null;

    ws.on('message', (message) => {
        try {
            const packet = JSON.parse(message);
            
            switch (packet.type) {
                case 'LOGIN':
                    handleLogin(ws, packet.data);
                    currentPlayerId = packet.data.id;
                    break;
                    
                case 'UPDATE_POS':
                    if (currentPlayerId !== null) {
                        handleUpdatePosition(currentPlayerId, packet.data);
                    }
                    break;
            }
        } catch (err) {
            console.error('解析消息失败:', err);
        }
    });

    // 3. 玩家断开连接
    ws.on('close', () => {
        if (currentPlayerId !== null) {
            console.log(`❌ 玩家 [${currentPlayerId}] 断开连接，已记录最后位置。`);
            activeConnections.delete(currentPlayerId);
            
            // 广播通知其他玩家该玩家下线
            broadcast({
                type: 'PLAYER_LEAVE',
                data: { id: currentPlayerId }
            });
        }
    });

    ws.on('error', (err) => console.error(`Socket 错误 [${currentPlayerId}]:`, err));
});

// 处理登录/重连逻辑
function handleLogin(ws, data) {
    const { id, name } = data;
    
    let player = players.get(id);
    let isReconnect = false;

    if (player) {
        // 重连：检查坐标是否存在
        isReconnect = true;
        if (player.x === undefined || player.y === undefined) {
            player.x = getRandomCoord();
            player.y = getRandomCoord();
        }
        player.name = name; // 更新可能改变的名字
        console.log(`🔄 玩家 [${name} (${id})] 重新连接。位置: (${player.x}, ${player.y})`);
    } else {
        // 新登录
        player = {
            id,
            name,
            x: getRandomCoord(),
            y: getRandomCoord(),
            isDirty: true // 标记需要同步
        };
        players.set(id, player);
        console.log(`➕ 新玩家 [${name} (${id})] 登录。位置: (${player.x}, ${player.y})`);
    }

    // 绑定连接
    activeConnections.set(id, ws);

    // 1. 回应当前玩家：登录成功，返回其最终坐标
    ws.send(JSON.stringify({
        type: 'LOGIN_SUCCESS',
        data: { x: player.x, y: player.y }
    }));

    // 2. 将当前所有在线玩家列表发送给该重连/新登录玩家
    const currentList = [];
    for (const [onlineId, onlineWs] of activeConnections.entries()) {
        if (onlineId !== id) {
            const p = players.get(onlineId);
            if (p) currentList.push({ id: p.id, name: p.name, x: p.x, y: p.y });
        }
    }
    if (currentList.length > 0) {
        ws.send(JSON.stringify({ type: 'PLAYER_LIST', data: currentList }));
    }

    // 3. 广播给其他玩家：有人进来了
    broadcastToOthers(id, {
        type: 'PLAYER_ENTER',
        data: { id: player.id, name: player.name, x: player.x, y: player.y }
    });
}

// 处理位置更新
function handleUpdatePosition(id, data) {
    const player = players.get(id);
    if (!player) return;

    // 只有当坐标真正改变时才处理
    if (player.x !== data.x || player.y !== data.y) {
        player.x = data.x;
        player.y = data.y;
        player.isDirty = true; // 开启脏标记，等待 Tick 统一广播
    }
}

// 基础广播（所有人）
function broadcast(messageObj) {
    const rawMessage = JSON.stringify(messageObj);
    for (const ws of activeConnections.values()) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(rawMessage);
        }
    }
}

// 广播给除特定玩家外的人
function broadcastToOthers(excludeId, messageObj) {
    const rawMessage = JSON.stringify(messageObj);
    for (const [id, ws] of activeConnections.entries()) {
        if (id !== excludeId && ws.readyState === WebSocket.OPEN) {
            ws.send(rawMessage);
        }
    }
}

// 4. 优化核心：定频同步 (Tick Rate)
// 每秒同步 20 次 (50ms 一次)，只广播有数据变动的玩家
const TICK_RATE = 50; 
setInterval(() => {
    const packData = [];

    // 收集有位移变动的玩家
    for (const [id, ws] of activeConnections.entries()) {
        const p = players.get(id);
        if (p && p.isDirty) {
            packData.push({ id: p.id, x: p.x, y: p.y });
            p.isDirty = false; // 重置脏标记
        }
    }

    // 如果有数据更新，打包一次性广播
    if (packData.length > 0) {
        const syncPacket = JSON.stringify({
            type: 'SYNC_POS',
            data: packData
        });

        for (const ws of activeConnections.values()) {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(syncPacket);
            }
        }
    }
}, TICK_RATE);