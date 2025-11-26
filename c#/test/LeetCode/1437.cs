using LeetCode;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace _1437
{
    public class Solution
    {
        public bool KLengthApart(int[] nums, int k)
        {
            int distance = 0;
            bool isStart = false;
            for (int i = 0; i < nums.Length; i++)
            {
                if (nums[i] == 1)
                {
                    if (isStart && distance < k)
                    {
                        return false;
                    }
                    isStart = true;
                    distance = 0;
                }
                else
                {
                    distance++;
                }

            }
            return true;
        }
    }
    class Test
    {
        private static void T(int[] nums, int k)
        {
            var solution = new Solution();
            Printer.Print(solution.KLengthApart(nums, k));
        }

        public static void Run()
        {
            /**
             * 
             * */
            Test.T([1, 0, 0, 0, 1, 0, 0, 1],2);
            /**
             * 
             * */
            Test.T([1, 0, 0, 1, 0, 1],2);
        }
    }
}
