using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

// 通过检查不同的事件类型来处理不同的事件参数
namespace EventTest
{
    // 定义一个泛型事件参数类
    public class GenericEventArgs : EventArgs
    {
        public object Data { get; set; }

        public GenericEventArgs(object data)
        {
            Data = data;
        }
    }

    // 定义一个通用事件发布者类
    public class UniversalEventPublisher
    {
        // 定义一个通用事件
        public event EventHandler<GenericEventArgs> UniversalEvent;

        // 触发事件的方法
        public void RaiseEvent<T>(T data) where T : EventArgs
        {
            // 创建通用事件参数
            GenericEventArgs args = new GenericEventArgs(data);

            // 触发事件
            UniversalEvent?.Invoke(this, args);
        }
    }


    // 定义一个通用事件订阅者类
    public class UniversalEventSubscriber
    {
        // 通用事件处理方法
        public void OnUniversalEvent(object sender, GenericEventArgs e)
        {
            // 检查事件参数的类型并处理
            if (e.Data is MyEventArgs myArgs)
            {
                Console.WriteLine($"Event received from {sender.GetType().Name}:");
                Console.WriteLine($"Message: {myArgs.Message}");
                Console.WriteLine($"Value: {myArgs.Value}");
            }
            else if (e.Data is AnotherEventArgs anotherArgs)
            {
                Console.WriteLine($"Event received from {sender.GetType().Name}:");
                Console.WriteLine($"AnotherMessage: {anotherArgs.AnotherMessage}");
            }
            else
            {
                Console.WriteLine($"Unknown event type received from {sender.GetType().Name}: {e.Data}");
            }
        }
    }

    // 定义一个自定义事件参数类
    public class MyEventArgs : EventArgs
    {
        public string Message { get; set; }
        public int Value { get; set; }

        public MyEventArgs(string message, int value)
        {
            Message = message;
            Value = value;
        }
    }


    // 定义另一个自定义事件参数类
    public class AnotherEventArgs : EventArgs
    {
        public string AnotherMessage { get; set; }

        public AnotherEventArgs(string anotherMessage)
        {
            AnotherMessage = anotherMessage;
        }
    }
}
