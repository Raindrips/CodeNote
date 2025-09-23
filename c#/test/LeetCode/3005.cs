// See https://aka.ms/new-console-template for more information

using System.Collections;
using System.Diagnostics;

namespace _3005
{
    public class Solution
    {
        public int MaxFrequencyElements(int[] nums)
        {
            //统计每个数字出现的频率
            var hash = new Dictionary<int, int>();
            for (int i = 0; i < nums.Length; i++)
            {
                if (!hash.ContainsKey(nums[i]))
                {
                    hash.Add(nums[i], 1);
                }
                else
                {
                    hash[nums[i]]++;
                }
            }

            // 统计频率出现的次数
            var sortHash = new SortedDictionary<int, int>();
            foreach (var item in hash)
            {
                //Console.WriteLine("{0}:{1}", item.Key, item.Value);
                if (!sortHash.ContainsKey(item.Value))
                {
                    sortHash.Add(item.Value, 1);
                }
                else
                {
                    sortHash[item.Value]++;
                }
            }
            //Console.WriteLine("{0}:{1}", sortHash.Keys.Max() , sortHash[sortHash.Keys.Max()]);
            return sortHash.Keys.Max() * sortHash[sortHash.Keys.Max()];
        }
    }
    class Test
    {
        private static void Fn1(int[] nums)
        {
            var solution = new Solution();
            Console.WriteLine(solution.MaxFrequencyElements(nums));
        }

        public static void Run()
        {
            Test.Fn1([1, 2, 2, 3, 3, 3, 2]);
            Test.Fn1([1, 2, 3, 4, 5]);
            Test.Fn1([1, 2, 2, 3, 1, 4]);
            Test.Fn1([10, 12, 11, 9, 6, 19, 11]);
        }
    }

}

