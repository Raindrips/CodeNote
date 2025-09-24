using System;
namespace DesignPatterns.AbstractFactoryPattern
{
    public class ColorBlue : IColor
    {
        public void Fill()
        {
            Console.WriteLine("BlueFill");
        }
    }

    public class ColorRed : IColor
    {
        public void Fill()
        {
          Console.WriteLine("BlueFill");
        }
    }
}
