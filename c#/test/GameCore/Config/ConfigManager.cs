using System;
using System.Collections.Generic;

namespace GameCore.Config
{


    public class DataManager
    {
        private readonly Dictionary<string, object> _dataDict = new Dictionary<string, object>();

        /// <summary>
        /// 存储指定类型的数据
        /// </summary>

        public void Set<T>(string key, T value)
        {
            _dataDict[key] = value;
        }

        /// <summary>
        /// 获取指定类型的数据，如果键不存在或类型不匹配，则返回默认值
        /// </summary>
        /// <returns>获取到的值或默认值</returns>
        public T Get<T>(string key, T defaultValue = default)
        {

            if (_dataDict.TryGetValue(key, out object value))
            {
                if (value is T typedValue)
                {
                    return typedValue;
                }
                else
                {
                    // 类型不匹配，可以抛出异常或返回默认值
                    // 这里选择返回默认值，也可以改为抛出异常
                    // throw new InvalidCastException($"类型不匹配: 期望 {typeof(T)}, 实际 {value.GetType()}");
                    return defaultValue;
                }
            }

            // 键不存在，返回默认值
            return defaultValue;
        }

        /// <summary>
        /// 获取指定类型的数据，如果键不存在或类型不匹配则抛出异常
        /// </summary>
        /// <typeparam name="T">期望的数据类型</typeparam>
        /// <param name="key">键</param>
        /// <returns>获取到的值</returns>
        /// <exception cref="KeyNotFoundException">键不存在</exception>
        /// <exception cref="InvalidCastException">类型不匹配</exception>
        public T GetRequired<T>(string key)
        {
            if (key == null) throw new ArgumentNullException(nameof(key));

            if (_dataDict.TryGetValue(key, out object value))
            {
                if (value is T typedValue)
                {
                    return typedValue;
                }
                else
                {
                    throw new InvalidCastException($"类型不匹配: 期望 {typeof(T)}, 实际 {value.GetType()}");
                }
            }

            throw new KeyNotFoundException($"键 '{key}' 不存在。");
        }

        /// <summary>
        /// 检查是否包含指定键
        /// </summary>
        /// <param name="key">键</param>
        /// <returns>是否存在</returns>
        public bool Has(string key)
        {
            return _dataDict.ContainsKey(key);
        }

        /// <summary>
        /// 移除指定键
        /// </summary>
        /// <param name="key">键</param>
        /// <returns>是否成功移除</returns>
        public bool Remove(string key)
        {
            return _dataDict.Remove(key);
        }
    }


}