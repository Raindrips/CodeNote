import { BehaviorTreeNode } from '../BehaviorTreeNode';
import { DecoratorNode } from '../DecoratorNode';
import { BehaviorTreeEvent, EventListener, EventSystem } from '../EventSystem';
import { NodeStatus } from '../type';


/**
 * 监听装饰器节点
 * 监听指定事件，当事件触发时才执行子节点
 */
export class ListenDecorator extends DecoratorNode {
    private eventType: string;
    private eventReceived: boolean = false;
    private eventListener: EventListener;
    private eventSystem: EventSystem;

    constructor(
        child: BehaviorTreeNode,
        eventType: string,
        name: string = 'ListenDecorator',
    ) {
        super(child, name);
        this.eventType = eventType;
        this.eventSystem = EventSystem.getInstance();

        // 创建事件监听器
        this.eventListener = (event: BehaviorTreeEvent) => {
            this.onEventReceived(event);
        };
    }

    onEnter(): void {
        super.onEnter();
        this.eventReceived = false;
        // 注册事件监听
        this.eventSystem.addEventListener(
            this.eventType,
            this.eventListener,
        );
        console.log(`[${this.name}] 开始监听事件: ${this.eventType}`);
    }

    onTick(): NodeStatus {
        // 如果事件未触发，继续等待
        if (!this.eventReceived) {
            return NodeStatus.RUNNING;
        }

        // 事件触发后执行子节点
        return this.child.execute();
    }

    onExit(): void {
        super.onExit();
        // 移除事件监听
        this.eventSystem.removeEventListener(
            this.eventType,
            this.eventListener,
        );
        console.log(`[${this.name}] 停止监听事件: ${this.eventType}`);
    }

    protected onReset(): void {
        this.eventReceived = false;
    }

    private onEventReceived(event: BehaviorTreeEvent): void {
        console.log(`[${this.name}] 收到事件: ${event.type}`, event.data);
        this.eventReceived = true;
    }
}
