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

    class EventManager {
        private static _instance: EventManager = null!;
        public static get Instance() {
            if (EventManager._instance == null) {
                EventManager._instance = new EventManager();
            }
            return EventManager._instance;
        }

        // 存储事件类型到处理器集合的映射
        private handlers: Map<string, Set<EventHandler<any>>> = new Map();

        // 注册事件类
        private register<T>(classType: ClassType<T>) {
            if (!classType || !classType.name) return false;

            if (!this.handlers.has(classType.name)) {
                this.handlers.set(classType.name, new Set());
            }
            return true;
        }

        /**
         * 订阅事件
         * @param classType 事件类
         * @param handler 处理器
         */
        on<T>(classType: ClassType<T>, handler: EventHandler<T>): void {
            if (!this.register(classType)) {
                console.error('event class is error');
                return;
            }
            const key = classType.name;

            let set = this.handlers.get(key)!;
            this.handlers.set(key, set);
            set.add(handler as EventHandler<any>);
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
            const set = this.handlers.get(key);
            if (!set || set.size === 0) return;

            let eventInstance: T;
            if (payload instanceof classType) {
                eventInstance = payload as T;
            } else {
                eventInstance = new classType();
                if (payload && typeof payload === 'object') {
                    Object.assign(eventInstance as any, payload);
                }
            }

            // 调用处理器（浅拷贝集合以避免在回调中修改集合导致迭代问题）
            Array.from(set).forEach((h) => {
                try {
                    h(eventInstance);
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

        class MyClass {
            fn(e: InfoEvent) {
                console.log('MyClass', e);
            }
        }

        const myClass: MyClass | undefined = new MyClass();
        /// / @ts-ignore

        EventManager.Instance.on(InfoEvent, (e) => console.log(e.message));

        const handle = myClass.fn.bind(myClass);
        EventManager.Instance.on(InfoEvent, handle);

        // EventManager.Instance.off(InfoEvent, handle);

        const info = new InfoEvent(10, 'hello');
        EventManager.Instance.emit(InfoEvent, info);
        EventManager.Instance.emit(InfoEvent, { id: 0, message: 'world' });
    }
    test();
}
