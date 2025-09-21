using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace algorithm
{
    public class BinnarySearch
    {
        /**
         * 二分查找法
         *
         */
        public static int Search(int[] arr, int target)
        {
            int l = 0;
            int r = arr.Length - 1;

            int m ;
            while (l <= r)
            {
                m = l + (r - l) / 2;
                if (arr[m] == target)
                {
                    return m;
                }
                else if (target<arr[m]  )
                {             
                    r = m - 1;
                }
                else
                {
                    l = m + 1;
                }
            }
            return -1;
        }
    }
}