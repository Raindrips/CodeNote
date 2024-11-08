//198. https://leetcode.cn/problems/house-robber/
//打家劫舍
namespace _198 {
    function rob1(nums: number[]): number {
        return recursion(nums, -2, 0);
    }

    function rob(nums: number[]): number {
        if (nums.length <= 0) {
            return 0;
        }
        const n = nums.length;
        let result = new Array(n + 1);

        result[0] = nums[0];
        result[1] = Math.max(nums[0], nums[1]);
        for (let i = 2; i < n; i++) {
            result[i] = Math.max(result[i - 2] + nums[i], result[i - 1]);
        }
        return result[n - 1];
    }

    function recursion(nums: number[], step: number, money: number): number {
        if (step >= nums.length) {
            return money;
        }
        if (step >= 0) {
            money += nums[step];
        }
        let planB = money;
        let planC = money;
        if (step + 2 < nums.length) {
            planB = recursion(nums, step + 2, money);
        }
        if (step + 3 < nums.length) {
            planC = recursion(nums, step + 3, money);
        }
        return Math.max(planB, planC);
    }

    function test(nums: number[]) {
        console.log(rob(nums));
    }

    test([1, 2, 3, 1]);
    test([2, 7, 9, 3, 1]);
    test([1, 6, 3, 2, 1]);
    test([4, 5, 6, 8]);
    test([9, 5, 6, 8]);
}
