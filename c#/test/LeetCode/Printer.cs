using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LeetCode
{
    public static class Printer
    {
        public static void Print<T>(T data)
        {
            
            switch (data)
            {
                case Array array:
                    foreach (var item in array)
                    {
                        Console.WriteLine($"- {item}");
                    }
                    break;

                case IDictionary dict:
                    foreach (var key in dict.Keys)
                    {
                        Console.WriteLine($"- {key}: {dict[key]}");
                    }
                    break;

                default:
                    Console.WriteLine($"不支持的类型: {typeof(T)}");
                    break;
            }
        }

        public static void PrintArray<T>(T[] array)
        {
            Console.Write("[ ");
            foreach (var item in array)
            {
                Console.Write($"{item}, ");
            }
            Console.WriteLine("]");
        }

        public static void PrintDictionary<TKey, TValue>(Dictionary<TKey, TValue> dict)
        {
            foreach (var kvp in dict)
            {
                Console.WriteLine($"- {kvp.Key}: {kvp.Value}");
            }
        }
    }
}
