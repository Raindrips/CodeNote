using FrameSyncGameFramework.Common.Interfaces;

namespace FrameSyncGameFramework.FrameSync.Interfaces
{
    /// <summary>
    /// 帧输入管理器接口
    /// </summary>
    public interface IFrameInput
    {
        /// <summary>
        /// 添加玩家输入
        /// </summary>
        void AddInput(IInput input);

        /// <summary>
        /// 获取指定帧的所有输入
        /// </summary>
        IInput[] GetInputs(uint frame);

        /// <summary>
        /// 获取指定玩家指定帧的输入
        /// </summary>
        IInput? GetInput(uint frame, byte playerId);

        /// <summary>
        /// 清理指定帧之前的输入数据
        /// </summary>
        void ClearInputsBefore(uint frame);

        /// <summary>
        /// 检查指定帧的所有输入是否都已收集
        /// </summary>
        bool HasAllInputs(uint frame, int playerCount);
    }
}