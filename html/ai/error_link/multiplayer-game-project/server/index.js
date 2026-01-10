const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const UserManager = require('./modules/UserManager');
const MessageHandler = require('./modules/MessageHandler');
const BroadcastManager = require('./modules/BroadcastManager');

class GameServer {
    constructor() {
        this.port = process.env.PORT || 3000;
        this.maxUsers = 100;
        this.userManager = new UserManager();
        this.messageHandler = new MessageHandler(this.userManager);
        this.broadcastManager = new BroadcastManager();
        this.wss = null;
    }

    start() {
        this.wss = new WebSocket.Server({ port: this.port });
        
        this.wss.on('connection', (ws) => {
            this.handleNewConnection(ws);
        });

        console.log(`🎮 游戏服务端已启动，监听端口: ${this.port}`);
        console.log(`👥 最大支持用户数: ${this.maxUsers}`);
        console.log(`📡 WebSocket服务器地址: ws://localhost:${this.port}`);
    }

    handleNewConnection(ws) {
        // 检查是否达到最大用户数
        if (this.userManager.getUserCount() >= this.maxUsers) {
            ws.send(JSON.stringify({
                type: 'error',
                message: '服务器已满，请稍后再试'
            }));
            ws.close();
            return;
        }

        const userId = uuidv4();
        const user = {
            id: userId,
            ws: ws,
            username: null,
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            isLoggedIn: false,
            lastActivity: Date.now()
        };

        this.userManager.addUser(user);

        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message);
                this.messageHandler.handleMessage(userId, data);
            } catch (error) {
                console.error('消息解析错误:', error);
                ws.send(JSON.stringify({
                    type: 'error',
                    message: '消息格式错误'
                }));
            }
        });

        ws.on('close', () => {
            this.handleDisconnection(userId);
        });

        ws.on('error', (error) => {
                console.error('WebSocket错误:', error);
            this.handleDisconnection(userId);
        });

        // 发送连接成功消息
        ws.send(JSON.stringify({
            type: 'connected',
            userId: userId,
            message: '连接成功，请登录'
        }));

        console.log(`✅ 新用户连接: ${userId}`);
    }

    handleDisconnection(userId) {
        const user = this.userManager.getUser(userId);
        if (user) {
            console.log(`👋 用户断开连接: ${user.username || userId}`);
            
            // 广播用户离开消息
            this.broadcastManager.broadcast({
                type: 'user_left',
                userId: userId,
                username: user.username
            }, this.userManager.getAllUsers());

            this.userManager.removeUser(userId);
        }
    }
}

// 启动服务器
const server = new GameServer();
server.start();