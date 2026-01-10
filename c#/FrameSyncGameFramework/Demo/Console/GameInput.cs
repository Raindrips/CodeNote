using System;
using FrameSyncGameFramework.Common.Interfaces;

namespace FrameSyncGameFramework.Demo.Console
{
    /// <summary>
    /// 示例游戏输入
    /// </summary>
    public class GameInput : IInput
    {
        public byte PlayerId { get; set; }
        public uint Frame { get; set; }
        
        public InputType Type { get; set; }
        public float MoveX { get; set; }
        public float MoveY { get; set; }
        public bool Shoot { get; set; }
        public float AimX { get; set; }
        public float AimY { get; set; }

        public GameInput()
        {
            Type = InputType.None;
            MoveX = 0f;
            MoveY = 0f;
            Shoot = false;
            AimX = 0f;
            AimY = 0f;
        }

        public IInput DeepCopy()
        {
            return new GameInput
            {
                PlayerId = PlayerId,
                Frame = Frame,
                Type = Type,
                MoveX = MoveX,
                MoveY = MoveY,
                Shoot = Shoot,
                AimX = AimX,
                AimY = AimY
            };
        }

        public int GetHash()
        {
            // 简单的哈希计算
            var hash = PlayerId.GetHashCode() ^ Frame.GetHashCode() ^ Type.GetHashCode();
            hash = hash ^ MoveX.GetHashCode() ^ MoveY.GetHashCode();
            hash = hash ^ Shoot.GetHashCode() ^ AimX.GetHashCode() ^ AimY.GetHashCode();
            return hash;
        }

        public override string ToString()
        {
            return $"Input[Player:{PlayerId}, Frame:{Frame}, Type:{Type}, Move:({MoveX:F2},{MoveY:F2}), Shoot:{Shoot}, Aim:({AimX:F2},{AimY:F2})]";
        }
    }

    /// <summary>
    /// 输入类型
    /// </summary>
    public enum InputType
    {
        None = 0,
        Move = 1,
        Shoot = 2,
        MoveAndShoot = 3
    }
}