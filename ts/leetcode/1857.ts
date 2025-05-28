(function () {
    function largestPathValue(colors: string, edges: number[][]): number {
        let cv: number[][] = [];
        let g: number[][] = [];
        let vis: number[] = [];
        return visited();
        function visited() {
            let n = colors.length;
            cv = new Array(n);
            vis = new Array(n);
            g = new Array(n);

            for (let i = 0; i < edges.length; i++) {
                const e = edges[i];
                g[e[0]].push(e[1]);
            }
            let ans = 0;

            for (let i = 0; i < n; i++) {
                if (vis[i] === 0) {
                    if (!dfs(colors, i)) return -1;
                    ans = Math.max(ans, maxArr(cv[i]));
                }
            }
            return ans;
        }

        function maxArr(arr: number[]) {
            let m = arr[0];
            for (let i = 1; i < arr.length; i++) {
                m = Math.max(m, arr[0]);
            }
            return m;
        }

        function dfs(color: string, u: number) {
            if (vis[u] == 1) return false;
            if (vis[u] == 2) return true;

            vis[u] = 1;
            for (const v of g[u]) {
                if (!dfs(color, v)) return false;
            }
            for (const v of g[u]) {
                for (let c = 0; c < 26; c++) {
                    cv[u][c] = Math.max(cv[u][c], cv[v][c]);
                }
            }
            cv[u][colors[u].charCodeAt(0) - 'a'.charCodeAt(0)]++;
            vis[u] = 2;
            return true;
        }
    }

    function test(colors: string, edges: number[][]) {
        console.log(largestPathValue(colors, edges));
    }

    test('abaca', [
        [0, 1],
        [0, 2],
        [2, 3],
        [3, 4],
    ]);
})();
