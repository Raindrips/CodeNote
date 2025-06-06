(() => {
    function createMultiDimensionalArray<T = number>(
        fill: T,
        ...dimensions: number[]
    ): any {
        if (dimensions.length === 0) {
            return fill;
        }
        const currentDimLength = dimensions[0];
        const remainingDimensions = dimensions.slice(1);

        const array = [];
        for (let i = 0; i < currentDimLength; i++) {
            array.push(
                createMultiDimensionalArray(fill, ...remainingDimensions),
            );
        }
        return array;
    }

    // [a-b] 匹配一个
    // *  匹配多个
    // ? 匹配任意一个
    function isMatch(s: string, p: string): boolean {
        const dp = createMultiDimensionalArray(
            0,
            s.length + 1,
            p.length + 1,
        );
        dp[0][0] = 1;
        for (let i = 1; i <= s.length; i++) {
            if (p[i - 1] == '*') {
                dp[0][1] = 1;
            } else {
                break;
            }
        }
        for (let i = 1; i <= s.length; i++) {
            for (let j = 1; j <= p.length; j++) {
                if (p[j - 1] == '*') {
                    dp[i][j] = dp[i][j - 1] | dp[i - 1][j];
                } else if (p[j - 1] === '?' || s[i - 1] === p[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                }
            }
        }
        return dp[s.length][p.length];
    }

    function test(s: string, p: string) {
        console.log(isMatch(s, p));
    }

    test('cb', '?a');
    test('aa', '*');
     test('aa', 'a');
})();
