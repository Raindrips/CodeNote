(() => {
    function maxDistance(s: string, k: number): number {
        let ret = 0;
        let dir: Record<string, number> = {
            'N': 0,
            'S': 0,
            'E': 0,
            'W': 0,
        };

        for (const d of s) {
            dir[d]++;
            const n1 =
                Math.max(dir['N'], dir['S']) +
                Math.max(dir['W'], dir['E']);
            const n2 =
                Math.min(dir['N'], dir['S']) +
                Math.min(dir['W'], dir['E']);

            ret = Math.max(ret, n1 - n2 + 2 * Math.min(n2, k));
        }

        return ret;
    }

    function test(s: string, k: number) {
        console.log(maxDistance(s, k));
    }

    test('NWSE', 1); //3
    test('NSWWEW', 3); //6
})();
