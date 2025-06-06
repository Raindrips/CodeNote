// 通用搜索参数接口
type SearchMode = 'BFS' | 'DFS';

export interface ISearchOptions<NodeType> {
    // 起点
    start: NodeType;
    // 获取子节点
    getNeighbors: (node: NodeType) => NodeType[];
    // 判断是否访问过
    isVisited: (node: NodeType) => boolean;
    // 标记为已访问
    markVisited: (node: NodeType) => void;
    // 判断是否为终点
    isTarget?: (node: NodeType) => boolean;
    // 节点入队/入栈时回调
    onEnqueue?: (node: NodeType) => void;
    // 节点出队/出栈时回调
    onDequeue?: (node: NodeType) => void;
    // 访问节点时回调
    onVisit?: (node: NodeType) => void;
    // 过滤子节点
    filterNeighbor?: (node: NodeType, neighbor: NodeType) => boolean;
    // 搜索模式
    mode: SearchMode;
}

// 通用非递归搜索实现
export class GeneralSearch {
    static search<T>(options: ISearchOptions<T>): T | undefined {
        const {
            start, getNeighbors, isVisited, markVisited, isTarget,
            onEnqueue, onDequeue, onVisit, filterNeighbor, mode
        } = options;
        const container: T[] = [];
        container.push(start);
        onEnqueue?.(start);
        while (container.length > 0) {
            const node = mode === 'BFS' ? container.shift()! : container.pop()!;
            onDequeue?.(node);
            if (isVisited(node)) continue;
            markVisited(node);
            onVisit?.(node);
            if (isTarget?.(node)) return node;
            for (const neighbor of getNeighbors(node)) {
                if (filterNeighbor && !filterNeighbor(node, neighbor)) continue;
                if (!isVisited(neighbor)) {
                    container.push(neighbor);
                    onEnqueue?.(neighbor);
                }
            }
        }
        return undefined;
    }
}

// 兼容原有 BFS/DFS 类名
export class BFS {
    static search = (options: Omit<ISearchOptions<any>, 'mode'>) => {
        return GeneralSearch.search({ ...options, mode: 'BFS' });
    };
}

export class DFS {
    static search = (options: Omit<ISearchOptions<any>, 'mode'>) => {
        return GeneralSearch.search({ ...options, mode: 'DFS' });
    };
}