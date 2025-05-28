(function () {
    function letterCombinations(digits: string): string[] {
        let numMap = [
            '',
            '', // 0 and 1 have no letters
            'abc',
            'def',
            'ghi',
            'jkl',
            'mno',
            'pqrs',
            'tuv',
            'wxyz',
        ];
        let path: number[] = [];
        let ans: string[] = [];
        for (let i = 0; i < digits.length; i++) {
            let num = parseInt(digits[i]);
            path.push(num);
        }
        backtrack(0, numMap, path, ans, '');
        return ans;
    }

    function backtrack(
        index: number,
        numMap: string[],
        path: number[],
        ans: string[],
        digits: string = '',
    ) {
        if (index === path.length) {
            if (digits.length > 0) {
                ans.push(digits);
            }
            return;
        }
        let letters = numMap[path[index]];
        for (let i = 0; i < letters.length; i++) {
            let letter = letters[i];
            let newDigits = digits + letter;
            backtrack(index + 1, numMap, path, ans, newDigits);
        }
    }

    function test(digits: string) {
        console.log(letterCombinations(digits));
    }

    test('23');
    test('');
    test('2');
})();
