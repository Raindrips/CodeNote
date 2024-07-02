type Func = (...args: any[]) => void

interface Action {
    func: Func,
    context: any,
    args: any[]
}


export class FunctionQueue {
    private actions: Action[] = [];
    private currentIndex: number = 0;

    // 添加一个新的函数到队列
    public add(func: Func, context: unknown=null, ...args: any[]): void {
        this.actions.push({ func, context, args });
    }

    // 获取当前迭代的函数，并将索引指向下一个函数
    // 如果到达末尾，则重置索引并返回第一个函数
    public next(): VoidFunction {
        if (this.actions.length === 0) {
            return this.voidAction;
        }

        const action = this.actions[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.actions.length;
        return action.func.bind(action.context, ...action.args);
    }

    public clear() {
        this.actions.length = 0;
    }

    voidAction = function () {
        console.log('action is null');
    };
}
const queue = new FunctionQueue();
queue.add(() => {
    console.log('hello world')
})

queue.add((i: number) => {
    console.log('i=' + i);
}, null, 100)

queue.add(ABC, { a: 30 })

function ABC(this: unknown) {
    console.log(this)
}

for (let i = 0; i < 6; i++) {
    let action = queue.next();
    action();
}