class MemoryPool {
    // 使用 Map 来存储变量，键是字符串 ID，值是对应的变量
    private pool: Map<string, unknown> = new Map();

    /**
     * 在内存池中设置一个变量。
     * 如果该 ID 已存在，则会覆盖其值。
     *
     * @template T 变量的类型。
     * @param id 变量的唯一标识符（字符串）。
     * @param value 要存储的变量值。
     */
    public set<T>(id: string, value: T): void {
        this.pool.set(id, value);
    }

    /**
     * 从内存池中获取一个变量。
     * 如果 ID 不存在，将返回 undefined。
     *
     * @template T 期望获取的变量类型。
     * @param id 变量的唯一标识符（字符串）。
     * @returns 变量的值，如果 ID 不存在则为 undefined。
     */
    public get<T>(id: string): T | undefined {
        const value = this.pool.get(id);
        return value as T | undefined;
    }

    /**
     * 从内存池中删除一个变量。
     *
     * @param id 要删除变量的唯一标识符（字符串）。
     * @returns 如果成功删除则返回 true，否则返回 false。
     */
    public delete(id: string): boolean {
        const deleted = this.pool.delete(id);
        return deleted;
    }

    /**
     * 检查内存池中是否存在指定 ID 的变量。
     *
     * @param id 要检查的变量 ID。
     * @returns 如果存在则返回 true，否则返回 false。
     */
    public has(id: string): boolean {
        return this.pool.has(id);
    }

    /**
     * 返回内存池中当前存储的变量数量。
     *
     * @returns 变量数量。
     */
    public size(): number {
        return this.pool.size;
    }

    /**
     * 清空内存池中的所有变量。
     */
    public clear(): void {
        this.pool.clear();
    }
}
(() => {
    const pool = new MemoryPool();

    // --- 存储变量 ---
    pool.set<number>('myNumber', 123);
    pool.set<string>('myString', 'hello world');
    pool.set<boolean>('myBoolean', true);
    pool.set<{ name: string; age: number }>('myObject', {
        name: 'Alice',
        age: 30,
    });
    pool.set<number[]>('myArray', [10, 20, 30]);

    console.log('\n--- 获取变量 ---');
    const num = pool.get<number>('myNumber');
    console.log("获取 'myNumber':", num); // 输出: 获取 'myNumber': 123

    const str = pool.get<string>('myString');
    console.log("获取 'myString':", str); // 输出: 获取 'myString': hello world

    const obj = pool.get<{ name: string; age: number }>('myObject');
    console.log("获取 'myObject':", obj?.name); // 输出: 获取 'myObject': Alice

    const nonExistent = pool.get<string>('unknownId');
    console.log("获取 'unknownId':", nonExistent); // 输出: 变量 ID 'unknownId' 不存在。 获取 'unknownId': undefined

    // --- 检查和大小 ---
    console.log('\n--- 检查和大小 ---');
    console.log("是否存在 'myBoolean'?", pool.has('myBoolean')); // true
    console.log('内存池当前变量数量:', pool.size()); // 5

    // --- 解除引用 (删除变量) ---
    console.log('\n--- 删除变量 ---');
    pool.delete('myNumber');
    pool.delete('myString');
    console.log('内存池当前变量数量:', pool.size()); // 3

    // 再次尝试获取已删除的变量
    const deletedNum = pool.get<number>('myNumber');
    console.log("再次获取 'myNumber' (应为 undefined):", deletedNum); // undefined

    // 尝试删除不存在的变量
    pool.delete('anotherUnknownId');

    // --- 清空内存池 ---
    console.log('\n--- 清空内存池 ---');
    pool.clear();
    console.log('清空后变量数量:', pool.size()); // 0
})();
