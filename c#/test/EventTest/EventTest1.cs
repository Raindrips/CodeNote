using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace EventTest
{
    public class EventPublisher
    {
        public event EventHandler<EventArgsClass> MyEvent;

        public void On()
        {

        }

        public void Emit(int number, string message)
        {
            // 创建事件参数
            EventArgsClass args = new EventArgsClass(number, message);

            // 触发事件
            MyEvent?.Invoke(this, args);
        }
    }


    public class EventSubscriber
    {
        public void OnMyEvent(object sender, EventArgsClass e)
        {
            Console.WriteLine($"Event received from {sender.GetType().Name}:");
            Console.WriteLine($"Message: {e.Number}");
            Console.WriteLine($"Value: {e.Message}");
        }
    }
}
