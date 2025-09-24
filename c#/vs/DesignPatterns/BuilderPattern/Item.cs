using System;
namespace DesignPatterns.BuilderPattern
{
    public interface IItem
    {
        public string Name();
        public Pack Packing();
        public float Price();
    }
}
