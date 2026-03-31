namespace _15 {
    function threeSum(nums: number[]): number[][] {
        // 排序
        nums.sort((a, b) => a - b);
        console.log(nums);
        let tuple: [number, number, number][] = [];
        let set = new Set<number>();
        for (let i = 0; i < nums.length; i++) {
            if (set.has(nums[i])) {
                continue;
            }
            set.add(nums[i]);
            let l = i + 1;
            let r = nums.length - 1;
            while (l < r) {
                const sum = nums[l] + nums[r];
                if (sum + nums[i] == 0) {
                    tuple.push([nums[i], nums[l], nums[r]]);
                    l++;
                    r--;
                    while (nums[l] === nums[l - 1]) l++;
                    while (nums[r] === nums[r + 1]) r--;
                } else if (sum + nums[i] < 0) {
                    l++;
                } else {
                    r--;
                }
            }
        }
        return tuple;
    }

    function test(nums: number[]) {
        console.log(threeSum(nums));
    }

    // test([1, -1, -1, 0]);
    // test([-1, 0, 1, 2, -1, -4]);
    // test([0, 1, 1]);
    // test([0, 0, 0]);
    // test([-1, 0, 1, 2, -1, -4]);
    test([2, -3, 0, -2, -5, -5, -4, 1, 2, -2, 2, 0, 2, -4, 5, 5, -10]);
}
