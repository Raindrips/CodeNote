using LeetCode;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace _1930
{
    public class Solution
    {

        public int CountPalindromicSubsequence(string s)
        {
            HashSet<string> palindromic = new HashSet<string>();
            StringBuilder stringBuilder = new StringBuilder("000");
            for (char c = 'a'; c <= 'z'; c++)
            {
                int l = 0, r = s.Length - 1;
                while (l < s.Length - 1 && s[l] != c)
                {
                    l++;
                }
                while (r >= 0 && s[r] != c)
                {
                    --r;
                }
                if (r - l < 2)
                {
                    continue;
                }
                for (int i = l + 1; i < r; i++)
                {
                    stringBuilder[0] = s[l];
                    stringBuilder[1] = s[i];
                    stringBuilder[2] = s[r];
                    palindromic.Add(stringBuilder.ToString());
                }
            }
            Printer.Print(palindromic);
            return palindromic.Count;
        }
        #region 暴力搜索 已超时
        public int OldCountPalindromicSubsequence(string s)
        {
            HashSet<string> palindromic = new HashSet<string>();
            StringBuilder stringBuilder = new StringBuilder("000");

            //[1]遍历每一个子串
            for (int r = 2; r < s.Length; r++)
            {
                for (int l = 0; l < r - 1; l++)
                {
                    if (s[l] == s[r])
                    {
                        for (int k = l + 1; k < r; k++)
                        {
                            stringBuilder[0] = s[l];
                            stringBuilder[1] = s[k];
                            stringBuilder[2] = s[r];
                            palindromic.Add(stringBuilder.ToString());
                        }
                    }
                }
            }
            return palindromic.Count;
        }
        #endregion

        private bool IsPalindromic(string s)
        {
            int l = 0, r = s.Length - 1;
            while (l <= r)
            {
                if (s[l] != s[r])
                {
                    return false;
                }
                l++;
                r--;
            }
            return true;
        }
    }
    class Test
    {
        private static void T(string s)
        {
            var solution = new Solution();
            Printer.Print(solution.CountPalindromicSubsequence(s));
        }

        public static void Run()
        {

            Test.T("aabca");

            Test.T("adc");

            Test.T("bbcbaba");
        }
    }
}
