using System;
namespace DesignPatterns.AbstractFactoryPattern
{
    public class ShapeFactory:AbstractFactory
    {
        public override IColor GetColor(string color)
        {
            throw null;
        }

        public override IShape GetShape(string shape)
        {
            switch (shape)
            {
                case "Circle":
                    return new ShapeCircle();
                case "Rect":
                    return new ShapeRect();
            }
            throw null;
        }

    }

    public class ColorFactory:AbstractFactory
    {

        public override IColor GetColor(string color)
        {
            switch (color)
            {
                case "Blue":
                    return new ColorBlue();
                case "Red":
                    return new ColorRed();
            }
            throw null;
        }

        public override IShape GetShape(string shape)
        {
            throw null;
        }
    }
    
    public class FactoryProducer
    {
        public static AbstractFactory GetFactory(string choice)
        {
            switch (choice)
            {
                case "Shape":
                    return  new ShapeFactory();
                case "Color":
                    return  new ColorFactory();
            }
            return null;
        }
    }
}
