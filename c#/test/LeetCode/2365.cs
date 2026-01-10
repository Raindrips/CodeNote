using LeetCode;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace _2365
{
    public class Solution
    {
        public long TaskSchedulerII(int[] tasks, int space)
        {
            Dictionary<int, long> lastDay = new Dictionary<int, long>();
            long day = 0;
            for (int i = 0; i < tasks.Length; i++)
            {
                int task = tasks[i];
                day++;
                if (lastDay.ContainsKey(task))
                {
                    long availableDay = lastDay[task] + space + 1;
                    if (day < availableDay)
                    {
                        day = availableDay;
                    }
                }
                lastDay[task] = day;
            }
            return day;
        }
    }
    class Test
    {
        private static void T(int[] tasks, int space)
        {
            var solution = new Solution();
            Printer.Print(solution.TaskSchedulerII(tasks, space));
        }

        public static void Run()
        {
            /**
             * 
             * */
            Test.T([1, 2, 1, 2, 3, 1], 3);
            /**
             * 
             * */
            Test.T([5, 8, 8, 5], 2);
        }
    }
}
