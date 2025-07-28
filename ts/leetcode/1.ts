namespace _1 {
    function twoSum(nums: number[], target: number): number[] {
        let m = new Map<number, number>();
        for (let i = 0; i < nums.length; i++) {
            if (m.has(nums[i])) {
                return [m.get(nums[i])!, i];
            }
            m.set(target - nums[i], i);
        }
        return [];
    }

    function test(nums: number[], target: number) {
        console.log(twoSum(nums, target));
    }

    test([2, 7, 11, 15], 9);
    test([3, 2, 4], 6);
    test([3, 3], 6);
}
