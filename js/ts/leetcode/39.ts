namespace _39 {
    function combinationSum(
        candidates: number[],
        target: number,
    ): number[][] {
        candidates.sort((a, b) => b - a);
        console.log(candidates);
        let result: number[][] = [];
        dfs(candidates, target, [], 0, result);
        return result;
    }

    function dfs(
        array: number[],
        target: number,
        temp: number[],
        step: number,
        result: number[][],
    ) {
        if (step >= array.length) {
            return;
        }
        if (target == 0) {
            result.push(temp.slice());
            return;
        }

        dfs(array, target, temp, step + 1, result);
        let sub = target - array[step];
        if (sub >= 0) {
            temp.push(array[step]);
            dfs(array, sub, temp, step, result);
            temp.pop();
        }
    }

    function test(candidates: number[], target: number) {
        console.log(combinationSum(candidates, target));
    }

    test([2, 3, 6, 7], 7);
    test([2, 3, 5], 8);
    test([2], 1);
}
