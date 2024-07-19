namespace Tasks {
    type Task<F extends (...args: any[]) => any> = {
        func: F;
        context: any;
        args: Parameters<F>;
    };

    class TasksStore {
        private storedFunction?: Task<any>;

        // 存储函数、上下文和参数
        save<F extends (...args: any[]) => any>(
            func: F,
            context: any,
            ...args: Parameters<F>
        ): void {
            this.storedFunction = { func, context, args };
        }

        // 调用存储的函数
        call(): ReturnType<any> | undefined {
            if (!this.storedFunction) {
                throw new Error("No function has been stored.");
            }
            const { func, context, args } = this.storedFunction;
            return func.apply(context, args);
        }
    }

    // 示例用法
    class MyClass {
        sayHello(name: string, greeting: string): string {
            return `${greeting}, ${name}!`;
        }
    }

    function sayHello(name: string, id: number) {
        return `${id}:${name}!`;
    }

    const myInstance = new MyClass();
    const functionStore = new TasksStore();

    // 存储函数、上下文和参数
    functionStore.save(
        myInstance.sayHello,
        myInstance,
        "Alice",
        "Hello"
    );

    // 调用存储的函数
    const result = functionStore.call();
    console.log(result); // 输出: "Hello, Alice!"

    functionStore.save(sayHello, null, "hello", 10);
    const result2 = functionStore.call();
    console.log(result2);
}
