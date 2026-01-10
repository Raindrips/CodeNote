namespace FrameSyncGameFramework.Common.Interfaces
{
    /// <summary>
    /// 输入接口，所有玩家输入都需要实现此接口
    /// </summary>
    public interface IInput
    {
        /// <summary>
        /// 玩家ID
        /// </summary>
        byte PlayerId { get; set; }

        /// <summary>
        /// 输入帧号
        /// </summary>
        uint Frame { get; set; }

        /// <summary>
        /// 深拷贝当前输入
        /// </summary>
        IInput DeepCopy();

        /// <summary>
        /// 获取输入的哈希值，用于校验
        /// </summary>
        int GetHash();
    }
}