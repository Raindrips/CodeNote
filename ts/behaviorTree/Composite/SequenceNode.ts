import { BehaviorTreeNode } from '../BehaviorTreeNode';
import { CompositeNode } from '../CompositeNode';
import { NodeStatus } from '../type';

/**
 * 序列节点 (Sequence)
 * 依次执行所有子节点，只有当所有子节点都成功时才返回成功
 * 如果任何一个子节点失败，则立即返回失败
 * 如果当前子节点正在运行，则返回运行状态
 */
export class SequenceNode extends CompositeNode {
    constructor(
        name: string = 'SequenceNode',
        children: BehaviorTreeNode[] = [],
    ) {
        super(name, children);
    }

    onEnter(): void {
        super.onEnter();
        this.currentChildIndex = 0;
        console.log(
            `[${this.name}] 开始执行序列，共有 ${this.children.length} 个子节点`,
        );
    }

    onTick(): NodeStatus {
        // 如果没有子节点，直接返回成功
        if (this.children.length === 0) {
            console.log(`[${this.name}] 没有子节点，返回成功`);
            return NodeStatus.SUCCESS;
        }

        // 执行当前子节点
        while (this.currentChildIndex < this.children.length) {
            const currentChild = this.children[this.currentChildIndex];
            const childStatus = currentChild.execute();

            console.log(
                `[${this.name}] 子节点 ${
                    this.currentChildIndex
                } (${currentChild.getName()}) 状态: ${childStatus}`,
            );

            switch (childStatus) {
                case NodeStatus.RUNNING:
                    // 子节点正在运行，返回运行状态
                    return NodeStatus.RUNNING;

                case NodeStatus.SUCCESS:
                    // 子节点成功，继续执行下一个子节点
                    this.currentChildIndex++;
                    break;

                case NodeStatus.FAILURE:
                    // 子节点失败，序列失败
                    console.log(`[${this.name}] 子节点失败，序列执行失败`);
                    return NodeStatus.FAILURE;
            }
        }

        // 所有子节点都执行成功
        console.log(`[${this.name}] 所有子节点执行成功，序列执行成功`);
        return NodeStatus.SUCCESS;
    }
}
