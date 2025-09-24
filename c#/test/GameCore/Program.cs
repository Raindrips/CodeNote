using GameCore.Config;

void TestConfig()
{
    var config = new DataManager();
    config.Set("key", "value");
    config.Set("a", 1000);

    var a=config.Get("a", 10);
    var b=config.Get<string>("key");

    Console.WriteLine(a+" "+b);
}

TestConfig();