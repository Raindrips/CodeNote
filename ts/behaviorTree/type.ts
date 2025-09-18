/**
 * 行为树节点状态枚举
 */
export enum NodeStatus {
    RUNNING, // 正在执行
    SUCCESS, // 成功
    FAILURE, // 失败
}

export interface IBehaviorTreeNode {
    status: NodeStatus;
    onEnter(): void;
    onTick(): NodeStatus;
    onExit(): void;
}
