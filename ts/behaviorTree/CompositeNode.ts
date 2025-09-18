import { BehaviorTreeNode } from './BehaviorTreeNode';
import { NodeStatus } from './type';

/**
 * 并行执行策略枚举
 */
export enum ParallelPolicy {
    ALL_SUCCESS = 'ALL_SUCCESS', // 所有子节点都成功才算成功
    ANY_SUCCESS = 'ANY_SUCCESS', // 任意子节点成功就算成功
    ALL_FAILURE = 'ALL_FAILURE', // 所有子节点都失败才算失败
    ANY_FAILURE = 'ANY_FAILURE', // 任意子节点失败就算失败
}

/**
 * 组合节点抽象基类
 * 包含多个子节点，用于控制子节点的执行顺序和逻辑
 */
export abstract class CompositeNode extends BehaviorTreeNode {
    protected children: BehaviorTreeNode[] = [];
    protected currentChildIndex: number = 0;

    constructor(name: string, children: BehaviorTreeNode[] = []) {
        super(name);
        this.children = [...children];
    }

    /**
     * 添加子节点
     */
    public addChild(child: BehaviorTreeNode): void {
        this.children.push(child);
    }

    /**
     * 移除子节点
     */
    public removeChild(child: BehaviorTreeNode): boolean {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * 获取子节点数量
     */
    public getChildCount(): number {
        return this.children.length;
    }

    /**
     * 获取指定索引的子节点
     */
    public getChild(index: number): BehaviorTreeNode | null {
        return index >= 0 && index < this.children.length
            ? this.children[index]
            : null;
    }

    /**
     * 重置节点状态
     */
    public reset(): void {
        super.reset();
        this.currentChildIndex = 0;
        // 重置所有子节点
        this.children.forEach((child) => child.reset());
    }

    /**
     * 中断节点执行
     */
    public interrupt(): void {
        super.interrupt();
        // 中断所有子节点
        this.children.forEach((child) => child.interrupt());
    }

    protected onReset(): void {
        this.currentChildIndex = 0;
    }
}


