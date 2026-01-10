class GameRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.players = new Map();
        this.localPlayerId = null;
        this.camera = { x: 0, y: 0 };
        this.worldSize = { width: 2000, height: 2000 };
        
        this.setupCanvas();
        this.loadAssets();
    }
    
    setupCanvas() {
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.canvas.style.background = 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)';
        
        // 添加网格背景
        this.drawGrid();
    }
    
    loadAssets() {
        // 玩家头像emoji集合
        this.playerEmojis = ['😊', '😎', '🤠', '🧑‍🚀', '👨‍💻', '👩‍🎨', '🧙‍♂️', '👨‍🔬', '🥷', '🧑‍🎤'];
        this.emojiColors = [
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', 
            '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd',
            '#00d2d3', '#ff9f43'
        ];
    }
    
    drawGrid() {
        const gridSize = 50;
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.lineWidth = 1;
        
        // 绘制垂直线
        for (let x = 0; x <= this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // 绘制水平线
        for (let y = 0; y <= this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    worldToScreen(worldX, worldY) {
        return {
            x: worldX - this.camera.x + this.canvas.width / 2,
            y: worldY - this.camera.y + this.canvas.height / 2
        };
    }
    
    screenToWorld(screenX, screenY) {
        return {
            x: screenX + this.camera.x - this.canvas.width / 2,
            y: screenY + this.camera.y - this.canvas.height / 2
        };
    }
    
    updateCamera(targetX, targetY) {
        this.camera.x = targetX;
        this.camera.y = targetY;
    }
    
    addPlayer(playerData) {
        const player = {
            id: playerData.id,
            name: playerData.name,
            x: playerData.x,
            y: playerData.y,
            emoji: this.playerEmojis[playerData.id % this.playerEmojis.length],
            color: this.emojiColors[playerData.id % this.emojiColors.length],
            isLocal: playerData.isLocal || false,
            lastUpdate: Date.now()
        };
        
        this.players.set(player.id, player);
        
        if (player.isLocal) {
            this.localPlayerId = player.id;
        }
        
        return player;
    }
    
    removePlayer(playerId) {
        this.players.delete(playerId);
    }
    
    updatePlayer(playerId, data) {
        const player = this.players.get(playerId);
        if (player) {
            player.x = data.x;
            player.y = data.y;
            player.lastUpdate = Date.now();
        }
    }
    
    getLocalPlayer() {
        return this.players.get(this.localPlayerId);
    }
    
    drawPlayer(player) {
        const screenPos = this.worldToScreen(player.x, player.y);
        
        // 绘制玩家阴影
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.beginPath();
        this.ctx.ellipse(screenPos.x, screenPos.y + 25, 15, 8, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 绘制玩家背景圆圈
        this.ctx.fillStyle = player.color;
        this.ctx.beginPath();
        this.ctx.arc(screenPos.x, screenPos.y, 20, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 绘制玩家边框
        this.ctx.strokeStyle = player.isLocal ? '#ffffff' : 'rgba(255, 255, 255, 0.8)';
        this.ctx.lineWidth = player.isLocal ? 3 : 2;
        this.ctx.stroke();
        
        // 绘制玩家emoji
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(player.emoji, screenPos.x, screenPos.y);
        
        // 绘制玩家名称
        this.ctx.font = '12px Arial';
        this.ctx.fillStyle = '#2d3748';
        this.ctx.fillText(player.name, screenPos.x, screenPos.y - 35);
        
        // 如果是本地玩家，添加特殊效果
        if (player.isLocal) {
            // 绘制光环效果
            this.ctx.strokeStyle = player.color;
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.arc(screenPos.x, screenPos.y, 30, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
            
            // 更新相机位置
            this.updateCamera(player.x, player.y);
        }
    }
    
    drawWorld() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 重新绘制网格
        this.drawGrid();
        
        // 绘制世界边界
        const topLeft = this.worldToScreen(0, 0);
        const bottomRight = this.worldToScreen(this.worldSize.width, this.worldSize.height);
        
        this.ctx.strokeStyle = '#4a5568';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
        
        // 绘制所有玩家
        this.players.forEach(player => {
            this.drawPlayer(player);
        });
        
        // 绘制本地玩家信息
        const localPlayer = this.getLocalPlayer();
        if (localPlayer) {
            this.ctx.font = '14px Arial';
            this.ctx.fillStyle = '#4a5568';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(`位置: (${Math.round(localPlayer.x)}, ${Math.round(localPlayer.y)})`, 10, 30);
            this.ctx.fillText(`在线玩家: ${this.players.size}`, 10, 50);
        }
    }
    
    getVisiblePlayers() {
        const visiblePlayers = [];
        const screenWorld = this.screenToWorld(0, 0);
        const screenWorldEnd = this.screenToWorld(this.canvas.width, this.canvas.height);
        
        this.players.forEach(player => {
            if (player.x >= screenWorld.x - 100 && player.x <= screenWorldEnd.x + 100 &&
                player.y >= screenWorld.y - 100 && player.y <= screenWorldEnd.y + 100) {
                visiblePlayers.push(player);
            }
        });
        
        return visiblePlayers;
    }
    
    render() {
        this.drawWorld();
    }
    
    // 获取世界坐标系中的随机位置
    getRandomWorldPosition() {
        return {
            x: Math.random() * this.worldSize.width,
            y: Math.random() * this.worldSize.height
        };
    }
    
    // 检查位置是否在世界边界内
    isPositionValid(x, y) {
        return x >= 0 && x <= this.worldSize.width && y >= 0 && y <= this.worldSize.height;
    }
    
    // 将位置限制在世界边界内
    clampPosition(x, y) {
        return {
            x: Math.max(0, Math.min(this.worldSize.width, x)),
            y: Math.max(0, Math.min(this.worldSize.height, y))
        };
    }
}