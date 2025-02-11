namespace _1561 {
    function maxCoins(piles: number[]): number {
        let n = piles.length;
        let n3 = n / 3;
        piles.sort((a, b) => a - b);
        let s = 0;
        let arr2 = piles.slice(n3, n);
        for (let i = 0; i < arr2.length; i+=2) {
            s += arr2[i];
        }
        return s;
    }

    function test(piles: number[], result: number) {
        let a = maxCoins(piles);
        console.log(a, a == result);
    }

    test([2, 4, 1, 2, 7, 8], 9);
    test([2, 4, 5], 4);
    test([9, 8, 7, 6, 5, 1, 2, 3, 4], 18);
}
