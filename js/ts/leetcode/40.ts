namespace _39 {
    function combinationSum2(
        candidates: number[],
        target: number,
    ): number[][] {
        candidates.sort((a, b) => b - a);
        console.log(candidates);
        let result: number[][] = [];
        dfs(candidates, target, [], 0, result, false);
        return result;
    }

    function dfs(
        array: number[],
        target: number,
        temp: number[],
        step: number,
        result: number[][],
        flag: boolean,
    ) {
        if (step >= array.length) {
            return;
        }
        if (target == 0) {
            result.push(temp.slice());
            return;
        }

        dfs(array, target, temp, step + 1, result, false);
        let sub = target - array[step];

        if (sub >= 0) {
            temp.push(array[step]);
            dfs(array, sub, temp, step + 1, result, true);
            temp.pop();
        } else if (flag) {
            dfs(array, target, temp, step + 1, result, true);
            temp.pop();
        }
    }

    function test(candidates: number[], target: number) {
        console.log(combinationSum2(candidates, target));
    }

    test([2, 5, 2, 1, 2], 5);
    test([10, 1, 2, 7, 6, 1, 5], 8);
}
