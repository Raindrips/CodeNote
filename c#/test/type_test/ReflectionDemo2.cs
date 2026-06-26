using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Numerics;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace type_test
{
    [AttributeUsage(AttributeTargets.All)]
    public class MyAttribute : Attribute
    {
        public string Name;
        public string Version = "";
        public MyAttribute(string name)
        {
            Name = name;
        }
    }

    // 最小插件标签
    [AttributeUsage(AttributeTargets.Class, Inherited = false)]
    public class PluginAttribute : Attribute
    {
        public string Name { get; }
        public string Version { get; set; } = "1.0";

        public PluginAttribute(string name)
        {
            Name = name;
        }
    }

    [My("Hero", Version = "1.0")]
    public class MyPlayer
    {
        int hp = 0;
        // 标记弃用
        [System.Obsolete]
        void Test()
        {

        }
    }



    [Plugin("GM", Version = "1.0")]
    public class GMPlugin
    {
    }

    [Plugin("AI", Version = "2.1")]
    public class AIPlugin
    {
    }



    public class ReflectionDemo2
    {
        public static void Test1()
        {
            Type type = typeof(MyPlayer);
            MyAttribute attr = type.GetCustomAttribute<MyAttribute>();

            Console.WriteLine((attr.Name));
            Console.WriteLine(attr.Version);
        }

        public static void Test2()
        {
            Type type = typeof(GMPlugin);

            PluginAttribute attr =
                type.GetCustomAttribute<PluginAttribute>();

            Console.WriteLine($"Name = {attr.Name}");
            Console.WriteLine($"Version = {attr.Version}");
        }

        // 查找所有的标签
        public static void Test3()
        {

            // 扫描当前程序集
            // 找到所有带 [Plugin] 的类
            // 输出：
            // Register Plugin: GM (1.0)
            // Register Plugin: AI (2.1)

            Assembly asm = typeof(GMPlugin).Assembly; //获取Assembly对象

            foreach (Type type in asm.GetTypes())
            {
                PluginAttribute attr = type.GetCustomAttribute<PluginAttribute>();

                if (attr != null)
                {
                    Console.WriteLine($"Register Plugin: - {attr.Version} - {type.Name}");
                }
            }

        }
    }


}
