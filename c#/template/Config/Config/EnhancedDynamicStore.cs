using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Xml;
namespace GameCore.Config
{
    /// <summary>
    /// 增强版动态类型存储管理器，提供类型安全的键值存储和扩展功能
    /// </summary>
    public class EnhancedDynamicStore
    {
        private readonly Dictionary<string, (Type Type, object Value)> _store = new Dictionary<string, (Type, object)>();

        /// <summary>
        /// 值变更事件（键名，旧值，新值）
        /// </summary>
        public event Action<string, object, object> ValueChanged;

        /// <summary>
        /// 键被删除事件
        /// </summary>
        public event Action<string, object> KeyDeleted;

        /// <summary>
        /// 设置或更新键值对
        /// </summary>
        public void Set<T>(string key, T value)
        {
            if (string.IsNullOrWhiteSpace(key))
                throw new ArgumentException("Key cannot be null or whitespace", nameof(key));

            object oldValue = null;
            bool exists = _store.TryGetValue(key, out var oldEntry);
            if (exists) oldValue = oldEntry.Value;

            _store[key] = (typeof(T), value);

            // 触发值变更事件
            ValueChanged?.Invoke(key, oldValue, value);
        }

        /// <summary>
        /// 获取指定键的值
        /// </summary>
        public T Get<T>(string key)
        {
            if (!_store.TryGetValue(key, out var entry))
                return default;

            if (entry.Type == typeof(T))
                return (T)entry.Value;

            // 尝试类型转换
            try
            {
                return (T)Convert.ChangeType(entry.Value, typeof(T));
            }
            catch
            {
                return default;
            }
        }

        /// <summary>
        /// 安全获取值（带类型检查）
        /// </summary>
        /// <returns>如果键存在且类型匹配返回true，否则false</returns>
        public bool TryGet<T>(string key, out T value)
        {
            value = default;

            if (!_store.TryGetValue(key, out var entry))
                return false;

            if (entry.Type == typeof(T))
            {
                value = (T)entry.Value;
                return true;
            }

            // 尝试类型转换
            try
            {
                value = (T)Convert.ChangeType(entry.Value, typeof(T));
                return true;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// 检查键是否存在
        /// </summary>
        public bool Has(string key) => _store.ContainsKey(key);

        /// <summary>
        /// 获取键对应的值类型
        /// </summary>
        public Type GetType(string key) =>
            _store.TryGetValue(key, out var entry) ? entry.Type : null;

        /// <summary>
        /// 删除指定键
        /// </summary>
        public bool Delete(string key)
        {
            if (!_store.TryGetValue(key, out var entry))
                return false;

            object value = entry.Value;
            bool removed = _store.Remove(key);

            if (removed)
            {
                KeyDeleted?.Invoke(key, value);
            }

            return removed;
        }

        /// <summary>
        /// 清空所有存储
        /// </summary>
        public void Clear()
        {
            // 触发删除所有键的事件
            var keys = _store.Keys.ToList();
            foreach (string key in keys)
            {
                KeyDeleted?.Invoke(key, _store[key].Value);
            }

            _store.Clear();
        }

        /// <summary>
        /// 获取所有键名
        /// </summary>
        public IEnumerable<string> Keys => _store.Keys;

        /// <summary>
        /// 获取所有键值对
        /// </summary>
        public IEnumerable<KeyValuePair<string, object>> Entries =>
            _store.Select(kvp => new KeyValuePair<string, object>(kvp.Key, kvp.Value.Value));

        /// <summary>
        /// 批量设置键值对
        /// </summary>
        public void SetMultiple(IEnumerable<KeyValuePair<string, object>> items,
                              bool suppressEvents = false)
        {
            if (items == null) return;

            foreach (var item in items)
            {
                // 使用动态类型设置值
                if (suppressEvents)
                {
                    // 直接设置不触发事件
                    _store[item.Key] = (item.Value?.GetType() ?? typeof(object), item.Value);
                }
                else
                {
                    // 使用反射调用泛型方法
                    var method = GetType().GetMethod("Set");
                    var generic = method.MakeGenericMethod(item.Value?.GetType() ?? typeof(object));
                    generic.Invoke(this, new object[] { item.Key, item.Value });
                }
            }
        }

        /// <summary>
        /// 批量设置键值对（类型安全版本）
        /// </summary>
        public void SetMultiple<T>(IEnumerable<KeyValuePair<string, T>> items)
        {
            if (items == null) return;

            foreach (var item in items)
            {
                Set(item.Key, item.Value);
            }
        }

        /// <summary>
        /// 保存存储内容到文件（JSON格式）
        /// </summary>
        public void SaveToFile(string filePath, bool prettyPrint = true)
        {
            // 创建包含类型信息的JSON对象
            var jObject = new JObject();

            foreach (var kvp in _store)
            {
                var entry = new JObject
                {
                    ["type"] = kvp.Value.Type.AssemblyQualifiedName,
                    ["value"] = kvp.Value.Value != null ?
                        JToken.FromObject(kvp.Value.Value) :
                        JValue.CreateNull()
                };

                jObject[kvp.Key] = entry;
            }

            // 写入文件
            File.WriteAllText(filePath, jObject.ToString(prettyPrint ?Newtonsoft.Json. Formatting.Indented : Newtonsoft.Json.Formatting.None));
        }

        /// <summary>
        /// 从文件加载存储内容
        /// </summary>
        public void LoadFromFile(string filePath)
        {
            if (!File.Exists(filePath))
                throw new FileNotFoundException("Storage file not found", filePath);

            string json = File.ReadAllText(filePath);
            var jObject = JObject.Parse(json);

            Clear(); // 清除当前存储

            foreach (var property in jObject.Properties())
            {
                string key = property.Name;
                JObject entry = (JObject)property.Value;

                string typeName = (string)entry["type"];
                JToken valueToken = entry["value"];

                Type valueType = Type.GetType(typeName);
                if (valueType == null)
                {
                    Console.WriteLine($"Skipping key '{key}': Type '{typeName}' not found");
                    continue;
                }

                object value = valueToken.Type == JTokenType.Null ?
                    null :
                    valueToken.ToObject(valueType);

                // 使用反射调用泛型Set方法
                var method = GetType().GetMethod("Set");
                var generic = method.MakeGenericMethod(valueType);
                generic.Invoke(this, new object[] { key, value });
            }
        }
    }
}