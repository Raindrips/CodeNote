using LeetCode;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace _64
{
    public class Solution
    {
        public int MinPathSum(int[][] grid)
        {
            int[][] step = grid;
            int m = grid.Length;
            for (int i = 0; i < m; i++)
            {
                for (int j = 0; j < step[i].Length; j++)
                {
                    if (i == 0 && j == 0) continue;
                    if (i == 0)
                    {
                        step[i][j] += step[i][j - 1];
                    }
                    else if (j == 0)
                    {
                        step[i][j] += step[i - 1][j];
                    }
                    else
                    {
                        step[i][j] += Math.Min(step[i - 1][j], step[i][j - 1]);
                    }
                }
            }
            return step[m-1].Last();
        }

        T[]? DeepCopy<T>(T[] source)
        {
            if (source == null) return null;
            var json = JsonSerializer.Serialize(source);
            return JsonSerializer.Deserialize<T[]>(json);
        }
    }

    class Test
    {
        private static void T(int[][] grid)
        {
            var solution = new Solution();
            Printer.Print(solution.MinPathSum(grid));
        }

        public static void Run() 
        {
            /**
             * 1 3 1 
             * 1 5 1
             * 4 2 1
             * */
            Test.T([
               [1,3,1],[1,5,1],[4,2,1]
            ]);
            /**
             * 1 2 3
             * 4 5 6
             * */
            Test.T([[1, 2, 3], [4, 5, 6]]);
        }
    }
}
