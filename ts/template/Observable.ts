// 简易版 Observable 实现
type Listener<T> = (newValue: T) => void;

class Observable<T> {
    private value: T;
    private listeners: Set<Listener<T>> = new Set();

    constructor(initialValue: T) {
        this.value = initialValue;
    }

    get(): T {
        return this.value;
    }

    set(newValue: T) {
        if (this.value === newValue) return;
        this.value = newValue;
        this.notify();
    }

    subscribe(listener: Listener<T>): () => void {
        this.listeners.add(listener);
        // 立即推送当前值
        listener(this.value);

        // 返回取消订阅函数
        return () => {
            this.listeners.delete(listener);
        };
    }

    private notify() {
        this.listeners.forEach((listener) => listener(this.value));
    }
}

(() => {
    function test() {
        const hp = new Observable(100);
        // 绑定 UI 更新
        const unsubscribe = hp.subscribe((value) => {
            console.log('HP changed to', value);
        });

        // 修改数据
        hp.set(80); // 输出: HP changed to 80

        // 解绑监听
        unsubscribe();
    }
    test();
})();
