export class SimpleEvent<T> {
    private handlers = new Set<(arg: T) => void>();

    // 添加监听器
    add(handler: (arg: T) => void) {
        this.handlers.add(handler);
    }

    // 移除监听器
    remove(handler: (arg: T) => void) {
        this.handlers.delete(handler);
    }

    // 触发事件
    invoke(arg: T) {
        this.handlers.forEach((h) => h(arg));
    }

    clear() {
        this.handlers.clear();
    }
}

/*(数组版本, 可以重复添加同一个事件, 大量事件时性能较差);*/

// export class SimpleEvent<T> {
//     private handlers: Array<(arg: T) => void> = [];

//     // 添加监听器
//     add(handler: (arg: T) => void) {
//         this.handlers.push(handler);
//     }

//     // 移除监听器
//     remove(handler: (arg: T) => void) {
//         this.handlers = this.handlers.filter((h) => h !== handler);
//     }

//     // 触发事件
//     invoke(arg: T) {
//         this.handlers.forEach((h) => h(arg));
//     }

//     clear() {
//         this.handlers.slice();
//     }
// }
