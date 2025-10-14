using LeetCode;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace _3349
{
    public class Solution
    {
        public bool HasIncreasingSubarrays(IList<int> nums, int k)
        {
            if (k == 1)
            {
                return true;
            }
            int n = nums.Count;
            for (int i = 0; i < n - (k * 2) + 1; i++)
            {
                bool inc = true;
                for (int j = i + 1; j < i + k; j++)
                {
                    if (nums[j] <= nums[j - 1])
                    {
                        inc = false;
                        break;
                    }
                }
                if (!inc) { continue; }
                for (int j = i + k + 1; j < i + k * 2; j++)
                {
                    if (nums[j] <= nums[j - 1])
                    {
                        inc = false;
                        break;
                    }
                }
                if (inc)
                {
                    return true;
                }
            }
            return false;
        }
    }
    class Test
    {
        private static void T(IList<int> nums, int k)
        {
            var solution = new Solution();

            Printer.Print(solution.HasIncreasingSubarrays(nums, k));
        }

        public static void Run()
        {

            //Test.T([2, 5, 7, 8, 9, 2, 3, 4, 3, 1], 3);
            //Test.T([1, 2, 3, 4, 4, 4, 4, 5, 6, 7], 5);
            //Test.T([-15, 19], 1);

            Test.T([5, 8, -2, -1], 2);
        }
    }
}
