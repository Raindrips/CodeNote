using EventTest;


void Test()
{
    Console.WriteLine("Test");
}


void TestEvent()
{
    EventPublisher publisher = new EventPublisher();
    EventSubscriber subscriber = new EventSubscriber();

    publisher.MyEvent += subscriber.OnMyEvent;
    publisher.Emit(124, "hello");

}

void TestEvent2()
{
    // 创建通用事件发布者和订阅者
    UniversalEventPublisher publisher = new UniversalEventPublisher();
    UniversalEventSubscriber subscriber = new UniversalEventSubscriber();

    // 订阅事件
    publisher.UniversalEvent += subscriber.OnUniversalEvent;

    // 订阅事件
    publisher.UniversalEvent += subscriber.OnUniversalEvent;

    // 触发事件
    publisher.RaiseEvent(new MyEventArgs("Hello, World!", 42));
    publisher.RaiseEvent(new AnotherEventArgs("Another message."));

    // 取消订阅
    publisher.UniversalEvent -= subscriber.OnUniversalEvent;

    // 再次触发事件（不会有任何输出，因为已经取消订阅）
    publisher.RaiseEvent(new MyEventArgs("This won't be seen.", 99));
}


void TestEvent3()
{

    var eventBus = new EventBus();

    // 订阅事件
    eventBus.Subscribe<UserCreatedEvent>(e =>
    {
        Console.WriteLine($"[用户服务] 新用户创建: {e.Username}，时间: {e.CreatedAt:HH:mm:ss}");
    });

    eventBus.Subscribe<UserCreatedEvent>(e =>
    {
        Console.WriteLine($"[通知服务] 发送欢迎邮件给: {e.Username}");
    });

    eventBus.Subscribe<OrderPlacedEvent>(e =>
    {
        Console.WriteLine($"[订单服务] 新订单: {e.OrderId}，金额: {e.Amount:C}");
    });

    // 发布事件
    eventBus.Publish(new UserCreatedEvent("Alice"));
    eventBus.Publish(new OrderPlacedEvent("ORD-1001", 99.99m));

    // 输出：
    // [用户服务] 新用户创建: Alice，时间: ...
    // [通知服务] 发送欢迎邮件给: Alice
    // [订单服务] 新订单: ORD-1001，金额: ¥99.99

    // 取消订阅示例
    Action<UserCreatedEvent> welcomeHandler = e =>
    {
        Console.WriteLine($"欢迎 {e.Username}！");
    };

    eventBus.Subscribe(welcomeHandler);
    eventBus.Publish(new UserCreatedEvent("Bob")); // 会触发欢迎

    eventBus.Unsubscribe(welcomeHandler);
    eventBus.Publish(new UserCreatedEvent("Charlie")); // 不会触发欢迎

    Console.WriteLine($"总订阅数: {eventBus.SubscriptionCount}");

}

//TestEvent();
//TestEvent2();
TestEvent3();