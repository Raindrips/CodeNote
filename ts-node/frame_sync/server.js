// server.js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let frame = 0; // 当前逻辑帧
let inputs = new Map(); // 存储每帧的玩家输入 { frame: { playerId: input } }

// 每 50ms 更新一帧（20帧/秒）
setInterval(() =>
{
    // 广播当前帧的所有输入
    const currentInputs = inputs.get(frame) || {};
    wss.clients.forEach(client =>
    {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: 'frame',
                frame: frame,
                inputs: currentInputs
            }));
        }
    });

    // 清空当前帧输入，进入下一帧
    inputs.delete(frame);
    frame++;
}, 50);

wss.on('connection', (ws) =>
{
    const playerId = Math.random().toString(36); // 生成随机玩家ID

    // 发送初始信息（玩家ID和当前帧）
    ws.send(JSON.stringify({ type: 'init', playerId, currentFrame: frame }));

    // 接收客户端输入
    ws.on('message', (message) =>
    {
        const data = JSON.parse(message);
        if (data.type === 'input') {
            if (!inputs.has(data.frame)) {
                inputs.set(data.frame, {});
            }
            inputs.get(data.frame)[playerId] = data.input;
        }
    });
});