namespace PromiseLog {

    export class MyPromiseQueue {
        private queue: (() => MyPromise<any>)[] = [];
        private current: number = 0;
        private paused: boolean = false;
        private onCompleteCallback: (() => void) | null = null;

        /**
         * 添加一个Promise任务到队列
         */
        add(promiseFn: () => MyPromise<any>) {
            this.queue.push(promiseFn);
        }

        /**
         * 移除队列中的某个Promise任务
         */
        remove(index: number) {
            if (index >= 0 && index < this.queue.length) {
                this.queue.splice(index, 1);
            }
        }

        clear() {
            this.queue = [];
        }

        stop() {
            this.queue = [];
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
         * 当队列中的所有Promise都执行完毕后触发回调
         */
        onComplete(callback: () => void) {
            this.onCompleteCallback = callback;
        }

        private runNext() {
            if (this.paused || this.current >= this.queue.length) {
                return;
            }

            const promiseFn = this.queue[this.current];
            promiseFn()
                .then(() => {
                    this.current++;
                    if (this.current === this.queue.length) {
                        if (this.onCompleteCallback) {
                            this.onCompleteCallback();
                        }
                    } else {
                        this.runNext();
                    }
                })
                .catch((err) => {
                    console.error('Promise execution failed:', err);
                });
        }
    }

    function main() {
        let a1 = () =>
            new MyPromise<void>((resolve, reject) => {
                setTimeout(() => {
                    console.log('time 1');
                    resolve();
                }, 1000);
            });
        let a2 = () =>
            new MyPromise<void>((resolve, reject) => {
                setTimeout(() => {
                    console.log('time 2');
                    resolve();
                }, 1000);
            });

        let que = new MyPromiseQueue();
        que.add(a1);
        que.add(a2);
        que.add(a1);
        que.add(a2);
        que.start();
        que.onComplete(() => {
            console.log('end');
        });
        setTimeout(() => {
            que.clear();
        }, 2000);
    }

    main();
}
