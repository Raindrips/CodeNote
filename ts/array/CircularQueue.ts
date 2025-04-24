class CircularQueue<T> {
    private buffer: Array<T | undefined>;
    private head = 0; // index of next element to remove
    private tail = 0; // index of next insertion
    private count = 0; // current number of elements

    constructor(private capacity: number) {
        if (capacity <= 0) throw new Error('Capacity must be > 0');
        this.buffer = new Array<T | undefined>(capacity);
    }

    // 添加元素，若已满则先移除最旧的（队首）
    add(item: T): void {
        if (this.count === this.capacity) {
            // remove oldest
            this.head = (this.head + 1) % this.capacity;
            this.count--;
        }
        this.buffer[this.tail] = item;
        this.tail = (this.tail + 1) % this.capacity;
        this.count++;
    }

    // 移除并返回最旧的元素（队首）
    remove(): T | undefined {
        if (this.count === 0) return undefined;
        const val = this.buffer[this.head];
        this.buffer[this.head] = undefined;
        this.head = (this.head + 1) % this.capacity;
        this.count--;
        return val;
    }

    // 获取最新插入的元素（队尾）
    getTail(): T | undefined {
        if (this.count === 0) return undefined;
        const idx = (this.tail - 1 + this.capacity) % this.capacity;
        return this.buffer[idx];
    }

    // 当前大小
    size(): number {
        return this.count;
    }

    // 清空队列
    clear(): void {
        this.head = this.tail = this.count = 0;
        this.buffer.fill(undefined);
    }
}

{
    // 测试 CircularQueue
    function testCircularQueue() {
        const q = new CircularQueue<number>(3);

        console.log('初始 size:', q.size()); // 0
        console.log('remove on empty:', q.remove()); // undefined
        console.log('getTail on empty:', q.getTail()); // undefined

        q.add(1);
        q.add(2);
        q.add(3);
        console.log('加入 1,2,3 后 size, tail:', q.size(), q.getTail());
        // size: 3, tail: 3

        q.add(4);
        console.log(
            '加入 4（溢出，移除 1）后 size, tail:',
            q.size(),
            q.getTail(),
        );
        // size: 3, tail: 4

        console.log('remove():', q.remove()); // 2
        console.log('remove() 后 size, tail:', q.size(), q.getTail());
        // size: 2, tail: 4

        q.add(5);
        q.add(6);
        console.log(
            '加入 5,6（溢出，移除 3）后 size, tail:',
            q.size(),
            q.getTail(),
        );
        // size: 3, tail: 6

        console.log('依次 remove all:');
        while (q.size() > 0) {
            console.log(q.remove());
        }
        // outputs remaining in order: 4,5,6

        q.clear();
        console.log('clear 后 size:', q.size()); // 0
    }

    // 执行测试
    testCircularQueue();
}
