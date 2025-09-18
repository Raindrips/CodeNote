import { BehaviorTreeNode } from './BehaviorTreeNode';
/**
 * 装饰器节点抽象基类
 * 包含一个子节点，用于修改子节点的行为
 */
export abstract class DecoratorNode extends BehaviorTreeNode {
    protected child: BehaviorTreeNode;

    constructor(child: BehaviorTreeNode, name: string) {
        super(name);
        this.child = child;
    }

    public reset(): void {
        super.reset();
        this.child.reset();
    }

    public interrupt(): void {
        super.interrupt();
        this.child.interrupt();
    }
}
