using System.IO;

namespace FrameSyncGameFramework.Snapshot.Interfaces
{
    /// <summary>
    /// 可快照化接口，支持序列化和反序列化
    /// </summary>
    public interface ISnapshotable
    {
        /// <summary>
        /// 序列化到二进制流
        /// </summary>
        void Serialize(BinaryWriter writer);

        /// <summary>
        /// 从二进制流反序列化
        /// </summary>
        void Deserialize(BinaryReader reader);

        /// <summary>
        /// 获取快照版本号
        /// </summary>
        int GetSnapshotVersion();
    }
}