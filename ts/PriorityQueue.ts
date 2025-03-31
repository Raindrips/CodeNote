// 队列项接口
interface QueueItem {
    name: string;
    orderPriority: number; // 顺序优先级（越高越优先）
    execPriority: number; // 执行优先级（越高越优先）
    task: () => Promise<void>; // 异步任务
}

// 队列状态枚举
enum QueueState {
    IDLE = 'idle',
    EXECUTING = 'executing',
}

// 事件回调类型
type QueueEventCallback =
    | ((queueName: string) => void) // 开始、进行中、完成
    | ((oldQueue: string, newQueue: string) => void); // 中断

class PriorityQueue {
    private queues: QueueItem[] = [];
    private state: QueueState = QueueState.IDLE;
    private currentQueue: QueueItem | null = null;
    private pendingUpdate: boolean = false;

    // 事件监听器
    private events: {
        onStart: QueueEventCallback[];
        onProcessing: QueueEventCallback[];
        onComplete: QueueEventCallback[];
        onInterrupt: QueueEventCallback[];
    } = {
        onStart: [],
        onProcessing: [],
        onComplete: [],
        onInterrupt: [],
    };

    constructor() {
        this.update = this.update.bind(this);
    }

    // 添加事件监听器
    public on(event: 'start', callback: (queueName: string) => void): void;
    public on(
        event: 'processing',
        callback: (queueName: string) => void,
    ): void;
    public on(
        event: 'complete',
        callback: (queueName: string) => void,
    ): void;
    public on(
        event: 'interrupt',
        callback: (oldQueue: string, newQueue: string) => void,
    ): void;
    public on(event: string, callback: QueueEventCallback): void {
        switch (event) {
            case 'start':
                this.events.onStart.push(callback);
                break;
            case 'processing':
                this.events.onProcessing.push(callback);
                break;
            case 'complete':
                this.events.onComplete.push(callback);
                break;
            case 'interrupt':
                this.events.onInterrupt.push(callback);
                break;
        }
    }

    // 触发事件
    private emit(
        event: 'start' | 'processing' | 'complete',
        queueName: string,
    ): void;
    private emit(
        event: 'interrupt',
        oldQueue: string,
        newQueue: string,
    ): void;
    private emit(event: string, ...args: string[]): void {
        const eventMap = {
            start: this.events.onStart,
            processing: this.events.onProcessing,
            complete: this.events.onComplete,
            interrupt: this.events.onInterrupt,
        };
        const callbacks = eventMap[event as keyof typeof eventMap];
        callbacks.forEach((callback) => {
            if (args.length == 2) {
                callback(args[0], args[1]);
            } else {
                callback(args[0], '');
            }
        });
    }

    // 添加新队列
    public add(
        name: string,
        orderPriority: number,
        execPriority: number,
        task: () => Promise<void>,
    ): void {
        this.queues.push({
            name,
            orderPriority,
            execPriority,
            task,
        });
        this.requestUpdate();
    }

    // 获取当前状态
    public getStatus(): [QueueState, string | null] {
        return [this.state, this.currentQueue?.name ?? null];
    }

    // 请求更新
    private requestUpdate(): void {
        if (!this.pendingUpdate) {
            this.pendingUpdate = true;
            setTimeout(() => {
                this.pendingUpdate = false;
                this.update();
            }, 0);
        }
    }

    // 更新逻辑
    private async update(): Promise<void> {
        // 当前正在执行且有更高优先级队列进入
        if (this.state === QueueState.EXECUTING && this.currentQueue) {
            const highestExec = this.getHighestExecPriority();
            if (
                highestExec &&
                highestExec.execPriority > this.currentQueue.execPriority
            ) {
                this.emit(
                    'interrupt',
                    this.currentQueue.name,
                    highestExec.name,
                );
                this.currentQueue = highestExec;
                this.queues = this.queues.filter((q) => q !== highestExec);
                await this.executeCurrent();
            }
            return;
        }

        // 闲置状态，执行顺序优先级最高的队列
        if (this.state === QueueState.IDLE && this.queues.length > 0) {
            const nextQueue = this.getHighestOrderPriority();
            if (nextQueue) {
                this.currentQueue = nextQueue;
                this.queues = this.queues.filter((q) => q !== nextQueue);
                await this.executeCurrent();
            }
        }
    }

    // 执行当前队列
    private async executeCurrent(): Promise<void> {
        if (!this.currentQueue) return;

        this.state = QueueState.EXECUTING;
        this.emit('start', this.currentQueue.name);

        try {
            this.emit('processing', this.currentQueue.name);
            await this.currentQueue.task();
            this.emit('complete', this.currentQueue.name);
        } catch (error) {
            console.error(
                `Queue ${this.currentQueue.name} failed:`,
                error,
            );
        }

        this.state = QueueState.IDLE;
        this.currentQueue = null;
        this.requestUpdate(); // 检查是否有新队列需要执行
    }

    // 获取最高顺序优先级的队列
    private getHighestOrderPriority(): QueueItem | null {
        return this.queues.reduce(
            (highest, current) =>
                current.orderPriority >
                (highest?.orderPriority ?? -Infinity)
                    ? current
                    : highest,
            null as QueueItem | null,
        );
    }

    // 获取最高执行优先级的队列
    private getHighestExecPriority(): QueueItem | null {
        return this.queues.reduce(
            (highest, current) =>
                current.execPriority > (highest?.execPriority ?? -Infinity)
                    ? current
                    : highest,
            null as QueueItem | null,
        );
    }
}

// 使用示例
async function example() {
    const pq = new PriorityQueue();

    // 添加事件监听
    pq.on('start', (name) => console.log(`Started: ${name}`));
    pq.on('processing', (name) => console.log(`Processing: ${name}`));
    pq.on('complete', (name) => console.log(`Completed: ${name}`));
    pq.on('interrupt', (oldQ, newQ) =>
        console.log(`Interrupted: ${oldQ} -> ${newQ}`),
    );

    // 添加队列
    pq.add('Task1', 1, 1, async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log('Task1 executing');
    });

    pq.add('Task2', 2, 2, async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log('Task2 executing');
    });

    setTimeout(() => {
        pq.add('Task3', 3, 3, async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            console.log('Task3 executing');
        });
    }, 500);
}

example();
