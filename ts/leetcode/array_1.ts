// 对角线遍历

namespace _array {
    function findDiagonalOrder(mat: number[][]): number[] {
        const M = mat.length;
        const N = mat[0].length;
        let result: number[] = [];
        const dir: [number, number][] = [
            [-1, 1],
            [0, 1],
            [1, -1],
            [1, 0],
        ];
        let x = 0,
            z = 0,
            d = 0,
            bCount = 0;
        result.push(mat[z][x]);
        while (true) {
            const newZ = z + dir[d][0];
            const newX = x + dir[d][1];
            if (result.length >= N * M) {
                break;
            }
            if (!isArea(newZ, M) || !isArea(newX, N)) {
                d = (d + 1) % dir.length;
                continue;
            }

            z = newZ;
            x = newX;
            result.push(mat[z][x]);
            if (d == 1 || d == 3) {
                d = (d + 1) % dir.length;
            }
        }
        return result;
    }
    function isArea(x: number, length: number) {
        return x >= 0 && x < length;
    }

    function test(mat: number[][]) {
        console.log(findDiagonalOrder(mat));
    }

    test([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
    ]);
}
