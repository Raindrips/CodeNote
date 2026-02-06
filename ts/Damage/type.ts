/**
 * 伤害计算日志条目
 */
export   interface DamageLog {
  step: string;
  description: string;
  value: number;
  formula?: string;
}

/**
 * 伤害计算上下文
 */
export interface DamageContext {
    // 基础属性
    attack: number;
    defense: number;
    critRate: number;
    critDamage: number;

    // 伤害系数（分区存储）
    baseDamage: number;
    damageIncrease: number; // 增伤
    damageReduction: number; // 减伤
    vulnerability: number; // 易伤
    resistance: number; // 抗性

    // 当前累积伤害
    currentDamage: number;

    // 标记系统
    flags: {
        isCritical?: boolean;
        hasElementalReaction?: boolean;
        isVulnerable?: boolean;
        [key: string]: any;
    };

    // 中间结果记录
    logs: DamageLog[];

    // 扩展数据
    metadata: Map<string, any>;
}