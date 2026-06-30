/// <reference path="./types/cc_net.d.ts" />
import { WebSocket } from 'ws';

for (let i = 0; i < 100; i++) {
    const ws = new WebSocket('ws://localhost:8080');
    const mockPlayer = { id: i, name: 'Gordon_' + i };

    ws.on('open', () => {
        console.log('已连接服务器，正在登录...' + i);
        // 1. 发送登录请求
        ws.send(
            JSON.stringify({
                type: 'LOGIN',
                data: mockPlayer,
            }),
        );
    });

    ws.on('message', (message) => {
        const packet = JSON.parse(message.toString());
        // console.log(`收到事件 [${packet.type}]:`, packet.data);

        if (packet.type === 'LOGIN_SUCCESS') {
            let curX = Math.random() * 2048 - 1024;
            let curY = Math.random() * 2048 - 1024;

            // 2. 模拟摇杆或键盘移动，每 100ms 改变一下本地坐标发送给服务端
            setInterval(() => {
                curX += Math.random() > 0.5 ? 1 : -1;
                curY += Math.random() > 0.5 ? 1 : -1;

                ws.send(
                    JSON.stringify({
                        type: 'UPDATE_POS',
                        data: { x: curX, y: curY },
                    }),
                );
            }, 100);
        }
    });
}
