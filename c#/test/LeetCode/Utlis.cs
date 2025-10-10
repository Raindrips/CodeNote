using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace LeetCode
{
    internal class Utlis
    {
    }

    public static class ArrayUtlis
    {
        public static T[]? DeepCopy<T>(T[] source)
        {
            if (source == null) return null;
            var json = JsonSerializer.Serialize(source);
            return JsonSerializer.Deserialize<T[]>(json);
        }
    }
}
