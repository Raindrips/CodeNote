(() => {
    function partitionArray(nums: number[], k: number): number {
        nums.sort((a, b) => a - b);
        let sub = nums[0];
        let count = 1;
        for (let i = 0; i < nums.length; i++) {
            if (nums[i] - sub > k) {
                count++;
                sub = nums[i];
                console.log(i, nums[i]);
            }
        }
        return count;
    }
    partitionArray([1, 2, 3, 5, 6], 2);
})();
