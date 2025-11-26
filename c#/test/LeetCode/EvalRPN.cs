using LeetCode;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EvalRPN
{
    public class Solution
    {

        public int EvalRPN(string[] tokens)
        {
            Stack<int> stack = new Stack<int>();
            for (int i = 0; i < tokens.Length; i++)
            {

                if (IsOperator(tokens[i]))
                {
                    string op = tokens[i];
                    int a = stack.Pop();
                    int b = stack.Pop();
                    int res = Eval(b, a, op);
                    stack.Push(res);
                }
                else
                {
                    stack.Push(int.Parse(tokens[i]));
                }
            }

            return stack.Peek();
        }
        private bool IsOperator(string token)
        {
            return token == "+" || token == "-" || token == "*" || token == "/";
        }
        private int Eval(int a, int b, string op)
        {
            switch (op)
            {
                case "+":
                    return a + b;
                case "-":
                    return a - b;
                case "*":
                    return a * b;
                case "/":
                    return a / b;
                default:
                    return a + b;
            }
        }
    }
    class Test
    {
        private static void T(string[] tokens)
        {
            var solution = new Solution();
            Printer.Print(solution.EvalRPN(tokens));
        }

        public static void Run()
        {

            T(["2", "1", "+", "3", "*"]);
            T(["4", "13", "5", "/", "+"]);
            T(["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]);
        }
    }
}
