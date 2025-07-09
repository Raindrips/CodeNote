(() => {
    function maxValue(events: number[][], k: number): number {
        events.sort((a, b) => a[1] - b[1]);
        const n = events.length;
        const dp: number[][] = Array.from({ length: n + 1 }, () =>
            Array(k + 1).fill(0),
        );

        function lowerBound(target: number): number {
            let left = 0,
                right = n;
            while (left < right) {
                const mid = Math.floor((left + right) / 2);
                if (events[mid][1] < target) left = mid + 1;
                else right = mid;
            }
            return left;
        }

        for (let i = 0; i < n; i++) {
            let p = lowerBound(events[i][0]);
            for (let j = 1; j <= k; j++) {
                dp[i + 1][j] = Math.max(
                    dp[i][j],
                    dp[p][j - 1] + events[i][2],
                );
            }
        }
        return dp[n][k];
    }

    function test() {
        console.log(
            maxValue(
                [
                    [1, 2, 4],
                    [3, 4, 3],
                    [2, 3, 1],
                ],
                2,
            ),
        ); //7

        console.log(
            maxValue(
                [
                    [1, 2, 4],
                    [3, 4, 3],
                    [2, 3, 10],
                ],
                2,
            ),
        ); //10

        console.log(
            maxValue(
                [
                    [1, 1, 1],
                    [2, 2, 2],
                    [3, 3, 3],
                    [4, 4, 4],
                ],
                3,
            ),
        ); //9
    }

    test();
})();
