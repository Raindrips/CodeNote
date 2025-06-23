(() => {
    function minimumDeletions(word: string, k: number): number {
        let rec: Record<string, number> & Object = {};
        for (let w of word) {
            if (w in rec) {
                rec[w]++;
            } else {
                rec[w] = 1;
            }
        }
        let count = Object.values(rec);
        let ans = word.length;
        for (let min_f of count) {
            let max_f = min_f + k;
            let deletions = 0;
            for (let f of count) {
                if (f < min_f) {
                    //全部删除
                    deletions += f;
                } else if (f > max_f) {
                    // 删除超出部分
                    deletions += f - max_f;
                }
            }
            ans = Math.min(ans, deletions);
        }
        return ans;
    }

    function test(word: string, k: number) {
        console.log(minimumDeletions(word, k));
    }

    test('aabcaba', 0);
    test('dabdcbdcdcd', 2);
    test('aaabaaa', 2);
})();
