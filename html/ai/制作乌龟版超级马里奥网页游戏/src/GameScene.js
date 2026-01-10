import Phaser from 'phaser';
import { createTurtleSprite, createMarioSprite, createEnvironmentSprites } from '../assets/generateSprites';

class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.player = null;
    this.enemies = null;
    this.platforms = null;
    this.coins = null;
    this.cursors = null;
    this.score = 0;
    this.scoreText = null;
    this.gameOver = false;
  }

  preload() {
    // 生成并加载精灵图
    const turtleDataURL = createTurtleSprite();
    const marioDataURL = createMarioSprite();
    const environmentSprites = createEnvironmentSprites();

    // 加载生成的精灵图
    this.textures.addBase64('turtle', turtleDataURL);
    this.textures.addBase64('mario', marioDataURL);
    this.textures.addBase64('ground', environmentSprites.ground);
    this.textures.addBase64('question', environmentSprites.question);
    this.textures.addBase64('pipe', environmentSprites.pipe);
    this.textures.addBase64('coin', environmentSprites.coin);
    this.textures.addBase64('mushroom', environmentSprites.mushroom);
    this.textures.addBase64('background', environmentSprites.background);

    // 加载音效
    this.load.audio('jump', [
      'https://labs.phaser.io/assets/audio/SoundEffects/jump.wav'
    ]);
    this.load.audio('coin', [
      'https://labs.phaser.io/assets/audio/SoundEffects/coin.wav'
    ]);
    this.load.audio('stomp', [
      'https://labs.phaser.io/assets/audio/SoundEffects/squit.wav'
    ]);
  }

  create() {
    // 添加背景
    this.add.image(400, 300, 'background');

    // 创建平台组
    this.platforms = this.physics.add.staticGroup();

    // 创建地面
    for (let i = 0; i < 25; i++) {
      this.platforms.create(i * 32 + 16, 568, 'ground');
    }

    // 创建一些平台
    this.platforms.create(600, 400, 'ground');
    this.platforms.create(50, 250, 'ground');
    this.platforms.create(750, 220, 'ground');
    this.platforms.create(400, 320, 'ground');
    this.platforms.create(200, 450, 'ground');

    // 创建问号砖块
    this.questionBlocks = this.physics.add.staticGroup();
    this.questionBlocks.create(200, 350, 'question');
    this.questionBlocks.create(300, 350, 'question');
    this.questionBlocks.create(500, 250, 'question');

    // 创建管道
    this.pipes = this.physics.add.staticGroup();
    this.pipes.create(500, 500, 'pipe').setScale(2).refreshBody();
    this.pipes.create(100, 500, 'pipe').setScale(2).refreshBody();

    // 创建玩家角色（乌龟）
    this.player = this.physics.add.sprite(100, 450, 'turtle');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(24, 24);

    // 创建玩家动画
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('turtle', { start: 1, end: 2 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'turtle', frame: 0 }],
      frameRate: 20
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('turtle', { start: 1, end: 2 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'jump',
      frames: [{ key: 'turtle', frame: 3 }],
      frameRate: 10
    });

    // 创建敌人（马里奥）
    this.enemies = this.physics.add.group();
    this.createEnemy(300, 450);
    this.createEnemy(600, 350);

    // 创建金币
    this.coins = this.physics.add.group({
      key: 'coin',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    });

    this.coins.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      child.setCircle(8);
    });

    // 设置碰撞
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.questionBlocks, this.hitQuestionBlock, null, this);
    this.physics.add.collider(this.player, this.pipes);
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.enemies, this.pipes);
    this.physics.add.collider(this.coins, this.platforms);
    this.physics.add.collider(this.coins, this.questionBlocks);

    // 设置重叠检测
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
    this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, null, this);

    // 设置键盘控制
    this.cursors = this.input.keyboard.createCursorKeys();

    // 添加分数文本
    this.scoreText = this.add.text(16, 16, '分数: 0', { fontSize: '32px', fill: '#000' });

    // 添加音效
    this.jumpSound = this.sound.add('jump');
    this.coinSound = this.sound.add('coin');
    this.stompSound = this.sound.add('stomp');
  }

  update() {
    if (this.gameOver) {
      return;
    }

    // 玩家控制
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.flipX = true;
      
      if (this.player.body.touching.down) {
        this.player.anims.play('left', true);
      }
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.flipX = false;
      
      if (this.player.body.touching.down) {
        this.player.anims.play('right', true);
      }
    } else {
      this.player.setVelocityX(0);
      
      if (this.player.body.touching.down) {
        this.player.anims.play('turn');
      }
    }

    // 跳跃控制
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
      this.player.anims.play('jump');
      this.jumpSound.play();
    }
    
    // 如果玩家在空中，播放跳跃动画
    if (!this.player.body.touching.down) {
      this.player.anims.play('jump');
    }

    // 更新敌人行为
    this.enemies.children.iterate(function (enemy) {
      if (enemy.body.touching.right || enemy.body.blocked.right) {
        enemy.setVelocityX(-100);
        enemy.flipX = true;
      } else if (enemy.body.touching.left || enemy.body.blocked.left) {
        enemy.setVelocityX(100);
        enemy.flipX = false;
      }
    });
  }

  createEnemy(x, y) {
    const enemy = this.enemies.create(x, y, 'mario');
    enemy.setBounce(0.2);
    enemy.setCollideWorldBounds(true);
    enemy.setVelocityX(100);
    enemy.body.setSize(24, 24);
    
    // 创建敌人动画
    this.anims.create({
      key: 'enemy-walk',
      frames: this.anims.generateFrameNumbers('mario', { start: 1, end: 2 }),
      frameRate: 10,
      repeat: -1
    });
    
    enemy.anims.play('enemy-walk', true);
    
    return enemy;
  }

  collectCoin(player, coin) {
    coin.disableBody(true, true);
    this.coinSound.play();
    
    // 增加分数
    this.score += 10;
    this.scoreText.setText('分数: ' + this.score);
    
    // 检查是否所有金币都被收集
    if (this.coins.countActive(true) === 0) {
      // 重新生成一些金币
      this.coins.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });
    }
  }

  hitEnemy(player, enemy) {
    // 如果玩家从上方踩到敌人
    if (player.body.velocity.y > 0 && player.y < enemy.y - enemy.height/2) {
      this.stompSound.play();
      enemy.disableBody(true, true);
      player.setVelocityY(-200);
      
      // 增加分数
      this.score += 100;
      this.scoreText.setText('分数: ' + this.score);
    } else {
      // 玩家被敌人碰到
      this.physics.pause();
      player.setTint(0xff0000);
      player.anims.play('turn');
      this.gameOver = true;
      
      // 3秒后重新开始游戏
      this.time.delayedCall(3000, function() {
        this.scene.restart();
        this.gameOver = false;
        this.score = 0;
      }, [], this);
    }
  }

  hitQuestionBlock(player, block) {
    // 只有当玩家从下方撞击问号砖块时才触发
    if (player.body.velocity.y < 0 && player.y > block.y + block.height/2) {
      // 创建一个金币
      const coin = this.coins.create(block.x, block.y - 40, 'coin');
      coin.setBounceY(0.8);
      coin.setVelocityY(-200);
      
      // 将问号砖块变为普通砖块
      block.setTexture('ground');
      
      // 增加分数
      this.score += 5;
      this.scoreText.setText('分数: ' + this.score);
    }
  }
}

export default GameScene;
