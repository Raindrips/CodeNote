using System;

namespace EventManager
{

    class Program
    {

        public void Message(object obj,params object[] args)
        {
            Console.WriteLine(obj);
            Console.WriteLine(args);
        }

        static void test1(EventArgs args)
        {
            EventManager eventManager= EventManager.instance;
            Program program = new Program();
            eventManager.on("Message", program.Message);
        }

        static void test2()
        {
            AA aA = new AA();
            Sender sender = new Sender();
            sender.SendMessage();
            sender.SendMessage();
        }

        static void Main(string[] args)
        {
            test2();   
        }
    }
}
