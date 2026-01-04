using LeetCode;

namespace DailyTemperatures;

class Solution
{
    public int[] DailyTemperatures(int[] temperatures)
    {
        Stack<int> st = new();
        int n = temperatures.Length;
        int[] result = new int[n];

        for (int i = 0; i < n; i++)
        {

            if (i == 0)
            {
                st.Push(i);
                continue;
            }
            while (st.Count > 0 && temperatures[i] > temperatures[st.Peek()])
            {
                int idx = st.Pop();
                result[idx] = i - idx;
            }
            st.Push(i);

        }
        return result;
    }
}
class Test
{
    private static void T(int[] temperatures)
    {
        var solution = new Solution();
        Printer.Print(solution.DailyTemperatures(temperatures));
    }

    public static void Run()
    {

        T([73, 74, 75, 71, 69, 72, 76, 73]);
        T([30, 40, 50, 60]);
        T([30, 60, 90]);
    }
}

