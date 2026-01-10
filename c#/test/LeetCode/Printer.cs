using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace LeetCode
{
    public static class Printer
    {
        public static void Print<T>(T data)
        {

            switch (data)
            {
                case Array array:
                    Console.Write("[");
                    foreach (var item in array)
                    {
                        Console.Write($"{item},");
                    }
                    Console.WriteLine("\b]");
                    break;

                case IDictionary dict:
                    foreach (var key in dict.Keys)
                    {
                        Console.WriteLine($"- {key}: {dict[key]}");
                    }
                    break;

                default:
                    Console.WriteLine(ToPrettyString(data, ""));
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

        public static void PrintDictionary<TKey, TValue>(IDictionary<TKey, TValue> dict)
        {
            foreach (var kvp in dict)
            {
                Console.WriteLine($"- {kvp.Key}: {kvp.Value}");
            }
        }



        public static string ToPrettyString(object? obj, string name = "Root", int indent = 0, HashSet<object>? visited = null)
        {
            var sb = new StringBuilder();
            string indentStr = new(' ', indent * 2);
            if (visited == null) visited = new HashSet<object>(ReferenceEqualityComparer.Instance);

            // Null
            if (obj == null)
            {
                sb.AppendLine($"{indentStr}{name}: null");
                return sb.ToString();
            }

            Type t = obj.GetType();
            string typeName = t.Name;

            // 防止循环引用
            if (!t.IsValueType&&t.Name!="String")
            {
                if (visited.Contains(obj))
                {
                    sb.AppendLine($"{indentStr}{name}: <circular reference to {typeName}>");
                    return sb.ToString();
                }
                visited.Add(obj);
            }
            // 基本类型
            if (obj is string or ValueType)
            {
                sb.AppendLine($"{indentStr}{name}: {obj}");
            }
            // IDictionary
            else if (obj is IDictionary dict)
            {
                sb.AppendLine($"{indentStr}{name} ({typeName}):");
                foreach (DictionaryEntry entry in dict)
                {
                    sb.Append(ToPrettyString(entry.Value, $"[{entry.Key}]", indent + 1, visited));
                }
            }
            // IEnumerable（如 List、Array）
            else if (obj is IEnumerable enumerable)
            {
                // 多维数组特殊处理
                if (t.IsArray && t.GetArrayRank() > 1)
                {
                    Array arr = (Array)obj;
                    int[] indices = new int[t.GetArrayRank()];
                    sb.AppendLine($"{indentStr}{name} ({typeName}):");
                    PrintMultiArray(arr, 0, indices, sb, indent + 1, visited);
                }
                else
                {
                    int i = 0;
                    sb.AppendLine($"{indentStr}{name} ({typeName}):");
                    foreach (var item in enumerable)
                    {
                        sb.Append(ToPrettyString(item, $"[{i++}]", indent + 1, visited));
                    }
                }
            }
            // 对象（反射属性）
            else
            {
                sb.AppendLine($"{indentStr}{name} ({typeName}):");
                foreach (var prop in t.GetProperties(BindingFlags.Public | BindingFlags.Instance))
                {
                    if (!prop.CanRead) continue;
                    object? val = null;
                    try { val = prop.GetValue(obj); } catch { }
                    sb.Append(ToPrettyString(val, prop.Name, indent + 1, visited));
                }

                foreach (var field in t.GetFields(BindingFlags.Public | BindingFlags.Instance))
                {
                    object? val = null;
                    try { val = field.GetValue(obj); } catch { }
                    sb.Append(ToPrettyString(val, field.Name, indent + 1, visited));
                }
            }

            return sb.ToString();
        }

        private static void PrintMultiArray(Array arr, int dim, int[] indices, StringBuilder sb, int indent, HashSet<object> visited)
        {
            string indentStr = new(' ', indent * 2);
            int len = arr.GetLength(dim);
            for (int i = 0; i < len; i++)
            {
                indices[dim] = i;
                if (dim < arr.Rank - 1)
                {
                    PrintMultiArray(arr, dim + 1, indices, sb, indent, visited);
                }
                else
                {
                    var value = arr.GetValue(indices);
                    string indexStr = string.Join(",", indices);
                    sb.Append(ToPrettyString(value, $"[{indexStr}]", indent, visited));
                }
            }
        }

        // 比较器: 按引用比较对象，防止循环引用
        private class ReferenceEqualityComparer : IEqualityComparer<object>
        {
            public static readonly ReferenceEqualityComparer Instance = new();
            public new bool Equals(object? x, object? y) => ReferenceEquals(x, y);
            public int GetHashCode(object obj) => System.Runtime.CompilerServices.RuntimeHelpers.GetHashCode(obj);
        }
    }
}
