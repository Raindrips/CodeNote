namespace _3066 {
    function minOperations(nums: number[], k: number): number {
        const minHeap = new MinHeap();
        for (let i = 0; i < nums.length; i++) {
            if (nums[i] < k) {
                minHeap.push(nums[i]);
            }
        }
        let count = 0;
        while (minHeap.size() > 1) {
            count++;
            const m1 = minHeap.pop()!;
            const m2 = minHeap.pop()!;
            const result = m1 * 2 + m2;
            if (result < k) {
                minHeap.push(result);
            }
        }
        if (minHeap.size() === 1) count++;
        return count;
    }

    class MinHeap {
        private heap: number[];

        constructor() {
            this.heap = [];
        }

        size(): number {
            return this.heap.length;
        }

        isEmpty(): boolean {
            return this.size() === 0;
        }

        peek(): number {
            if (this.isEmpty()) {
                throw new Error('Heap is empty');
            }
            return this.heap[0];
        }

        push(val: number): void {
            this.heap.push(val);
            this._heapifyUp();
        }

        pop(): number {
            if (this.isEmpty()) {
                throw new Error('Heap is empty');
            }
            if (this.size() === 1) {
                return this.heap.pop() as number;
            }

            const root = this.heap[0];
            this.heap[0] = this.heap.pop() as number;
            this._heapifyDown();
            return root;
        }

        private _heapifyUp(): void {
            let index = this.size() - 1;
            const element = this.heap[index];

            while (index > 0) {
                const parentIndex = Math.floor((index - 1) / 2);
                const parent = this.heap[parentIndex];

                if (element >= parent) break;

                this.heap[index] = parent;
                this.heap[parentIndex] = element;
                index = parentIndex;
            }
        }

        private _heapifyDown(): void {
            let index = 0;
            const length = this.size();
            const element = this.heap[0];

            while (true) {
                let leftChildIndex = 2 * index + 1;
                let rightChildIndex = 2 * index + 2;
                let smallest = index;

                if (
                    leftChildIndex < length &&
                    this.heap[leftChildIndex] < this.heap[smallest]
                ) {
                    smallest = leftChildIndex;
                }

                if (
                    rightChildIndex < length &&
                    this.heap[rightChildIndex] < this.heap[smallest]
                ) {
                    smallest = rightChildIndex;
                }

                if (smallest === index) break;

                this.heap[index] = this.heap[smallest];
                this.heap[smallest] = element;
                index = smallest;
            }
        }
    }

    function test(nums: number[], k: number, result: number) {
        let r = minOperations(nums, k);
        console.log(r, r === result);
    }

    test([42, 46], 42, 0);
    test([2, 11, 10, 1, 3], 10, 2);
    test([1, 1, 2, 4, 9], 20, 4);
    test([85, 93, 100, 90, 40, 7, 62, 90, 68, 88], 88, 3);
    test(
        [
            1000000000, 999999999, 1000000000, 999999999, 1000000000,
            999999999,
        ],
        1000000000,
        2,
    );
}
