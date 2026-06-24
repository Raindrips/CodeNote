using System;
namespace DesignPatterns.FactoryPattern
{
    public class ShapeFactory
    {
        public ShapeFactory()
        {
            
        }

        public IShape CreatorShap(string shapeName)
        {
            switch (shapeName)
            {
                case "Circle":
                    return new ShapeCircle();
                case "Rect":
                    return new ShapeRect();
            }
            return null;
        }
    }
}
