import { BehaviorTreeNode } from '../BehaviorTreeNode';
import { CompositeNode, ParallelPolicy } from '../CompositeNode';
import { NodeStatus } from '../type';

/**
 * 并行节点 (Parallel)
 * 同时执行所有子节点，根据策略决定何时返回成功或失败
 */
export class ParallelNode extends CompositeNode {
    private successPolicy: ParallelPolicy;
    private failurePolicy: ParallelPolicy;
    private childrenStatus: NodeStatus[] = [];

    constructor(
        name: string = 'ParallelNode',
        successPolicy: ParallelPolicy = ParallelPolicy.ALL_SUCCESS,
        failurePolicy: ParallelPolicy = ParallelPolicy.ANY_FAILURE,
        children: BehaviorTreeNode[] = [],
    ) {
        super(name, children);
        this.successPolicy = successPolicy;
        this.failurePolicy = failurePolicy;
    }

     onEnter(): void {
        super.onEnter();
        // 初始化子节点状态数组
        this.childrenStatus = new Array(this.children.length).fill(
            NodeStatus.RUNNING,
        );
        console.log(
            `[${this.name}] 开始并行执行 ${this.children.length} 个子节点`,
        );
        console.log(
            `[${this.name}] 成功策略: ${this.successPolicy}, 失败策略: ${this.failurePolicy}`,
        );
    }

     onTick(): NodeStatus {
        // 如果没有子节点，直接返回成功
        if (this.children.length === 0) {
            console.log(`[${this.name}] 没有子节点，返回成功`);
            return NodeStatus.SUCCESS;
        }

        let runningCount = 0;
        let successCount = 0;
        let failureCount = 0;

        // 执行所有正在运行的子节点
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];

            // 只执行还在运行的子节点
            if (this.childrenStatus[i] === NodeStatus.RUNNING) {
                this.childrenStatus[i] = child.execute();
            }

            // 统计各种状态的子节点数量
            switch (this.childrenStatus[i]) {
                case NodeStatus.RUNNING:
                    runningCount++;
                    break;
                case NodeStatus.SUCCESS:
                    successCount++;
                    break;
                case NodeStatus.FAILURE:
                    failureCount++;
                    break;
            }
        }

        console.log(
            `[${this.name}] 状态统计 - 运行中: ${runningCount}, 成功: ${successCount}, 失败: ${failureCount}`,
        );

        // 检查失败策略
        const shouldFail = this.checkFailureCondition(
            failureCount,
            successCount,
            runningCount,
        );
        if (shouldFail) {
            console.log(`[${this.name}] 满足失败条件，并行执行失败`);
            // 中断所有仍在运行的子节点
            this.interruptRunningChildren();
            return NodeStatus.FAILURE;
        }

        // 检查成功策略
        const shouldSuccess = this.checkSuccessCondition(
            successCount,
            failureCount,
            runningCount,
        );
        if (shouldSuccess) {
            console.log(`[${this.name}] 满足成功条件，并行执行成功`);
            // 中断所有仍在运行的子节点
            this.interruptRunningChildren();
            return NodeStatus.SUCCESS;
        }

        // 如果还有子节点在运行，继续运行
        if (runningCount > 0) {
            return NodeStatus.RUNNING;
        }

        // 所有子节点都已完成，但没有满足成功或失败条件
        // 这种情况理论上不应该发生，但为了安全起见返回失败
        console.log(
            `[${this.name}] 所有子节点已完成但未满足任何条件，返回失败`,
        );
        return NodeStatus.FAILURE;
    }

    /**
     * 检查是否满足失败条件
     */
    private checkFailureCondition(
        failureCount: number,
        successCount: number,
        runningCount: number,
    ): boolean {
        switch (this.failurePolicy) {
            case ParallelPolicy.ANY_FAILURE:
                return failureCount > 0;
            case ParallelPolicy.ALL_FAILURE:
                return failureCount === this.children.length;
            case ParallelPolicy.ANY_SUCCESS:
                // 当策略是ANY_SUCCESS时，如果没有任何成功且没有正在运行的，则失败
                return successCount === 0 && runningCount === 0;
            case ParallelPolicy.ALL_SUCCESS:
                // 当策略是ALL_SUCCESS时，如果有任何失败，则整体失败
                return failureCount > 0;
            default:
                return false;
        }
    }

    /**
     * 检查是否满足成功条件
     */
    private checkSuccessCondition(
        successCount: number,
        failureCount: number,
        runningCount: number,
    ): boolean {
        switch (this.successPolicy) {
            case ParallelPolicy.ANY_SUCCESS:
                return successCount > 0;
            case ParallelPolicy.ALL_SUCCESS:
                return successCount === this.children.length;
            case ParallelPolicy.ANY_FAILURE:
                // 当策略是ANY_FAILURE时，如果没有任何失败且没有正在运行的，则成功
                return failureCount === 0 && runningCount === 0;
            case ParallelPolicy.ALL_FAILURE:
                // 当策略是ALL_FAILURE时，如果有任何成功，则整体成功
                return successCount > 0;
            default:
                return false;
        }
    }

    /**
     * 中断所有仍在运行的子节点
     */
    private interruptRunningChildren(): void {
        for (let i = 0; i < this.children.length; i++) {
            if (this.childrenStatus[i] === NodeStatus.RUNNING) {
                console.log(
                    `[${this.name}] 中断子节点 ${i} (${this.children[
                        i
                    ].getName()})`,
                );
                this.children[i].interrupt();
                this.childrenStatus[i] = NodeStatus.FAILURE;
            }
        }
    }

    protected onReset(): void {
        super.onReset();
        this.childrenStatus = [];
    }

    /**
     * 设置成功策略
     */
    public setSuccessPolicy(policy: ParallelPolicy): void {
        this.successPolicy = policy;
    }

    /**
     * 设置失败策略
     */
    public setFailurePolicy(policy: ParallelPolicy): void {
        this.failurePolicy = policy;
    }

    /**
     * 获取成功策略
     */
    public getSuccessPolicy(): ParallelPolicy {
        return this.successPolicy;
    }

    /**
     * 获取失败策略
     */
    public getFailurePolicy(): ParallelPolicy {
        return this.failurePolicy;
    }
    
}
