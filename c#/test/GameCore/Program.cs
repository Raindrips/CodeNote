using GameCore.Config;

void TestConfig()
{
    var config = new DataManager();
    config.Set("key", "value");
    config.Set("a", 1000);

    var a = config.Get("a", 10);
    var b = config.Get<string>("key");

    Console.WriteLine(a + " " + b);
}

void TestEnhancedDynamicStore()
{
    var enhancedDynamicStore = new EnhancedDynamicStore();
    enhancedDynamicStore.Set("key", "value");
    enhancedDynamicStore.Set("a", 1000);
    enhancedDynamicStore.Set("b", Tuple.Create(1, 1.2));

    foreach(var data in enhancedDynamicStore.Entries)
    {
        Console.WriteLine(data.Key + " " + data.Value);
    }
}

//TestConfig();
TestEnhancedDynamicStore();