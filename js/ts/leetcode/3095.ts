namespace _3095 {
    // 1. 暴力解法
    function minimumSubarrayLength(nums: number[], k: number): number {
        const n = nums.length;
        let res = Number.MAX_VALUE;
        for (let i = 0; i < n; i++) {
            let value = 0;
            for (let j = i; j < n; j++) {
                value |= nums[j];
                if (value >= k) {
                    res = Math.min(res, j - i + 1);
                    break;
                }
            }
        }
        return res === Number.MAX_VALUE ? -1 : res;
    }

    function test(nums: number[], k: number, result: number) {
        let r = minimumSubarrayLength(nums, k);
        console.log(r, r === result);
    }

    test([1, 2, 3], 2, 1);
    test([2, 1, 8], 10, 3);
    test([1, 2], 0, 1);
    test([1, 12, 2, 5], 43, -1);
    test([2, 1, 2, 32], 29, 1);
    test([2, 24, 32, 1], 22, 1);
}
