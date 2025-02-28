using System;
using DesignPatterns.AbstractFactoryPattern;
using DesignPatterns.BuilderPattern;

namespace DesignPatterns
{
    class Program
    {
        //抽象工厂模式test
        static void Test1()
        {
            AbstractFactory colorFactory= FactoryProducer.GetFactory("Color");
            AbstractFactory shapeFactory = FactoryProducer.GetFactory("Shape");

            IColor color = colorFactory.GetColor("Red");
            IShape shape = shapeFactory.GetShape("Circle");

            color.Fill();
            shape.Draw();
        }

        static void Test2()
        {
            MealBuilder mealBuilder = new MealBuilder();

            Meal vegMeal = mealBuilder.PrepareVegMeal();
            Console.WriteLine("Veg Meal");
            vegMeal.ShowItems();
            Console.WriteLine("Total Cost: " + vegMeal.GetCost());

            Meal nonVegMeal = mealBuilder.PrepareNonVegMeal();
            Console.WriteLine("\n\nNon-Veg Meal");
            nonVegMeal.ShowItems();
            Console.WriteLine("Total Cost: " + nonVegMeal.GetCost());

        }

        private static void Main(string[] args)
        {
            //Test1();
            Test2();
        }
    }
}
