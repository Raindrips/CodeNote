class PromiseQueue {
    private queue: (() => Promise<any>)[] = [];
    private current: number = 0;
    private paused: boolean = false;
    private onCompleteCallback: (() => void) | null = null;

    /**
     * 添加一个Promise任务到队列
     */
    add(promiseFn: () => Promise<any>) {
        this.queue.push(promiseFn);
    }

    /**
     * 移除队列中的某个Promise任务
     */
    remove(index: number) {
        if (index >= 0 && index < this.queue.length) {
            this.queue.splice(index, 1);
            if (this.current >= index) {
                this.current = Math.max(0, this.current - 1); // 调整当前索引
            }
        }
    }

    /**
     * 开始执行队列中的任务
     */
    start() {
        this.paused = false;
        this.runNext();
    }

    /**
     * 暂停队列
     */
    pause() {
        this.paused = true;
    }

    /**
     * 重置队列到开始
     */
    reset() {
        this.current = 0;
    }

    /**
     * 清除所有队列
     */
    clear() {
        this.queue = [];
        this.current = 0;
    }

    /**
     * 当队列中的所有Promise都执行完毕后触发回调
     */
    onComplete(callback: () => void) {
        this.onCompleteCallback = callback;
    }

    private runNext() {
        if (this.paused || this.current >= this.queue.length) {
            if (this.onCompleteCallback && this.current === this.queue.length) {
                this.onCompleteCallback();
            }
            return;
        }

        const promiseFn = this.queue[this.current];
        promiseFn()
            .then(() => {
                this.current++;
                this.runNext(); // 继续执行下一个
            })
            .catch((err) => {
                console.error('Promise execution failed:', err);
                this.current++; // 继续执行下一个，出错不阻塞
                this.runNext();
            });
    }
}

function test() {
    const a1 = () =>
        new Promise<void>((resolve, reject) => {
            setTimeout(() => {
                console.log('a1');
                resolve();
            }, 1000);
        });
    const a2 = () =>
        new Promise<void>((resolve, reject) => {
            setTimeout(() => {
                console.log('a2');
                resolve();
            }, 1000);
        });
    const a3 = () =>
        new Promise<void>((resolve, reject) => {
            setTimeout(() => {
                console.log('a3');
                resolve();
            }, 1000);
        });

    const que = new PromiseQueue();
    que.add(a1);
    que.add(a2);
    que.add(a3);

    que.onComplete(() => {
        console.log('end');
    });

    setTimeout(() => {
        que.clear();
    }, 2000);
    que.start();
}

test();
