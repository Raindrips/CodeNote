type Compare = string | number; // 顶点类型

/**
 * 有向图
 */
export class DirectedGraph {
    private adjacencyList: { [key: Compare]: Set<Compare> };

    constructor() {
        this.adjacencyList = {}; // 使用对象来存储邻接表
    }

    // 添加顶点
    addVertex(vertex: Compare): void {
        const key = this.getKey(vertex);
        if (!this.adjacencyList[key]) {
            this.adjacencyList[key] = new Set();
        }
    }

    // 连接顶点（有向边）
    addEdge(from: Compare, to: Compare): void {
        const fromKey = this.getKey(from);
        const toKey = this.getKey(to);

        // 确保这两个顶点都已存在
        if (!this.adjacencyList[fromKey]) {
            this.addVertex(from);
        }
        if (!this.adjacencyList[toKey]) {
            this.addVertex(to);
        }

        this.adjacencyList[fromKey].add(to);
    }

    // 删除顶点及其所有相关的边
    removeVertex(vertex: Compare): void {
        const key = this.getKey(vertex);

        // 删除所有与该顶点相关的边
        delete this.adjacencyList[key];

        // 删除从其他顶点指向该顶点的所有边
        for (const v in this.adjacencyList) {
            this.adjacencyList[v].delete(vertex);
        }
    }

    // 检查是否有直接连接
    hasEdge(from: Compare, to: Compare): boolean {
        const fromKey = this.getKey(from);
        const toKey = this.getKey(to);
        return this.adjacencyList[fromKey]?.has(to) ?? false;
    }

    // 检查是否有连通路径（深度优先搜索DFS）
    isConnected(from: Compare, to: Compare): boolean {
        const visited = new Set<Compare>();
        return this.dfs(from, to, visited);
    }

    // 获取顶点的唯一键值
    private getKey(vertex: Compare): string {
        return String(vertex); // 将所有类型转化为字符串形式
    }

    // 深度优先搜索实现
    private dfs(
        from: Compare,
        to: Compare,
        visited: Set<Compare>,
    ): boolean {
        const key = this.getKey(from);

        if (visited.has(from)) {
            return false;
        }

        visited.add(from);

        if (from === to) {
            return true;
        }

        for (const neighbor of this.adjacencyList[key] || []) {
            if (this.dfs(neighbor, to, visited)) {
                return true;
            }
        }

        return false;
    }

    // 打印邻接表，用于调试
    printGraph(): void {
        console.log(this.adjacencyList);
    }
}

// 使用示例

const graph = new DirectedGraph();

// 添加顶点
graph.addVertex('A');
graph.addVertex('B');
graph.addVertex('C');

// 连接顶点
graph.addEdge('A', 'B');
graph.addEdge('B', 'C');

// 打印邻接表
graph.printGraph(); // { A: Set { 'B' }, B: Set { 'C' }, C: Set {} }

// 检查连通性
console.log(graph.isConnected('A', 'C')); // true
console.log(graph.isConnected('C', 'A')); // false

// 删除顶点
graph.removeVertex('B');
graph.printGraph(); // { A: Set {}, C: Set {} }

// 检查删除后连通性
console.log(graph.isConnected('A', 'C')); // false
