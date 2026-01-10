class GameNetwork {
    constructor(renderer, ui) {
        this.renderer = renderer;
        this.ui = ui;
        this.socket = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        this.messageQueue = [];
        this.playerId = null;
        
        this.setupEventHandlers();
    }
    
    setupEventHandlers() {
        // 连接按钮事件
        document.getElementById('connectBtn').addEventListener('click', () => {
            this.connect();
        });
        
        document.getElementById('disconnectBtn').addEventListener('click', () => {
            this.disconnect();
        });
        
        // 输入框回车事件
        document.getElementById('playerNameInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.connect();
            }
        });
        
        document.getElementById('serverUrlInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.connect();
            }
        });
    }
    
    connect() {
        const playerName = document.getElementById('playerNameInput').value.trim();
        const serverUrl = document.getElementById('serverUrlInput').value.trim();
        
        if (!playerName) {
            this.addMessage('请输入玩家名称', 'error');
            return;
        }
        
        if (!serverUrl) {
            this.addMessage('请输入服务器地址', 'error');
            return;
        }
        
        try {
            this.socket = new WebSocket(serverUrl);
            this.setupSocketHandlers(playerName);
            this.addMessage(`正在连接到 ${serverUrl}...`, 'info');
        } catch (error) {
            this.addMessage(`连接失败: ${error.message}`, 'error');
        }
    }
    
    setupSocketHandlers(playerName) {
        this.socket.onopen = () => {
            this.isConnected = true;
            this.reconnectAttempts = 0;
            this.addMessage('连接成功！', 'success');
            this.updateConnectionStatus(true);
            
            // 发送玩家加入消息
            this.sendMessage({
                type: 'join',
                playerName: playerName
            });
            
            // 处理消息队列
            this.processMessageQueue();
        };
        
        this.socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.handleServerMessage(data);
            } catch (error) {
                this.addMessage(`消息解析失败: ${error.message}`, 'error');
            }
        };
        
        this.socket.onclose = () => {
            this.isConnected = false;
            this.addMessage('连接已断开', 'error');
            this.updateConnectionStatus(false);
            
            // 尝试重连
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                this.attemptReconnect();
            }
        };
        
        this.socket.onerror = (error) => {
            this.addMessage('连接错误', 'error');
            console.error('WebSocket error:', error);
        };
    }
    
    handleServerMessage(data) {
        switch (data.type) {
            case 'playerJoined':
                this.handlePlayerJoined(data);
                break;
                
            case 'playerLeft':
                this.handlePlayerLeft(data);
                break;
                
            case 'playerUpdate':
                this.handlePlayerUpdate(data);
                break;
                
            case 'gameState':
                this.handleGameState(data);
                break;
                
            case 'playerId':
                this.handlePlayerId(data);
                break;
                
            case 'error':
                this.addMessage(`服务器错误: ${data.message}`, 'error');
                break;
                
            default:
                this.addMessage(`未知消息类型: ${data.type}`, 'info');
        }
    }
    
    handlePlayerJoined(data) {
        const player = this.renderer.addPlayer({
            id: data.playerId,
            name: data.playerName,
            x: data.x,
            y: data.y,
            isLocal: data.playerId === this.playerId
        });
        
        if (data.playerId === this.playerId) {
            this.addMessage(`你加入了游戏！位置: (${data.x}, ${data.y})`, 'success');
        } else {
            this.addMessage(`玩家 ${data.playerName} 加入了游戏`, 'info');
        }
        
        this.updatePlayerCount();
    }
    
    handlePlayerLeft(data) {
        const player = this.renderer.players.get(data.playerId);
        if (player) {
            this.addMessage(`玩家 ${player.name} 离开了游戏`, 'info');
            this.renderer.removePlayer(data.playerId);
            this.updatePlayerCount();
        }
    }
    
    handlePlayerUpdate(data) {
        this.renderer.updatePlayer(data.playerId, {
            x: data.x,
            y: data.y
        });
    }
    
    handleGameState(data) {
        // 更新所有玩家状态
        data.players.forEach(playerData => {
            if (this.renderer.players.has(playerData.id)) {
                this.renderer.updatePlayer(playerData.id, playerData);
            } else {
                this.renderer.addPlayer({
                    id: playerData.id,
                    name: playerData.name,
                    x: playerData.x,
                    y: playerData.y,
                    isLocal: playerData.id === this.playerId
                });
            }
        });
        
        this.updatePlayerCount();
    }
    
    handlePlayerId(data) {
        this.playerId = data.playerId;
        this.addMessage(`分配玩家ID: ${data.playerId}`, 'info');
    }
    
    sendMessage(message) {
        if (this.isConnected && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            // 如果未连接，加入消息队列
            this.messageQueue.push(message);
        }
    }
    
    processMessageQueue() {
        while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift();
            this.sendMessage(message);
        }
    }
    
    movePlayer(direction) {
        if (!this.isConnected) {
            this.addMessage('请先连接服务器', 'error');
            return;
        }
        
        this.sendMessage({
            type: 'move',
            direction: direction
        });
    }
    
    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        
        this.isConnected = false;
        this.playerId = null;
        this.messageQueue = [];
        
        // 清空玩家列表
        this.renderer.players.clear();
        this.renderer.localPlayerId = null;
        
        this.addMessage('已断开与服务器的连接', 'info');
        this.updateConnectionStatus(false);
        this.updatePlayerCount();
    }
    
    attemptReconnect() {
        this.reconnectAttempts++;
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
        
        this.addMessage(`尝试重新连接 (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`, 'info');
        
        setTimeout(() => {
            if (!this.isConnected) {
                this.connect();
            }
        }, delay);
    }
    
    updateConnectionStatus(connected) {
        const statusElement = document.getElementById('connectionStatus');
        const connectBtn = document.getElementById('connectBtn');
        const disconnectBtn = document.getElementById('disconnectBtn');
        
        if (connected) {
            statusElement.textContent = '已连接';
            statusElement.className = 'status-connected';
            connectBtn.disabled = true;
            disconnectBtn.disabled = false;
        } else {
            statusElement.textContent = '未连接';
            statusElement.className = 'status-disconnected';
            connectBtn.disabled = false;
            disconnectBtn.disabled = true;
        }
    }
    
    updatePlayerCount() {
        const count = this.renderer.players.size;
        document.getElementById('playerCount').textContent = `在线玩家: ${count}`;
    }
    
    addMessage(text, type = 'info') {
        const messagesContainer = document.getElementById('messages');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // 限制消息数量
        const messages = messagesContainer.querySelectorAll('.message');
        if (messages.length > 100) {
            messages[0].remove();
        }
    }
    
    updateLocalPlayerInfo(player) {
        document.getElementById('myName').textContent = player.name;
        document.getElementById('myPosition').textContent = `位置: (${Math.round(player.x)}, ${Math.round(player.y)})`;
        document.getElementById('myAvatar').textContent = player.emoji;
    }
}