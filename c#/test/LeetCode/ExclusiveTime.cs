using LeetCode;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExclusiveTime
{
    public class Solution
    {
        public int[] ExclusiveTime(int n, IList<string> logs)
        {
            int[] result = new int[n];
            Stack<int> st = new();

            int first;
            string log;
            int second;

            int last = 0;
            for (int i = 0; i < logs.Count; i++)
            {
                TryParse(logs[i].AsSpan(), out first, out log, out second);
                if (log == "start")
                {
                    if (st.Count >= 1)
                    {
                        result[st.Peek()] += second - last;
                    }
                    st.Push(first);
                    last = second;
                }
                else
                {
                    int index = st.Pop();
                    result[index] += second - last + 1;
                    last = second + 1;
                }
            }
            return result;
        }

        private bool TryParse(ReadOnlySpan<char> input,
                                 out int first,
                                 out string log,
                                 out int second)
        {
            first = second = 0;
            log = string.Empty;

            int idx1 = input.IndexOf(':');
            if (idx1 <= 0) return false;
            if (!int.TryParse(input.Slice(0, idx1), out first))
                return false;

            int idx2 = input.LastIndexOf(':');
            if (idx2 < 0 || idx2 == idx1 + 1) return false;
            if (!int.TryParse(input.Slice(idx2 + 1), out second))
                return false;

            log = input.Slice(idx1 + 1, idx2 - idx1 - 1).ToString();
            return true;
        }
    }
    class Test
    {
        private static void T(int n, IList<string> logs)
        {
            var solution = new Solution();
            Printer.Print(solution.ExclusiveTime(n, logs));
        }

        public static void Run()
        {

            T(2, ["0:start:0", "1:start:2", "1:end:5", "0:end:6"]);
            T(1, ["0:start:0", "0:start:2", "0:end:5", "0:start:6", "0:end:6", "0:end:7"]);
            T(2, ["0:start:0", "0:start:2", "0:end:5", "1:start:6", "1:end:6", "0:end:7"]);
        }
    }
}
