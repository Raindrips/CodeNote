// 32. 最长有效括号
// https://leetcode.cn/problems/longest-valid-parentheses/
namespace _42 {
    function longestValidParentheses(s: string): number {
        if (s.length < 2) return 0;
        let left = 0;
        let right = 1;
        let m = 0;
        while (left < right&&right<=s.length && right - left + 1 > m) {
            const moveRight = (): void => {
                if (right < s.length) {
                    right++;
                } else {
                    left++;
                    right = left + 1;
                }
            };
            const sub = s.substring(left, right + 1);

            if (isValid(sub)) {
                // 正确
                m = Math.max(m, sub.length);
                moveRight();
            } else if (isUnfinished(sub)) {
                // 未完成
                moveRight();
            } else {
                // 错误
                left = right;
                right += 1;
            }
        }
        return m;
    }

    //是否是未完成的有效括号
    function isUnfinished(s: string): boolean {
        const stack: string[] = [];
        for (let i = 0; i < s.length; i++) {
            const c = s[i];
            if (c === '(') {
                stack.push(c);
            } else {
                const top = stack.pop();
                if (top !== '(') {
                    return false;
                }
            }
        }
        return true;
    }

    // 是否是有效的括号
    function isValid(s: string): boolean {
        if (s.length % 2 === 1) {
            return false;
        }
        const stack: string[] = [];
        for (let i = 0; i < s.length; i++) {
            const c = s[i];
            if (c === '(') {
                stack.push(c);
            } else {
                const top = stack.pop();
                if (top !== '(') {
                    return false;
                }
            }
        }
        return stack.length === 0;
    }

    function test(s: string) {
        console.log(longestValidParentheses(s));
    }

    test(')(');
    test('');
    test('(()');
    test(')()())');
    test('()(())');
    test('(()');
    test(')(((((()())()()))()(()))('); //22
    test(')(())))(())())'); //6
}
