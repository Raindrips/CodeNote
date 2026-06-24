import { AbstractHandler } from './AbstractHandler';
import { Handler } from './interface';
import { DamageContext } from './type';

/**
 * 1. 基础伤害计算器
 * 公式：max(攻击 - 防御, 攻击 * 0.05)
 */
class BaseDamageHandler extends AbstractHandler {
    constructor() {
        super('基础伤害计算', 10);
    }

    protected async process(
        context: DamageContext,
    ): Promise<DamageContext> {
        const rawDamage = context.attack - context.defense;
        const minDamage = context.attack * 0.05;

        context.currentDamage = Math.max(rawDamage, minDamage);

        this.addLog(
            context,
            '基础伤害',
            context.currentDamage,
            `max(${context.attack} - ${context.defense}, ${context.attack} * 0.05)`,
        );

        return context;
    }
}

/**
 * 2. 增伤减伤乘区
 * 当增伤-减伤为负时：使用衰减公式 1 - D/(D+100)
 */
class DamageModifierHandler extends AbstractHandler {
    constructor() {
        super('增伤减伤乘区', 20);
    }

    protected async process(
        context: DamageContext,
    ): Promise<DamageContext> {
        const netModifier =
            context.damageIncrease - context.damageReduction;
        let multiplier: number;

        if (netModifier >= 0) {
            // 正增伤：直接按百分比加成
            multiplier = 1 + netModifier / 100;
            this.addLog(
                context,
                '增伤倍率',
                multiplier,
                `1 + ${netModifier}/100`,
            );
        } else {
            // 负增伤（减伤大于增伤）：衰减公式
            const D = Math.abs(netModifier);
            multiplier = 1 - D / (D + 100);
            this.addLog(
                context,
                '减伤衰减',
                multiplier,
                `1 - ${D}/(${D}+100)`,
            );
        }

        context.currentDamage *= multiplier;

        this.addLog(context, '应用增减伤后', context.currentDamage);

        return context;
    }
}

/**
 * 3. 暴击伤害乘区
 */
class CriticalHandler extends AbstractHandler {
    constructor() {
        super('暴击判定', 30);
    }

    protected async process(
        context: DamageContext,
    ): Promise<DamageContext> {
        // 暴击判定
        const isCritical = Math.random() * 100 < context.critRate;
        context.flags.isCritical = isCritical;

        if (isCritical) {
            const critMultiplier = 1 + context.critDamage / 100;
            context.currentDamage *= critMultiplier;

            this.addLog(
                context,
                '暴击！',
                context.currentDamage,
                `伤害 × ${critMultiplier.toFixed(2)}`,
            );
        } else {
            this.addLog(context, '未暴击', context.currentDamage);
        }

        return context;
    }
}

/**
 * 4. 易伤/抗性乘区
 * 支持正负值，负值使用衰减公式 1 - D/(D+k)
 */
class ResistanceHandler extends AbstractHandler {
    private readonly k: number = 200; // 衰减系数

    constructor() {
        super('易伤抗性乘区', 40);
    }

    protected async process(
        context: DamageContext,
    ): Promise<DamageContext> {
        const netResistance = context.vulnerability - context.resistance;
        let multiplier: number;

        if (netResistance >= 0) {
            // 净易伤为正：增加伤害
            multiplier = 1 + netResistance / 100;
            this.addLog(
                context,
                '易伤加成',
                multiplier,
                `1 + ${netResistance}/100`,
            );
        } else {
            // 净抗性为正：减少伤害（衰减公式）
            const D = Math.abs(netResistance);
            multiplier = 1 - D / (D + this.k);
            this.addLog(
                context,
                '抗性衰减',
                multiplier,
                `1 - ${D}/(${D}+${this.k})`,
            );
        }

        context.currentDamage *= multiplier;

        this.addLog(context, '应用易伤/抗性后', context.currentDamage);

        return context;
    }
}

/**
 * 5. 最终修正处理器
 * 包含：下限保护、取整规则
 */
class FinalModifierHandler extends AbstractHandler {
    private readonly minDamage: number;
    private readonly roundingMode: 'floor' | 'round' | 'ceil';

    constructor(
        minDamage: number = 1,
        roundingMode: 'floor' | 'round' | 'ceil' = 'floor',
    ) {
        super('最终修正', 50);
        this.minDamage = minDamage;
        this.roundingMode = roundingMode;
    }

    protected async process(
        context: DamageContext,
    ): Promise<DamageContext> {
        // 取整
        let finalDamage = context.currentDamage;

        switch (this.roundingMode) {
            case 'floor':
                finalDamage = Math.floor(finalDamage);
                break;
            case 'round':
                finalDamage = Math.round(finalDamage);
                break;
            case 'ceil':
                finalDamage = Math.ceil(finalDamage);
                break;
        }

        this.addLog(
            context,
            '取整',
            finalDamage,
            `${this.roundingMode}(${context.currentDamage.toFixed(2)})`,
        );

        // 下限保护
        if (finalDamage < this.minDamage) {
            finalDamage = this.minDamage;
            this.addLog(
                context,
                '伤害下限保护',
                finalDamage,
                `max(damage, ${this.minDamage})`,
            );
        }

        context.currentDamage = finalDamage;

        return context;
    }
}

// ==================== 伤害计算器主类 ====================

/**
 * 伤害计算器 - 管理责任链
 */
class DamageCalculator {
    private handlers: Handler[] = [];
    private headHandler: Handler | null = null;

    /**
     * 添加处理器
     * @param handler 处理器实例
     * @param position 插入位置：'before'(最前), 'after'(最后), 或指定优先级数字
     */
    addHandler(
        handler: Handler,
        position?: 'before' | 'after' | number,
    ): this {
        if (position === 'before') {
            handler.priority = -Infinity;
        } else if (position === 'after') {
            handler.priority = Infinity;
        } else if (typeof position === 'number') {
            handler.priority = position;
        }

        this.handlers.push(handler);
        this.rebuildChain();

        return this;
    }

    /**
     * 移除处理器
     */
    removeHandler(name: string): this {
        this.handlers = this.handlers.filter((h) => h.name !== name);
        this.rebuildChain();
        return this;
    }

    /**
     * 重建责任链（按优先级排序）
     */
    private rebuildChain(): void {
        // 按优先级排序
        this.handlers.sort(
            (a, b) => (a.priority || 0) - (b.priority || 0),
        );

        // 链接处理器
        for (let i = 0; i < this.handlers.length - 1; i++) {
            this.handlers[i].setNext(this.handlers[i + 1]);
        }

        this.headHandler = this.handlers[0] || null;
    }

    /**
     * 执行伤害计算
     */
    async calculate(contextData: Partial<DamageContext>): Promise<{
        finalDamage: number;
        context: DamageContext;
    }> {
        // 初始化上下文
        const context: DamageContext = {
            attack: 0,
            defense: 0,
            critRate: 0,
            critDamage: 0,
            baseDamage: 0,
            damageIncrease: 0,
            damageReduction: 0,
            vulnerability: 0,
            resistance: 0,
            currentDamage: 0,
            flags: {},
            logs: [],
            metadata: new Map(),
            ...contextData,
        };

        if (!this.headHandler) {
            throw new Error('伤害计算链为空，请先添加处理器');
        }

        // 执行责任链
        const finalContext = await this.headHandler.handle(context);

        return {
            finalDamage: finalContext.currentDamage,
            context: finalContext,
        };
    }

    /**
     * 打印计算日志
     */
    printLogs(context: DamageContext): void {
        console.log('\n========== 伤害计算日志 ==========');
        context.logs.forEach((log, index) => {
            console.log(`[${index + 1}] ${log.step}: ${log.description}`);
            if (log.formula) {
                console.log(`    公式: ${log.formula}`);
            }
            console.log(`    结果: ${log.value.toFixed(2)}`);
        });
        console.log(`\n最终伤害: ${context.currentDamage.toFixed(2)}`);
        if (context.flags.isCritical) {
            console.log('暴击！');
        }
        console.log('===================================\n');
    }
}

// ==================== 扩展示例：元素反应处理器 ====================

/**
 * 元素反应乘区（扩展示例）
 */
class ElementalReactionHandler extends AbstractHandler {
    private reactionMultipliers: Map<string, number>;

    constructor() {
        super('元素反应', 35);
        this.reactionMultipliers = new Map([
            ['蒸发', 2.0],
            ['融化', 1.5],
            ['超载', 1.2],
        ]);
    }

    protected async process(
        context: DamageContext,
    ): Promise<DamageContext> {
        const reactionType = context.metadata.get('elementalReaction') as
            | string
            | undefined;

        if (reactionType && this.reactionMultipliers.has(reactionType)) {
            const multiplier = this.reactionMultipliers.get(reactionType)!;
            context.currentDamage *= multiplier;
            context.flags.hasElementalReaction = true;

            this.addLog(
                context,
                `元素反应: ${reactionType}`,
                context.currentDamage,
                `伤害 × ${multiplier}`,
            );
        }

        return context;
    }
}

// ==================== 使用示例 ====================

async function main() {
    // 创建伤害计算器
    const calculator = new DamageCalculator();

    // 注册标准伤害链
    calculator
        .addHandler(new BaseDamageHandler()) // 优先级 10
        .addHandler(new DamageModifierHandler()) // 优先级 20
        .addHandler(new CriticalHandler()) // 优先级 30
        .addHandler(new ElementalReactionHandler()) // 优先级 35
        .addHandler(new ResistanceHandler()) // 优先级 40
        .addHandler(new FinalModifierHandler(1, 'floor')); // 优先级 50

    // 场景1：普通攻击
    console.log('【场景1：普通攻击】');
    const result1 = await calculator.calculate({
        attack: 1000,
        defense: 200,
        critRate: 50,
        critDamage: 150,
        damageIncrease: 30, // 30%增伤
        damageReduction: 10, // 10%减伤
        vulnerability: 0,
        resistance: 0,
    });
    calculator.printLogs(result1.context);

    // 场景2：高抗性目标（减伤大于增伤）
    console.log('【场景2：高抗性目标】');
    const result2 = await calculator.calculate({
        attack: 1000,
        defense: 200,
        critRate: 100, // 必定暴击
        critDamage: 200,
        damageIncrease: 20,
        damageReduction: 80, // 净减伤60%
        vulnerability: 0,
        resistance: 50,
    });
    calculator.printLogs(result2.context);

    // 场景3：元素反应
    console.log('【场景3：元素反应 - 蒸发】');
    const context3Data: Partial<DamageContext> = {
        attack: 1200,
        defense: 150,
        critRate: 70,
        critDamage: 180,
        damageIncrease: 50,
        damageReduction: 0,
        vulnerability: 20,
        resistance: 0,
        metadata: new Map([['elementalReaction', '蒸发']]),
    };
    const result3 = await calculator.calculate(context3Data);
    calculator.printLogs(result3.context);

    // 场景4：动态添加处理器 - 护盾抵消
    console.log('【场景4：护盾抵消（动态添加处理器）】');

    class ShieldHandler extends AbstractHandler {
        constructor(private shieldValue: number) {
            super('护盾抵消', 45);
        }

        protected async process(
            context: DamageContext,
        ): Promise<DamageContext> {
            const damageAfterShield = Math.max(
                0,
                context.currentDamage - this.shieldValue,
            );
            const blocked = context.currentDamage - damageAfterShield;

            this.addLog(
                context,
                `护盾抵消 ${blocked.toFixed(2)} 点伤害`,
                damageAfterShield,
                `max(0, ${context.currentDamage.toFixed(2)} - ${this.shieldValue})`,
            );

            context.currentDamage = damageAfterShield;
            return context;
        }
    }

    calculator.addHandler(new ShieldHandler(500));

    const result4 = await calculator.calculate({
        attack: 1000,
        defense: 100,
        critRate: 100,
        critDamage: 100,
        damageIncrease: 0,
        damageReduction: 0,
        vulnerability: 0,
        resistance: 0,
    });
    calculator.printLogs(result4.context);
}

// 执行示例
main().catch(console.error);
