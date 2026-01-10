class BroadcastManager {
    constructor() {
        this.messageQueue = [];
        this.isProcessing = false;
    }

    // 广播消息给所有用户
    broadcast(message, users) {
        if (!users || users.length === 0) {
            return;
        }

        const messageStr = JSON.stringify(message);
        let successCount = 0;
        let failCount = 0;

        users.forEach(user => {
            if (user.ws && user.ws.readyState === 1) { // WebSocket.OPEN = 1
                try {
                    user.ws.send(messageStr);
                    successCount++;
                } catch (error) {
                    console.error(`广播消息失败 - 用户: ${user.username || user.id}`, error);
                    failCount++;
                }
            } else {
                failCount++;
            }
        });

        if (process.env.NODE_ENV === 'development') {
            console.log(`广播完成 - 成功: ${successCount}, 失败: ${failCount}, 消息类型: ${message.type}`);
        }
    }

    // 广播消息给指定用户列表
    broadcastToUsers(message, userIds, userManager) {
        const users = userIds.map(userId => userManager.getUser(userId)).filter(user => user);
        this.broadcast(message, users);
    }

    // 广播消息给除指定用户外的所有用户
    broadcastExcept(message, exceptUserId, users) {
        const filteredUsers = users.filter(user => user.id !== exceptUserId);
        this.broadcast(message, filteredUsers);
    }

    // 批量广播（用于减少频繁广播的开销）
    queueBroadcast(message, users) {
        this.messageQueue.push({ message, users, timestamp: Date.now() });
        
        if (!this.isProcessing) {
            this.processMessageQueue();
        }
    }

    processMessageQueue() {
        if (this.messageQueue.length === 0) {
            this.isProcessing = false;
            return;
        }

        this.isProcessing = true;
        
        // 合并相同类型的消息
        const mergedMessages = this.mergeMessages();
        
        // 批量发送消息
        mergedMessages.forEach(({ message, users }) => {
            this.broadcast(message, users);
        });

        this.messageQueue = [];
        
        // 继续处理队列
        setTimeout(() => {
            this.processMessageQueue();
        }, 16); // 约60fps的更新频率
    }

    mergeMessages() {
        const messageGroups = new Map();
        
        this.messageQueue.forEach(({ message, users }) => {
            const key = `${message.type}_${JSON.stringify(users.map(u => u.id).sort())}`;
            
            if (messageGroups.has(key)) {
                // 合并相同类型的消息
                const existing = messageGroups.get(key);
                if (message.type === 'user_moved' || message.type === 'user_rotated') {
                    // 对于位置更新，只保留最新的消息
                    messageGroups.set(key, { message, users });
                } else {
                    // 对于其他消息，可能需要特殊处理
                    messageGroups.set(key, { message, users });
                }
            } else {
                messageGroups.set(key, { message, users });
            }
        });

        return Array.from(messageGroups.values());
    }

    // 发送系统消息
    sendSystemMessage(content, users, level = 'info') {
        const message = {
            type: 'system_message',
            level: level,
            content: content,
            timestamp: Date.now()
        };

        this.broadcast(message, users);
    }

    // 发送欢迎消息给新用户
    sendWelcomeMessage(user) {
        const welcomeMessage = {
            type: 'welcome_message',
            content: '欢迎来到多人游戏世界！',
            serverInfo: {
                maxUsers: 100,
                currentUsers: 1
            },
            timestamp: Date.now()
        };

        user.ws.send(JSON.stringify(welcomeMessage));
    }

    // 发送服务器状态
    sendServerStatus(users, userManager) {
        const status = {
            type: 'server_status',
            onlineUsers: userManager.getOnlineUserCount(),
            totalUsers: userManager.getUserCount(),
            maxUsers: 100,
            uptime: process.uptime(),
            timestamp: Date.now()
        };

        this.broadcast(status, users);
    }

    // 清理断开连接的用户
    cleanupDisconnectedUsers(users) {
        return users.filter(user => user.ws && user.ws.readyState === 1);
    }
}

module.exports = BroadcastManager;