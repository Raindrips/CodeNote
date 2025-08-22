/**
 * 通知组件JavaScript
 * 处理各种类型的通知消息显示和管理
 */

let notificationContainer = null;
let notificationQueue = [];
let maxNotifications = 5;
let defaultDuration = 5000;

/**
 * 初始化通知系统
 */
function initNotification() {
    console.log('初始化通知组件...');
    
    // 获取或创建通知容器
    notificationContainer = document.getElementById('notificationContainer');
    if (!notificationContainer) {
        createNotificationContainer();
    }
    
    // 初始化全局通知函数
    window.showNotification = showNotification;
}

/**
 * 创建通知容器
 */
function createNotificationContainer() {
    notificationContainer = document.createElement('div');
    notificationContainer.id = 'notificationContainer';
    notificationContainer.className = 'notification-container';
    document.body.appendChild(notificationContainer);
}

/**
 * 显示通知
 * @param {string} type - 通知类型 (success, warning, error, info)
 * @param {string} message - 通知消息
 * @param {Object} options - 配置选项
 */
function showNotification(type = 'info', message = '', options = {}) {
    const {
        title = '',
        duration = defaultDuration,
        closable = true,
        icon = '',
        position = 'top-right',
        className = '',
        onClick = null,
        onClose = null
    } = options;
    
    // 创建通知元素
    const notification = createNotificationElement({
        type,
        title,
        message,
        closable,
        icon: icon || getDefaultIcon(type),
        className,
        onClick,
        onClose
    });
    
    // 添加到队列
    notificationQueue.push(notification);
    
    // 检查队列长度，移除多余的通知
    while (notificationQueue.length > maxNotifications) {
        const oldNotification = notificationQueue.shift();
        removeNotification(oldNotification, false);
    }
    
    // 显示通知
    displayNotification(notification, position);
    
    // 自动关闭
    if (duration > 0) {
        setTimeout(() => {
            removeNotification(notification);
        }, duration);
    }
    
    return notification;
}

/**
 * 创建通知元素
 * @param {Object} config - 通知配置
 * @returns {HTMLElement} 通知元素
 */
function createNotificationElement(config) {
    const {
        type,
        title,
        message,
        closable,
        icon,
        className,
        onClick,
        onClose
    } = config;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type} ${className}`.trim();
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    // 创建图标
    if (icon) {
        const iconElement = document.createElement('div');
        iconElement.className = 'notification-icon';
        iconElement.innerHTML = `<i class="${icon}"></i>`;
        notification.appendChild(iconElement);
    }
    
    // 创建内容
    const content = document.createElement('div');
    content.className = 'notification-content';
    
    if (title) {
        const titleElement = document.createElement('div');
        titleElement.className = 'notification-title';
        titleElement.textContent = title;
        content.appendChild(titleElement);
    }
    
    if (message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'notification-message';
        messageElement.textContent = message;
        content.appendChild(messageElement);
    }
    
    notification.appendChild(content);
    
    // 创建关闭按钮
    if (closable) {
        const closeButton = document.createElement('button');
        closeButton.className = 'notification-close';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        closeButton.setAttribute('aria-label', '关闭通知');
        
        closeButton.addEventListener('click', () => {
            removeNotification(notification);
        });
        
        notification.appendChild(closeButton);
    }
    
    // 添加点击事件
    if (onClick && typeof onClick === 'function') {
        notification.style.cursor = 'pointer';
        notification.addEventListener('click', (e) => {
            if (!e.target.closest('.notification-close')) {
                onClick(notification, e);
            }
        });
    }
    
    // 保存关闭回调
    if (onClose && typeof onClose === 'function') {
        notification._onClose = onClose;
    }
    
    return notification;
}

/**
 * 显示通知
 * @param {HTMLElement} notification - 通知元素
 * @param {string} position - 显示位置
 */
function displayNotification(notification, position) {
    // 设置容器位置
    updateContainerPosition(position);
    
    // 添加到容器
    notificationContainer.appendChild(notification);
    
    // 添加进入动画
    setTimeout(() => {
        notification.classList.add('animate-slideInRight');
    }, 10);
    
    // 触发显示事件
    notification.dispatchEvent(new CustomEvent('notificationShow', {
        detail: { notification }
    }));
}

/**
 * 移除通知
 * @param {HTMLElement} notification - 通知元素
 * @param {boolean} animate - 是否使用动画
 */
function removeNotification(notification, animate = true) {
    if (!notification || !notification.parentNode) return;
    
    // 从队列中移除
    const index = notificationQueue.indexOf(notification);
    if (index > -1) {
        notificationQueue.splice(index, 1);
    }
    
    if (animate) {
        // 添加退出动画
        notification.classList.add('animate-slideOutRight');
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            
            // 触发关闭回调
            if (notification._onClose) {
                notification._onClose(notification);
            }
            
            // 触发关闭事件
            notification.dispatchEvent(new CustomEvent('notificationClose', {
                detail: { notification }
            }));
        }, 300);
    } else {
        // 直接移除
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
        
        if (notification._onClose) {
            notification._onClose(notification);
        }
    }
}

/**
 * 更新容器位置
 * @param {string} position - 位置
 */
function updateContainerPosition(position) {
    if (!notificationContainer) return;
    
    // 移除所有位置类
    notificationContainer.className = 'notification-container';
    
    // 添加新位置类
    notificationContainer.classList.add(`notification-${position}`);
    
    // 设置CSS样式
    const positions = {
        'top-right': { top: '20px', right: '20px', left: 'auto', bottom: 'auto' },
        'top-left': { top: '20px', left: '20px', right: 'auto', bottom: 'auto' },
        'bottom-right': { bottom: '20px', right: '20px', top: 'auto', left: 'auto' },
        'bottom-left': { bottom: '20px', left: '20px', top: 'auto', right: 'auto' },
        'top-center': { top: '20px', left: '50%', transform: 'translateX(-50%)', right: 'auto', bottom: 'auto' },
        'bottom-center': { bottom: '20px', left: '50%', transform: 'translateX(-50%)', right: 'auto', top: 'auto' }
    };
    
    const pos = positions[position] || positions['top-right'];
    Object.assign(notificationContainer.style, pos);
}

/**
 * 获取默认图标
 * @param {string} type - 通知类型
 * @returns {string} 图标类名
 */
function getDefaultIcon(type) {
    const icons = {
        success: 'fas fa-check-circle',
        warning: 'fas fa-exclamation-triangle',
        error: 'fas fa-times-circle',
        info: 'fas fa-info-circle'
    };
    
    return icons[type] || icons.info;
}

/**
 * 通知工具类
 */
class NotificationUtils {
    /**
     * 显示成功通知
     * @param {string} message - 消息内容
     * @param {Object} options - 配置选项
     */
    static success(message, options = {}) {
        return showNotification('success', message, options);
    }
    
    /**
     * 显示警告通知
     * @param {string} message - 消息内容
     * @param {Object} options - 配置选项
     */
    static warning(message, options = {}) {
        return showNotification('warning', message, options);
    }
    
    /**
     * 显示错误通知
     * @param {string} message - 消息内容
     * @param {Object} options - 配置选项
     */
    static error(message, options = {}) {
        return showNotification('error', message, options);
    }
    
    /**
     * 显示信息通知
     * @param {string} message - 消息内容
     * @param {Object} options - 配置选项
     */
    static info(message, options = {}) {
        return showNotification('info', message, options);
    }
    
    /**
     * 清除所有通知
     */
    static clearAll() {
        notificationQueue.forEach(notification => {
            removeNotification(notification, false);
        });
        notificationQueue = [];
    }
    
    /**
     * 设置最大通知数量
     * @param {number} max - 最大数量
     */
    static setMaxNotifications(max) {
        maxNotifications = Math.max(1, max);
    }
    
    /**
     * 设置默认持续时间
     * @param {number} duration - 持续时间（毫秒）
     */
    static setDefaultDuration(duration) {
        defaultDuration = Math.max(0, duration);
    }
    
    /**
     * 获取当前通知数量
     * @returns {number}
     */
    static getCount() {
        return notificationQueue.length;
    }
    
    /**
     * 创建进度通知
     * @param {string} message - 消息内容
     * @param {Object} options - 配置选项
     * @returns {Object} 包含通知元素和更新方法的对象
     */
    static progress(message, options = {}) {
        const {
            title = '进度',
            initialProgress = 0,
            showPercentage = true
        } = options;
        
        // 创建进度条HTML
        const progressHtml = `
            <div class="notification-progress">
                <div class="progress-text">${message}</div>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${initialProgress}%"></div>
                </div>
                ${showPercentage ? `<div class="progress-percentage">${initialProgress}%</div>` : ''}
            </div>
        `;
        
        const notification = showNotification('info', '', {
            ...options,
            title,
            duration: 0, // 不自动关闭
            closable: false
        });
        
        // 替换内容
        const content = notification.querySelector('.notification-content');
        content.innerHTML = progressHtml;
        
        return {
            notification,
            update: (progress, newMessage) => {
                const progressBar = notification.querySelector('.progress-bar');
                const progressText = notification.querySelector('.progress-text');
                const progressPercentage = notification.querySelector('.progress-percentage');
                
                if (progressBar) {
                    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
                }
                
                if (newMessage && progressText) {
                    progressText.textContent = newMessage;
                }
                
                if (showPercentage && progressPercentage) {
                    progressPercentage.textContent = `${Math.round(progress)}%`;
                }
            },
            complete: (message = '完成') => {
                const progressText = notification.querySelector('.progress-text');
                if (progressText) {
                    progressText.textContent = message;
                }
                
                notification.classList.remove('info');
                notification.classList.add('success');
                
                const icon = notification.querySelector('.notification-icon i');
                if (icon) {
                    icon.className = 'fas fa-check-circle';
                }
                
                setTimeout(() => {
                    removeNotification(notification);
                }, 2000);
            },
            close: () => {
                removeNotification(notification);
            }
        };
    }
}

// 导出到全局
window.NotificationUtils = NotificationUtils;
window.showNotification = showNotification;

// 添加通知动画样式（如果不存在）
if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        .notification-container {
            position: fixed;
            z-index: 1060;
            max-width: 350px;
            pointer-events: none;
        }
        
        .notification {
            pointer-events: auto;
            margin-bottom: 0.5rem;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        }
        
        .notification.animate-slideInRight {
            opacity: 1;
            transform: translateX(0);
        }
        
        .notification.animate-slideOutRight {
            opacity: 0;
            transform: translateX(100%);
        }
        
        .notification-title {
            font-weight: 600;
            margin-bottom: 0.25rem;
        }
        
        .notification-message {
            font-size: 0.875rem;
            line-height: 1.4;
        }
        
        .notification-progress {
            width: 100%;
        }
        
        .progress-bar-container {
            width: 100%;
            height: 8px;
            background-color: rgba(255, 255, 255, 0.3);
            border-radius: 4px;
            overflow: hidden;
            margin: 0.5rem 0;
        }
        
        .progress-bar {
            height: 100%;
            background-color: currentColor;
            transition: width 0.3s ease;
        }
        
        .progress-percentage {
            text-align: right;
            font-size: 0.75rem;
            opacity: 0.8;
        }
        
        /* 位置样式 */
        .notification-top-left {
            top: 20px;
            left: 20px;
        }
        
        .notification-top-left .notification.animate-slideInRight {
            transform: translateX(0);
        }
        
        .notification-top-left .notification {
            transform: translateX(-100%);
        }
        
        .notification-top-left .notification.animate-slideOutRight {
            transform: translateX(-100%);
        }
        
        .notification-bottom-right {
            bottom: 20px;
            right: 20px;
        }
        
        .notification-bottom-left {
            bottom: 20px;
            left: 20px;
        }
        
        .notification-bottom-left .notification {
            transform: translateX(-100%);
        }
        
        .notification-bottom-left .notification.animate-slideInRight {
            transform: translateX(0);
        }
        
        .notification-bottom-left .notification.animate-slideOutRight {
            transform: translateX(-100%);
        }
        
        .notification-top-center,
        .notification-bottom-center {
            left: 50%;
            transform: translateX(-50%);
        }
        
        .notification-top-center {
            top: 20px;
        }
        
        .notification-bottom-center {
            bottom: 20px;
        }
        
        .notification-top-center .notification,
        .notification-bottom-center .notification {
            transform: translateX(-50%) translateY(-100%);
        }
        
        .notification-top-center .notification.animate-slideInRight,
        .notification-bottom-center .notification.animate-slideInRight {
            transform: translateX(-50%) translateY(0);
        }
        
        .notification-bottom-center .notification {
            transform: translateX(-50%) translateY(100%);
        }
        
        .notification-top-center .notification.animate-slideOutRight {
            transform: translateX(-50%) translateY(-100%);
        }
        
        .notification-bottom-center .notification.animate-slideOutRight {
            transform: translateX(-50%) translateY(100%);
        }
    `;
    document.head.appendChild(style);
}

