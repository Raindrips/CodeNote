using System;
using System.Collections.Generic;
using System.IO;
using Microsoft.Extensions.Logging;
using FrameSyncGameFramework.Snapshot.Interfaces;

namespace FrameSyncGameFramework.Snapshot.Serializers
{
    /// <summary>
    /// 二进制快照序列化器
    /// </summary>
    public class BinarySnapshotSerializer
    {
        private readonly ILogger<BinarySnapshotSerializer> _logger;

        public BinarySnapshotSerializer(ILogger<BinarySnapshotSerializer>? logger = null)
        {
            _logger = logger ?? Microsoft.Extensions.Logging.Abstractions.NullLogger<BinarySnapshotSerializer>.Instance;
        }

        /// <summary>
        /// 序列化可快照对象到字节数组
        /// </summary>
        public byte[] Serialize(ISnapshotable obj)
        {
            if (obj == null)
                throw new ArgumentNullException(nameof(obj));

            using var stream = new MemoryStream();
            using var writer = new BinaryWriter(stream);
            
            // 写入版本号
            writer.Write(obj.GetSnapshotVersion());
            
            // 序列化对象数据
            obj.Serialize(writer);
            
            var data = stream.ToArray();
            _logger.LogDebug($"Serialized object to {data.Length} bytes, version: {obj.GetSnapshotVersion()}");
            
            return data;
        }

        /// <summary>
        /// 从字节数组反序列化
        /// </summary>
        public T Deserialize<T>(byte[] data) where T : ISnapshotable, new()
        {
            if (data == null || data.Length == 0)
                throw new ArgumentException("Data cannot be null or empty", nameof(data));

            using var stream = new MemoryStream(data);
            using var reader = new BinaryReader(stream);
            
            // 读取版本号
            var version = reader.ReadInt32();
            
            // 创建对象并反序列化
            var obj = new T();
            if (obj.GetSnapshotVersion() != version)
            {
                _logger.LogWarning($"Version mismatch: expected {obj.GetSnapshotVersion()}, got {version}");
            }
            
            obj.Deserialize(reader);
            
            _logger.LogDebug($"Deserialized object from {data.Length} bytes, version: {version}");
            return obj;
        }

        /// <summary>
        /// 序列化对象列表
        /// </summary>
        public byte[] SerializeList<T>(List<T> objects) where T : ISnapshotable
        {
            if (objects == null)
                throw new ArgumentNullException(nameof(objects));

            using var stream = new MemoryStream();
            using var writer = new BinaryWriter(stream);
            
            // 写入对象数量
            writer.Write(objects.Count);
            
            // 序列化每个对象
            foreach (var obj in objects)
            {
                var objData = Serialize(obj);
                writer.Write(objData.Length);
                writer.Write(objData);
            }
            
            var data = stream.ToArray();
            _logger.LogDebug($"Serialized {objects.Count} objects to {data.Length} bytes");
            
            return data;
        }

        /// <summary>
        /// 反序列化对象列表
        /// </summary>
        public List<T> DeserializeList<T>(byte[] data) where T : ISnapshotable, new()
        {
            if (data == null || data.Length == 0)
                throw new ArgumentException("Data cannot be null or empty", nameof(data));

            using var stream = new MemoryStream(data);
            using var reader = new BinaryReader(stream);
            
            var objects = new List<T>();
            
            // 读取对象数量
            var count = reader.ReadInt32();
            
            // 反序列化每个对象
            for (int i = 0; i < count; i++)
            {
                var objDataLength = reader.ReadInt32();
                var objData = reader.ReadBytes(objDataLength);
                var obj = Deserialize<T>(objData);
                objects.Add(obj);
            }
            
            _logger.LogDebug($"Deserialized {objects.Count} objects from {data.Length} bytes");
            return objects;
        }

        /// <summary>
        /// 序列化字典
        /// </summary>
        public byte[] SerializeDictionary<TKey, TValue>(Dictionary<TKey, TValue> dict) 
            where TKey : ISnapshotable 
            where TValue : ISnapshotable
        {
            if (dict == null)
                throw new ArgumentNullException(nameof(dict));

            using var stream = new MemoryStream();
            using var writer = new BinaryWriter(stream);
            
            // 写入字典大小
            writer.Write(dict.Count);
            
            // 序列化每个键值对
            foreach (var kvp in dict)
            {
                var keyData = Serialize(kvp.Key);
                var valueData = Serialize(kvp.Value);
                
                writer.Write(keyData.Length);
                writer.Write(keyData);
                writer.Write(valueData.Length);
                writer.Write(valueData);
            }
            
            var data = stream.ToArray();
            _logger.LogDebug($"Serialized dictionary with {dict.Count} items to {data.Length} bytes");
            
            return data;
        }

        /// <summary>
        /// 反序列化字典
        /// </summary>
        public Dictionary<TKey, TValue> DeserializeDictionary<TKey, TValue>(byte[] data)
            where TKey : ISnapshotable, new()
            where TValue : ISnapshotable, new()
        {
            if (data == null || data.Length == 0)
                throw new ArgumentException("Data cannot be null or empty", nameof(data));

            using var stream = new MemoryStream(data);
            using var reader = new BinaryReader(stream);
            
            var dict = new Dictionary<TKey, TValue>();
            
            // 读取字典大小
            var count = reader.ReadInt32();
            
            // 反序列化每个键值对
            for (int i = 0; i < count; i++)
            {
                var keyDataLength = reader.ReadInt32();
                var keyData = reader.ReadBytes(keyDataLength);
                var key = Deserialize<TKey>(keyData);
                
                var valueDataLength = reader.ReadInt32();
                var valueData = reader.ReadBytes(valueDataLength);
                var value = Deserialize<TValue>(valueData);
                
                dict[key] = value;
            }
            
            _logger.LogDebug($"Deserialized dictionary with {dict.Count} items from {data.Length} bytes");
            return dict;
        }

        /// <summary>
        /// 获取序列化数据的大小估计
        /// </summary>
        public int EstimateSize(ISnapshotable obj)
        {
            if (obj == null)
                return 0;

            try
            {
                var data = Serialize(obj);
                return data.Length;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to estimate object size");
                return 0;
            }
        }
    }
}