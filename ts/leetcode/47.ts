namespace _47 {
    function permuteUnique(nums: number[]): number[][] {
        const result: number[][] = [];
        nums.sort((a, b) => a - b); // 排序，确保重复的元素相邻

        function backtrack(path: number[], used: boolean[]) {
            if (path.length === nums.length) {
                result.push([...path]); // 找到一个排列，加入结果
                return;
            }

            for (let i = 0; i < nums.length; i++) {
                if (used[i]) continue; // 如果已经使用过该元素，跳过
                if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1])
                    continue; // 去重条件

                used[i] = true;
                path.push(nums[i]);
                backtrack(path, used); // 递归调用
                path.pop();
                used[i] = false;
            }
        }

        backtrack([], new Array(nums.length).fill(false)); // 初始化回溯
        return result;
    }

    function permute(nums:number[]):number[][]{
        const result: number[][] = [];
        nums.sort((a, b) => a - b); // 排序，确保重复的元素相邻
        return result
    }
}
