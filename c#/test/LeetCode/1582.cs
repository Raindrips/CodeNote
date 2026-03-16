using LeetCode;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace _1582
{
    public class Solution
    {
        public int NumSpecial(int[][] mat)
        {
            int n = mat.Length;
            int n2 = mat[0].Length;
            int[] row = new int[n];
            int[] col = new int[n2];

            for (int i = 0; i < n; i++)
            {
                for (int j = 0; j < n2; j++)
                {
                    if (mat[i][j] == 1)
                    {
                        row[i]++;
                        col[j]++;
                    }
                }
            }

            int l = 0;
            for (int i = 0; i < n; i++)
            {
                for (int j = 0; j < n2; j++)
                {
                    if (mat[i][j] == 1 && col[j] == 1 && row[i] == 1)
                    {
                        l++;
                    }
                }
            }
            return l;
        }
    }
    public class Test
    {
        private static void T(int[][] mat)
        {
            var solution = new Solution();
            Printer.Print(solution.NumSpecial(mat));
        }

        public static void Run()
        {

            T([[1, 0, 0], [0, 0, 1], [1, 0, 0]]);  //1
            T([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);  //3

            T([[1, 0, 1], [0, 0, 1], [0, 1, 0]]);  //1

            T([[0, 0], [0, 0], [1, 0]]);  //1
        }
    }
}
