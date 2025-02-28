using System;
using System.Collections;
using System.Collections.Generic;

namespace DesignPatterns.BuilderPattern
{
    public class Meal
    {
        private List<IItem> itemArray=new List<IItem>();
        public Meal()
        {

        }

        public void AddItem(IItem item)
        {
            itemArray.Add(item);
        }

        public float GetCost()
        {
            float cost = 0.0f;
            foreach(IItem item in itemArray){
                cost += item.Price();
            }
            return cost;
        }

        public void ShowItems()
        {
            foreach (IItem item in itemArray)
            {
                Console.WriteLine("Item:"+item.Name());
                Console.WriteLine("Packing:" + item.Packing());
                Console.WriteLine("Price:" + item.Price());
                Console.WriteLine();
            }
        }

    }
}
