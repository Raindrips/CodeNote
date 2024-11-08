namespace _3254 {
    function resultsArray(nums: number[], k: number): number[] {
        const result: number[] = [];
        if (k === 1) {
            return nums;
        }
        loop: for (let i = 0; i < nums.length - k + 1; i++) {
            for (let j = i + 1; j < i + k; j++) {
                if (nums[j] - nums[j - 1] != 1) {
                    result.push(-1);
                    continue loop;
                }
            }
            result.push(nums[i + k - 1]);
        }
        return result;
    }

    function test(nums: number[], k: number) {
        console.log(resultsArray(nums, k));
    }

    test([1, 2, 3, 4, 3, 2, 5], 3);
    test([2, 2, 2, 2, 2], 4);
    test([3, 2, 3, 2, 3, 2], 2);
}
