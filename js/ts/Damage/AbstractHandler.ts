import { Handler } from "./interface";
import { DamageContext } from "./type";

/**
 * 抽象处理器 - 实现责任链基础逻辑
 */
export abstract class AbstractHandler implements Handler {
    private nextHandler: Handler | null = null;
    public priority: number = 0;
    public name: string;

    constructor(name: string, priority: number = 0) {
        this.name = name;
        this.priority = priority;
    }

    setNext(handler: Handler): Handler {
        this.nextHandler = handler;
        return handler;
    }

    async handle(context: DamageContext): Promise<DamageContext> {
        // 执行当前处理器的逻辑
        const updatedContext = await this.process(context);

        // 传递给下一个处理器
        if (this.nextHandler) {
            return this.nextHandler.handle(updatedContext);
        }

        return updatedContext;
    }

    /**
     * 子类实现具体的处理逻辑
     */
    protected abstract process(
        context: DamageContext,
    ): Promise<DamageContext>;

    /**
     * 辅助方法：添加日志
     */
    protected addLog(
        context: DamageContext,
        description: string,
        value: number,
        formula?: string,
    ): void {
        context.logs.push({
            step: this.name,
            description,
            value,
            formula,
        });
    }
}
