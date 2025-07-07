(() => {
    class MinHeap {
        private heap: number[] = [];

        private swap(i: number, j: number) {
            [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
        }

        private bubbleUp(index: number) {
            while (index > 0) {
                let parent = Math.floor((index - 1) / 2);
                if (this.heap[index] >= this.heap[parent]) break;
                this.swap(index, parent);
                index = parent;
            }
        }

        private bubbleDown(index: number) {
            const lastIndex = this.heap.length - 1;
            while (true) {
                let left = 2 * index + 1;
                let right = 2 * index + 2;
                let smallest = index;

                if (
                    left <= lastIndex &&
                    this.heap[left] < this.heap[smallest]
                )
                    smallest = left;
                if (
                    right <= lastIndex &&
                    this.heap[right] < this.heap[smallest]
                )
                    smallest = right;

                if (smallest === index) break;
                this.swap(index, smallest);
                index = smallest;
            }
        }

        insert(value: number) {
            this.heap.push(value);
            this.bubbleUp(this.heap.length - 1);
        }

        extractMin(): number | undefined {
            if (this.heap.length === 0) return undefined;
            const min = this.heap[0];
            const last = this.heap.pop()!;
            if (this.heap.length > 0) {
                this.heap[0] = last;
                this.bubbleDown(0);
            }
            return min;
        }

        peek(): number | undefined {
            return this.heap[0];
        }

        size(): number {
            return this.heap.length;
        }
    }
    function maxEvents(events: number[][]): number {
        events.sort((a, b) => {
            return a[0] - b[0];
        });

        console.log(events);
        const minH = new MinHeap();

        let ans = 0;
        for (
            let currDay = 1, i = 0;
            i < events.length || minH.size() != 0;
            currDay++
        ) {
            //添加符合当天的会议
            while (i < events.length && events[i][0] <= currDay) {
                minH.insert(events[i][1]);
                i++;
            }
            // 删除过期的会议
            while (minH.size() != 0 && minH.peek()! < currDay) {
                minH.extractMin();
            }
            if (minH.size() != 0) {
                minH.extractMin()!;
                ans++;
            }
        }
        return ans;
    }

    function test(events: number[][]) {
        console.log(maxEvents(events));
    }

    test([
        [1, 2],
        [2, 3],
        [3, 4],
    ]);
    test([
        [1, 2],
        [2, 3],
        [3, 4],
        [1, 2],
    ]);
    test([[1, 100000]]);
})();
