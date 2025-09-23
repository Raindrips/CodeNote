using System;
namespace DesignPatterns.BuilderPattern
{
    //包装器
    public class Wrapper :Pack
    {
        public string Packing()
        {
            return "Wapper";
        }
    }

    //瓶子
    public class Bottle : Pack
    { 
        public string Packing()
        {
            return "Bottle";
        }
    }
}
