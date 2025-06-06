class DirGraph {
    adjacency: Map<number, Set<number>>;

    constructor(edges: number[]) {
        this.adjacency = new Map();
        for (let i = 0; i < edges.length; i++) {
            const v = edges[i];
            if (v === -1) continue;
            if (!this.adjacency.has(i)) this.adjacency.set(i, new Set());
            this.adjacency.get(i)!.add(v);
        }
    }

    // 获取某个节点的所有邻居
    neighbors(node: number): number[] {
        return Array.from(this.adjacency.get(node) || []);
    }

    // 最短路径长度
    shortestPathValue(start: number, end: number): number {
        if (start === end) return 0;
        const visited = new Set<number>();
        const queue: [number, number][] = [[start, 0]];
        visited.add(start);
        while (queue.length) {
            const [node, dist] = queue.shift()!;
            for (const neighbor of this.neighbors(node)) {
                if (neighbor === end) return dist + 1;
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push([neighbor, dist + 1]);
                }
            }
        }
        return -1;
    }

    // 最短路径节点序列
    shortestPath(start: number, end: number): number[] {
        if (start === end) return [start];
        const visited = new Set<number>();
        const queue: [number, number[]][] = [[start, [start]]];
        visited.add(start);
        while (queue.length) {
            const [node, path] = queue.shift()!;
            for (const neighbor of this.neighbors(node)) {
                if (neighbor === end) return [...path, end];
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push([neighbor, [...path, neighbor]]);
                }
            }
        }
        return [];
    }
}

// 无向图
class Graph {
    adjacency: Map<number, Set<number>>;

    constructor(edges: number[]) {
        this.adjacency = new Map();
        for (let i = 0; i < edges.length; i++) {
            const j = edges[i];
            if (j === -1) continue;
            if (!this.adjacency.has(i)) this.adjacency.set(i, new Set());
            if (!this.adjacency.has(j)) this.adjacency.set(j, new Set());
            this.adjacency.get(i)!.add(j);
            this.adjacency.get(j)!.add(i);
        }
    }

    // 获取某个节点的所有邻居
    neighbors(node: number): number[] {
        return Array.from(this.adjacency.get(node) || []);
    }

    // 最短路径长度
    shortestPathValue(start: number, end: number): number {
        if (start === end) return 0;
        const visited = new Set<number>();
        const queue: [number, number][] = [[start, 0]];
        visited.add(start);
        while (queue.length) {
            const [node, dist] = queue.shift()!;
            for (const neighbor of this.neighbors(node)) {
                if (neighbor === end) return dist + 1;
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push([neighbor, dist + 1]);
                }
            }
        }
        return -1;
    }

    // 最短路径节点序列
    shortestPath(start: number, end: number): number[] {
        if (start === end) return [start];
        const visited = new Set<number>();
        const queue: [number, number[]][] = [[start, [start]]];
        visited.add(start);
        while (queue.length) {
            const [node, path] = queue.shift()!;
            for (const neighbor of this.neighbors(node)) {
                if (neighbor === end) return [...path, end];
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push([neighbor, [...path, neighbor]]);
                }
            }
        }
        return [];
    }
}

(() => {
    function closestMeetingNode(
        edges: number[],
        node1: number,
        node2: number,
    ): number {
        const g = new DirGraph(edges);
        let m = -1;
        for (let i = 0; i < edges.length; i++) {
            let p1 = g.shortestPathValue(node1, i);
            let p2 = g.shortestPathValue(node2, i);
            if (p1 == -1 || p2 == -1) {
                continue;
            }
            const max = Math.max(p1, p2);
            if (m == -1 || m < max) {
                m = max;
            }
        }
        return m;
    }

    function test(edges: number[], node1: number, node2: number) {
        console.log(closestMeetingNode(edges, node1, node2));
    }

    test([2, 2, 3, -1], 0, 1);
    test([1, 2, -1], 0, 2);
})();
