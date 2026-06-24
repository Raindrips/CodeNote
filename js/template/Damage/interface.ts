import { DamageContext } from "./type";

/**
 * 责任链处理器接口
 */
export interface Handler {
    /**
     * 处理伤害计算逻辑
     */
    handle(context: DamageContext): Promise<DamageContext>;

    /**
     * 设置下一个处理器
     */
    setNext(handler: Handler): Handler;

    /**
     * 处理器优先级（数字越小越先执行）
     */
    priority?: number;

    /**
     * 处理器名称（用于调试）
     */
    name: string;
}