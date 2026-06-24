using System;
namespace DesignPatterns.FactoryPattern
{
    public class ShapeRect :IShape
    {
        public void draw()
        {
            Console.WriteLine(this.GetType().FullName);
        }
    }

    public class ShapeCircle : IShape
    {
        public void draw()
        {
            Console.WriteLine(GetType().FullName);
        }
    }
}
