//128. https://leetcode.cn/problems/longest-consecutive-sequence/
//最长连续序列

namespace _198 {
    function longestConsecutive(nums: number[]): number {
        if (nums.length == 0) {
            return 0;
        }
        nums.sort((a, b) => a - b);
        let count = 1;
        let maxCount = 1;
        for (let i = 1; i < nums.length; i++) {
            const result = nums[i] - nums[i - 1];
            if(result === 0){
                continue;
            }
            if (result === 1 ) {
                count++;
                if (count > maxCount) {
                    maxCount = count;
                }
            } else {
                count = 1;
            }
        }
        return maxCount;
    }

    function test(nums: number[]) {
        console.log(longestConsecutive(nums));
    }

    test([100, 4, 200, 1, 3, 2]);
    test([0, 3, 7, 2, 5, 8, 4, 6, 0, 1]);
}
