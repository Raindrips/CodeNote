//1422
{
    function maxScore(s: string): number {
        let m = 0;
        let left = 0;
        let right = 0;
        for (let i = 0; i < s.length; i++) {
            if (s[i] === '1') {
                right++;
            }
        }
        for (let i = 0; i < s.length - 1; i++) {
            if (s[i] === '0') {
                left++;
            } else {
                right--;
            }
            m = Math.max(m, left + right);
        }
        return m;
    }

    function test(s: string) {
        console.log(maxScore(s));
    }
    test('011101');
    test('1111');
    test('00');
}
