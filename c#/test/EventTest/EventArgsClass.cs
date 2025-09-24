using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EventTest
{
    public class EventArgsClass : EventArgs
    {
        public int Number { get; set; }
        public string Message { get; set; }

        public EventArgsClass(int number, string message)
        {
            Number = number;
            Message = message;
        }
    }
}
