using LeetCode;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace _238
{
    public class Solution
    {
        public int[] ProductExceptSelf(int[] nums)
        {
            int[] result = new int[nums.Length];
            int dot = 1;
            int zeroCount = 0;
            for (int i = 0; i < nums.Length; i++)
            {
                if (nums[i] == 0)
                {
                    zeroCount++;
                    continue;
                }
                dot *= nums[i];
            }
            for (int i = 0; i < nums.Length; i++)
            {
                if (zeroCount >= 2)
                {
                    result[i] = 0;
                    continue;
                }

                if (nums[i] == 0)
                {
                    result[i] = dot;
                }
                else if (zeroCount == 1)
                {
                    result[i] = 0;
                }
                else
                {
                    result[i] = dot / nums[i];
                }
            }
            return result;
        }
    }

    class Test
    {
        private static void T(int[] nums)
        {
            var solution = new Solution();
            Printer.PrintArray(solution.ProductExceptSelf(nums));
        }

        public static void Run()
        {
            Test.T([1, 2, 3, 4]);
            Test.T([-1, 1, 0, -3, 3]);
            Test.T([-1, 0, 0, -3, 3]);

        }
    }

}
