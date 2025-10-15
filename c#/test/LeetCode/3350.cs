using LeetCode;

namespace _3350
{
    public class Solution
    {
        public int MaxIncreasingSubarrays(IList<int> nums)
        {
            int count = 1, last = 0, maxCount = 0;
            for (int i = 1; i < nums.Count; i++)
            {
                if (nums[i] > nums[i - 1])
                {
                    count++;
                }
                else
                {
                    last = count;
                    count = 1;
                }
                maxCount = Math.Max(Math.Max(maxCount, Math.Min(count, last)), count / 2);
            }
            return maxCount;
        }

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
        private static void T(IList<int> nums)
        {
            var solution = new Solution();

            Printer.Print(solution.MaxIncreasingSubarrays(nums));
        }

        public static void Run()
        {

            Test.T([1, 2, 3, 4, 4, 4, 4, 5, 6, 7]);  //2
            Test.T([2, 5, 7, 8, 9, 2, 3, 4, 3, 1]);  //3
            Test.T([-15, 19]);  //1
            Test.T([5, 8, -2, -1]);//2
        }
    }
}
