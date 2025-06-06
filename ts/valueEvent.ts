(() => {
    // 有bug
    // 简单事件系统
    class EventEmitter {
        private listeners: { [key: string]: Function[] } = {};
        on(event: string, listener: Function) {
            if (!this.listeners[event]) this.listeners[event] = [];
            this.listeners[event].push(listener);
        }
        emit(event: string, ...args: any[]) {
            if (this.listeners[event]) {
                for (const fn of this.listeners[event]) fn(...args);
            }
        }
    }

    // 装饰器：自动为每个属性生成 getter/setter，并在 set 时发送事件
    function AutoAccessor<T extends { new (...args: any[]): {} }>(
        theClass: T,
    ) {
        return class extends theClass {
            static __emitter = new EventEmitter();
            constructor(...args: any[]) {
                super(...args);
                const keys = Object.getOwnPropertyNames(this);
                for (const key of keys) {
                    let value = (this as any)[key];
                    Object.defineProperty(this, key, {
                        get() {
                            return value;
                        },
                        set(newVal) {
                            value = newVal;
                            (theClass as any).__emitter.emit(
                                `${key}_changed`,
                                newVal,
                            );
                        },
                        enumerable: true,
                        configurable: true,
                    });
                }
                // 更推荐的写法
                // const entries = Object.entries(this);
                // for (const [key, initValue] of entries) {
                //     let value = initValue;
                //     Object.defineProperty(this, key, {
                //         get() {
                //             console.log('get', value);
                //             return value;
                //         },
                //         set(newVal) {
                //             value = newVal;
                //             (constructor as any).__emitter.emit(
                //                 `${key}_changed`,
                //                 newVal,
                //             );
                //         },
                //         enumerable: true,
                //         configurable: true,
                //     });
                // }
            }
            static on(event: string, listener: Function) {
                this.__emitter.on(event, listener);
            }
        };
    }

    @AutoAccessor
    class AA {
        a = 1;
        b = 2;
    }

    // 示例：监听属性变化
    (AA as any).on('a_changed', (val: any) => {
        console.log('a changed to', val);
    });

    const aa = new AA();
    aa.a = 42; // 控制台会输出 'a changed to 42'

    // let v = aa.a;
})();
