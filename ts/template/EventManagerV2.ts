namespace MyEvent2 {
    type ClassType<T> = new (...args: any[]) => T;

    type EventHandler<T> = (event: T) => void;

    const registerSet = new Set<string>();
    /**
     *事件装饰器
     */
    export function RegisterEvent<T>(target: ClassType<T>) {
        if (registerSet.has(target.name)) {
            console.warn(`'event [${target.name}] target is repeat'`);
        }
        registerSet.add(target.name);
    }

    class EventManager {
        //单例
        private static _instance: EventManager = null!;
        public static get Instance() {
            if (EventManager._instance == null) {
                EventManager._instance = new EventManager();
            }
            return EventManager._instance;
        }

        private handlers: Map<string, Map<EventHandler<any>, unknown>> =
            new Map();

        // 注册事件类
        private register<T>(classType: ClassType<T>) {
            if (!classType || !classType.name) return false;

            if (!this.handlers.has(classType.name)) {
                this.handlers.set(classType.name, new Map());
            }
            return true;
        }

        /**
         * 订阅事件
         * @param classType 事件类
         * @param handler 处理器
         */
        on<T>(
            classType: ClassType<T>,
            handler: EventHandler<T>,
            target?: unknown,
        ): void {
            if (!this.register(classType)) {
                console.error('event class is error');
                return;
            }
            const key = classType.name;

            let handle = this.handlers.get(key)!;
            this.handlers.set(key, handle);
            handle.set(handler, target);
        }

        /**
         * 订阅一次性事件
         */
        once<T>(classType: ClassType<T>, handler: EventHandler<T>): void {
            const wrapper = (evt: T) => {
                handler(evt);
                this.off(classType, wrapper as EventHandler<T>);
            };
            this.on(classType, wrapper as EventHandler<T>);
        }

        /**
         * 取消订阅
         */
        off<T>(classType: ClassType<T>, handler: EventHandler<T>): void {
            const key = classType.name;
            const set = this.handlers.get(key);
            if (!set) return;

            set.delete(handler as EventHandler<any>);
            if (set.size === 0) this.handlers.delete(key);
        }

        /**
         *  销毁该事件下全部订阅
         */
        remove<T>(classType: ClassType<T>) {
            const key = classType.name;
            const set = this.handlers.get(key);
            if (!set) return;
            set.clear();
            this.handlers.delete(key);
        }

        /**
         * 发送事件。支持两种调用方式：
         * - emit(EventClass, instance)
         * - emit(EventClass, {arg:value})
         */
        emit<T>(
            classType: ClassType<T>,
            payload?: Required<T> | ClassType<T> | undefined,
        ): void {
            const key = classType.name;
            const handle = this.handlers.get(key);
            if (!handle || handle.size === 0) return;

            let eventObject: T;
            if (payload instanceof classType) {
                eventObject = payload as T;
            } else {
                eventObject = new classType();
                if (payload && typeof payload === 'object') {
                    Object.assign(eventObject as any, payload);
                }
            }
            Array.from(handle).forEach((h) => {
                try {
                    const [call, target] = h;
                    if (target) {
                        call.call(target, eventObject);
                    } else {
                        call(eventObject);
                    }
                } catch (e) {
                    console.error('Event handler error', e);
                }
            });
        }
    }

    function test() {
        //自定义无参事件
        @RegisterEvent
        class MyEvent {
            constructor() {}
        }
        //定义带参事件类型
        @RegisterEvent
        class InfoEvent {
            constructor(public id: number, public message: string) {}
        }

        class MyClass {
            a = 10;
            constructor() {
                EventManager.Instance.on(InfoEvent, this.fn2, this);
            }
            fn(e: InfoEvent) {
                console.log('MyClass fn', e, this.a);
            }

            fn2(e: InfoEvent) {
                console.log('MyClass fn2', e, this.a);
            }
        }

        const myClass: MyClass | undefined = new MyClass();
        const event = EventManager.Instance;
        event.on(MyEvent, () => console.log('My Event'));

        const handle = myClass.fn.bind(myClass);
        event.on(InfoEvent, myClass.fn, myClass);

        // event.off(InfoEvent, myClass.fn);

        const info = new InfoEvent(10, 'hello');
        event.emit(MyEvent);
        event.emit(InfoEvent, info);
        event.emit(InfoEvent, {
            id: 0,
            message: 'world',
        });
    }

    function test2() {
        @RegisterEvent
        class MyEvent {
            constructor() {}
        }
        @RegisterEvent
        class InfoEvent {
            constructor(public id: number, public message: string) {}
        }
        const event = EventManager.Instance;
        // 注册事件
        event.on(MyEvent, () => console.log('My Event'));
        event.on(InfoEvent, (e: InfoEvent) =>
            console.log('Info Event ', e.id, e.message),
        );
        event.emit(MyEvent);
        //传递参数
        event.emit(InfoEvent, new InfoEvent(10, 'hello'));
        // 自动转换
        event.emit(InfoEvent, { id: 10, message: 'world' });
        //类型不对,报错
        // event.emit(InfoEvent, new MyEvent());
        //参数不对,报错
        // event.emit(InfoEvent, { name: 123 });
    }
    // test();
    test2();
}
