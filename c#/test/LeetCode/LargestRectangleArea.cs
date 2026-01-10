using LeetCode;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LargestRectangleArea
{
    public class Solution
    {
        public int LargestRectangleArea(int[] heights)
        {
            int n = heights.Length;
            if (n == 0)
            {
                return 0;
            }
            int res = 0;
            for (int i = 0; i < n; i++)
            {
                int right = i;
                while (right + 1 < n && heights[right + 1] >= heights[i])
                {
                    right++;
                }
                int left = i;
                while (left - 1 >= 0 && heights[left - 1] >= heights[i])
                {
                    left--;
                }
                res = Math.Max(res, (right - left + 1) * heights[i]);
            }
            return res;
        }

    }
    class Test
    {
        private static void T(int[] heights)
        {
            var solution = new Solution();
            Printer.Print(solution.LargestRectangleArea(heights));
        }

        public static void Run()
        {

            T([2, 1, 5, 6, 2, 3]);
            T([2, 4]);
        }
    }
}
