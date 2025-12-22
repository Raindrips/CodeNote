namespace FrameSyncGameFramework.Common.Interfaces
{
    /// <summary>
    /// 游戏状态接口，所有可帧同步的游戏状态都需要实现此接口
    /// </summary>
    public interface IGameState
    {
        /// <summary>
        /// 获取当前帧号
        /// </summary>
        uint Frame { get; set; }

        /// <summary>
        /// 深拷贝当前状态
        /// </summary>
        IGameState DeepCopy();

        /// <summary>
        /// 重置状态到初始值
        /// </summary>
        void Reset();
    }
}