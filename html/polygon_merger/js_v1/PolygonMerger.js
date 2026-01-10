/**
 * 多边形合并器 - 核心算法类（与渲染无关）
 */
class PolygonMerger
{
    constructor()
    {
        this.squares = [];
    }

    addSquare(square)
    {
        this.squares.push(square);
    }

    // 使用并查集找出所有连通的正方形组
    findConnectedGroups()
    {
        const n = this.squares.length;
        const parent = Array.from({ length: n }, (_, i) => i);

        const find = (x) =>
        {
            if (parent[x] !== x) {
                parent[x] = find(parent[x]);
            }
            return parent[x];
        };

        const union = (x, y) =>
        {
            const rootX = find(x);
            const rootY = find(y);
            if (rootX !== rootY) {
                parent[rootX] = rootY;
            }
        };

        // 检查所有正方形对，如果相邻则合并到同一组
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                if (this.squares[i].isAdjacent(this.squares[j])) {
                    union(i, j);
                }
            }
        }

        // 将正方形按组分类
        const groups = {};
        for (let i = 0; i < n; i++) {
            const root = find(i);
            if (!groups[root]) {
                groups[root] = [];
            }
            groups[root].push(this.squares[i]);
        }

        return Object.values(groups);
    }

    // 从一组正方形中提取外轮廓
    extractOutline(squares)
    {
        // 收集所有边
        const edges = new Map();

        for (const sq of squares) {
            const vertices = sq.getVertices();
            // 添加四条边
            const edgeList = [
                [vertices[0], vertices[1]], // 上
                [vertices[1], vertices[2]], // 右
                [vertices[2], vertices[3]], // 下
                [vertices[3], vertices[0]]  // 左
            ];

            for (const edge of edgeList) {
                const key = this.edgeKey(edge[0], edge[1]);
                edges.set(key, (edges.get(key) || 0) + 1);
            }
        }

        // 只保留出现一次的边（外轮廓边）
        const outlineEdges = [];
        for (const [key, count] of edges.entries()) {
            if (count === 1) {
                const [p1, p2] = this.parseEdgeKey(key);
                outlineEdges.push([p1, p2]);
            }
        }

        // 将边连接成有序的轮廓路径
        return this.orderEdges(outlineEdges);
    }

    // 创建边的唯一键
    edgeKey(p1, p2)
    {
        const [first, second] = [p1, p2].sort((a, b) =>
            a.x !== b.x ? a.x - b.x : a.y - b.y
        );
        return `${first.x.toFixed(2)},${first.y.toFixed(2)}-${second.x.toFixed(2)},${second.y.toFixed(2)}`;
    }

    parseEdgeKey(key)
    {
        const [p1Str, p2Str] = key.split('-');
        const [x1, y1] = p1Str.split(',').map(Number);
        const [x2, y2] = p2Str.split(',').map(Number);
        return [{ x: x1, y: y1 }, { x: x2, y: y2 }];
    }

    // 将无序的边连接成有序路径
    orderEdges(edges)
    {
        if (edges.length === 0) return [];

        const path = [edges[0][0], edges[0][1]];
        edges.splice(0, 1);

        while (edges.length > 0) {
            const lastPoint = path[path.length - 1];
            let found = false;

            for (let i = 0; i < edges.length; i++) {
                const [p1, p2] = edges[i];

                if (this.pointsEqual(p1, lastPoint)) {
                    path.push(p2);
                    edges.splice(i, 1);
                    found = true;
                    break;
                } else if (this.pointsEqual(p2, lastPoint)) {
                    path.push(p1);
                    edges.splice(i, 1);
                    found = true;
                    break;
                }
            }

            if (!found) break;
        }

        return path;
    }

    pointsEqual(p1, p2)
    {
        return Math.abs(p1.x - p2.x) < 0.1 && Math.abs(p1.y - p2.y) < 0.1;
    }

    // 主方法：合并所有正方形并返回多边形轮廓
    mergeAll()
    {
        const groups = this.findConnectedGroups();
        const polygons = [];

        for (const group of groups) {
            const outline = this.extractOutline(group);
            if (outline.length > 0) {
                polygons.push(outline);
            }
        }

        return polygons;
    }

    clear()
    {
        this.squares = [];
    }
}
