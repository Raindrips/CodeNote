using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Logging;
using FrameSyncGameFramework.Snapshot.Interfaces;

namespace FrameSyncGameFramework.Snapshot.Serializers
{
    /// <summary>
    /// JSON快照序列化器
    /// </summary>
    public class JsonSnapshotSerializer
    {
        private readonly JsonSerializerOptions _options;
        private readonly ILogger<JsonSnapshotSerializer> _logger;

        public JsonSnapshotSerializer(ILogger<JsonSnapshotSerializer>? logger = null)
        {
            _logger = logger ?? Microsoft.Extensions.Logging.Abstractions.NullLogger<JsonSnapshotSerializer>.Instance;
            
            _options = new JsonSerializerOptions
            {
                WriteIndented = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
                Converters =
                {
                    new JsonStringEnumConverter()
                }
            };
        }

        /// <summary>
        /// 序列化对象到JSON字符串
        /// </summary>
        public string SerializeToString<T>(T obj) where T : ISnapshotable
        {
            if (obj == null)
                throw new ArgumentNullException(nameof(obj));

            try
            {
                var json = JsonSerializer.Serialize(obj, _options);
                _logger.LogDebug($"Serialized object to JSON string, length: {json.Length}");
                return json;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to serialize object to JSON");
                throw;
            }
        }

        /// <summary>
        /// 从JSON字符串反序列化
        /// </summary>
        public T DeserializeFromString<T>(string json) where T : ISnapshotable, new()
        {
            if (string.IsNullOrEmpty(json))
                throw new ArgumentException("JSON string cannot be null or empty", nameof(json));

            try
            {
                var obj = JsonSerializer.Deserialize<T>(json, _options);
                if (obj == null)
                    throw new InvalidOperationException("Deserialized object is null");

                _logger.LogDebug($"Deserialized object from JSON string, length: {json.Length}");
                return obj;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to deserialize object from JSON");
                throw;
            }
        }

        /// <summary>
        /// 序列化对象到JSON文件
        /// </summary>
        public void SerializeToFile<T>(string filePath, T obj) where T : ISnapshotable
        {
            if (string.IsNullOrEmpty(filePath))
                throw new ArgumentException("File path cannot be null or empty", nameof(filePath));

            if (obj == null)
                throw new ArgumentNullException(nameof(obj));

            try
            {
                var directory = Path.GetDirectoryName(filePath);
                if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }

                var json = SerializeToString(obj);
                File.WriteAllText(filePath, json);
                
                _logger.LogInformation($"Serialized object to JSON file: {filePath}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to serialize object to file: {filePath}");
                throw;
            }
        }

        /// <summary>
        /// 从JSON文件反序列化
        /// </summary>
        public T DeserializeFromFile<T>(string filePath) where T : ISnapshotable, new()
        {
            if (string.IsNullOrEmpty(filePath))
                throw new ArgumentException("File path cannot be null or empty", nameof(filePath));

            if (!File.Exists(filePath))
                throw new FileNotFoundException($"JSON file not found: {filePath}");

            try
            {
                var json = File.ReadAllText(filePath);
                var obj = DeserializeFromString<T>(json);
                
                _logger.LogInformation($"Deserialized object from JSON file: {filePath}");
                return obj;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to deserialize object from file: {filePath}");
                throw;
            }
        }

        /// <summary>
        /// 序列化对象列表到JSON字符串
        /// </summary>
        public string SerializeListToString<T>(List<T> objects) where T : ISnapshotable
        {
            if (objects == null)
                throw new ArgumentNullException(nameof(objects));

            try
            {
                var json = JsonSerializer.Serialize(objects, _options);
                _logger.LogDebug($"Serialized {objects.Count} objects to JSON string, length: {json.Length}");
                return json;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to serialize object list to JSON");
                throw;
            }
        }

        /// <summary>
        /// 从JSON字符串反序列化对象列表
        /// </summary>
        public List<T> DeserializeListFromString<T>(string json) where T : ISnapshotable, new()
        {
            if (string.IsNullOrEmpty(json))
                throw new ArgumentException("JSON string cannot be null or empty", nameof(json));

            try
            {
                var objects = JsonSerializer.Deserialize<List<T>>(json, _options);
                if (objects == null)
                    throw new InvalidOperationException("Deserialized list is null");

                _logger.LogDebug($"Deserialized {objects.Count} objects from JSON string, length: {json.Length}");
                return objects;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to deserialize object list from JSON");
                throw;
            }
        }

        /// <summary>
        /// 序列化字典到JSON字符串
        /// </summary>
        public string SerializeDictionaryToString<TKey, TValue>(Dictionary<TKey, TValue> dict)
            where TKey : ISnapshotable
            where TValue : ISnapshotable
        {
            if (dict == null)
                throw new ArgumentNullException(nameof(dict));

            try
            {
                var json = JsonSerializer.Serialize(dict, _options);
                _logger.LogDebug($"Serialized dictionary with {dict.Count} items to JSON string, length: {json.Length}");
                return json;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to serialize dictionary to JSON");
                throw;
            }
        }

        /// <summary>
        /// 从JSON字符串反序列化字典
        /// </summary>
        public Dictionary<TKey, TValue> DeserializeDictionaryFromString<TKey, TValue>(string json)
            where TKey : ISnapshotable, new()
            where TValue : ISnapshotable, new()
        {
            if (string.IsNullOrEmpty(json))
                throw new ArgumentException("JSON string cannot be null or empty", nameof(json));

            try
            {
                var dict = JsonSerializer.Deserialize<Dictionary<TKey, TValue>>(json, _options);
                if (dict == null)
                    throw new InvalidOperationException("Deserialized dictionary is null");

                _logger.LogDebug($"Deserialized dictionary with {dict.Count} items from JSON string, length: {json.Length}");
                return dict;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to deserialize dictionary from JSON");
                throw;
            }
        }

        /// <summary>
        /// 压缩JSON字符串
        /// </summary>
        public string CompressJson(string json)
        {
            if (string.IsNullOrEmpty(json))
                return json;

            try
            {
                // 移除不必要的空白字符
                using var document = JsonDocument.Parse(json);
                var compressed = JsonSerializer.Serialize(document.RootElement, new JsonSerializerOptions 
                { 
                    WriteIndented = false 
                });
                
                _logger.LogDebug($"Compressed JSON from {json.Length} to {compressed.Length} bytes");
                return compressed;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to compress JSON, returning original");
                return json;
            }
        }

        /// <summary>
        /// 格式化JSON字符串
        /// </summary>
        public string FormatJson(string json)
        {
            if (string.IsNullOrEmpty(json))
                return json;

            try
            {
                using var document = JsonDocument.Parse(json);
                var formatted = JsonSerializer.Serialize(document.RootElement, _options);
                
                _logger.LogDebug($"Formatted JSON string");
                return formatted;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to format JSON, returning original");
                return json;
            }
        }

        /// <summary>
        /// 验证JSON格式
        /// </summary>
        public bool ValidateJson(string json)
        {
            if (string.IsNullOrEmpty(json))
                return false;

            try
            {
                using var document = JsonDocument.Parse(json);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "JSON validation failed");
                return false;
            }
        }

        /// <summary>
        /// 获取JSON统计信息
        /// </summary>
        public (int Length, int ObjectCount, int PropertyCount) GetJsonStats(string json)
        {
            if (string.IsNullOrEmpty(json))
                return (0, 0, 0);

            try
            {
                using var document = JsonDocument.Parse(json);
                var stats = AnalyzeJsonElement(document.RootElement);
                return (json.Length, stats.ObjectCount, stats.PropertyCount);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to get JSON stats");
                return (json.Length, 0, 0);
            }
        }

        private (int ObjectCount, int PropertyCount) AnalyzeJsonElement(JsonElement element)
        {
            int objectCount = 0;
            int propertyCount = 0;

            switch (element.ValueKind)
            {
                case JsonValueKind.Object:
                    objectCount++;
                    foreach (var property in element.EnumerateObject())
                    {
                        propertyCount++;
                        var childStats = AnalyzeJsonElement(property.Value);
                        objectCount += childStats.ObjectCount;
                        propertyCount += childStats.PropertyCount;
                    }
                    break;
                
                case JsonValueKind.Array:
                    foreach (var item in element.EnumerateArray())
                    {
                        var childStats = AnalyzeJsonElement(item);
                        objectCount += childStats.ObjectCount;
                        propertyCount += childStats.PropertyCount;
                    }
                    break;
            }

            return (objectCount, propertyCount);
        }
    }
}