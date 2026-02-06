(() => {
    function findSquares(grid: number[][]) {
        const h = grid.length;
        const w = grid[0].length;

        const used = Array.from({ length: h }, () => Array(w).fill(false));
        const result: number[][][] = [];

        const dir = [
            [0, 0], // 左上
            [1, 0], // 左下
            [0, 1], // 右上
            [1, 1], // 右下
        ];

        for (let x = 0; x < w - 1; x++) {
            for (let y = 0; y < h - 1; y++) {
                // 检查是否所有点都未使用
                let canUse = true;
                for (const [dx, dy] of dir) {
                    if (used[x + dy][y + dx]) {
                        canUse = false;
                        break;
                    }
                }
                if (!canUse) continue;

                // 检查 4 个点是否相等
                const v = grid[x][y];
                let ok = true;

                for (const [dx, dy] of dir) {
                    if (v == 5) {
                        console.log(x, y, dx, dy, grid[x + dx][y + dy], v);
                    }
                    if (grid[x + dx][y + dy] !== v) {
                        ok = false;
                        break;
                    }
                }
                if (!ok) continue;

                const square = dir.map(([dx, dy]) => [x + dx, y + dy]);
                result.push(square);

                for (const [xx, yy] of square) {
                    used[xx][yy] = true;
                }
            }
        }
        console.log(result, used);
        return result;
    }

    const grid = [
        [1, 1, 2, 2, 3, 3],
        [1, 1, 2, 2, 3, 3],
        [5, 5, 6, 6, 7, 7],
        [5, 5, 6, 6, 7, 7],
        [0, 2, 3, 4, 5, 6],
        [0, 1, 4, 1, 3, 2],
    ];

    console.log(findSquares(grid));
})();
