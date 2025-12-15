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
            return "";
        }

        string Mult(string num1, string num2)
        {

            if (num1 == "0" || num2 == "0")
            {
                return "0";
            }
            return "";
        }

        public string AddStrings(string num1, string num2)
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
        }
    }
}
