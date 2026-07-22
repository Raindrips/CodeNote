// 泛型事件总线
export class EventEmitter<T extends Record<string, any>> {
    private listeners: {
        [K in keyof T]?: Array<(payload: T[K]) => void>;
    } = {};

    // 注册监听器
    on<K extends keyof T>(
        event: K,
        listener: (payload: T[K]) => void,
    ): void {
        (this.listeners[event] ??= []).push(listener);
    }

    // 移除监听器
    off<K extends keyof T>(
        event: K,
        listener: (payload: T[K]) => void,
    ): void {
        this.listeners[event] = (this.listeners[event] ?? []).filter(
            (l) => l !== listener,
        );
    }

    // 触发事件
    emit<K extends keyof T>(event: K, payload: T[K]): void {
        (this.listeners[event] ?? []).forEach((listener) =>
            listener(payload),
        );
    }

    // 扩展函数,需要则添加
    // 一次性监听器
    once<K extends keyof T>(
        event: K,
        listener: (payload: T[K]) => void,
    ): void {
        const wrapper = (payload: T[K]) => {
            this.off(event, wrapper);
            listener(payload);
        };
        this.on(event, wrapper);
    }

    // 异步触发事件（返回 Promise，等待所有监听器完成）
    async emitAsync<K extends keyof T>(
        event: K,
        payload: T[K],
    ): Promise<void> {
        await Promise.all(
            (this.listeners[event] ?? []).map((listener) =>
                Promise.resolve().then(() => listener(payload)),
            ),
        );
    }
}
