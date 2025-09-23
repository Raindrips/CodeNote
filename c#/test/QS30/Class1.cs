using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Q1
{
    //编写一个类，能存储多个 Func<int,int> 委托，并实现一个方法，依次执行它们，并返回最终结果。
    public class Class1
    {
        public List<Func<int, int>> list;
        Class1()
        {
            list = new List<Func<int, int>>();
        }

        public void Add(Func<int, int> fn)
        {
            list.Add(fn);
        }


        public List<int> Exec(int val)
        {
            List<int> result = new List<int>();
            foreach (var fn in list)
            {
                result.Add(fn(val));
            }
            return result;
        }

        public static void Run()
        {
            var c1=new Class1();
            var result=Exec(10);
            Console.WriteLine(result);
        }
    }
}
