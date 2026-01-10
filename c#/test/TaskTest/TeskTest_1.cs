using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskTest
{
    internal class TeskTest_1
    {
        public void Run()
        {

        }

        Task<int> ExampleAsync()
        {
            return Task.FromResult(42);
        }

        Task<int> ExampleAsync2()
        {
            Task.Delay(2);
            return Task.FromResult(42);
        }
    }
}
