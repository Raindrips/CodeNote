import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>超级马里奥 - 角色互换版</h1>
        <p>控制乌龟角色，打败马里奥敌人！</p>
      </header>
      <div className="game-instructions">
        <h2>游戏说明</h2>
        <p>使用方向键控制乌龟角色：</p>
        <ul>
          <li>← → 键：左右移动</li>
          <li>↑ 键：跳跃</li>
        </ul>
        <p>游戏目标：</p>
        <ul>
          <li>收集金币增加分数</li>
          <li>从上方踩踏马里奥敌人</li>
          <li>撞击问号砖块获取奖励</li>
          <li>避免被马里奥敌人碰到</li>
        </ul>
      </div>
      <div id="game-container" className="game-container">
        <p>游戏加载中...</p>
      </div>
      <footer className="App-footer">
        <p>基于Phaser和React开发的超级马里奥网页游戏</p>
      </footer>
    </div>
  );
}

export default App;
