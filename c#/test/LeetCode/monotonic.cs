using LeetCode;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace monotonic
{
    public class Solution
    {
        public int[] FinalPrices(int[] prices)
        {
            Stack<int> st = new();
            for (int i = 0; i < prices.Length; i++)
            {
                while (st.Count > 0 && prices[i] <= prices[st.Peek()])
                {
                    int idx = st.Pop();
                    prices[idx] = prices[idx] - prices[i];
                }
                st.Push(i);

            }
            return prices;
        }
    }
    class Test
    {
        private static void T(int[] prices)
        {
            var solution = new Solution();
            Printer.Print(solution.FinalPrices(prices));
        }

        public static void Run()
        {

            T([8, 4, 6, 2, 3]);
            T([1, 2, 3, 4, 5]);
            T([10, 1, 1, 6]);
            
        }
    }
}
