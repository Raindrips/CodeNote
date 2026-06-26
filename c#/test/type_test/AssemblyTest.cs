using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace type_test
{
    public class AssemblyTest
    {
        public static void Test()
        {
            Assembly asm = typeof(Player).Assembly; // 优先推荐 表示 Player 所在程序集
            Assembly ass2 = Assembly.GetExecutingAssembly(); //低优先 当前执行代码所在程序集

            Type[] types = asm.GetTypes(); //获取所有类型
            foreach (Type t in types)
            {
                Console.WriteLine(t.Name);
            }

            // 获取指定的Type
            Type type = asm.GetType("type_test.Player"); //如果没有命名空间直接使用类名即可
            Console.WriteLine(type.Name);

        }

        //Assembly.Load()：按程序集名称或其他重载加载，推荐优先理解这种模型。
        //Assembly.LoadFrom()：按文件路径加载，同时参与程序集解析，传统插件系统常用。
        //Assembly.LoadFile()：按文件路径加载，但几乎不参与程序集解析，一般不建议用于插件系统。

        public static void Test2( )
        {
            // 1. Assembly.Load()
            // 2. Assembly.GetType()
            // 3. Activator.CreateInstance(Type)

            Assembly asm = typeof(Player).Assembly;
            Type type = asm.GetType("type_test.Player");
            object obj = Activator.CreateInstance(type);
            Player player = obj as Player;
            player.Print();

        }
    }

}
