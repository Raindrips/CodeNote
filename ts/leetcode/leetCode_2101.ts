// 2101. 引爆最多的炸弹
//https://leetcode.cn/problems/detonate-the-maximum-bombs/
namespace _2101 {
    // 炸弹爆炸范围是一个圆，爆炸范围内的炸弹可以相互引爆
    // 求最多引爆多少个炸弹
    function maximumDetonation(bombs: number[][]): number {
        const n = bombs.length;
        const graph = new Array(n).fill(0).map(() => new Array());

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (i === j) continue;
                const [x, y, r] = bombs[i];
                const [x1, y1, r1] = bombs[j];
                if (isConnect(x, y, r, x1, y1)) {
                    graph[i].push(j);
                }
            }
        }
        let m = 0,
            i = 0;
        const visited = new Array(n).fill(false);
        for (const b of bombs) {
            m = Math.max(m, dfs(graph, new Array(n).fill(false), i));
            i++;
        }
        return m;
    }

    function isConnect(x: number, y: number, r: number, x1: number, y1: number) {
        const dx = x - x1;
        const dy = y - y1;
        return r * r >= dx * dx + dy * dy;
    }

    function dfs(graph: number[][], visited: boolean[], i: number) {
        visited[i] = true;
        let count = 1;
        for (const j of graph[i]) {
            if (!visited[j]) {
                count += dfs(graph, visited, j);
            }
        }
        return count;
    }

    function test(bombs: number[][]) {
        console.log(maximumDetonation(bombs));
    }

    test([
        [2, 1, 3],
        [6, 1, 4],
    ]);
    test([
        [1, 1, 5],
        [10, 10, 5],
    ]);
    test([
        [1, 2, 3],
        [2, 3, 1],
        [3, 4, 2],
        [4, 5, 3],
        [5, 6, 4],
    ]);
}
