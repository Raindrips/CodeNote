function maximumUniqueSubarray(nums: number[]): number {
    const sumArray: number[] = new Array(nums.length + 1).fill(0); //前缀和数组
    const cnt: Map<number, number> = new Map();
    let ans = 0,
        pre = 0;
    for (let i = 0; i < nums.length; ++i) {
        sumArray[i + 1] = sumArray[i] + nums[i];
        pre = Math.max(pre, cnt.get(nums[i]) || 0);
        ans = Math.max(ans, sumArray[i + 1] - sumArray[pre]);
        cnt.set(nums[i], i + 1);
    }
    return ans;
}
