{
    type Entry<K, V> = { key: K; value: V };

    class SortedKVArray<K, V> {
        private data: Entry<K, V>[] = [];

        constructor(private compareFn: (a: K, b: K) => number) {}

        insert(key: K, value: V): void {
            const index = this.upperBound(key); // 插入到相同 key 的最后位置
            this.data.splice(index, 0, { key, value });
        }

        find(key: K): V[] {
            const results: V[] = [];
            const index = this.lowerBound(key);

            for (
                let i = index;
                i < this.data.length &&
                this.compareFn(this.data[i].key, key) === 0;
                i++
            ) {
                results.push(this.data[i].value);
            }

            return results;
        }

        keys(): K[] {
            return this.data.map((item) => item.key);
        }

        values(): V[] {
            return this.data.map((item) => item.value);
        }

        size(): number {
            return this.data.length;
        }

        clear(): void {
            this.data = [];
        }

        delete(key: K): void {
            const start = this.lowerBound(key);
            const end = this.upperBound(key);
            this.data.splice(start, end - start);
        }

        // 更新key的值,替换所有相同key的value
        update(key: K, updater: (oldValue: V) => V): void {
            const start = this.lowerBound(key);
            const end = this.upperBound(key);
            for (let i = start; i < end; i++) {
                this.data[i].value = updater(this.data[i].value);
            }
        }

        //范围查询（闭区间 [] ）
        range(from: K, to: K): Entry<K, V>[] {
            const start = this.lowerBound(from);
            const end = this.upperBound(to);
            return this.data.slice(start, end);
        }

        private lowerBound(key: K): number {
            let low = 0;
            let high = this.data.length;
            while (low < high) {
                const mid = (low + high) >> 1;
                if (this.compareFn(this.data[mid].key, key) < 0) {
                    low = mid + 1;
                } else {
                    high = mid;
                }
            }
            return low;
        }

        private upperBound(key: K): number {
            let low = 0;
            let high = this.data.length;
            while (low < high) {
                const mid = (low + high) >> 1;
                if (this.compareFn(this.data[mid].key, key) <= 0) {
                    low = mid + 1;
                } else {
                    high = mid;
                }
            }
            return low;
        }
    }

    function test() {
        const kv = new SortedKVArray<number, string>((a, b) => a - b);

        kv.insert(2, 'a');
        kv.insert(1, 'b');
        kv.insert(2, 'c');
        kv.insert(3, 'd');

        console.log(kv.keys()); // [1, 2, 2, 3]
        console.log(kv.values()); // ['b', 'a', 'c', 'd']
        console.log(kv.find(2)); // ['a', 'c']
        console.log(kv.size()); // 4
        kv.clear();
        console.log(kv.size()); // 0
    }
    test();
}
