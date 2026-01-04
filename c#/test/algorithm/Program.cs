namespace algorithm
{
    internal class Program
    {
        static void Test1()
        {
            int[] arr = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
            var index = BinnarySearch.Search(arr, 6);
            Console.WriteLine("index " + index);
        }

        static void Test2()
        {
            var dlist = new DoubleLinkList();
            var dlist2 = new DoubleLinkList();
            int[] li = [1, 2, 3, 4, 5];
            foreach (int i in li)
            {
                dlist.AddLast(i);
            }

            foreach (int i in li)
            {
                dlist2.AddFirst(i);
            }

            Console.WriteLine("dlist:");
            foreach (int f in dlist)
            {
                Console.Write(f + " ");
            }
            Console.WriteLine();

            Console.WriteLine("dlist.Backward:");
            foreach (int f in dlist.Backward())
            {
                Console.Write(f + " ");
            }
            Console.WriteLine();

            while (dlist2.Count > 0)
            {
                dlist2.RemoveLast();
                Console.WriteLine("dlist:");
                foreach (int f in dlist2)
                {
                    Console.Write(f + " ");
                }
                Console.WriteLine();
            }

        }

        static void Test3()
        {
            var cache = new LRUCache<int, string>(3);
            cache.Put(1, "A");
            cache.Put(2, "B");
            cache.Put(3, "C");
            cache.Get(1); // 1 变成最近使用
            cache.Put(4, "D"); // 淘汰 key=2，因为它最久未使用
            cache.Put(5, "E"); // 淘汰 key=3
        }
        static void Main(string[] args)
        {
            Test3();
        }
    }
}
