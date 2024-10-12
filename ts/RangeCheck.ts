class RangeChecker {
    private intervals: [number, number][];

    constructor(intervals: [number, number][]) {
        this.intervals = intervals;
    }

    // 检查给定的值是否在某个区间内
    findIndex(value: number): number {
        for (let i = 0; i < this.intervals.length; i++) {
            const [start, end] = this.intervals[i];
            if (value >= start && value < end) {
                return i;
            }
        }
        return -1;
    }
}

(function () {
    const rc = new RangeChecker([
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
    ]);
    console.log(rc.findIndex(0.5));
    console.log(rc.findIndex(1)); 
    console.log(rc.findIndex(3)); 
    console.log(rc.findIndex(2.5));
    console.log(rc.findIndex(-1)); 
})();
