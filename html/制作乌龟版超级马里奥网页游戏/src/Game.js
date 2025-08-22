import Phaser from 'phaser';
import GameScene from './scenes/GameScene';

class Game extends Phaser.Game {
  constructor() {
    // 游戏配置
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: 'game-container',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 },
          debug: false
        }
      },
      scene: [GameScene]
    };
    
    super(config);
  }
}

export default Game;
