namespace AsyncQueue2 {
    class AsyncQueue {
        queue: Promise<any>[];
        constructor() {
            this.queue = [];
        }

        push(promiseFactory: Promise<any>) {
            this.queue.push(promiseFactory);
        }

        async pop() {
            if (this.queue.length === 0) {
                return Promise.resolve();
            }

            const promiseFactory = this.queue.shift();
            if (!promiseFactory) {
                return;
            }
            const result = await promiseFactory;
            return result;
        }

        async run() {
            while (this.queue.length > 0) {
                await this.pop();
            }
        }
    }

    class PromiseQueue<T = any> {
        private queue: (() => Promise<T>)[];
        constructor() {
            this.queue = [];
        }

        push(promiseFactory: () => Promise<T>) {
            this.queue.push(promiseFactory);
        }

        async pop() {
            if (this.queue.length === 0) {
                return null;
            }

            const promiseFactory = this.queue[0];
            this.queue.shift();
            const result: T = await promiseFactory();
            return result;
        }

        async run() {
            let result: T[] = [];
            while (this.queue.length > 0) {
                let v = await this.pop();
                if (v) {
                    result.push(v);
                }
            }
            return result;
        }
    }

    async function test() {
        const asyncQueue = new AsyncQueue();

        asyncQueue.push(
            new Promise<any>((r) => {
                setTimeout(() => {
                    console.log('1');
                    r('1');
                }, 500);
            }),
        );
        asyncQueue.push(
            new Promise<any>((r) => {
                setTimeout(() => {
                    console.log('1');
                    r('2');
                }, 100);
            }),
        );
        asyncQueue.push(
            new Promise<any>((r) => {
                setTimeout(() => {
                    console.log('3');
                    r('3');
                }, 1000);
            }),
        );

        await asyncQueue.run();
        console.log('All tasks completed');
    }

    async function test2() {
        let ro: (val?: any) => void;
        let pro = new Promise<any>((r) => {
            ro = r;
        });

        let v = async () => {
            await pro;
            console.log('end');
        };
        v();

        setTimeout(() => {
            console.log('start');
            ro();
        }, 1000);
    }

    function test3() {
        const queue = new PromiseQueue();
        queue.push(() => {
            return new Promise<any>((r) => {
                setTimeout(() => {
                    r('1');
                }, 500);
            });
        });
        queue.push(() => {
            return new Promise<any>((r) => {
                setTimeout(() => {
                    r('2');
                }, 250);
            });
        });
        queue.push(() => {
            return new Promise<any>((r) => {
                setTimeout(() => {
                    r('3');
                }, 1000);
            });
        });

        let r = queue.run().then((r) => {
            console.log(r);
        });
    }
    test3();
}
