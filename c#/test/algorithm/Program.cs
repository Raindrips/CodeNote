namespace algorithm
{
    internal class Program
    {
        static void Main(string[] args)
        {
            int[] arr = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
            var index=BinnarySearch.Search(arr, 6);
            Console.WriteLine("index "+index);
        }
    }
}
