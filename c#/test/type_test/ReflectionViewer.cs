using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace type_test
{


    public class ReflectionViewer
    {
        public static void Test()
        {
            Type type = typeof(Player);

            Console.WriteLine($"class {type.Name}" +" {");

            Console.WriteLine("Fields:");
            foreach (var f in type.GetFields(
                         BindingFlags.Public |
                         BindingFlags.NonPublic |
                         BindingFlags.Instance))
            {
                Console.WriteLine($"{f.FieldType.Name} {f.Name}");
            }

            Console.WriteLine("Methods:");
            foreach (var m in type.GetMethods(
                         BindingFlags.Public |
                         BindingFlags.Instance |
                         BindingFlags.DeclaredOnly))
            {
                Console.WriteLine($"{m.ReturnType} {m.Name} {StringArgument(m.GetParameters())}");
            }

            Console.WriteLine("Constructors:");
            foreach (var c in type.GetConstructors())
            {
                Console.WriteLine(c);
            }
            Console.WriteLine("}");
        }

        public static string StringArgument(ParameterInfo[]  types )
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("(");
            foreach (var t in types)
            {
                sb.Append(t.ParameterType.Name);
                sb.Append(" ");
                sb.Append(t.Name);
                sb.Append(",");
            }
            sb.Append(")\n");
            return sb.ToString();
        }
    }

   
}
