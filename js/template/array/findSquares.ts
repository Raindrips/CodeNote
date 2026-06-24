(() => {
    function findSquares(grid: number[][]) {
        const h = grid.length;
        const w = grid[0].length;
        const used = Array.from({ length: h }, () => Array(w).fill(false));
        const result: number[][][] = [];

        for (let y = 0; y < h - 1; y++) {
            for (let x = 0; x < w - 1; x++) {
                if (
                    !used[y][x] &&
                    !used[y][x + 1] &&
                    !used[y + 1][x] &&
                    !used[y + 1][x + 1]
                ) {
                    const v = grid[y][x];
                    if (
                        grid[y][x + 1] === v &&
                        grid[y + 1][x] === v &&
                        grid[y + 1][x + 1] === v
                    ) {
                        const square = [
                            [x, y],
                            [x + 1, y],
                            [x, y + 1],
                            [x + 1, y + 1],
                        ];
                        result.push(square);

                        // 标记已使用
                        for (const [xx, yy] of square) {
                            used[yy][xx] = true;
                        }
                    }
                }
            }
        }

        return result;
    }

    function findSquaresX(grid: number[][]) {
        const h = grid.length;
        const w = grid[0].length;

        const used = Array.from({ length: h }, () => Array(w).fill(false));
        const result: number[][][] = [];

        const dir = [
            [0, 0],
            [1, 0],
            [0, 1],
            [1, 1],
        ];

        for (let x = 0; x < w - 1; x++) {
            for (let y = 0; y < h - 1; y++) {
                // 检查是否所有点都未使用
                let canUse = true;
                for (const [dx, dy] of dir) {
                    if (used[y + dy][x + dx]) {
                        canUse = false;
                        break;
                    }
                }
                if (!canUse) continue;

                // 检查 4 个点是否相等
                const v = grid[y][x];
                let ok = true;
                for (const [dx, dy] of dir) {
                    if (grid[y + dy][x + dx] !== v) {
                        ok = false;
                        break;
                    }
                }
                if (!ok) continue;

                // 记录结果
                const square = dir.map(([dx, dy]) => [x + dx, y + dy]);
                result.push(square);

                // 标记已使用
                for (const [xx, yy] of square) {
                    used[yy][xx] = true;
                }
            }
        }

        return result;
    }

    const grid = [
        [6, 4, 1, 1, 3, 3],
        [3, 2, 1, 1, 3, 3],
        [4, 4, 2, 8, 7, 7],
        [1, 2, 2, 1, 7, 7],
        [6, 4, 1, 2, 8, 8],
        [6, 1, 6, 1, 8, 8],
    ];

    console.log(findSquaresX(grid));
})();
