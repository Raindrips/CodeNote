using LeetCode;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Intrinsics.Arm;
using System.Text;
using System.Threading.Tasks;

namespace _10
{
    public class Solution
    {
        public bool IsMatch(string s, string p)
        {
            if (p.Length == 0) return false;
            if (s.Length == 0) return false;

            int[,] dp = new int[s.Length + 1, p.Length + 1];

            dp[0, 0] = 1;
            for (int i = 1; i < dp.GetLength(0); i++)
            {

                for (int j = 1; j < dp.GetLength(1); j++)
                {
                    if (p[j - 1] == '*')
                    {
                        if (dp[i, j - 2] == 1 || (dp[i - 1, j] == 1 && (s[i - 1] == p[j - 2] || p[j - 2] == '.')))
                        {
                            dp[i, j] = 1;
                        }
                    }
                    else
                    {
                        if (dp[i - 1, j - 1] == 1 && (s[i - 1] == p[j - 1] || p[j - 1] == '.'))
                        {
                            dp[i, j] = 1;
                        }
                    }
                }
            }
            return dp[s.Length, p.Length] == 1;
        }

    }
    class Test
    {
        private static void T(string s, string p)
        {
            var solution = new Solution();
            Printer.Print(solution.IsMatch(s, p));
        }

        public static void Run()
        {
            Test.T("aa", "a");  //False
            Test.T("aa", "a*"); //True
            Test.T("ab", ".*"); //True

            Test.T("ab", "ab"); //True
            Test.T("ab", "a."); //True
            Test.T("abc", "a*"); //False

        }
    }
}
