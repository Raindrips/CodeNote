//https://leetcode.cn/problems/spiral-matrix-ii/description/

namespace _59 {
    function generateMatrix(n: number): number[][] {
        if(n==1){return [[1]]}
        const arr: number[][] = new Array(n);
        for (let i = 0; i < arr.length; i++) {
            arr[i] = new Array(n).fill(-1);
        }
        const dir = [
            { x: 1, y: 0 },
            { x: 0, y: 1 },
            { x: -1, y: 0 },
            { x: 0, y: -1 },
        ];
        let d = 0;
        let x = 0;
        let y = 0;
        let index = 1;
        arr[y][x] = index;
        while (true) {
            const newX = x + dir[d].x;
            const newY = y + dir[d].y;
            if (inArea(newX, newY, n, arr)) {
                y = newY;
                x = newX;
                arr[y][x] = ++index;
                if (index >= n * n) {
                    break;
                }
            } else {
                d = (d + 1) % dir.length;
            }
        }
        return arr;
    }

    function inArea(x: number, y: number, n: number, arr: number[][]) {
        if (x < 0 || x >= n || y < 0 || y >= n) {
            return false;
        }
        if (arr[y][x] !== -1) {
            return false;
        }
        return true;
    }

    function test(n: number) {
        console.log(generateMatrix(n));
    }

    test(1);
}
