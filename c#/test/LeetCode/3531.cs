using LeetCode;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace _3531
{
    public class Solution
    {
        public int CountCoveredBuildings(int n, int[][] buildings)
        {

            int[] maxX = new int[n];
            int[] minX = new int[n];

            int[] maxY = new int[n];
            int[] minY = new int[n];

            Array.Fill(minX, n);
            Array.Fill(minY, n);

            for (int i = 0; i < buildings.Length; i++)
            {

                int x = buildings[i][0] - 1;
                int y = buildings[i][1] - 1;
                minY[x] = Math.Min(minY[x], y);
                maxY[x] = Math.Max(maxY[x], y);

                minX[y] = Math.Min(minX[y], x);
                maxX[y] = Math.Max(maxX[y], x);

            }
         
            int count = 0;
            for (int i = 0; i < buildings.Length; i++)
            {
                int x = buildings[i][0] - 1;
                int y = buildings[i][1] - 1;
                if (
                        y <= minY[x] || y >= maxY[x] ||
                        x <= minX[y] || x >= maxX[y])
                {
                    continue;
                }
                count++;

            }
            return count;
        }
    }
    class Test
    {
        private static void T(int n, int[][] buildings)
        {
            var solution = new Solution();
            Printer.Print(solution.CountCoveredBuildings(n, buildings));
        }

        public static void Run()
        {
            T(3, [[1, 1], [1, 2], [1, 3], [2, 1], [2, 2], [2, 3], [3, 1], [3, 2], [3, 3],]); // 1
            T(3, [[1, 2], [2, 2], [3, 2], [2, 1], [2, 3]]);//1 
            T(3, [[1, 1], [1, 2], [2, 1], [2, 2]]); //0
            T(5, [[1, 3], [3, 2], [3, 3], [3, 5], [5, 3]]); //1
            T(4, [[2, 4], [1, 2], [3, 1], [1, 4], [2, 3], [3, 3], [2, 2], [1, 3]]);
            T(4, [[4, 4], [2, 4], [3, 4], [2, 1], [4, 3], [4, 1], [3, 1], [1, 1], [1, 4], [4, 2], [2, 2], [3, 2], [1, 3]]);
            T(3, [[1, 2], [3, 1], [1, 1], [2, 3], [2, 2], [3, 2]]); //0
        }
    }
}
