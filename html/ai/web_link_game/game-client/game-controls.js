class GameControls {
    constructor(network, renderer) {
        this.network = network;
        this.renderer = renderer;
        this.keys = {};
        this.moveSpeed = 5;
        this.isMoving = false;
        this.moveInterval = null;
        
        this.setupKeyboardControls();
        this.setupTouchControls();
        this.setupMouseControls();
    }
    
    setupKeyboardControls() {
        // 键盘按下事件
        document.addEventListener('keydown', (e) => {
            if (this.keys[e.code]) return; // 防止重复触发
            
            this.keys[e.code] = true;
            
            // 只处理方向键
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
                this.handleMovement();
            }
            
            // 其他快捷键
            this.handleShortcuts(e);
        });
        
        // 键盘释放事件
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
            
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
                this.handleMovementEnd();
            }
        });
        
        // 窗口失去焦点时清除所有按键状态
        window.addEventListener('blur', () => {
            this.keys = {};
            this.handleMovementEnd();
        });
    }
    
    setupTouchControls() {
        // 创建虚拟摇杆
        this.createVirtualJoystick();
        
        // 触摸事件
        let touchStartPos = null;
        
        this.renderer.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (e.touches.length === 1) {
                touchStartPos = {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY
                };
            }
        });
        
        this.renderer.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (touchStartPos && e.touches.length === 1) {
                const touch = e.touches[0];
                const deltaX = touch.clientX - touchStartPos.x;
                const deltaY = touch.clientY - touchStartPos.y;
                
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                
                if (distance > 20) { // 最小移动距离
                    const angle = Math.atan2(deltaY, deltaX);
                    this.handleTouchMovement(angle);
                }
            }
        });
        
        this.renderer.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            touchStartPos = null;
            this.handleMovementEnd();
        });
    }
    
    setupMouseControls() {
        let isMouseDown = false;
        let mouseDownPos = null;
        
        this.renderer.canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0) { // 左键
                isMouseDown = true;
                mouseDownPos = {
                    x: e.clientX,
                    y: e.clientY
                };
            }
        });
        
        this.renderer.canvas.addEventListener('mousemove', (e) => {
            if (isMouseDown && mouseDownPos) {
                const deltaX = e.clientX - mouseDownPos.x;
                const deltaY = e.clientY - mouseDownPos.y;
                
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                
                if (distance > 10) {
                    const angle = Math.atan2(deltaY, deltaX);
                    this.handleMouseMovement(angle);
                }
            }
        });
        
        this.renderer.canvas.addEventListener('mouseup', (e) => {
            isMouseDown = false;
            mouseDownPos = null;
            this.handleMovementEnd();
        });
        
        this.renderer.canvas.addEventListener('mouseleave', (e) => {
            isMouseDown = false;
            mouseDownPos = null;
            this.handleMovementEnd();
        });
    }
    
    createVirtualJoystick() {
        // 创建虚拟摇杆DOM元素
        const joystickContainer = document.createElement('div');
        joystickContainer.id = 'virtualJoystick';
        joystickContainer.innerHTML = `
            <div class="joystick-base">
                <div class="joystick-stick"></div>
            </div>
        `;
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            #virtualJoystick {
                position: fixed;
                bottom: 20px;
                left: 20px;
                width: 120px;
                height: 120px;
                z-index: 1000;
                display: none;
            }
            
            .joystick-base {
                width: 120px;
                height: 120px;
                background: rgba(255, 255, 255, 0.2);
                border: 2px solid rgba(255, 255, 255, 0.4);
                border-radius: 50%;
                position: relative;
                backdrop-filter: blur(10px);
            }
            
            .joystick-stick {
                width: 50px;
                height: 50px;
                background: rgba(255, 255, 255, 0.8);
                border-radius: 50%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                transition: transform 0.1s ease-out;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
            
            @media (max-width: 768px) {
                #virtualJoystick {
                    display: block;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(joystickContainer);
        
        // 设置摇杆事件
        this.setupJoystickEvents();
    }
    
    setupJoystickEvents() {
        const joystickBase = document.querySelector('.joystick-base');
        const joystickStick = document.querySelector('.joystick-stick');
        let isDragging = false;
        let centerX, centerY;
        
        const getJoystickPosition = (clientX, clientY) => {
            const rect = joystickBase.getBoundingClientRect();
            centerX = rect.left + rect.width / 2;
            centerY = rect.top + rect.height / 2;
            
            const deltaX = clientX - centerX;
            const deltaY = clientY - centerY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const maxDistance = rect.width / 2 - 25;
            
            if (distance > maxDistance) {
                const angle = Math.atan2(deltaY, deltaX);
                return {
                    x: Math.cos(angle) * maxDistance,
                    y: Math.sin(angle) * maxDistance,
                    distance: maxDistance,
                    angle: angle
                };
            }
            
            return {
                x: deltaX,
                y: deltaY,
                distance: distance,
                angle: Math.atan2(deltaY, deltaX)
            };
        };
        
        const startDrag = (clientX, clientY) => {
            isDragging = true;
            const pos = getJoystickPosition(clientX, clientY);
            joystickStick.style.transform = `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`;
            this.handleJoystickMovement(pos.angle, pos.distance);
        };
        
        const moveDrag = (clientX, clientY) => {
            if (!isDragging) return;
            const pos = getJoystickPosition(clientX, clientY);
            joystickStick.style.transform = `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`;
            this.handleJoystickMovement(pos.angle, pos.distance);
        };
        
        const endDrag = () => {
            isDragging = false;
            joystickStick.style.transform = 'translate(-50%, -50%)';
            this.handleMovementEnd();
        };
        
        // 鼠标事件
        joystickBase.addEventListener('mousedown', (e) => {
            startDrag(e.clientX, e.clientY);
        });
        
        document.addEventListener('mousemove', (e) => {
            moveDrag(e.clientX, e.clientY);
        });
        
        document.addEventListener('mouseup', endDrag);
        
        // 触摸事件
        joystickBase.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            startDrag(touch.clientX, touch.clientY);
        });
        
        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const touch = e.touches[0];
            moveDrag(touch.clientX, touch.clientY);
        });
        
        document.addEventListener('touchend', endDrag);
    }
    
    handleMovement() {
        if (!this.network.isConnected) return;
        
        let direction = null;
        
        if (this.keys['ArrowUp'] && !this.keys['ArrowDown']) {
            direction = 'up';
        } else if (this.keys['ArrowDown'] && !this.keys['ArrowUp']) {
            direction = 'down';
        }
        
        if (this.keys['ArrowLeft'] && !this.keys['ArrowRight']) {
            if (direction) {
                direction += '-left';
            } else {
                direction = 'left';
            }
        } else if (this.keys['ArrowRight'] && !this.keys['ArrowLeft']) {
            if (direction) {
                direction += '-right';
            } else {
                direction = 'right';
            }
        }
        
        if (direction && !this.isMoving) {
            this.startMovement(direction);
        }
    }
    
    handleMovementEnd() {
        if (this.isMoving) {
            this.stopMovement();
        }
    }
    
    handleTouchMovement(angle) {
        if (!this.network.isConnected) return;
        
        // 将角度转换为方向
        const directions = ['right', 'down-right', 'down', 'down-left', 'left', 'up-left', 'up', 'up-right'];
        const index = Math.round(angle / (Math.PI / 4)) + 4;
        const direction = directions[index % 8];
        
        if (!this.isMoving) {
            this.startMovement(direction);
        }
    }
    
    handleMouseMovement(angle) {
        if (!this.network.isConnected) return;
        
        const directions = ['right', 'down-right', 'down', 'down-left', 'left', 'up-left', 'up', 'up-right'];
        const index = Math.round(angle / (Math.PI / 4)) + 4;
        const direction = directions[index % 8];
        
        if (!this.isMoving) {
            this.startMovement(direction);
        }
    }
    
    handleJoystickMovement(angle, distance) {
        if (!this.network.isConnected) return;
        
        const directions = ['right', 'down-right', 'down', 'down-left', 'left', 'up-left', 'up', 'up-right'];
        const index = Math.round(angle / (Math.PI / 4)) + 4;
        const direction = directions[index % 8];
        
        if (distance > 10) {
            if (!this.isMoving) {
                this.startMovement(direction);
            }
        } else {
            this.handleMovementEnd();
        }
    }
    
    startMovement(direction) {
        this.isMoving = true;
        this.currentDirection = direction;
        
        // 立即发送移动消息
        this.network.movePlayer(direction);
        
        // 设置移动间隔
        if (this.moveInterval) {
            clearInterval(this.moveInterval);
        }
        
        this.moveInterval = setInterval(() => {
            if (this.isMoving && this.currentDirection) {
                this.network.movePlayer(this.currentDirection);
            }
        }, 50); // 每50ms发送一次移动消息
    }
    
    stopMovement() {
        this.isMoving = false;
        this.currentDirection = null;
        
        if (this.moveInterval) {
            clearInterval(this.moveInterval);
            this.moveInterval = null;
        }
        
        // 发送停止移动消息
        this.network.sendMessage({
            type: 'stopMove'
        });
    }
    
    handleShortcuts(e) {
        // 快捷键处理
        switch (e.code) {
            case 'KeyC':
                // C键连接/断开
                if (e.ctrlKey) {
                    e.preventDefault();
                    if (this.network.isConnected) {
                        this.network.disconnect();
                    } else {
                        this.network.connect();
                    }
                }
                break;
                
            case 'KeyR':
                // R键重新连接
                if (e.ctrlKey) {
                    e.preventDefault();
                    if (this.network.isConnected) {
                        this.network.disconnect();
                        setTimeout(() => this.network.connect(), 100);
                    }
                }
                break;
                
            case 'F11':
                // 全屏
                e.preventDefault();
                this.toggleFullscreen();
                break;
        }
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                this.network.addMessage(`无法进入全屏模式: ${err.message}`, 'error');
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    // 获取移动状态
    getMovementState() {
        return {
            isMoving: this.isMoving,
            direction: this.currentDirection,
            keys: { ...this.keys }
        };
    }
    
    // 重置控制状态
    reset() {
        this.keys = {};
        this.isMoving = false;
        this.currentDirection = null;
        
        if (this.moveInterval) {
            clearInterval(this.moveInterval);
            this.moveInterval = null;
        }
    }
}