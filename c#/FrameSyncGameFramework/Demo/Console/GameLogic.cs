using System;
using System.Collections.Generic;
using System.Linq;
using FrameSyncGameFramework.Common.Math;
using FrameSyncGameFramework.Common.Interfaces;

namespace FrameSyncGameFramework.Demo.Console
{
    /// <summary>
    /// 游戏逻辑处理器
    /// </summary>
    public class GameLogic
    {
        private readonly Random _random;
        private uint _nextProjectileId;

        public GameLogic()
        {
            _random = new Random();
            _nextProjectileId = 1;
        }

        /// <summary>
        /// 处理游戏输入并更新游戏状态
        /// </summary>
        public void ProcessInput(GameState state, IInput input)
        {
            if (input is not GameInput gameInput)
                return;

            if (!state.Players.TryGetValue(gameInput.PlayerId, out var player))
                return;

            // 处理移动输入
            if (gameInput.Type == InputType.Move || gameInput.Type == InputType.MoveAndShoot)
            {
                var moveSpeed = FixedPoint.FromFloat(5f);
                var moveVector = new FixedVector2(gameInput.MoveX, gameInput.MoveY);
                
                if (moveVector.Magnitude() > FixedPoint.Zero)
                {
                    moveVector = moveVector.Normalized() * moveSpeed;
                    player.Velocity = moveVector;
                }
            }

            // 处理射击输入
            if (gameInput.Type == InputType.Shoot || gameInput.Type == InputType.MoveAndShoot)
            {
                if (gameInput.Shoot)
                {
                    ShootProjectile(state, player, gameInput.AimX, gameInput.AimY);
                }
            }
        }

        /// <summary>
        /// 发射投射物
        /// </summary>
        private void ShootProjectile(GameState state, PlayerState player, float aimX, float aimY)
        {
            var projectileSpeed = FixedPoint.FromFloat(20f);
            var aimVector = new FixedVector2(aimX, aimY);
            
            if (aimVector.Magnitude() > FixedPoint.Zero)
            {
                aimVector = aimVector.Normalized() * projectileSpeed;
            }
            else
            {
                // 默认向右发射
                aimVector = new FixedVector2(projectileSpeed, FixedPoint.Zero);
            }

            var projectile = new ProjectileState
            {
                Id = _nextProjectileId++,
                OwnerId = player.PlayerId,
                Position = player.Position,
                Velocity = aimVector,
                Radius = FixedPoint.FromFloat(0.5f),
                Damage = 10,
                Lifetime = 0,
                MaxLifetime = 60 // 1秒（60帧）
            };

            state.Projectiles.Add(projectile);
        }

        /// <summary>
        /// 模拟游戏更新（确定性）
        /// </summary>
        public void UpdateGame(GameState state, IInput[] inputs)
        {
            // 处理所有输入
            foreach (var input in inputs)
            {
                ProcessInput(state, input);
            }

            // 更新游戏状态
            state.Update();
        }

        /// <summary>
        /// 生成随机输入（用于测试）
        /// </summary>
        public GameInput GenerateRandomInput(byte playerId, uint frame)
        {
            var input = new GameInput
            {
                PlayerId = playerId,
                Frame = frame
            };

            // 随机移动
            var moveX = (float)(_random.NextDouble() * 2 - 1);
            var moveY = (float)(_random.NextDouble() * 2 - 1);
            
            // 随机射击
            var shoot = _random.Next(100) < 20; // 20%概率射击
            var aimX = (float)(_random.NextDouble() * 2 - 1);
            var aimY = (float)(_random.NextDouble() * 2 - 1);

            input.MoveX = moveX;
            input.MoveY = moveY;
            input.Shoot = shoot;
            input.AimX = aimX;
            input.AimY = aimY;

            // 确定输入类型
            if (Math.Abs(moveX) > 0.1f || Math.Abs(moveY) > 0.1f)
            {
                input.Type = shoot ? InputType.MoveAndShoot : InputType.Move;
            }
            else if (shoot)
            {
                input.Type = InputType.Shoot;
            }
            else
            {
                input.Type = InputType.None;
            }

            return input;
        }

        /// <summary>
        /// 检查游戏是否结束
        /// </summary>
        public bool IsGameOver(GameState state)
        {
            return state.Players.Count == 0 || state.Players.Values.All(p => p.Health <= 0);
        }

        /// <summary>
        /// 获取胜利者
        /// </summary>
        public PlayerState? GetWinner(GameState state)
        {
            if (state.Players.Count == 0)
                return null;

            return state.Players.Values
                .Where(p => p.Health > 0)
                .OrderByDescending(p => p.Health)
                .FirstOrDefault();
        }

        /// <summary>
        /// 重置游戏逻辑状态
        /// </summary>
        public void Reset()
        {
            _nextProjectileId = 1;
        }
    }
}