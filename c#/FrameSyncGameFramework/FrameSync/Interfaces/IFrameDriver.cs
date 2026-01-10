using FrameSyncGameFramework.Common.Interfaces;

namespace FrameSyncGameFramework.FrameSync.Interfaces
{
    /// <summary>
    /// 帧驱动器接口
    /// </summary>
    public interface IFrameDriver
    {
        /// <summary>
        /// 当前帧号
        /// </summary>
        uint CurrentFrame { get; }

        /// <summary>
        /// 帧率
        /// </summary>
        int FrameRate { get; }

        /// <summary>
        /// 是否正在运行
        /// </summary>
        bool IsRunning { get; }

        /// <summary>
        /// 开始帧循环
        /// </summary>
        void Start();

        /// <summary>
        /// 停止帧循环
        /// </summary>
        void Stop();

        /// <summary>
        /// 更新一帧
        /// </summary>
        void Update();

        /// <summary>
        /// 注册帧更新回调
        /// </summary>
        void RegisterFrameCallback(Action<uint> callback);

        /// <summary>
        /// 注销帧更新回调
        /// </summary>
        void UnregisterFrameCallback(Action<uint> callback);
    }
}