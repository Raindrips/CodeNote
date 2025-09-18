import { BehaviorTreeNode } from './BehaviorTreeNode';
import { CompositeNode } from './CompositeNode';
import { NodeStatus } from './type';

/**
 * 行为树统计信息
 */
export interface BehaviorTreeStats {
    totalNodes: number; // 总节点数
    runningNodes: number; // 正在运行的节点数
    successNodes: number; // 成功的节点数
    failureNodes: number; // 失败的节点数
    executionTime: number; // 执行时间（毫秒）
    tickCount: number; // tick次数
}

/**
 * 行为树执行模式
 */
export enum ExecutionMode {
    CONTINUOUS = 'CONTINUOUS', // 持续执行模式：每次update都执行
    ON_DEMAND = 'ON_DEMAND', // 按需执行模式：只有当树未运行时才执行
    SINGLE_SHOT = 'SINGLE_SHOT', // 单次执行模式：只执行一次直到完成
}

/**
 * 行为树主体类
 * 作为行为树的入口点，管理整个行为树的执行
 */
export class BehaviorTree {
    private root: BehaviorTreeNode | null = null;
    private isRunning: boolean = false;
    private executionMode: ExecutionMode = ExecutionMode.CONTINUOUS;
    private tickCount: number = 0;
    private lastExecutionTime: number = 0;
    private totalExecutionTime: number = 0;
    private name: string;

    // 调试和监控
    private enableDebug: boolean = false;
    private maxTicksPerUpdate: number = 1000; // 防止无限循环
    private onStatusChange?: (status: NodeStatus) => void;
    private onNodeExecute?: (
        node: BehaviorTreeNode,
        status: NodeStatus,
    ) => void;

    constructor(name: string = 'BehaviorTree', root?: BehaviorTreeNode) {
        this.name = name;
        if (root) {
            this.setRoot(root);
        }
    }

    // ===== 根节点管理 =====

    /**
     * 设置根节点
     */
    public setRoot(root: BehaviorTreeNode): void {
        if (this.root) {
            this.root.interrupt();
            this.root.reset();
        }
        this.root = root;
        this.reset();
        this.log(`根节点设置为: ${root.getName()}`);
    }

    /**
     * 获取根节点
     */
    public getRoot(): BehaviorTreeNode | null {
        return this.root;
    }

    /**
     * 添加子节点到根节点（如果根节点是组合节点）
     */
    public addChild(child: BehaviorTreeNode): boolean {
        if (!this.root) {
            this.log('警告: 没有根节点，无法添加子节点');
            return false;
        }

        if (this.root instanceof CompositeNode) {
            (this.root as CompositeNode).addChild(child);
            this.log(`添加子节点: ${child.getName()}`);
            return true;
        } else {
            this.log('警告: 根节点不是组合节点，无法添加子节点');
            return false;
        }
    }

    /**
     * 从根节点移除子节点（如果根节点是组合节点）
     */
    public removeChild(child: BehaviorTreeNode): boolean {
        if (!this.root) {
            return false;
        }

        if (this.root instanceof CompositeNode) {
            const success = (this.root as CompositeNode).removeChild(
                child,
            );
            if (success) {
                this.log(`移除子节点: ${child.getName()}`);
            }
            return success;
        }

        return false;
    }

    // ===== 执行控制 =====

    /**
     * 游戏主循环调用的更新接口
     * 只有作为根节点时才生效
     */
    public update(): NodeStatus | null {
        if (!this.root) {
            this.log('警告: 没有根节点，无法执行');
            return null;
        }

        const startTime = performance.now();
        let currentStatus: NodeStatus;

        try {
            switch (this.executionMode) {
                case ExecutionMode.CONTINUOUS:
                    currentStatus = this.tick();
                    break;

                case ExecutionMode.ON_DEMAND:
                    if (
                        !this.isRunning ||
                        this.root.getStatus() === NodeStatus.RUNNING
                    ) {
                        currentStatus = this.tick();
                    } else {
                        currentStatus = this.root.getStatus();
                    }
                    break;

                case ExecutionMode.SINGLE_SHOT:
                    if (!this.isRunning) {
                        currentStatus = this.tick();
                        if (currentStatus !== NodeStatus.RUNNING) {
                            this.stop();
                        }
                    } else {
                        currentStatus = this.root.getStatus();
                    }
                    break;

                default:
                    currentStatus = this.tick();
                    break;
            }

            const endTime = performance.now();
            this.lastExecutionTime = endTime - startTime;
            this.totalExecutionTime += this.lastExecutionTime;

            // 触发状态变化回调
            if (
                this.onStatusChange &&
                currentStatus !== NodeStatus.RUNNING
            ) {
                this.onStatusChange(currentStatus);
            }

            this.log(
                `Update完成，状态: ${currentStatus}, 耗时: ${this.lastExecutionTime.toFixed(
                    2,
                )}ms`,
            );
            return currentStatus;
        } catch (error) {
            this.log(`执行出错: ${error}`);
            this.stop();
            return NodeStatus.FAILURE;
        }
    }

    /**
     * 执行一次tick（可被其他节点引用调用）
     */
    public tick(): NodeStatus {
        if (!this.root) {
            return NodeStatus.FAILURE;
        }

        if (this.tickCount >= this.maxTicksPerUpdate) {
            this.log(`警告: tick次数超过限制 ${this.maxTicksPerUpdate}`);
            return NodeStatus.FAILURE;
        }

        this.tickCount++;
        this.isRunning = true;

        const status = this.root.execute();

        // 触发节点执行回调
        if (this.onNodeExecute) {
            this.onNodeExecute(this.root, status);
        }

        if (status !== NodeStatus.RUNNING) {
            this.isRunning = false;
        }

        return status;
    }

    /**
     * 启动行为树
     */
    public start(): void {
        if (!this.root) {
            this.log('警告: 没有根节点，无法启动');
            return;
        }

        this.log('启动行为树');
        this.isRunning = true;
        this.tickCount = 0;
    }

    /**
     * 停止行为树
     */
    public stop(): void {
        this.log('停止行为树');
        this.isRunning = false;
        if (this.root) {
            this.root.interrupt();
        }
    }

    /**
     * 暂停行为树
     */
    public pause(): void {
        this.log('暂停行为树');
        this.isRunning = false;
    }

    /**
     * 恢复行为树
     */
    public resume(): void {
        this.log('恢复行为树');
        this.isRunning = true;
    }

    /**
     * 重置行为树
     */
    public reset(): void {
        this.log('重置行为树');
        this.tickCount = 0;
        this.totalExecutionTime = 0;
        this.lastExecutionTime = 0;
        this.isRunning = false;

        if (this.root) {
            this.root.reset();
        }
    }

    // ===== 状态查询 =====

    /**
     * 检查行为树是否正在运行
     */
    public getIsRunning(): boolean {
        return this.isRunning;
    }

    /**
     * 获取当前状态
     */
    public getStatus(): NodeStatus | null {
        return this.root ? this.root.getStatus() : null;
    }

    /**
     * 获取执行模式
     */
    public getExecutionMode(): ExecutionMode {
        return this.executionMode;
    }

    /**
     * 设置执行模式
     */
    public setExecutionMode(mode: ExecutionMode): void {
        this.executionMode = mode;
        this.log(`执行模式设置为: ${mode}`);
    }

    // ===== 统计信息 =====

    /**
     * 获取行为树统计信息
     */
    public getStats(): BehaviorTreeStats {
        const stats = this.collectNodeStats(this.root);
        return {
            ...stats,
            executionTime: this.totalExecutionTime,
            tickCount: this.tickCount,
        };
    }

    /**
     * 递归收集节点统计信息
     */
    private collectNodeStats(
        node: BehaviorTreeNode | null,
    ): Omit<BehaviorTreeStats, 'executionTime' | 'tickCount'> {
        if (!node) {
            return {
                totalNodes: 0,
                runningNodes: 0,
                successNodes: 0,
                failureNodes: 0,
            };
        }

        let stats = {
            totalNodes: 1,
            runningNodes: node.getStatus() === NodeStatus.RUNNING ? 1 : 0,
            successNodes: node.getStatus() === NodeStatus.SUCCESS ? 1 : 0,
            failureNodes: node.getStatus() === NodeStatus.FAILURE ? 1 : 0,
        };

        // 如果是组合节点，递归收集子节点统计
        if (node instanceof CompositeNode) {
            const composite = node as CompositeNode;
            for (let i = 0; i < composite.getChildCount(); i++) {
                const child = composite.getChild(i);
                if (child) {
                    const childStats = this.collectNodeStats(child);
                    stats.totalNodes += childStats.totalNodes;
                    stats.runningNodes += childStats.runningNodes;
                    stats.successNodes += childStats.successNodes;
                    stats.failureNodes += childStats.failureNodes;
                }
            }
        }

        return stats;
    }

    // ===== 调试和监控 =====

    /**
     * 启用/禁用调试模式
     */
    public setDebugMode(enabled: boolean): void {
        this.enableDebug = enabled;
        this.log(`调试模式: ${enabled ? '启用' : '禁用'}`);
    }

    /**
     * 设置最大tick次数限制
     */
    public setMaxTicksPerUpdate(maxTicks: number): void {
        this.maxTicksPerUpdate = Math.max(1, maxTicks);
        this.log(`最大tick次数设置为: ${this.maxTicksPerUpdate}`);
    }

    /**
     * 设置状态变化回调
     */
    public setOnStatusChange(
        callback: (status: NodeStatus) => void,
    ): void {
        this.onStatusChange = callback;
    }

    /**
     * 设置节点执行回调
     */
    public setOnNodeExecute(
        callback: (node: BehaviorTreeNode, status: NodeStatus) => void,
    ): void {
        this.onNodeExecute = callback;
    }

    /**
     * 获取行为树名称
     */
    public getName(): string {
        return this.name;
    }

    /**
     * 设置行为树名称
     */
    public setName(name: string): void {
        this.name = name;
    }

    /**
     * 输出行为树结构（用于调试）
     */
    public printTree(): string {
        if (!this.root) {
            return 'Empty BehaviorTree';
        }
        return this.printNodeTree(this.root, 0);
    }

    /**
     * 递归打印节点树结构
     */
    private printNodeTree(node: BehaviorTreeNode, depth: number): string {
        const indent = '  '.repeat(depth);
        let result = `${indent}├─ ${node.getName()} [${node.getStatus()}]\n`;

        if (node instanceof CompositeNode) {
            const composite = node as CompositeNode;
            for (let i = 0; i < composite.getChildCount(); i++) {
                const child = composite.getChild(i);
                if (child) {
                    result += this.printNodeTree(child, depth + 1);
                }
            }
        }

        return result;
    }

    /**
     * 日志输出
     */
    private log(message: string): void {
        if (this.enableDebug) {
            console.log(`[BehaviorTree:${this.name}] ${message}`);
        }
    }

    // ===== 工具方法 =====

    /**
     * 查找指定名称的节点
     */
    public findNode(name: string): BehaviorTreeNode | null {
        return this.findNodeRecursive(this.root, name);
    }

    /**
     * 递归查找节点
     */
    private findNodeRecursive(
        node: BehaviorTreeNode | null,
        name: string,
    ): BehaviorTreeNode | null {
        if (!node) {
            return null;
        }

        if (node.getName() === name) {
            return node;
        }

        if (node instanceof CompositeNode) {
            const composite = node as CompositeNode;
            for (let i = 0; i < composite.getChildCount(); i++) {
                const child = composite.getChild(i);
                const found = this.findNodeRecursive(child, name);
                if (found) {
                    return found;
                }
            }
        }

        return null;
    }

    /**
     * 获取所有叶子节点
     */
    public getLeafNodes(): BehaviorTreeNode[] {
        const leaves: BehaviorTreeNode[] = [];
        this.collectLeafNodes(this.root, leaves);
        return leaves;
    }

    /**
     * 递归收集叶子节点
     */
    private collectLeafNodes(
        node: BehaviorTreeNode | null,
        leaves: BehaviorTreeNode[],
    ): void {
        if (!node) {
            return;
        }

        if (node instanceof CompositeNode) {
            const composite = node as CompositeNode;
            if (composite.getChildCount() === 0) {
                leaves.push(node);
            } else {
                for (let i = 0; i < composite.getChildCount(); i++) {
                    const child = composite.getChild(i);
                    this.collectLeafNodes(child, leaves);
                }
            }
        } else {
            leaves.push(node);
        }
    }

    /**
     * 克隆行为树（浅拷贝）
     */
    public clone(newName?: string): BehaviorTree {
        const clonedTree = new BehaviorTree(
            newName || `${this.name}_Clone`,
        );
        if (this.root) {
            clonedTree.setRoot(this.root); // 注意：这里是浅拷贝，共享节点引用
        }
        clonedTree.setExecutionMode(this.executionMode);
        clonedTree.setDebugMode(this.enableDebug);
        clonedTree.setMaxTicksPerUpdate(this.maxTicksPerUpdate);
        return clonedTree;
    }
}
