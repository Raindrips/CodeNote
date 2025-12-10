class GameRoom {
    constructor(roomId, roomName, maxPlayers = 50) {
        this.id = roomId;
        this.name = roomName;
        this.maxPlayers = maxPlayers;
        this.players = new Map(); // userId -> user
        this.createdAt = Date.now();
        this.isActive = true;
        this.gameState = 'waiting'; // waiting, playing, ended
        this.roomSettings = {
            allowChat: true,
            allowMovement: true,
            gameMode: 'free_roam', // free_roam, team_battle, etc.
            maxMessageLength: 200
        };
    }

    addPlayer(user) {
        if (this.players.size >= this.maxPlayers) {
            return false;
        }

        if (this.players.has(user.id)) {
            return false;
        }

        this.players.set(user.id, user);
        return true;
    }

    removePlayer(userId) {
        const user = this.players.get(userId);
        if (user) {
            this.players.delete(userId);
            
            // 如果房间为空，标记为非活跃
            if (this.players.size === 0) {
                this.isActive = false;
            }
            
            return true;
        }
        return false;
    }

    getPlayer(userId) {
        return this.players.get(userId);
    }

    getAllPlayers() {
        return Array.from(this.players.values());
    }

    getPlayerCount() {
        return this.players.size;
    }

    isFull() {
        return this.players.size >= this.maxPlayers;
    }

    isEmpty() {
        return this.players.size === 0;
    }

    broadcastToRoom(message, exceptUserId = null) {
        const BroadcastManager = require('./BroadcastManager');
        const broadcastManager = new BroadcastManager();
        
        const targetUsers = exceptUserId 
            ? this.getAllPlayers().filter(player => player.id !== exceptUserId)
            : this.getAllPlayers();

        broadcastManager.broadcast(message, targetUsers);
    }

    updateGameState(newState) {
        this.gameState = newState;
        
        // 广播游戏状态变化
        this.broadcastToRoom({
            type: 'game_state_changed',
            roomId: this.id,
            newState: newState,
            timestamp: Date.now()
        });
    }

    getRoomInfo() {
        return {
            id: this.id,
            name: this.name,
            playerCount: this.getPlayerCount(),
            maxPlayers: this.maxPlayers,
            gameState: this.gameState,
            isActive: this.isActive,
            createdAt: this.createdAt,
            settings: this.roomSettings
        };
    }

    getPlayersInfo() {
        return this.getAllPlayers().map(player => ({
            id: player.id,
            username: player.username,
            position: player.position,
            rotation: player.rotation,
            isLoggedIn: player.isLoggedIn
        }));
    }

    // 检查玩家是否可以执行某些操作
    canPlayerAct(userId, action) {
        const user = this.players.get(userId);
        if (!user || !user.isLoggedIn) {
            return false;
        }

        switch (action) {
            case 'move':
                return this.roomSettings.allowMovement && this.gameState !== 'ended';
            case 'chat':
                return this.roomSettings.allowChat;
            default:
                return true;
        }
    }

    // 清理不活跃的玩家
    cleanupInactivePlayers(maxInactiveTime = 300000) {
        const now = Date.now();
        const inactivePlayers = [];
        
        for (const [userId, user] of this.players.entries()) {
            if (now - user.lastActivity > maxInactiveTime) {
                inactivePlayers.push(userId);
            }
        }

        inactivePlayers.forEach(userId => {
            this.removePlayer(userId);
        });

        return inactivePlayers.length;
    }
}

module.exports = GameRoom;