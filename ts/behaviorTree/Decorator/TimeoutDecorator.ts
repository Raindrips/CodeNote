import { BehaviorTreeNode } from '../BehaviorTreeNode';
import { DecoratorNode } from '../DecoratorNode';
import { NodeStatus } from '../type';

/**
 * 超时装饰器节点
 * 如果子节点在指定时间内未完成，则返回失败
 */
export class TimeoutDecorator extends DecoratorNode {
    private timeoutDuration: number;
    private startTime: number = 0;

    constructor(
        child: BehaviorTreeNode,
        timeoutDuration: number,
        name: string = 'TimeoutDecorator',
    ) {
        super(child, name);
        this.timeoutDuration = timeoutDuration;
    }

    onEnter(): void {
        super.onEnter();
        this.startTime = Date.now();
        console.log(
            `[${this.name}] 开始执行，超时时间 ${this.timeoutDuration}ms`,
        );
    }

    onTick(): NodeStatus {
        const currentTime = Date.now();
        const elapsedTime = currentTime - this.startTime;

        // 检查是否超时
        if (elapsedTime >= this.timeoutDuration) {
            console.log(`[${this.name}] 执行超时，中断子节点`);
            this.child.interrupt();
            return NodeStatus.FAILURE;
        }

        // 执行子节点
        const childStatus = this.child.execute();

        // 如果子节点完成，返回子节点的状态
        if (childStatus !== NodeStatus.RUNNING) {
            return childStatus;
        }

        return NodeStatus.RUNNING;
    }

    protected onReset(): void {
        this.startTime = 0;
    }
}
