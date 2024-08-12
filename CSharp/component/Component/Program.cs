using System.Collections;

namespace Component
{
    internal class Program
    {
        static void Test1()
        {
            Program p = new Program();
            IEnumerator itor;
            itor = p.Func();
            itor.MoveNext();
            itor.MoveNext();
            itor.MoveNext();
            itor.MoveNext();
            itor.MoveNext();

            

            //itor = p.Func();
            //itor.MoveNext();
            //itor.MoveNext();
        }

        IEnumerator Func()
        {
            for (int i = 0; i < 3; i++)
            {
                Console.WriteLine("{0}", i);
                yield return Enumerable.Empty<int>();
            }

        }

        static void Main(string[] args)
        {
            Test1();
        }
    }
}
