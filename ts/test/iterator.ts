(() => {
    // 内部生成器函数
    function* innerGenerator() {
        yield 'Inner Result 1';
        yield 'Inner Result 2';
    }

    // 外部生成器函数，嵌套调用内部生成器
    function* outerGenerator() {
        yield 'Outer Result 1';
        yield* innerGenerator();
        yield 'Outer Result 2';
    }

    // 使用迭代器来遍历生成器的结果
    const iterator = outerGenerator();

    async function test() {
        // for (const result of iterator) {
        //     console.log(result);
        //     await sleep(1);
        // }
    }

    function sleep(time: number) {
        return new Promise<void>((resolve, reject) => {
            setTimeout(resolve, time * 1000);
        });
    }

    test();
})();
