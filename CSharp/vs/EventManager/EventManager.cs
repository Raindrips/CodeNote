using System;
using System.Collections;
using System.Collections.Generic;




namespace EventManager
{
    //创建委托函数
    public delegate void EventMessage(object sender,params object[] values);

    //创建事件类
    public class EventTarget
    {
        public event EventMessage eventMessage;

        public void Invoke(object sender, params object[] values)
        {
            eventMessage.Invoke(sender,values);
        }
    }


    public class EventManager
    {
        private static Dictionary<string, EventTarget> dict = new Dictionary<string, EventTarget>();
     

        private static EventManager _instance;

        public static EventManager instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = new EventManager();
                }
                return _instance;
            }
        }

        public void on(string eventName, EventMessage message)
        {
            //如果不存在则添加
            if (!dict.ContainsKey(eventName))
            {
                dict.Add(eventName, new EventTarget());
            }
            // 添加关注的事件
            dict[eventName].eventMessage += message;
        }

        public void off(string eventName,EventMessage message)
        {
            if (!dict.ContainsKey(eventName))
            {
                return;
            }
            dict[eventName].eventMessage -= message;
        }

        // 通知事件
        public void Invoke(string eventName,object sender, params object[] values)
        {
            if (dict.ContainsKey(eventName))
            {
                dict[eventName].Invoke(sender, values);
            }
        }


        private EventManager()
        {

        }
    }
}
