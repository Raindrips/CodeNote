/**
 * 手动实现 Promise.withResolvers 兼容低版本规范
 */
export function withResolvers<T>() {
    let resolve: (value: T | PromiseLike<T>) => void = () => {};
    let reject: (reason?: any) => void = () => {};
    const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve, reject };
}

// 用法示例：
// const { promise, resolve, reject } = withResolvers<number>();
// resolve(123);
// promise.then(console.log);