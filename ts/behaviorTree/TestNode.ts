import { BehaviorTreeNode } from "./BehaviorTreeNode";
import { NodeStatus } from "./type";

/**
 * 示例：简单的测试节点
 * 用于演示节点的使用方式
 */
export class TestNode extends BehaviorTreeNode {
    private tickCount: number = 0;
    private maxTicks: number;
    private shouldSucceed: boolean;

    constructor(
        name: string,
        maxTicks: number = 3,
        shouldSucceed: boolean = true,
    ) {
        super(name);
        this.maxTicks = maxTicks;
        this.shouldSucceed = shouldSucceed;
    }

    public onEnter(): void {
        super.onEnter();
        this.tickCount = 0;
        console.log(
            `[${this.name}] 开始执行，预计执行 ${this.maxTicks} 次tick`,
        );
    }

    public onTick(): NodeStatus {
        this.tickCount++;
        console.log(`[${this.name}] 执行第 ${this.tickCount} 次tick`);

        if (this.tickCount >= this.maxTicks) {
            return this.shouldSucceed
                ? NodeStatus.SUCCESS
                : NodeStatus.FAILURE;
        }

        return NodeStatus.RUNNING;
    }

    public onReset(): void {
        this.tickCount = 0;
        console.log(`[${this.name}] 重置完成`);
    }
}
