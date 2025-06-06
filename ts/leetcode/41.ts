(() => {
    function firstMissingPositive(nums: number[]): number {
        let s = new Set<number>();
        let m = -1;
        for (let i = 0; i < nums.length; i++) {
            if (nums[i] > 0 ) {
                s.add(nums[i]);
            }
            if (nums[i] > m) {
                m = nums[i];
            }
        }
        if (s.size - 1 == m) {
            return m + 1;
        }
        for (let i = 1; i < m + 2; i++) {
            if (!s.has(i)) {
                return i;
            }
        }
        return 1;
    }

    function test(nums: number[]) {
        console.log(firstMissingPositive(nums));
    }

    test([0, 1, 2]);
    test([3, 4, -1, 1]);
    test([7, 8, 9, 11, 12]);
})();
