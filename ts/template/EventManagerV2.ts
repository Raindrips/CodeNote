namespace MyEvent {
    type ClassType<T> = new (...args: any[]) => T;

    /**
     * 事件处理器类型：接收事件实例
     */
    type EventHandler<T> = (event: T) => void;

    /**
     * 简单事件装饰器（可选，用于注册类名）
     */
    function RegisterEvent<T>(target: any) {}

    class EventManagerV2 {
        private static _instance: EventManagerV2 = null!;
        public static get Instance() {
            if (EventManagerV2._instance == null) {
                EventManagerV2._instance = new EventManagerV2();
            }
            return EventManagerV2._instance;
        }

        // 存储事件类型到处理器集合的映射
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
         * - emit(EventClass, plainObject) -> 会用 new EventClass() 并 Object.assign
         */
        emit<T>(classType: ClassType<T>, payload?: Required<T> | T): void {
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

            // 调用处理器（浅拷贝集合以避免在回调中修改集合导致迭代问题）
            Array.from(handle).forEach((h) => {
                try {
                    const [call, target] = h;
                    console.log(call, target);
                    if (target) {
                        // call(eventObject);
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
        class InfoEvent {
            constructor(public id: number, public message: string) {}
        }

        class MyEvent {
            constructor() {}
        }

        class MyClass {
            a = 10;
            constructor() {
                EventManagerV2.Instance.on(InfoEvent, this.fn2, this);
            }
            fn(e: InfoEvent) {
                console.log('MyClass fn', e, this.a);
            }

            fn2(e: InfoEvent) {
                console.log('MyClass fn2', e, this.a);
            }
        }

        const myClass: MyClass | undefined = new MyClass();
        /// / @ts-ignore

        EventManagerV2.Instance.on(MyEvent, () => console.log('My Event'));

        const handle = myClass.fn.bind(myClass);
        EventManagerV2.Instance.on(InfoEvent, myClass.fn, myClass);

        EventManagerV2.Instance.off(InfoEvent, myClass.fn);

        const info = new InfoEvent(10, 'hello');
        EventManagerV2.Instance.emit(MyEvent);
        EventManagerV2.Instance.emit(InfoEvent, info);
        EventManagerV2.Instance.emit(InfoEvent, {
            id: 0,
            message: 'world',
        });
    }
    test();
}
