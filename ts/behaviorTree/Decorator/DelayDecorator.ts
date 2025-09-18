import { BehaviorTreeNode } from '../BehaviorTreeNode';
import { DecoratorNode } from '../DecoratorNode';
import { NodeStatus } from '../type';

/**
 * 延时装饰器节点
 * 延时一段时间后再执行子节点
 */
export class DelayDecorator extends DecoratorNode {
    private delayTime: number;
    private startTime: number = 0;
    private isDelayComplete: boolean = false;

    constructor(
        child: BehaviorTreeNode,
        delayTime: number,
        name: string = 'DelayDecorator',
    ) {
        super(child, name);
        this.delayTime = delayTime;
    }

    onEnter(): void {
        super.onEnter();
        this.startTime = Date.now();
        this.isDelayComplete = false;
        console.log(`[${this.name}] 开始延时 ${this.delayTime}ms`);
    }

    onTick(): NodeStatus {
        // 如果延时未完成，继续等待
        if (!this.isDelayComplete) {
            const currentTime = Date.now();
            const elapsedTime = currentTime - this.startTime;

            if (elapsedTime >= this.delayTime) {
                this.isDelayComplete = true;
                console.log(`[${this.name}] 延时完成，开始执行子节点`);
            } else {
                return NodeStatus.RUNNING;
            }
        }

        // 延时完成后执行子节点
        return this.child.execute();
    }

    protected onReset(): void {
        this.startTime = 0;
        this.isDelayComplete = false;
    }
}
