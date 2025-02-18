namespace _2081 {
    class RangeFreqQuery {
        obj: { [key: number]: number[] } = {};
        constructor(public arr: number[]) {
            for (let i = 0; i < arr.length; i++) {
                if (!this.obj[arr[i]]) {
                    this.obj[arr[i]] = [];
                }
                this.obj[arr[i]].push(i);
            }
            // console.log(this.obj);
        }

        query(left: number, right: number, value: number): number {
            let m = this.obj[value]||[];
            let l = this.lowerBound(m, left);
            let r = this.upperBound(m, right);
            return r - l;
        }

        // 二分查找法寻找数组小于target的最小元素
        private lowerBound(pos: number[], target: number): number {
            let low = 0,
                high = pos.length - 1;
            while (low <= high) {
                const mid = low + Math.floor((high - low) / 2);
                if (pos[mid] < target) {
                    low = mid + 1;
                } else {
                    high = mid - 1;
                }
            }
            return low;
        }

        //二分查找法寻找数组大于target的最小元素
        private upperBound(pos: number[], target: number): number {
            let low = 0,
                high = pos.length - 1;
            while (low <= high) {
                const mid = low + Math.floor((high - low) / 2);
                if (pos[mid] <= target) {
                    low = mid + 1;
                } else {
                    high = mid - 1;
                }
            }
            return low;
        }
    }

    let query: RangeFreqQuery;
    function exec(cmd: string, arr: number[]) {
        switch (cmd) {
            case 'RangeFreqQuery':
                query = new RangeFreqQuery(arr);
                return null;

            case 'query':
                return query.query(arr[0], arr[1], arr[2]);
        }
    }

    function test(cmdArr: string[], arrArr: number[][]) {
        for (let i = 0; i < cmdArr.length; i++) {
            console.log(exec(cmdArr[i], arrArr[i]));
        }
    }

    test(
        ['RangeFreqQuery', 'query', 'query'],
        [
            [12, 33, 4, 56, 22, 2, 34, 33, 22, 12, 34, 56],
            [1, 2, 4],
            [0, 11, 33],
        ],
    );
}
