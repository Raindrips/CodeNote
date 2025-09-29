using LeetCode;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace _976
{
    public class Solution
    {
        public int LargestPerimeter(int[] nums)
        {
            Array.Sort(nums);
            int len = nums.Length;
            int i = len - 1, j = 0, k = 0;
            while (i > 1)
            {
                j = i - 1;
                k = i - 2;
                if (nums[i] < nums[j] + nums[k])
                {
                    return nums[i] + nums[j] + nums[k];
                }
                else
                {
                    i--;
                }
            }
            return 0;
        }
    }

    public class Test
    {
        private Test(int[] nums)
        {
            var s = new Solution();
            Console.WriteLine(s.LargestPerimeter(nums));
        }
        public static void Run()
        {

            new Test([2, 1, 2]);
            new Test([1, 2, 1, 10]);
            new Test([7, 5, 3, 2]);

        }
    }
}
