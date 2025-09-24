using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace _165
{
    public class Solution
    {
        public int CompareVersion(string version1, string version2)
        {
            string[] result = version1.Split('.');
            string[] result2 = version2.Split('.');

            int maxLen = Math.Max(result.Length, result2.Length);
            for (int i = 0; i < maxLen; i++)
            {
                int v1 = i >= result.Length ? 0 : int.Parse(result[i]);

                int v2 = i >= result2.Length ? 0 : int.Parse(result2[i]);
                if (v1 > v2)
                {
                    return 1;
                }
                else if (v1 < v2)
                {
                    return -1;
                }
            }
            return 0;
        }

        public void Test(string version1, string version2)
        {
            Console.WriteLine(CompareVersion(version1, version2));
        }


    }

    class Test
    {
        public static void Run()
        {
            var solution = new Solution();

            solution.Test("1.2", "1.10");  //-1
            solution.Test("1.01", "1.001");//0
            solution.Test("1.0", "1.0.0.0");//0
            solution.Test("1.0.1", "1.0.2.0");//-1 
            solution.Test("1.2.1", "1.1.6.0");
            solution.Test("1.0.1", "1"); //0
        }
    }
}
