using System;
namespace DesignPatterns.AbstractFactoryPattern
{
    public class ShapeRect :IShape
    {
        public void Draw()
        {
            Console.WriteLine(this.GetType().FullName);
        }
    }

    public class ShapeCircle : IShape
    {
        public void Draw()
        {
            Console.WriteLine(GetType().FullName);
        }
    }
}
