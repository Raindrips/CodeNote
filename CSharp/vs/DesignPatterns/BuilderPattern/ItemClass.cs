namespace DesignPatterns.BuilderPattern
{
    // 汉堡
    public abstract class Burger: IItem
    {
        public abstract string Name();

        public Pack Packing()
        {
            return new Wrapper();
        }

        public abstract float Price();
    }

    //素食汉堡
    public class VegBurger : Burger
    {
        public override string Name()
        {
            return "Veg Burger";
        }

        public override float Price()
        {
            return 25.0f;
        }
    }

    //鸡肉汉堡
    public class ChickenBurger : Burger
    {
        public override string Name()
        {
            return "Veg Burger";
        }

        public override float Price()
        {
            return 25.0f;
        }
    }

    //冷饮
    public abstract class ColdDrink:IItem
    {
        public abstract string Name();

        public Pack Packing()
        {
            return new Bottle();
        }

        public abstract float Price();
    }

    //披萨
    public class Pepsi : ColdDrink
    {
        public override string Name()
        {
            return "Pepsi";
        }

        public override float Price()
        {
            return 35.0f;
        }
    }

    public class Coke : ColdDrink
    {
        public override string Name()
        {
            return "Coke";
        }

        public override float Price()
        {
            return 35.0f;
        }
    }
}
