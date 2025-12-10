class MessageHandler {
    constructor(userManager) {
        this.userManager = userManager;
    }

    handleMessage(userId, message) {
        const { type, data } = message;
        const user = this.userManager.getUser(userId);

        if (!user) {
            console.error(`用户不存在: ${userId}`);
            return;
        }

        // 更新用户最后活动时间
        user.lastActivity = Date.now();

        switch (type) {
            case 'login':
                this.handleLogin(user, data);
                break;
            case 'move':
                this.handleMove(user, data);
                break;
            case 'rotate':
                this.handleRotate(user, data);
                break;
            case 'chat':
                this.handleChat(user, data);
                break;
            case 'heartbeat':
                this.handleHeartbeat(user);
                break;
            case 'get_online_users':
                this.handleGetOnlineUsers(user);
                break;
            default:
                this.handleUnknownMessage(user, type);
        }
    }

    handleLogin(user, data) {
        const { username } = data;

        if (!username || username.trim().length === 0) {
            this.sendError(user, '用户名不能为空');
            return;
        }

        if (username.length > 20) {
            this.sendError(user, '用户名长度不能超过20个字符');
            return;
        }

        if (!this.userManager.isUsernameAvailable(username)) {
            this.sendError(user, '用户名已存在');
            return;
        }

        // 设置用户登录状态
        this.userManager.setUserLoggedIn(user.id, username);

        console.log(`用户登录: ${username} (${user.id})`);

        // 发送登录成功消息
        user.ws.send(JSON.stringify({
            type: 'login_success',
            userId: user.id,
            username: username,
            position: user.position,
            message: '登录成功'
        }));

        // 广播新用户加入消息
        const BroadcastManager = require('./BroadcastManager');
        const broadcastManager = new BroadcastManager();
        broadcastManager.broadcast({
            type: 'user_joined',
            user: {
                id: user.id,
                username: user.username,
                position: user.position,
                rotation: user.rotation
            }
        }, this.userManager.getAllUsers());
    }

    handleMove(user, data) {
        if (!user.isLoggedIn) {
            this.sendError(user, '请先登录');
            return;
        }

        const { position } = data;
        if (!position || typeof position.x !== 'number' || typeof position.y !== 'number' || typeof position.z !== 'number') {
            this.sendError(user, '位置数据格式错误');
            return;
        }

        // 更新用户位置
        this.userManager.updateUserPosition(user.id, position);

        // 广播位置更新
        const BroadcastManager = require('./BroadcastManager');
        const broadcastManager = new BroadcastManager();
        broadcastManager.broadcast({
            type: 'user_moved',
            userId: user.id,
            position: position
        }, this.userManager.getAllUsers());
    }

    handleRotate(user, data) {
        if (!user.isLoggedIn) {
            this.sendError(user, '请先登录');
            return;
        }

        const { rotation } = data;
        if (!rotation || typeof rotation.x !== 'number' || typeof rotation.y !== 'number' || typeof rotation.z !== 'number') {
            this.sendError(user, '旋转数据格式错误');
            return;
        }

        // 更新用户旋转
        this.userManager.updateUserRotation(user.id, rotation);

        // 广播旋转更新
        const BroadcastManager = require('./BroadcastManager');
        const broadcastManager = new BroadcastManager();
        broadcastManager.broadcast({
            type: 'user_rotated',
            userId: user.id,
            rotation: rotation
        }, this.userManager.getAllUsers());
    }

    handleChat(user, data) {
        if (!user.isLoggedIn) {
            this.sendError(user, '请先登录');
            return;
        }

        const { message } = data;
        if (!message || message.trim().length === 0) {
            this.sendError(user, '消息不能为空');
            return;
        }

        if (message.length > 200) {
            this.sendError(user, '消息长度不能超过200个字符');
            return;
        }

        console.log(`聊天消息 [${user.username}]: ${message}`);

        // 广播聊天消息
        const BroadcastManager = require('./BroadcastManager');
        const broadcastManager = new BroadcastManager();
        broadcastManager.broadcast({
            type: 'chat_message',
            userId: user.id,
            username: user.username,
            message: message.trim(),
            timestamp: Date.now()
        }, this.userManager.getAllUsers());
    }

    handleHeartbeat(user) {
        user.ws.send(JSON.stringify({
            type: 'heartbeat_response',
            timestamp: Date.now()
        }));
    }

    handleGetOnlineUsers(user) {
        const onlineUsers = this.userManager.getAllUsersInfo();
        user.ws.send(JSON.stringify({
            type: 'online_users_list',
            users: onlineUsers,
            count: onlineUsers.length
        }));
    }

    handleUnknownMessage(user, type) {
        this.sendError(user, `未知的消息类型: ${type}`);
    }

    sendError(user, message) {
        user.ws.send(JSON.stringify({
            type: 'error',
            message: message
        }));
    }
}

module.exports = MessageHandler;