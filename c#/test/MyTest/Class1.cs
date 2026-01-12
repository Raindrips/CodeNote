using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyTest
{
    internal class Class1
    {
        public static void Test()
        {
            var c = new Class1();

            int a1 = 20;
            int b1 =0;
            c.Function(ref a1,out b1);
            Console.WriteLine($"{a1},{b1}");
        }

        void Function(ref int a, out int b)
        {
            a = 1;
            b = 2;
        }
    }
}
