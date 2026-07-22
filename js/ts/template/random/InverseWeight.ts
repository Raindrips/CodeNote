/**
 * 根据数值的倒数进行加权随机选择的工具类
 */
export class InverseWeight {
    private weights: Array<{ value: number; weight: number }> = [];
    private totalWeight: number = 0;

    constructor(values: number[]) {
        let lcmValue = 1;

        // 计算所有有效正整数的最小公倍数
        for (const v of values) {
            if (v > 0) {
                lcmValue = this.lcm(lcmValue, v);
            }
        }

        // 计算各值的权重 (权重 = LCM / 当前值)
        for (const v of values) {
            if (v <= 0) continue;

            const w = Math.floor(lcmValue / v);
            this.weights.push({ value: v, weight: w });
            this.totalWeight += w;
        }
    }

    /**
     * 获取随机抽选的值
     */
    public get(): number {
        if (this.totalWeight === 0) return 0;

        // 生成 [1, totalWeight] 之间的随机整数
        const rand = Math.floor(Math.random() * this.totalWeight) + 1;
        let current = 0;

        for (const item of this.weights) {
            current += item.weight;
            if (rand > current) continue;

            return item.value;
        }

        return 0;
    }

    /**
     * 最大公约数 (Greatest Common Divisor)
     */
    private gcd(a: number, b: number): number {
        return b === 0 ? a : this.gcd(b, a % b);
    }

    /**
     * 最小公倍数 (Least Common Multiple)
     */
    private lcm(a: number, b: number): number {
        if (a === 0 || b === 0) return 0;
        return (a * b) / this.gcd(a, b);
    }
}

// --- 使用示例 ---
// const rw = new InverseWeight([2, 3, 5, 10, 15]);
// console.log(rw.get()); // 2 出现的概率最高，15 最低
