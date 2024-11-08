//740 https://leetcode.cn/problems/delete-and-earn/
namespace _740 {
    function deleteAndEarn(nums: number[]): number {
        let obj: { [key: number]: number } & Object = {};
        for (let i = 0; i < nums.length; i++) {
            if (!(nums[i] in obj)) {
                obj[nums[i]] = 0;
                if (nums[i] > 0 && !(nums[i] - 1 in obj)) {
                    obj[nums[i] - 1] = 0;
                }
            }
            obj[nums[i]] += nums[i];
        }
        let newNums = Object.values(obj);
        console.log(newNums);
        return rob(newNums);
    }

    // 直接套用打家劫舍的代码
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

    function test(nums: number[]) {
        console.log(deleteAndEarn(nums));
    }

    test([3, 1]);
    test([3, 4, 2]);
    test([2, 2, 3, 3, 3, 4]);
}
