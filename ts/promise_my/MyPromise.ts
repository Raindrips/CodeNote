export namespace PromiseLog {
    enum PromiseStatus {
        PENDING = 'pending',
        FULFILLED = 'fulfilled',
        REJECTED = 'rejected',
    }

    type Executor<T> = (
        resolve: (value: T) => void,
        reject?: (reason: any) => void,
    ) => void;

    export class MyPromise<T> {
        private status: PromiseStatus = PromiseStatus.PENDING;
        private value: T | any = null;
        private reason: any = null;

        private onFulfilledCallbacks: ((value: T) => void)[] = [];
        private onRejectedCallbacks: ((reason: any) => void)[] = [];
        private onFinallyCallbacks: (() => void)[] = [];

        constructor(executor: Executor<T>) {
            try {
                executor(this.resolve.bind(this), this.reject.bind(this));
            } catch (err) {
                this.reject(err);
            }
        }

        // resolve方法
        private resolve(value: T): void {
            if (this.status === PromiseStatus.PENDING) {
                this.status = PromiseStatus.FULFILLED;
                this.value = value;

                // 执行所有的成功回调
                this.onFulfilledCallbacks.forEach((fn) => fn(value));

                // 执行所有的 finally 回调
                this.onFinallyCallbacks.forEach((fn) => fn());
            }
        }

        // reject方法
        private reject(reason: any): void {
            if (this.status === PromiseStatus.PENDING) {
                this.status = PromiseStatus.REJECTED;
                this.reason = reason;

                // 执行所有的失败回调
                this.onRejectedCallbacks.forEach((fn) => fn(reason));

                // 执行所有的 finally 回调
                this.onFinallyCallbacks.forEach((fn) => fn());
            }
        }

        // then方法，用于处理成功结果
        then(
            onFulfilled?: (value: T) => any,
            onRejected?: (reason: any) => any,
        ): MyPromise<any> {
            const promise = new MyPromise<any>((resolve, reject) => {
                const handleFulfilled = () => {
                    try {
                        if (onFulfilled) {
                            const result = onFulfilled(this.value);
                            if (result instanceof MyPromise) {
                                result.then(resolve, reject); // 如果返回的是一个 MyPromise，继续链式调用
                            } else {
                                resolve(result); // 直接返回结果
                            }
                        } else {
                            resolve(this.value); // 如果没有 onFulfilled，直接返回值
                        }
                    } catch (err) {
                        reject && reject(err); // 捕获异常
                    }
                };

                const handleRejected = () => {
                    try {
                        if (onRejected) {
                            const result = onRejected(this.reason);
                            if (result instanceof MyPromise) {
                                result.then(resolve, reject); // 如果返回的是一个 MyPromise，继续链式调用
                            } else {
                                resolve(result); // 直接返回结果
                            }
                        } else {
                            reject && reject(this.reason); // 如果没有 onRejected，直接返回拒绝的 reason
                        }
                    } catch (err) {
                        reject && reject(err); // 捕获异常
                    }
                };

                // 执行回调
                if (this.status === PromiseStatus.FULFILLED) {
                    handleFulfilled();
                } else if (this.status === PromiseStatus.REJECTED) {
                    handleRejected();
                } else {
                    // 当是 pending 状态时，等待执行
                    this.onFulfilledCallbacks.push(handleFulfilled);
                    this.onRejectedCallbacks.push(handleRejected);
                }
            });

            return promise;
        }

        // catch方法，用于处理拒绝结果
        catch(onRejected: (reason: any) => any): MyPromise<any> {
            return this.then(undefined, onRejected);
        }

        // finally方法
        finally(callback: () => void): MyPromise<T> {
            const promise = new MyPromise<T>((resolve, reject) => {
                const handleFinally = () => {
                    try {
                        callback();
                        if (this.status === PromiseStatus.FULFILLED) {
                            resolve(this.value);
                        } else if (this.status === PromiseStatus.REJECTED) {
                            reject && reject(this.reason);
                        }
                    } catch (err) {
                        reject && reject(err);
                    }
                };

                // 保存 finally 回调
                if (
                    this.status === PromiseStatus.FULFILLED ||
                    this.status === PromiseStatus.REJECTED
                ) {
                    handleFinally();
                } else {
                    this.onFinallyCallbacks.push(handleFinally);
                }
            });

            return promise;
        }

        // 获取当前的状态
        getStatus(): PromiseStatus {
            return this.status;
        }
    }
    function Test() {
        const promise = new MyPromise((resolve, reject) => {
            setTimeout(() => {
                resolve('Hello');
            }, 1000);
        })
            .then((val) => {
                return new MyPromise((resolve, reject) => {
                    setTimeout(() => {
                        console.log(val);
                        resolve('World');
                    }, 1000);
                });
            })
            .then((val) => {
                console.log(val);
            });
    }
    Test();
}
