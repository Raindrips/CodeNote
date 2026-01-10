using LeetCode;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace _2211
{
    public class Solution
    {
        public int CountCollisions(string directions)
        {
            int l = 0, r = directions.Length - 1;
            while (l < directions.Length && directions[l] == 'L') l++;
            while (r >= 0 && directions[r] == 'R') r--;

            int res = 0;
            for (int i = l; i <= r; i++)
            {
                if (directions[i] != 'S')
                {
                    res++;
                }
            }
            return res;
        }
    }
    class Test
    {
        private static void T(string directions)
        {
            var solution = new Solution();
            Printer.Print(solution.CountCollisions(directions));
        }

        public static void Run()
        {

            T("RLRSLL");
            T("LLRR");
        }
    }
}
