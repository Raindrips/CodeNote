class UserManager {
    constructor() {
        this.users = new Map(); // userId -> user
        this.usernames = new Set(); // 用于检查用户名唯一性
    }

    addUser(user) {
        this.users.set(user.id, user);
    }

    removeUser(userId) {
        const user = this.users.get(userId);
        if (user && user.username) {
            this.usernames.delete(user.username);
        }
        this.users.delete(userId);
    }

    getUser(userId) {
        return this.users.get(userId);
    }

    getUserByUsername(username) {
        for (const user of this.users.values()) {
            if (user.username === username) {
                return user;
            }
        }
        return null;
    }

    getAllUsers() {
        return Array.from(this.users.values());
    }

    getOnlineUsers() {
        return this.getAllUsers().filter(user => user.isLoggedIn);
    }

    getUserCount() {
        return this.users.size;
    }

    getOnlineUserCount() {
        return this.getOnlineUsers().length;
    }

    updateUserPosition(userId, position) {
        const user = this.users.get(userId);
        if (user) {
            user.position = { ...position };
            user.lastActivity = Date.now();
            return true;
        }
        return false;
    }

    updateUserRotation(userId, rotation) {
        const user = this.users.get(userId);
        if (user) {
            user.rotation = { ...rotation };
            user.lastActivity = Date.now();
            return true;
        }
        return false;
    }

    setUserLoggedIn(userId, username) {
        const user = this.users.get(userId);
        if (user && !this.usernames.has(username)) {
            if (user.username) {
                this.usernames.delete(user.username);
            }
            user.username = username;
            user.isLoggedIn = true;
            user.lastActivity = Date.now();
            this.usernames.add(username);
            return true;
        }
        return false;
    }

    isUsernameAvailable(username) {
        return !this.usernames.has(username);
    }

    // 清理长时间不活跃的用户（超过5分钟）
    cleanupInactiveUsers(maxInactiveTime = 300000) {
        const now = Date.now();
        const inactiveUsers = [];
        
        for (const [userId, user] of this.users.entries()) {
            if (now - user.lastActivity > maxInactiveTime) {
                inactiveUsers.push(userId);
            }
        }

        inactiveUsers.forEach(userId => {
            const user = this.users.get(userId);
            if (user && user.ws) {
                user.ws.close();
            }
            this.removeUser(userId);
        });

        return inactiveUsers.length;
    }

    // 获取所有用户的简要信息（用于广播）
    getAllUsersInfo() {
        return this.getOnlineUsers().map(user => ({
            id: user.id,
            username: user.username,
            position: user.position,
            rotation: user.rotation
        }));
    }
}

module.exports = UserManager;