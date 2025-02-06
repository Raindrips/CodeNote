namespace _1041 {
    function isRobotBounded(instructions: string): boolean {
        const dir = [
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0],
        ];
        let pos = [0, 0];
        let count = 0;
        let d = 0;
        for (let i = 0; i < instructions.length * 10; i++) {
            const c = instructions[i % instructions.length];
            switch (c) {
                case 'G':
                    pos[0] += dir[d][0];
                    pos[1] += dir[d][1];
                    if (pos[0] == 0 && pos[1] == 0) {
                        count++;
                        i=0;
                        if (count > 4) {
                            return true;
                        }

                    }
                    break;
                case 'L':
                    d = cyclicData(d - 1, dir.length);
                    break;

                case 'R':
                    d = cyclicData(d + 1, dir.length);
                    break;
            }
        }
        return false;
    }

    function cyclicData(index: number, n: number) {
        if (n <= 0) return NaN;
        return index >= 0 ? index % n : (n + (index % n)) % n;
    }

    function test(instructions: string) {
        console.log(isRobotBounded(instructions));
    }

    test('GGLLGG');
    test('GG');
    test("GL");
}
