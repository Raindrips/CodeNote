class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.renderer = null;
        this.network = null;
        this.controls = null;
        this.gameLoop = null;
        this.isRunning = false;
        this.lastFrameTime = 0;
        this.fps = 0;
        this.frameCount = 0;
        this.lastFpsUpdate = 0;
        
        this.init();
    }
    
    init() {
        console.log('初始化游戏...');
        
        // 检查浏览器支持
        if (!this.checkBrowserSupport()) {
            this.showError('您的浏览器不支持必要的游戏功能。请使用现代浏览器。');
            return;
        }
        
        // 初始化游戏模块
        this.setupRenderer();
        this.setupNetwork();
        this.setupControls();
        this.setupUI();
        
        // 开始游戏循环
        this.startGameLoop();
        
        console.log('游戏初始化完成！');
        this.addMessage('游戏客户端已就绪', 'success');
    }
    
    checkBrowserSupport() {
        // 检查WebSocket支持
        if (!window.WebSocket) {
            this.addMessage('您的浏览器不支持WebSocket', 'error');
            return false;
        }
        
        // 检查Canvas支持
        if (!this.canvas.getContext) {
            this.addMessage('您的浏览器不支持Canvas', 'error');
            return false;
        }
        
        // 检查localStorage支持
        if (!window.localStorage) {
            this.addMessage('您的浏览器不支持localStorage', 'warning');
        }
        
        return true;
    }
    
    setupRenderer() {
        this.renderer = new GameRenderer(this.canvas);
        this.addMessage('渲染器初始化完成', 'info');
    }
    
    setupNetwork() {
        this.network = new GameNetwork(this.renderer, this);
        this.addMessage('网络模块初始化完成', 'info');
    }
    
    setupControls() {
        this.controls = new GameControls(this.network, this.renderer);
        this.addMessage('控制模块初始化完成', 'info');
    }
    
    setupUI() {
        // 设置UI事件监听器
        this.setupUIEventListeners();
        
        // 加载保存的设置
        this.loadSettings();
        
        // 设置窗口大小调整
        this.setupResizeHandler();
        
        this.addMessage('用户界面初始化完成', 'info');
    }
    
    setupUIEventListeners() {
        // 窗口大小调整
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // 页面可见性变化
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
        
        // 页面加载完成
        window.addEventListener('load', () => {
            this.handlePageLoad();
        });
        
        // 页面卸载
        window.addEventListener('beforeunload', () => {
            this.handleBeforeUnload();
        });
        
        // 错误处理
        window.addEventListener('error', (e) => {
            this.handleError(e);
        });
        
        // 未处理的Promise拒绝
        window.addEventListener('unhandledrejection', (e) => {
            this.handleUnhandledRejection(e);
        });
    }
    
    setupResizeHandler() {
        const resizeCanvas = () => {
            const container = this.canvas.parentElement;
            const rect = container.getBoundingClientRect();
            
            // 保持宽高比
            const aspectRatio = 4 / 3;
            let width = rect.width;
            let height = width / aspectRatio;
            
            if (height > rect.height) {
                height = rect.height;
                width = height * aspectRatio;
            }
            
            this.canvas.style.width = width + 'px';
            this.canvas.style.height = height + 'px';
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }
    
    startGameLoop() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.lastFrameTime = performance.now();
        this.gameLoop = requestAnimationFrame((timestamp) => this.update(timestamp));
        
        this.addMessage('游戏循环已启动', 'info');
    }
    
    stopGameLoop() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
            this.gameLoop = null;
        }
        
        this.addMessage('游戏循环已停止', 'info');
    }
    
    update(timestamp) {
        if (!this.isRunning) return;
        
        const deltaTime = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;
        
        // 更新FPS
        this.frameCount++;
        if (timestamp - this.lastFpsUpdate >= 1000) {
            this.fps = Math.round(this.frameCount * 1000 / (timestamp - this.lastFpsUpdate));
            this.frameCount = 0;
            this.lastFpsUpdate = timestamp;
            
            // 显示FPS（可选）
            // this.showFPS(this.fps);
        }
        
        // 更新游戏逻辑
        this.updateGameLogic(deltaTime);
        
        // 渲染
        this.render();
        
        // 继续游戏循环
        this.gameLoop = requestAnimationFrame((timestamp) => this.update(timestamp));
    }
    
    updateGameLogic(deltaTime) {
        // 更新玩家位置（基于网络同步）
        // 这里可以添加客户端预测等逻辑
        
        // 检查连接状态
        if (this.network && this.network.isConnected) {
            // 可以在这里添加心跳包等逻辑
        }
    }
    
    render() {
        if (this.renderer) {
            this.renderer.render();
        }
    }
    
    handleResize() {
        this.addMessage('窗口大小已调整', 'info');
        // 重新设置画布大小等
        this.setupResizeHandler();
    }
    
    handleVisibilityChange() {
        if (document.hidden) {
            this.addMessage('页面已隐藏，游戏暂停', 'info');
            // 可以暂停游戏循环以节省资源
        } else {
            this.addMessage('页面已显示，游戏恢复', 'info');
            // 恢复游戏
        }
    }
    
    handlePageLoad() {
        this.addMessage('页面加载完成', 'info');
    }
    
    handleBeforeUnload() {
        if (this.network && this.network.isConnected) {
            this.network.disconnect();
        }
        this.addMessage('页面即将卸载', 'info');
    }
    
    handleError(event) {
        console.error('游戏错误:', event.error);
        this.addMessage(`游戏错误: ${event.message}`, 'error');
    }
    
    handleUnhandledRejection(event) {
        console.error('未处理的Promise拒绝:', event.reason);
        this.addMessage(`未处理的错误: ${event.reason}`, 'error');
    }
    
    // UI辅助方法
    addMessage(text, type = 'info') {
        if (this.network) {
            this.network.addMessage(text, type);
        } else {
            console.log(`[${type}] ${text}`);
        }
    }
    
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div class="error-content">
                <h3>游戏初始化失败</h3>
                <p>${message}</p>
                <button onclick="location.reload()">重新加载</button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        
        // 添加错误样式
        const style = document.createElement('style');
        style.textContent = `
            .error-message {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            }
            
            .error-content {
                background: white;
                padding: 30px;
                border-radius: 10px;
                text-align: center;
                max-width: 400px;
            }
            
            .error-content h3 {
                color: #e53e3e;
                margin-bottom: 15px;
            }
            
            .error-content button {
                background: #667eea;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 15px;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // 设置管理
    saveSettings() {
        try {
            const settings = {
                playerName: document.getElementById('playerNameInput').value,
                serverUrl: document.getElementById('serverUrlInput').value,
                timestamp: Date.now()
            };
            
            localStorage.setItem('gameSettings', JSON.stringify(settings));
        } catch (error) {
            console.warn('无法保存设置:', error);
        }
    }
    
    loadSettings() {
        try {
            const saved = localStorage.getItem('gameSettings');
            if (saved) {
                const settings = JSON.parse(saved);
                
                if (settings.playerName) {
                    document.getElementById('playerNameInput').value = settings.playerName;
                }
                
                if (settings.serverUrl) {
                    document.getElementById('serverUrlInput').value = settings.serverUrl;
                }
            }
        } catch (error) {
            console.warn('无法加载设置:', error);
        }
    }
    
    // 游戏控制方法
    restart() {
        this.stopGameLoop();
        
        if (this.network) {
            this.network.disconnect();
        }
        
        if (this.controls) {
            this.controls.reset();
        }
        
        this.init();
    }
    
    pause() {
        this.stopGameLoop();
        this.addMessage('游戏已暂停', 'info');
    }
    
    resume() {
        this.startGameLoop();
        this.addMessage('游戏已恢复', 'info');
    }
    
    // 性能监控
    showFPS(fps) {
        const fpsElement = document.getElementById('fpsCounter');
        if (!fpsElement) {
            const fpsDiv = document.createElement('div');
            fpsDiv.id = 'fpsCounter';
            fpsDiv.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 5px 10px;
                border-radius: 5px;
                font-family: monospace;
                font-size: 12px;
                z-index: 1000;
            `;
            document.body.appendChild(fpsDiv);
        }
        
        document.getElementById('fpsCounter').textContent = `FPS: ${fps}`;
    }
}

// 全局游戏实例
let game = null;

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    game = new Game();
});

// 暴露一些全局方法供调试使用
window.gameDebug = {
    restart: () => game && game.restart(),
    pause: () => game && game.pause(),
    resume: () => game && game.resume(),
    getNetwork: () => game && game.network,
    getRenderer: () => game && game.renderer,
    getControls: () => game && game.controls
};