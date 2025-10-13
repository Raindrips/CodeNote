using LeetCode;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace _2273
{
    public class Solution
    {
        public IList<string> RemoveAnagrams(string[] words)
        {
            IList<string> result = new List<string>();
            bool[] flag = new bool[words.Length];

            for (int i = 1; i < words.Length; i++)
            {
                if (IsAnagram(words[i], words[i - 1]))
                {
                    flag[i] = true;
                }
                else
                {
                    flag[i] = false;
                }
            }
            for (int i = 0; i < flag.Length; i++)
            {
                if (!flag[i])
                {
                    result.Add(words[i]);
                }
            }
            return result;
        }

        bool IsAnagram(string a, string b)
        {
            if (a.Length != b.Length) return false;

            int[] count = new int[26];
            foreach (var c in a) count[c - 'a']++;
            foreach (var c in b) count[c - 'a']--;

            return count.All(x => x == 0);
        }
    }

    class Test
    {
        private static void T(string[] words)
        {
            var solution = new Solution();
            Printer.Print(solution.RemoveAnagrams(words));
        }

        public static void Run()
        {
            /**
             * ["abba","cd"]
             * */
            Test.T(["abba", "baba", "bbaa", "cd", "cd"]);
            /**
             * ["a","b","c","d","e"]
             * */
            Test.T(["a", "b", "c", "d", "e"]);
        }
    }
}
