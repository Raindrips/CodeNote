// 创建游戏精灵图
export default function createSprites(scene) {
  // 创建玩家角色 - 乌龟
  createTurtlePlayer(scene);
  
  // 创建敌人 - 马里奥
  createMarioEnemy(scene);
  
  // 创建游戏环境元素
  createEnvironment(scene);
}

// 创建乌龟玩家角色
function createTurtlePlayer(scene) {
  // 加载乌龟精灵图
  scene.load.spritesheet('turtle', 'assets/images/characters/turtle.png', {
    frameWidth: 32,
    frameHeight: 32
  });
  
  // 创建乌龟动画
  scene.anims.create({
    key: 'turtle-idle',
    frames: scene.anims.generateFrameNumbers('turtle', { start: 0, end: 1 }),
    frameRate: 5,
    repeat: -1
  });
  
  scene.anims.create({
    key: 'turtle-walk',
    frames: scene.anims.generateFrameNumbers('turtle', { start: 2, end: 3 }),
    frameRate: 10,
    repeat: -1
  });
  
  scene.anims.create({
    key: 'turtle-jump',
    frames: scene.anims.generateFrameNumbers('turtle', { start: 4, end: 4 }),
    frameRate: 10,
    repeat: 0
  });
}

// 创建马里奥敌人
function createMarioEnemy(scene) {
  // 加载马里奥精灵图
  scene.load.spritesheet('mario', 'assets/images/characters/mario.png', {
    frameWidth: 32,
    frameHeight: 32
  });
  
  // 创建马里奥动画
  scene.anims.create({
    key: 'mario-idle',
    frames: scene.anims.generateFrameNumbers('mario', { start: 0, end: 1 }),
    frameRate: 5,
    repeat: -1
  });
  
  scene.anims.create({
    key: 'mario-walk',
    frames: scene.anims.generateFrameNumbers('mario', { start: 2, end: 3 }),
    frameRate: 10,
    repeat: -1
  });
}

// 创建游戏环境元素
function createEnvironment(scene) {
  // 加载地形和背景
  scene.load.image('ground', 'assets/images/backgrounds/ground.png');
  scene.load.image('background', 'assets/images/backgrounds/background.png');
  
  // 加载砖块和管道
  scene.load.image('brick', 'assets/images/items/brick.png');
  scene.load.image('question', 'assets/images/items/question.png');
  scene.load.image('pipe', 'assets/images/items/pipe.png');
  
  // 加载收集物品
  scene.load.image('coin', 'assets/images/items/coin.png');
  scene.load.image('mushroom', 'assets/images/items/mushroom.png');
}
