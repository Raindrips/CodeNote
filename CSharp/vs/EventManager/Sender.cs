using System;
namespace EventManager
{
    public class Sender
    {
        public string name = "Sender";
        public Sender()
        {
            
        }

        public void SendMessage()
        {
            EventManager.instance.Invoke("startEvent", this, 1, 3.14f, "hello");
        }
    }


    class AA
    {
        public AA()
        {
            EventManager.instance.on("startEvent",this.Start);
        }
        private void Start(object sender,params object[] args)
        {
            //Sender s = sender as Sender;
            Console.WriteLine(sender.ToString());
            Console.WriteLine((int)args[0]);
            Console.WriteLine((float)args[1]);
            Console.WriteLine((string)args[2]);
            for (int i = 0; i < args.Length; i++)
            {
                Console.WriteLine(args[i].ToString());
            }
          
            Console.WriteLine("start");
        }
    }
}
