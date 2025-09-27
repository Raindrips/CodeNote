using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace _120
{
    public class Solution
    {
        public int MinimumTotal(IList<IList<int>> triangle)
        {
            int n = triangle.Count;
            int[][] f = new int[n][];
            for (int i = 0; i < n; i++)
            {
                f[i] = new int[n];
            }
            f[0][0] = triangle[0][0];

            for (int i = 1; i < n; ++i)
            {
                f[i][0] = f[i - 1][0] + triangle[i][0]; //第1步

                //中间步
                for (int j = 1; j < i; ++j)
                {
                    // 从上面两个路径选择最少的
                    int minStep = Math.Min(f[i - 1][j - 1], f[i - 1][j]);
                    f[i][j] = minStep + triangle[i][j];
                }
                f[i][i] = f[i - 1][i - 1] + triangle[i][i]; //最后一步
            }

            return f[n - 1].Min();
        }
    }

    class Test
    {
        private static void T(IList<IList<int>> triangle)
        {
            var solution = new Solution();
            Console.WriteLine(solution.MinimumTotal(triangle));
        }

        public static void Run()
        {
            Test.T([
                [2],
                [3, 4],
                [6, 5, 7],
                [4, 1, 8, 3]
            ]);
            /**
             * 2
             * 5 6
             * 11 10 13
             * 15 11 18 10
             * 
             * */
            Test.T([[-10]]);
        }
    }
}
