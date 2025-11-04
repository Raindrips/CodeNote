using LeetCode;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace _1578
{
    public class Solution
    {
        public int MinCost(string colors, int[] neededTime)
        {
            int cost = 0;
            int len = neededTime.Length;
            int prev = 0;
            for (int i = 1; i < len; i++)
            {
                if (colors[i] == colors[prev])
                {
                    if (neededTime[i] < neededTime[prev])
                    {
                        cost += neededTime[i];
                    }
                    else
                    {
                        cost += neededTime[prev];
                        prev = i;
                    }
                }
                else
                {
                    prev = i;
                }
            }
            return cost;
        }
    }
    class Test
    {
        private static void T(string colors, int[] neededTime)
        {
            var solution = new Solution();
            Printer.Print(solution.MinCost(colors, neededTime));
        }

        public static void Run()
        {
            Test.T("abaac", [1, 2, 3, 4, 5]);
            Test.T("abc", [1, 2, 3]);
            Test.T("aabaa", [1, 2, 3, 4, 1]);
            Test.T("aabaa", [2, 1, 3, 1, 2]);

        }
    }
}
