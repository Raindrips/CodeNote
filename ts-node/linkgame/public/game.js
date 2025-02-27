const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;  // 设置画布宽度
canvas.height = 600; // 设置画布高度

const socket = io(); // 连接到服务器

const players = {}; // 用于客户端存储所有玩家的信息

// 监听服务器发送的 'currentPlayers' 事件，初始化所有玩家
socket.on('currentPlayers', (currentPlayers) =>
{
    Object.keys(currentPlayers).forEach((id) =>
    {
        players[id] = currentPlayers[id];
    });
});

// 监听服务器发送的 'newPlayer' 事件，添加新玩家
socket.on('newPlayer', (playerId, playerInfo) =>
{
    players[playerId] = playerInfo;
});

// 监听服务器发送的 'playerDisconnected' 事件，移除断线玩家
socket.on('playerDisconnected', (playerId) =>
{
    delete players[playerId];
});

// 监听服务器发送的 'playerMoved' 事件，更新玩家位置
socket.on('playerMoved', (playerId, playerInfo) =>
{
    if (players[playerId]) { // 确保玩家存在 (防止收到已断开连接的玩家信息)
        players[playerId] = playerInfo;
    }
});

// 玩家移动控制状态
const movement = {
    up: false,
    down: false,
    left: false,
    right: false
};

// 监听键盘按下事件，更新移动状态
document.addEventListener('keydown', (event) =>
{
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
            movement.up = true;
            break;
        case 'ArrowDown':
        case 's':
            movement.down = true;
            break;
        case 'ArrowLeft':
        case 'a':
            movement.left = true;
            break;
        case 'ArrowRight':
        case 'd':
            movement.right = true;
            break;
    }
});

// 监听键盘抬起事件，更新移动状态
document.addEventListener('keyup', (event) =>
{
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
            movement.up = false;
            break;
        case 'ArrowDown':
        case 's':
            movement.down = false;
            break;
        case 'ArrowLeft':
        case 'a':
            movement.left = false;
            break;
        case 'ArrowRight':
        case 'd':
            movement.right = false;
            break;
    }
});

function update(dt)
{
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空画布

    // 绘制所有玩家
    Object.keys(players).forEach((id) =>
    {
        const player = players[id];
        if (id == socket.id) {
            ctx.fillStyle = '#ff0000'; // 玩家颜色
        }
        else {
            ctx.fillStyle = '#fff000'; // 玩家颜色
        }
        ctx.fillRect(player.x, player.y, 20, 20); // 绘制玩家矩形 (大小 20x20)
    });

    // 处理玩家自身移动逻辑
    handlePlayerMovement();
}

function gameLoop(dt)
{
    update(dt)
    requestAnimationFrame(gameLoop); // 循环调用 gameLoop，实现动画
}

function handlePlayerMovement()
{
    const speed = 3; // 移动速度
    let moved = false; // 标记是否发生了移动

    if (movement.up) {
        players[socket.id].y -= speed;
        moved = true;
    }
    if (movement.down) {
        players[socket.id].y += speed;
        moved = true;
    }
    if (movement.left) {
        players[socket.id].x -= speed;
        moved = true;
    }
    if (movement.right) {
        players[socket.id].x += speed;
        moved = true;
    }

    // 如果玩家发生了移动，发送移动数据给服务器
    if (moved) {
        socket.emit('playerMovement', players[socket.id]);
    }
}

gameLoop(); // 启动游戏循环