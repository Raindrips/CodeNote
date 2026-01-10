const WebSocket = require('ws');

// 测试客户端类
class TestClient {
    constructor(username, serverUrl = 'ws://localhost:3000') {
        this.username = username;
        this.serverUrl = serverUrl;
        this.ws = null;
        this.userId = null;
        this.position = { x: 0, y: 0, z: 0 };
        this.isConnected = false;
        this.isLoggedIn = false;
    }

    connect() {
        console.log(`[${this.username}] 正在连接到 ${this.serverUrl}...`);
        
        this.ws = new WebSocket(this.serverUrl);
        
        this.ws.on('open', () => {
            console.log(`[${this.username}] WebSocket 连接成功`);
            this.isConnected = true;
        });

        this.ws.on('message', (data) => {
            try {
                const message = JSON.parse(data);
                this.handleMessage(message);
            } catch (error) {
                console.error(`[${this.username}] 消息解析错误:`, error);
            }
        });

        this.ws.on('close', () => {
            console.log(`[${this.username}] 连接已断开`);
            this.isConnected = false;
            this.isLoggedIn = false;
        });

        this.ws.on('error', (error) => {
            console.error(`[${this.username}] WebSocket 错误:`, error.message);
            this.isConnected = false;
        });
    }

    handleMessage(message) {
        switch (message.type) {
            case 'connected':
                console.log(`[${this.username}] 收到连接确认，用户ID: ${message.userId}`);
                this.userId = message.userId;
                this.login();
                break;
                
            case 'login_success':
                console.log(`[${this.username}] 登录成功！`);
                this.isLoggedIn = true;
                // 登录成功后开始随机移动
                this.startRandomMovement();
                break;
                
            case 'user_joined':
                console.log(`[${this.username}] 玩家加入: ${message.user.username}`);
                break;
                
            case 'user_left':
                console.log(`[${this.username}] 玩家离开: ${message.username}`);
                break;
                
            case 'user_moved':
                if (message.userId !== this.userId) {
                    console.log(`[${this.username}] 玩家移动: ${message.userId} -> (${message.position.x}, ${message.position.y}, ${message.position.z})`);
                }
                break;
                
            case 'chat_message':
                console.log(`[${this.username}] 聊天 [${message.username}]: ${message.message}`);
                break;
                
            case 'error':
                console.error(`[${this.username}] 错误: ${message.message}`);
                break;
                
            default:
                console.log(`[${this.username}] 收到消息:`, message);
        }
    }

    login() {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            console.log(`[${this.username}] 发送登录请求...`);
            this.sendMessage({
                type: 'login',
                data: { username: this.username }
            });
        }
    }

    move(x, y, z) {
        if (!this.isLoggedIn) return;
        
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
        
        this.sendMessage({
            type: 'move',
            data: { position: this.position }
        });
    }

    sendChat(message) {
        if (!this.isLoggedIn) return;
        
        this.sendMessage({
            type: 'chat',
            data: { message: message }
        });
    }

    sendMessage(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        }
    }

    startRandomMovement() {
        setInterval(() => {
            if (this.isLoggedIn) {
                const newX = this.position.x + (Math.random() - 0.5) * 2;
                const newY = this.position.y + (Math.random() - 0.5) * 2;
                const newZ = this.position.z + (Math.random() - 0.5) * 2;
                
                this.move(newX, newY, newZ);
            }
        }, 2000); // 每2秒移动一次
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

// 压力测试函数
async function stressTest() {
    console.log('开始压力测试...');
    const clients = [];
    const numClients = 10; // 测试10个并发客户端
    
    // 创建多个客户端
    for (let i = 1; i <= numClients; i++) {
        const client = new TestClient(`玩家${i}`);
        clients.push(client);
        
        // 延迟连接，避免同时连接过多
        setTimeout(() => {
            client.connect();
        }, i * 100);
    }
    
    // 运行30秒后断开所有连接
    setTimeout(() => {
        console.log('测试完成，断开所有连接...');
        clients.forEach(client => client.disconnect());
        
        // 统计结果
        const connectedCount = clients.filter(c => c.isConnected).length;
        const loggedInCount = clients.filter(c => c.isLoggedIn).length;
        
        console.log(`\n=== 测试结果 ===`);
        console.log(`总客户端数: ${clients.length}`);
        console.log(`连接成功: ${connectedCount}`);
        console.log(`登录成功: ${loggedInCount}`);
        
        process.exit(0);
    }, 30000);
}

// 运行测试
if (require.main === module) {
    stressTest();
}

module.exports = TestClient;