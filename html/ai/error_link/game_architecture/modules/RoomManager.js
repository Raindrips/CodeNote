const GameRoom = require('./GameRoom');
const { v4: uuidv4 } = require('uuid');

class RoomManager {
    constructor() {
        this.rooms = new Map(); // roomId -> GameRoom
        this.userRoomMap = new Map(); // userId -> roomId
        this.defaultRoomId = null;
    }

    createRoom(roomName, maxPlayers = 50) {
        const roomId = uuidv4();
        const room = new GameRoom(roomId, roomName, maxPlayers);
        
        this.rooms.set(roomId, room);
        
        // 设置默认房间
        if (!this.defaultRoomId) {
            this.defaultRoomId = roomId;
        }
        
        console.log(`创建房间: ${roomName} (${roomId})`);
        return room;
    }

    removeRoom(roomId) {
        const room = this.rooms.get(roomId);
        if (!room) {
            return false;
        }

        // 将所有玩家移出房间
        const players = room.getAllPlayers();
        players.forEach(player => {
            this.leaveRoom(player.id);
        });

        this.rooms.delete(roomId);
        
        // 如果删除的是默认房间，设置新的默认房间
        if (this.defaultRoomId === roomId) {
            const remainingRooms = Array.from(this.rooms.keys());
            this.defaultRoomId = remainingRooms.length > 0 ? remainingRooms[0] : null;
        }

        console.log(`删除房间: ${roomId}`);
        return true;
    }

    joinRoom(user, roomId = null) {
        // 如果用户已在房间中，先离开当前房间
        if (this.userRoomMap.has(user.id)) {
            this.leaveRoom(user.id);
        }

        // 如果没有指定房间ID，使用默认房间
        if (!roomId) {
            roomId = this.defaultRoomId;
        }

        // 如果没有默认房间，创建一个新房间
        if (!roomId) {
            const newRoom = this.createRoom('默认房间', 50);
            roomId = newRoom.id;
        }

        const room = this.rooms.get(roomId);
        if (!room) {
            return { success: false, message: '房间不存在' };
        }

        if (room.isFull()) {
            return { success: false, message: '房间已满' };
        }

        if (!room.addPlayer(user)) {
            return { success: false, message: '加入房间失败' };
        }

        this.userRoomMap.set(user.id, roomId);

        // 广播玩家加入消息
        room.broadcastToRoom({
            type: 'player_joined_room',
            roomId: roomId,
            player: {
                id: user.id,
                username: user.username
            }
        });

        console.log(`用户 ${user.username} 加入房间 ${room.name}`);
        
        return { 
            success: true, 
            room: room.getRoomInfo(),
            players: room.getPlayersInfo()
        };
    }

    leaveRoom(userId) {
        const roomId = this.userRoomMap.get(userId);
        if (!roomId) {
            return false;
        }

        const room = this.rooms.get(roomId);
        if (!room) {
            this.userRoomMap.delete(userId);
            return false;
        }

        const user = room.getPlayer(userId);
        if (!user) {
            this.userRoomMap.delete(userId);
            return false;
        }

        room.removePlayer(userId);
        this.userRoomMap.delete(userId);

        // 广播玩家离开消息
        room.broadcastToRoom({
            type: 'player_left_room',
            roomId: roomId,
            playerId: userId,
            username: user.username
        });

        console.log(`用户 ${user.username} 离开房间 ${room.name}`);

        // 如果房间为空，删除房间（除非是默认房间）
        if (room.isEmpty() && roomId !== this.defaultRoomId) {
            this.removeRoom(roomId);
        }

        return true;
    }

    getRoomById(roomId) {
        return this.rooms.get(roomId);
    }

    getUserRoom(userId) {
        const roomId = this.userRoomMap.get(userId);
        if (!roomId) {
            return null;
        }
        return this.rooms.get(roomId);
    }

    getAllRooms() {
        return Array.from(this.rooms.values()).map(room => room.getRoomInfo());
    }

    getRoomPlayers(roomId) {
        const room = this.rooms.get(roomId);
        if (!room) {
            return [];
        }
        return room.getPlayersInfo();
    }

    // 获取推荐房间（未满的房间）
    getRecommendedRooms() {
        const availableRooms = [];
        
        for (const room of this.rooms.values()) {
            if (!room.isFull() && room.isActive) {
                availableRooms.push(room.getRoomInfo());
            }
        }

        return availableRooms.sort((a, b) => a.playerCount - b.playerCount);
    }

    // 清理空房间（除了默认房间）
    cleanupEmptyRooms() {
        const emptyRooms = [];
        
        for (const [roomId, room] of this.rooms.entries()) {
            if (room.isEmpty() && roomId !== this.defaultRoomId) {
                emptyRooms.push(roomId);
            }
        }

        emptyRooms.forEach(roomId => {
            this.removeRoom(roomId);
        });

        return emptyRooms.length;
    }

    // 获取房间统计信息
    getRoomStats() {
        const stats = {
            totalRooms: this.rooms.size,
            activeRooms: 0,
            totalPlayers: 0,
            maxPlayersInRoom: 0,
            emptyRooms: 0
        };

        for (const room of this.rooms.values()) {
            if (room.isActive) {
                stats.activeRooms++;
            }
            
            const playerCount = room.getPlayerCount();
            stats.totalPlayers += playerCount;
            stats.maxPlayersInRoom = Math.max(stats.maxPlayersInRoom, playerCount);
            
            if (room.isEmpty()) {
                stats.emptyRooms++;
            }
        }

        return stats;
    }
}

module.exports = RoomManager;