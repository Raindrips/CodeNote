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
    class Player
    {
        public int hp = 100;
        private float speed = 5;
        public void Print()
        {
            Console.WriteLine($"Player: hp={hp}, speed={speed}");
        }

        public void Jump()
        {
            Console.WriteLine("Jump");
        }

        public void Attack(int damage) {
            Console.WriteLine("Attack");
        }

        public static int count = 0;
    }

    class Character
    {
        public string name = "";
    }

    class Enemy : Character
    {
        public int damage = 10;
    }



    public class ReflectionDemo
    {
        public static void Test()
        {
            Type type = typeof(Player);

            Console.WriteLine(type.Name);
            Console.WriteLine(type.FullName);
            Console.WriteLine(type.Namespace);
            Console.WriteLine(type.BaseType);
            Console.WriteLine(type.IsClass);
            Console.WriteLine(type.IsInterface);
        }

        public static void Test2()
        {
            Character c = new Enemy();
            Type type = c.GetType();
            Print(type);

            Type t2 = typeof(Object);
            Print(t2);


            var t3 = Type.GetType("type_test.Enemy");
            if (t3 != null)
            {
                Print(t3);
            }
        }

        public static void Test3()
        {
            try
            {
                Type type = Type.GetType("type_test.Player");
                object player = Activator.CreateInstance(type);
                if (player != null)
                {
                    var p = (Player)player;
                    p.Print();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }

        }

        public static void Test4()
        {
            Type type = typeof(Player);
            Player player = new Player();

            // 无法获取 private 字段
            FieldInfo[] fields = type.GetFields();
            foreach (var field in fields)
            {
                Console.WriteLine(field.Name);
            }
            Console.WriteLine();
            // 获取所有字段，包括 private 字段
            FieldInfo[] field2 = type.GetFields(
                BindingFlags.Public |
                BindingFlags.NonPublic |
                BindingFlags.Instance);
            foreach (var field in field2)
            {
                Console.WriteLine(field.Name);
            }

            // 获取字段,修改字段
            FieldInfo info =type.GetField("hp");
            int obj = (int)info.GetValue(player);
            Console.WriteLine(obj);
            info.SetValue(player, 999);
            Console.WriteLine(player.hp);

            // 调用函数
            MethodInfo jump = type.GetMethod("Jump");
            jump.Invoke(player, null);
        }

        public static void Test5()
        {
            
        }
        public static void Print(Type type)
        {

            Console.WriteLine(type.Name);
            Console.WriteLine(type.FullName);
            Console.WriteLine(type.BaseType);
            Console.WriteLine();

        }


    }
}
