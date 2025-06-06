class ActionQueue {
    private actions: (() => void)[] = [];
    private currentIndex: number = 0;

    // 添加一个新的函数到队列
    public add(action: () => void): void {
        this.actions.push(action);
    }

    // 获取当前迭代的函数，并将索引指向下一个函数
    // 如果到达末尾，则重置索引并返回第一个函数
    public next(): () => void {
        if (this.actions.length === 0) {
            throw new Error("No actions in the queue.");
        }

        const action = this.actions[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.actions.length;
        return action;
    }
}

// 使用示例
const queue = new ActionQueue();

queue.add(() => console.log("Action 1"));
queue.add(() => console.log("Action 2"));
queue.add(() => console.log("Action 3"));

console.log(queue.next()()); // 输出: Action 1
console.log(queue.next()()); // 输出: Action 2
console.log(queue.next()()); // 输出: Action 3
console.log(queue.next()()); // 输出: Action 1 (索引重置)