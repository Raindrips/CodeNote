using LeetCode;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace _43
{
    public class Solution
    {
        public string Multiply(string num1, string num2)
        {
            return Mult(num1, num2);
        }

        string Mult(ReadOnlySpan<char> num1, ReadOnlySpan<char> num2)
        {
            if (num1.SequenceEqual("0") || num2.SequenceEqual("0"))
                return "0";

            string ret = "0";
            int m = num1.Length, n = num2.Length;

            for (int i = n - 1; i >= 0; i--)
            {
                StringBuilder ans = new StringBuilder();
                int add = 0;
                for (int j = n - 1; j > i; j--)
                {
                    ans.Append(0);
                }
                int y = num2[i] - '0';
                for (int j = m - 1; j >= 0; j--)
                {
                    int x = num1[j] - '0';
                    int result = x * y + add;
                    ans.Append(result % 10);
                    add = result / 10;
                }
                if (add != 0)
                {
                    ans.Append(add % 10);
                }
                char[] arr = ans.ToString().ToCharArray();
                Array.Reverse(arr);
                ret = AddStrings(ret, arr);
            }


            return ret;
        }

        public string AddStrings(ReadOnlySpan<char> num1, ReadOnlySpan<char> num2)
        {
            int i = num1.Length - 1, j = num2.Length - 1, add = 0;
            StringBuilder ans = new StringBuilder();
            while (i >= 0 || j >= 0 || add != 0)
            {
                int x = i >= 0 ? num1[i] - '0' : 0;
                int y = j >= 0 ? num2[j] - '0' : 0;
                int result = x + y + add;
                ans.Append(result % 10);
                add = result / 10;
                i--;
                j--;
            }
            char[] arr = ans.ToString().ToCharArray();
            Array.Reverse(arr);
            return new string(arr);
        }
    }
    class Test
    {
        private static void T(string num1, string num2)
        {
            var solution = new Solution();
            Printer.Print(solution.Multiply(num1, num2));
        }

        public static void Run()
        {

            T("3", "2");
            T("123", "456");
            T("123", "456");
        }
    }
}
