namespace _1842 {
    function countBalls(lowLimit: number, highLimit: number): number {
        let obj: { [k: number]: number } = {};
        let maxCount = 0;
        for (let i = lowLimit; i <= highLimit; i++) {
            const v = splice(i);
            if (!(v in obj)) {
                obj[v] = 0;
            }
            obj[v]++;
            if (obj[v] > maxCount) {
                maxCount = obj[v];
            }
        }
        return maxCount;
    }

    function splice(n: number) {
        let v = 0;
        while (n !== 0) {
            v += n % 10;
            n = Math.floor(n / 10);
        }
        return v;
    }

    function test(lowLimit: number, highLimit: number) {
        console.log('result:', countBalls(lowLimit, highLimit));
    }

    test(1, 10);
    test(5, 15);
    test(19, 28);
    test(10, 20);
}
