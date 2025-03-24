namespace _ovbknc {
    function equationsPossible(equations: string[]): boolean {
        const uf = new UnionFind(26);
        for (let i = 0; i < equations.length; i++) {
            const [a, b, bool] = getObj(equations[i]);
            if (bool) {
                uf.union(id(a), id(b));
            }
        }
        for (let i = 0; i < equations.length; i++) {
            const [a, b, bool] = getObj(equations[i]);
            if (!bool) {
                if (uf.connected(id(a), id(b))) {
                    return false;
                }
            }
        }
        return true;
    }

    function getObj(equation: string): [string, string, boolean] {
        const a = equation.charAt(0);
        const b = equation.charAt(equation.length - 1);
        const bool: boolean = equation.substring(1, 3) == '==';

        return [a, b, bool];
    }

    function id(a: string) {
        return a.charCodeAt(0) - 'a'.charCodeAt(0);
    }

    //并查集

    class UnionFind {
        private parent: number[]; // 用于记录每个元素的父节点
        private rank: number[]; // 用于记录树的高度（按秩合并）

        constructor(size: number) {
            // 初始化并查集
            this.parent = Array(size)
                .fill(0)
                .map((_, index) => index);
            this.rank = Array(size).fill(1); // 初始时每个元素的秩为 1
        }

        // 查找操作，带路径压缩
        //查找元素 x 所在的集合的代表元素（即根节点）。路径压缩的作用是将路径上所有节点直接连接到根节点，从而加速后续的查找操作
        find(x: number): number {
            if (this.parent[x] !== x) {
                // 路径压缩：让每个节点直接指向其根节点
                this.parent[x] = this.find(this.parent[x]);
            }
            return this.parent[x];
        }

        // 合并操作，按秩合并
        union(x: number, y: number): void {
            const rootX = this.find(x);
            const rootY = this.find(y);

            if (rootX !== rootY) {
                // 按秩合并：将秩较小的树合并到秩较大的树下面
                if (this.rank[rootX] > this.rank[rootY]) {
                    this.parent[rootY] = rootX;
                } else if (this.rank[rootX] < this.rank[rootY]) {
                    this.parent[rootX] = rootY;
                } else {
                    this.parent[rootY] = rootX;
                    this.rank[rootX] += 1; // 增加秩
                }
            }
        }

        // 判断两个元素是否在同一个集合中
        connected(x: number, y: number): boolean {
            return this.find(x) === this.find(y);
        }
    }

    // test
    (function () {
        // const uf = new UnionFind(6);
        // uf.union(1, 2);
        // uf.union(1, 3);
        // uf.union(3, 2);
        // uf.union(4, 5);

        // //判断是否连通
        // console.log(uf.connected(1, 3));

        // console.log(uf.find(3));
        let s = equationsPossible(['b==a', 'a==b']);
        console.log(s);
    })();
}
