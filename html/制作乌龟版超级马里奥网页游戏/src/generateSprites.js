// 创建基本的精灵图占位符
// 这些将在实际游戏中被替换为真实的精灵图

// 乌龟玩家角色
const createTurtleSprite = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  
  // 绘制4个乌龟状态：站立、行走1、行走2、跳跃
  for (let i = 0; i < 4; i++) {
    // 绿色乌龟身体
    ctx.fillStyle = '#00AA00';
    ctx.fillRect(i * 32 + 8, 8, 16, 16);
    
    // 黄色乌龟腹部
    ctx.fillStyle = '#FFDD00';
    ctx.fillRect(i * 32 + 10, 16, 12, 8);
    
    // 黑色眼睛
    ctx.fillStyle = '#000000';
    ctx.fillRect(i * 32 + 18, 10, 4, 4);
    
    // 不同姿势
    if (i === 1) {
      // 行走姿势1
      ctx.fillStyle = '#00AA00';
      ctx.fillRect(i * 32 + 6, 24, 6, 4);
      ctx.fillRect(i * 32 + 20, 24, 6, 4);
    } else if (i === 2) {
      // 行走姿势2
      ctx.fillStyle = '#00AA00';
      ctx.fillRect(i * 32 + 4, 24, 6, 4);
      ctx.fillRect(i * 32 + 22, 24, 6, 4);
    } else if (i === 3) {
      // 跳跃姿势
      ctx.fillStyle = '#00AA00';
      ctx.fillRect(i * 32 + 6, 22, 6, 6);
      ctx.fillRect(i * 32 + 20, 22, 6, 6);
    } else {
      // 站立姿势
      ctx.fillStyle = '#00AA00';
      ctx.fillRect(i * 32 + 8, 24, 6, 4);
      ctx.fillRect(i * 32 + 18, 24, 6, 4);
    }
  }
  
  return canvas.toDataURL();
};

// 马里奥敌人
const createMarioSprite = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  
  // 绘制4个马里奥状态：站立、行走1、行走2、跳跃
  for (let i = 0; i < 4; i++) {
    // 红色帽子和衣服
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(i * 32 + 8, 4, 16, 6);
    ctx.fillRect(i * 32 + 8, 16, 16, 8);
    
    // 肤色脸和手臂
    ctx.fillStyle = '#FFA060';
    ctx.fillRect(i * 32 + 10, 10, 12, 6);
    ctx.fillRect(i * 32 + 6, 14, 4, 8);
    ctx.fillRect(i * 32 + 22, 14, 4, 8);
    
    // 蓝色裤子
    ctx.fillStyle = '#0000FF';
    ctx.fillRect(i * 32 + 10, 24, 12, 4);
    
    // 黑色眼睛
    ctx.fillStyle = '#000000';
    ctx.fillRect(i * 32 + 18, 12, 2, 2);
    
    // 不同姿势
    if (i === 1) {
      // 行走姿势1
      ctx.fillStyle = '#FFA060';
      ctx.fillRect(i * 32 + 8, 28, 4, 4);
      ctx.fillRect(i * 32 + 20, 28, 4, 4);
    } else if (i === 2) {
      // 行走姿势2
      ctx.fillStyle = '#FFA060';
      ctx.fillRect(i * 32 + 6, 28, 4, 4);
      ctx.fillRect(i * 32 + 22, 28, 4, 4);
    } else if (i === 3) {
      // 跳跃姿势
      ctx.fillStyle = '#FFA060';
      ctx.fillRect(i * 32 + 6, 26, 4, 6);
      ctx.fillRect(i * 32 + 22, 26, 4, 6);
    } else {
      // 站立姿势
      ctx.fillStyle = '#FFA060';
      ctx.fillRect(i * 32 + 10, 28, 4, 4);
      ctx.fillRect(i * 32 + 18, 28, 4, 4);
    }
  }
  
  return canvas.toDataURL();
};

// 游戏环境元素
const createEnvironmentSprites = () => {
  const sprites = {};
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  
  // 地面砖块
  ctx.fillStyle = '#B97A57';
  ctx.fillRect(0, 0, 32, 32);
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(0, 0, 32, 4);
  ctx.fillRect(0, 0, 4, 32);
  ctx.fillRect(28, 0, 4, 32);
  ctx.fillRect(0, 28, 32, 4);
  sprites.ground = canvas.toDataURL();
  
  // 问号砖块
  ctx.clearRect(0, 0, 32, 32);
  ctx.fillStyle = '#FFA500';
  ctx.fillRect(0, 0, 32, 32);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '24px Arial';
  ctx.fillText('?', 10, 24);
  sprites.question = canvas.toDataURL();
  
  // 管道
  ctx.clearRect(0, 0, 32, 32);
  ctx.fillStyle = '#00AA00';
  ctx.fillRect(0, 0, 32, 32);
  ctx.fillStyle = '#008800';
  ctx.fillRect(4, 4, 24, 24);
  sprites.pipe = canvas.toDataURL();
  
  // 金币
  ctx.clearRect(0, 0, 32, 32);
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(16, 16, 8, 0, Math.PI * 2);
  ctx.fill();
  sprites.coin = canvas.toDataURL();
  
  // 蘑菇
  ctx.clearRect(0, 0, 32, 32);
  ctx.fillStyle = '#FF0000';
  ctx.fillRect(4, 4, 24, 12);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(8, 8, 4, 4);
  ctx.fillRect(20, 8, 4, 4);
  ctx.fillStyle = '#FFA060';
  ctx.fillRect(4, 16, 24, 12);
  sprites.mushroom = canvas.toDataURL();
  
  // 背景
  canvas.width = 512;
  canvas.height = 256;
  ctx.fillStyle = '#87CEEB';
  ctx.fillRect(0, 0, 512, 256);
  
  // 绘制云朵
  ctx.fillStyle = '#FFFFFF';
  for (let i = 0; i < 5; i++) {
    const x = Math.random() * 400;
    const y = Math.random() * 100;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.arc(x + 15, y - 10, 15, 0, Math.PI * 2);
    ctx.arc(x + 30, y, 20, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // 绘制远景山丘
  ctx.fillStyle = '#90EE90';
  ctx.beginPath();
  ctx.moveTo(0, 256);
  ctx.lineTo(0, 200);
  ctx.quadraticCurveTo(100, 150, 200, 200);
  ctx.quadraticCurveTo(300, 250, 400, 200);
  ctx.lineTo(512, 256);
  ctx.fill();
  
  sprites.background = canvas.toDataURL();
  
  return sprites;
};

export { createTurtleSprite, createMarioSprite, createEnvironmentSprites };
