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
        static void Main(string[] args)
        {
            Test2();
        }
    }
}
