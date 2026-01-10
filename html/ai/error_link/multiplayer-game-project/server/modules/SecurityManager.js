class SecurityManager {
    constructor() {
        this.rateLimitMap = new Map(); // userId -> rateLimitData
        this.blockedUsers = new Set();
        this.suspiciousUsers = new Map();
        
        // 速率限制配置
        this.rateLimitConfig = {
            maxMessagesPerSecond: 10,
            maxMessagesPerMinute: 100,
            maxLoginAttempts: 5,
            blockDuration: 300000, // 5分钟
            suspiciousThreshold: 3
        };

        // 消息过滤配置
        this.filterConfig = {
            maxMessageLength: 200,
            forbiddenWords: [
                'admin', 'administrator', 'system', 'root',
                'hack', 'exploit', 'cheat', 'bot'
            ],
            allowSpecialChars: false
        };
    }

    // 检查速率限制
    checkRateLimit(userId, messageType = 'general') {
        if (this.blockedUsers.has(userId)) {
            return { allowed: false, reason: '用户被封锁' };
        }

        const now = Date.now();
        let rateLimitData = this.rateLimitMap.get(userId);

        if (!rateLimitData) {
            rateLimitData = {
                messageCount: 0,
                windowStart: now,
                loginAttempts: 0,
                lastLoginAttempt: 0
            };
            this.rateLimitMap.set(userId, rateLimitData);
        }

        // 重置计数窗口
        if (now - rateLimitData.windowStart > 60000) { // 1分钟窗口
            rateLimitData.messageCount = 0;
            rateLimitData.windowStart = now;
        }

        // 检查每秒限制
        if (rateLimitData.lastMessageTime && now - rateLimitData.lastMessageTime < 1000) {
            const recentMessages = rateLimitData.recentMessages || [];
            const secondAgo = now - 1000;
            const messagesInLastSecond = recentMessages.filter(time => time > secondAgo);
            
            if (messagesInLastSecond.length >= this.rateLimitConfig.maxMessagesPerSecond) {
                this.handleRateLimitViolation(userId, '每秒消息数超限');
                return { allowed: false, reason: '发送消息过于频繁' };
            }
        }

        // 检查每分钟限制
        if (rateLimitData.messageCount >= this.rateLimitConfig.maxMessagesPerMinute) {
            this.handleRateLimitViolation(userId, '每分钟消息数超限');
            return { allowed: false, reason: '发送消息过于频繁' };
        }

        // 更新计数
        rateLimitData.messageCount++;
        rateLimitData.lastMessageTime = now;
        
        // 更新最近消息时间数组
        if (!rateLimitData.recentMessages) {
            rateLimitData.recentMessages = [];
        }
        rateLimitData.recentMessages.push(now);
        rateLimitData.recentMessages = rateLimitData.recentMessages.filter(time => now - time < 1000);

        return { allowed: true };
    }

    // 检查登录尝试速率限制
    checkLoginRateLimit(userId) {
        if (this.blockedUsers.has(userId)) {
            return { allowed: false, reason: '用户被封锁' };
        }

        const now = Date.now();
        let rateLimitData = this.rateLimitMap.get(userId);

        if (!rateLimitData) {
            rateLimitData = {
                messageCount: 0,
                windowStart: now,
                loginAttempts: 0,
                lastLoginAttempt: 0
            };
            this.rateLimitMap.set(userId, rateLimitData);
        }

        // 重置登录尝试计数（24小时窗口）
        if (now - rateLimitData.lastLoginAttempt > 86400000) {
            rateLimitData.loginAttempts = 0;
        }

        if (rateLimitData.loginAttempts >= this.rateLimitConfig.maxLoginAttempts) {
            this.handleRateLimitViolation(userId, '登录尝试次数超限');
            return { allowed: false, reason: '登录尝试次数过多，请稍后再试' };
        }

        rateLimitData.loginAttempts++;
        rateLimitData.lastLoginAttempt = now;

        return { allowed: true };
    }

    // 处理速率限制违规
    handleRateLimitViolation(userId, reason) {
        console.warn(`用户 ${userId} 速率限制违规: ${reason}`);

        let violationCount = this.suspiciousUsers.get(userId) || 0;
        violationCount++;
        this.suspiciousUsers.set(userId, violationCount);

        if (violationCount >= this.rateLimitConfig.suspiciousThreshold) {
            this.blockUser(userId, `多次违规: ${reason}`);
        }
    }

    // 封锁用户
    blockUser(userId, reason) {
        this.blockedUsers.add(userId);
        console.warn(`用户被封锁: ${userId}, 原因: ${reason}`);

        // 设置自动解封
        setTimeout(() => {
            this.unblockUser(userId);
        }, this.rateLimitConfig.blockDuration);
    }

    // 解封用户
    unblockUser(userId) {
        this.blockedUsers.delete(userId);
        this.suspiciousUsers.delete(userId);
        this.rateLimitMap.delete(userId);
        console.log(`用户解封: ${userId}`);
    }

    // 验证消息内容
    validateMessage(message) {
        if (!message || typeof message !== 'string') {
            return { valid: false, reason: '消息格式错误' };
        }

        if (message.length > this.filterConfig.maxMessageLength) {
            return { valid: false, reason: '消息过长' };
        }

        // 检查禁用词汇
        const lowerMessage = message.toLowerCase();
        for (const word of this.filterConfig.forbiddenWords) {
            if (lowerMessage.includes(word.toLowerCase())) {
                return { valid: false, reason: '消息包含不当内容' };
            }
        }

        // 检查特殊字符（如果不允许）
        if (!this.filterConfig.allowSpecialChars) {
            const specialCharsPattern = /[!@#$%^&*()_+=\[\]{};:"\\|,.<>\/?]/;
            if (specialCharsPattern.test(message)) {
                return { valid: false, reason: '消息包含非法字符' };
            }
        }

        return { valid: true };
    }

    // 验证用户名
    validateUsername(username) {
        if (!username || typeof username !== 'string') {
            return { valid: false, reason: '用户名格式错误' };
        }

        if (username.length < 2 || username.length > 20) {
            return { valid: false, reason: '用户名长度必须在2-20个字符之间' };
        }

        // 检查用户名是否包含非法字符
        const validUsernamePattern = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
        if (!validUsernamePattern.test(username)) {
            return { valid: false, reason: '用户名只能包含字母、数字、下划线和中文' };
        }

        // 检查是否包含禁用词汇
        const lowerUsername = username.toLowerCase();
        for (const word of this.filterConfig.forbiddenWords) {
            if (lowerUsername.includes(word.toLowerCase())) {
                return { valid: false, reason: '用户名包含不当内容' };
            }
        }

        return { valid: true };
    }

    // 验证位置数据
    validatePosition(position) {
        if (!position || typeof position !== 'object') {
            return { valid: false, reason: '位置数据格式错误' };
        }

        const { x, y, z } = position;
        
        if (typeof x !== 'number' || typeof y !== 'number' || typeof z !== 'number') {
            return { valid: false, reason: '坐标必须是数字' };
        }

        // 检查坐标范围（防止异常值）
        const maxPosition = 10000;
        if (Math.abs(x) > maxPosition || Math.abs(y) > maxPosition || Math.abs(z) > maxPosition) {
            return { valid: false, reason: '坐标值超出允许范围' };
        }

        // 检查是否为有效数字
        if (!isFinite(x) || !isFinite(y) || !isFinite(z)) {
            return { valid: false, reason: '坐标值无效' };
        }

        return { valid: true };
    }

    // 验证旋转数据
    validateRotation(rotation) {
        if (!rotation || typeof rotation !== 'object') {
            return { valid: false, reason: '旋转数据格式错误' };
        }

        const { x, y, z } = rotation;
        
        if (typeof x !== 'number' || typeof y !== 'number' || typeof z !== 'number') {
            return { valid: false, reason: '旋转值必须是数字' };
        }

        // 检查旋转值范围（通常旋转值在0-360度或-180到180度之间）
        if (!isFinite(x) || !isFinite(y) || !isFinite(z)) {
            return { valid: false, reason: '旋转值无效' };
        }

        return { valid: true };
    }

    // 清理过期数据
    cleanup() {
        const now = Date.now();
        const cleanupThreshold = 3600000; // 1小时

        // 清理速率限制数据
        for (const [userId, data] of this.rateLimitMap.entries()) {
            if (now - data.windowStart > cleanupThreshold) {
                this.rateLimitMap.delete(userId);
            }
        }

        // 清理可疑用户记录
        for (const [userId, violationTime] of this.suspiciousUsers.entries()) {
            if (now - violationTime > cleanupThreshold) {
                this.suspiciousUsers.delete(userId);
            }
        }
    }

    // 获取安全统计信息
    getSecurityStats() {
        return {
            blockedUsers: this.blockedUsers.size,
            suspiciousUsers: this.suspiciousUsers.size,
            rateLimitedUsers: this.rateLimitMap.size,
            totalViolations: Array.from(this.suspiciousUsers.values()).reduce((sum, count) => sum + count, 0)
        };
    }
}

module.exports = SecurityManager;