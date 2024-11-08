//爬梯子2
namespace _764 {
    let allCost: number[] = [];

    function minCostClimbingStairs_1(cost: number[]): number {
        allCost = [];
        recursion(cost, -1, 0);
        allCost.sort((a, b) => a - b);
        console.log(allCost);
        return allCost[0];
    }

    interface Date {
        step: number;
        cost: number;
    }

    function minCostClimbingStairs_2(cost: number[]): number {
        allCost = [];
        console.log(allCost);
        let minNum = dfs(cost);
        return minNum;
    }

    function minCostClimbingStairs(cost: number[]): number {
        const n = cost.length;
        let result = new Array(n + 1);
        result[0] = 0;
        result[1] = 0;
        for (let i = 2; i <= n; i++) {
            result[i] = Math.min(
                result[i - 1] + cost[i - 1],
                result[i - 2] + cost[i - 2],
            );
        }
        console.log(result);
        return result[n];
    }

    function dfs(cost: number[]) {
        const queue: Date[] = [];
        const root: Date = { step: -1, cost: 0 };
        queue.push(root);
        let minNum: number = Number.MAX_VALUE;
        while (queue.length != 0) {
            const data = queue.pop()!;
            const left = data.step + 1;
            const right = data.step + 2;
            if (right >= cost.length || left >= cost.length) {
                minNum = Math.min(minNum, data.cost);
                allCost.push(data.cost);
                continue;
            }
            const cost_left = data.cost + cost[left];
            const cost_right = data.cost + cost[right];
            queue.push({ step: left, cost: cost_left });
            queue.push({ step: right, cost: cost_right });
        }
        return minNum;
    }

    function recursion(costArray: number[], step: number, cost: number): number {
        const left = step + 1;
        const right = step + 2;

        if (right >= costArray.length || left >= costArray.length) {
            allCost.push(cost);
            return 0;
        }

        return (
            recursion(costArray, left, cost + costArray[left]) +
            recursion(costArray, right, cost + costArray[right])
        );
    }

    function test(cost: number[]) {
        console.log(minCostClimbingStairs(cost));
    }

    test([1, 100, 1, 1, 1, 100, 1, 1, 100, 1]);
    test([0, 0, 1, 1]);
}
