using System;
using System.Collections.Generic;
using System.Linq;

namespace EventTest
{
    /// <summary>
    /// 通用事件管理器（事件总线），支持任意事件类型。
    /// </summary>
    public class EventBus
    {
        // 存储每个事件类型对应的处理函数列表
        private readonly Dictionary<Type, List<Delegate>> _handlers = new Dictionary<Type, List<Delegate>>();

        private readonly object _lock = new object();

        /// <summary>
        /// 订阅一个事件。
        /// </summary>
        /// <typeparam name="T">事件类型</typeparam>
        /// <param name="handler">事件处理函数 (Action<T>)</param>
        public void Subscribe<T>(Action<T> handler)
        {
            if (handler == null) throw new ArgumentNullException(nameof(handler));

            lock (_lock)
            {
                var eventType = typeof(T);
                if (!_handlers.TryGetValue(eventType, out var handlers))
                {
                    handlers = new List<Delegate>();
                    _handlers[eventType] = handlers;
                }

                handlers.Add(handler);
            }
        }

        /// <summary>
        /// 取消订阅一个事件。
        /// </summary>
        /// <typeparam name="T">事件类型</typeparam>
        /// <param name="handler">要移除的处理函数</param>
        public void Unsubscribe<T>(Action<T> handler)
        {
            if (handler == null) throw new ArgumentNullException(nameof(handler));

            lock (_lock)
            {
                var eventType = typeof(T);
                if (_handlers.TryGetValue(eventType, out var handlers))
                {
                    handlers.Remove(handler);

                    // 清理空列表
                    if (handlers.Count == 0)
                    {
                        _handlers.Remove(eventType);
                    }
                }
            }
        }

        /// <summary>
        /// 发布一个事件，通知所有订阅者。
        /// </summary>
        /// <typeparam name="T">事件类型</typeparam>
        /// <param name="eventData">事件数据</param>
        public void Publish<T>(T eventData)
        {
            if (eventData == null) throw new ArgumentNullException(nameof(eventData));

            List<Delegate> handlersCopy;
            lock (_lock)
            {
                if (!_handlers.TryGetValue(typeof(T), out var handlers) || handlers.Count == 0)
                {
                    return; // 没有订阅者
                }

                // 创建副本以避免在遍历时被修改（线程安全）
                handlersCopy = new List<Delegate>(handlers);
            }

            // 通知所有订阅者
            foreach (var handler in handlersCopy)
            {
                try
                {
                    ((Action<T>)handler)(eventData);
                }
                catch (Exception ex)
                {
                    // 可以记录日志或使用错误处理策略
                    Console.WriteLine($"事件处理异常: {ex.Message}");
                }
            }
        }

        /// <summary>
        /// 清除所有订阅（可选，用于重置）
        /// </summary>
        public void ClearAll()
        {
            lock (_lock)
            {
                _handlers.Clear();
            }
        }

        /// <summary>
        /// 获取当前订阅的事件类型数量
        /// </summary>
        public int SubscriptionCount => _handlers.Sum(kvp => kvp.Value.Count);
    }


    // 1. 测试示例1
    public class UserCreatedEvent
    {
        public string Username { get; }
        public DateTime CreatedAt { get; }

        public UserCreatedEvent(string username)
        {
            Username = username;
            CreatedAt = DateTime.Now;
        }
    }

    //测试示例2
    public class OrderPlacedEvent
    {
        public string OrderId { get; }
        public decimal Amount { get; }

        public OrderPlacedEvent(string orderId, decimal amount)
        {
            OrderId = orderId;
            Amount = amount;
        }
    }
}