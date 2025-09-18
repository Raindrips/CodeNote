import { BehaviorTreeNode } from "./BehaviorTreeNode";

/**
 * 动作节点抽象基类
 * 叶子节点，执行具体的动作逻辑
 */
export abstract class ActionNode extends BehaviorTreeNode {
  constructor(name: string) {
    super(name);
  }
}