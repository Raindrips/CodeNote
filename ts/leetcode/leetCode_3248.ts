namespace _2734 {
    const Command: { [key: string]: { x: number; y: number } } = {
        'UP': { y: -1, x: 0 },
        'RIGHT': { y: 0, x: 1 },
        'DOWN': { y: 1, x: 0 },
        'LEFT': { y: 0, x: -1 },
    };
    function finalPositionOfSnake(n: number, commands: string[]): number {
        const map = initGrid(n);
        console.log(map)
        let x = 0,
            y = 0;
        for (const command of commands) {
            x += Command[command].x;
            y += Command[command].y;
        }
        return map[y][x];
    }

    function initGrid(n: number) {
        const grid: number[][] = [];
        for (let i = 0; i < n; i++) {
            grid[i] = [];
            for (let j = 0; j < n; j++) {
                grid[i][j] = i * n + j;
            }
        }
        return grid;
    }

    function test(n: number, commands: string[]) {
        console.log(finalPositionOfSnake(n, commands));
    }

    test(2, ['RIGHT', 'DOWN']);
    test(3, ['DOWN', 'RIGHT', 'UP']);
}
