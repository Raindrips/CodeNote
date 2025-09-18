import { ActionNode } from '../main';
import { NodeStatus } from '../type';

/**
 * Wait动作节点
 * 等待指定时间后返回成功
 */
export class WaitAction extends ActionNode {
    private waitTime: number;
    private startTime: number = 0;

    constructor(waitTime: number, name: string = 'WaitAction') {
        super(name);
        this.waitTime = waitTime;
    }

    onEnter(): void {
        super.onEnter();
        this.startTime = Date.now();
        console.log(`[${this.name}] 开始等待 ${this.waitTime}ms`);
    }

    onTick(): NodeStatus {
        const currentTime = Date.now();
        const elapsedTime = currentTime - this.startTime;

        if (elapsedTime >= this.waitTime) {
            console.log(`[${this.name}] 等待完成，耗时 ${elapsedTime}ms`);
            return NodeStatus.SUCCESS;
        }

        return NodeStatus.RUNNING;
    }

    onExit(): void {
        this.onReset();
    }

    protected onReset(): void {
        this.startTime = 0;
    }
}
