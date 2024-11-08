// 非递归费波纳契数列
function fib(n: number): number {
    let nums: number[] = new Array(n + 1);
    nums[0] = 0;
    nums[1] = 1;
    for (let i = 2; i <= n; i++) {
        nums[i] = nums[i - 1] + nums[i - 2];
    }
    return nums[n];
}

console.log(fib(3));
