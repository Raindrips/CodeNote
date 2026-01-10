using System;
using System.Net;
using System.Threading.Tasks;

namespace FrameSyncGameFramework.Networking.Interfaces
{
    /// <summary>
    /// 网络传输接口
    /// </summary>
    public interface INetworkTransport : IDisposable
    {
        /// <summary>
        /// 是否已连接
        /// </summary>
        bool IsConnected { get; }

        /// <summary>
        /// 本地终结点
        /// </summary>
        IPEndPoint? LocalEndPoint { get; }

        /// <summary>
        /// 远程终结点
        /// </summary>
        IPEndPoint? RemoteEndPoint { get; }

        /// <summary>
        /// 数据接收事件
        /// </summary>
        event EventHandler<DataReceivedEventArgs>? DataReceived;

        /// <summary>
        /// 连接状态变化事件
        /// </summary>
        event EventHandler<ConnectionStateEventArgs>? ConnectionStateChanged;

        /// <summary>
        /// 连接到远程主机
        /// </summary>
        Task<bool> ConnectAsync(IPEndPoint remoteEndPoint);

        /// <summary>
        /// 断开连接
        /// </summary>
        void Disconnect();

        /// <summary>
        /// 发送数据
        /// </summary>
        Task<bool> SendAsync(byte[] data);

        /// <summary>
        /// 发送数据到指定终结点（用于UDP）
        /// </summary>
        Task<bool> SendAsync(byte[] data, IPEndPoint remoteEndPoint);

        /// <summary>
        /// 启动监听（用于服务器）
        /// </summary>
        Task<bool> StartListeningAsync(IPEndPoint localEndPoint);

        /// <summary>
        /// 停止监听
        /// </summary>
        void StopListening();

        /// <summary>
        /// 获取统计信息
        /// </summary>
        NetworkStatistics GetStatistics();
    }

    /// <summary>
    /// 数据接收事件参数
    /// </summary>
    public class DataReceivedEventArgs : EventArgs
    {
        public byte[] Data { get; set; } = Array.Empty<byte>();
        public IPEndPoint? RemoteEndPoint { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }

    /// <summary>
    /// 连接状态事件参数
    /// </summary>
    public class ConnectionStateEventArgs : EventArgs
    {
        public bool IsConnected { get; set; }
        public string? Reason { get; set; }
        public Exception? Exception { get; set; }
    }

    /// <summary>
    /// 网络统计信息
    /// </summary>
    public class NetworkStatistics
    {
        public long BytesSent { get; set; }
        public long BytesReceived { get; set; }
        public int PacketsSent { get; set; }
        public int PacketsReceived { get; set; }
        public int FailedSends { get; set; }
        public int FailedReceives { get; set; }
        public TimeSpan ConnectionDuration { get; set; }
        public double AverageLatency { get; set; }
        public int LatencySamples { get; set; }
    }
}