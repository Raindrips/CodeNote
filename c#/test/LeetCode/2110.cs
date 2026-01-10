using LeetCode;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace _2110
{
    public class Solution
    {
        public long GetDescentPeriods(int[] prices)
        {
            long count = 0;

            int l = 0;
            while (l < prices.Length)
            {
                int r = 1;
                while (l + r < prices.Length && prices[l + r - 1] - prices[l + r] == 1)
                {

                    r++;
                    count += r;
                }
                l += r;
                count++;
            }
            return count;
        }
        public long GetDescentPeriods_back(int[] prices)
        {
            int count = 0;
            for (int i = 0; i < prices.Length; i++)
            {
                int j = 0;
                while (i + j + 1 < prices.Length && prices[i + j] - prices[i + j + 1] == 1)
                {
                    count++;
                    j++;
                }
                count++;
            }
            return count;
        }
    }
    class Test
    {
        private static void T(int[] prices)
        {
            var solution = new Solution();
            Printer.Print(solution.GetDescentPeriods(prices));
        }

        public static void Run()
        {

            T([3, 2, 1, 4]);  //7
            T([8, 6, 7, 7]);  //4
            T([1]);//1
            T([4, 3, 2, 1,]);//10
        }
    }
}
