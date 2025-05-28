namespace _3274 {
    function checkTwoChessboards(coordinate1: string, coordinate2: string): boolean {
        const x1 = wordToNum(coordinate1[0]);
        const y1 = parseInt(coordinate1[1]);
        const a = x1 + y1;

        const x2 = wordToNum(coordinate2[0]);
        const y2 = parseInt(coordinate2[1]);
        const b = x2 + y2;

        return (a + b) % 2 === 0;
    }

    function wordToNum(a: string) {
        return a.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
    }

    function test(coordinate1: string, coordinate2: string) {
        console.log(checkTwoChessboards(coordinate1, coordinate2));
    }

    test('a1', 'c3');
    test('h3', 'h3');
    test('a1', 'h3');
}
