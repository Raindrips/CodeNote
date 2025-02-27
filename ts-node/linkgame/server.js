// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const players = {}; // 用于存储玩家信息的对象，键为 socket.id

// 设置静态文件服务，这样客户端可以访问 public 文件夹下的文件
app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('有玩家连接了: ', socket.id);

    // 创建一个新的玩家对象
    players[socket.id] = {
        x: Math.floor(Math.random() * 800), // 初始位置 x 坐标随机
        y: Math.floor(Math.random() * 600)  // 初始位置 y 坐标随机
    };

    // 将当前所有玩家的信息发送给新连接的玩家
    socket.emit('currentPlayers', players);

    // 广播给所有客户端，有新玩家加入
    socket.broadcast.emit('newPlayer', socket.id, players[socket.id]);

    socket.on('disconnect', () => {
        console.log('玩家断开连接: ', socket.id);
        delete players[socket.id]; // 移除断开连接的玩家
        io.emit('playerDisconnected', socket.id); // 广播给所有客户端，有玩家断开
    });

    // 监听客户端发送的玩家移动信息
    socket.on('playerMovement', (movementData) => {
        if (players[socket.id]) { // 确保玩家存在 (防止在断开连接后还收到移动信息)
            players[socket.id].x = movementData.x;
            players[socket.id].y = movementData.y;
            // 广播玩家的移动信息给所有其他客户端
            socket.broadcast.emit('playerMoved', socket.id, players[socket.id]);
        }
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`服务器运行在端口 env:${process.env.PORT}|| ${PORT}`);
});