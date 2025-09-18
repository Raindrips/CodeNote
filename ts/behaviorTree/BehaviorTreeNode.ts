import { IBehaviorTreeNode, NodeStatus } from './type';

/**
 * 行为树节点抽象基类
 */
export abstract class BehaviorTreeNode implements IBehaviorTreeNode {
    public status: NodeStatus = NodeStatus.RUNNING;
    protected name: string;
    protected isInitialized: boolean = false;

    constructor(name: string = 'UnnamedNode') {
        this.name = name;
    }

    /**
     * 获取节点名称
     */
    getName(): string {
        return this.name;
    }

    /**
     * 获取当前状态
     */
    getStatus(): NodeStatus {
        return this.status;
    }

    /**
     * 节点执行入口点
     * 管理生命周期：进入 -> 执行中(tick) -> 结束
     */
    public execute(): NodeStatus {
        // 如果节点还未初始化，先执行进入生命周期
        if (!this.isInitialized) {
            this.onEnter();
            this.isInitialized = true;
        }

        // 执行tick生命周期
        this.status = this.onTick();

        // 如果节点执行完成（成功或失败），执行结束生命周期
        if (this.status !== NodeStatus.RUNNING) {
            this.onExit();
            this.reset();
        }
        return this.status;
    }

    /**
     * 重置节点状态
     */
    public reset(): void {
        this.isInitialized = false;
        this.status = NodeStatus.RUNNING;
        this.onReset();
    }

    // ===== 生命周期方法 =====

    /**
     * 进入生命周期
     * 节点开始执行时调用，用于初始化
     */
    onEnter(): void {
        console.log(`[${this.name}] 节点进入`);
    }

    /**
     * 执行中生命周期（tick）
     * 每帧都会调用，包含节点的主要逻辑
     * @returns 节点执行状态
     */
    abstract onTick(): NodeStatus;

    /**
     * 结束生命周期
     * 节点执行完成时调用，用于清理工作
     */
    onExit(): void {
        console.log(`[${this.name}] 节点结束，状态: ${this.status}`);
    }

    /**
     * 重置生命周期
     * 节点重置时调用，用于清理状态
     */
    protected onReset(): void {
        // 子类可以重写此方法进行特定的重置逻辑
    }

    /**
     * 中断节点执行
     * 强制停止节点执行
     */
    public interrupt(): void {
        if (this.isInitialized) {
            console.log(`[${this.name}] 节点被中断`);
            this.status = NodeStatus.FAILURE;
            this.onExit();
            this.reset();
        }
    }

    /**
     * 检查节点是否正在运行
     */
    public isRunning(): boolean {
        return this.status === NodeStatus.RUNNING;
    }

    /**
     * 检查节点是否成功完成
     */
    public isSuccess(): boolean {
        return this.status === NodeStatus.SUCCESS;
    }

    /**
     * 检查节点是否失败
     */
    public isFailure(): boolean {
        return this.status === NodeStatus.FAILURE;
    }
}
