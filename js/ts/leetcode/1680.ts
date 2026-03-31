(() => {
    function concatenatedBinary(n: number): number {
        let buf: string[] = [];
        for (let i = 1; i <= n; i++) {
            buf.push(intToBinaryString(i));
        }
        const binStr = buf.join('');
        return binaryStringToIntWithMod(binStr);
    }

    function intToBinaryString(num: number): string {
        return num.toString(2);
    }
    function binaryStringToIntWithMod(binStr: string): number {
        if (!binStr) {
            return 0;
        }
        const MOD = BigInt(10 ** 9 + 7);

        // '0b' 前缀告诉 BigInt 这是一个二进制格式
        const bigNum = BigInt('0b' + binStr);

        const result = bigNum % MOD;
        return Number(result);
    }

    function test(n: number) {
        console.log('result:', concatenatedBinary(n));
    }

    test(1);
    test(3);
    test(12);
})();
