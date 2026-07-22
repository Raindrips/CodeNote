/**
 * 随机权重生成器
 * 根据传入数据的权重按比例随机抽取
 *
 * // 示例用法
 * const items = [
 *     { value: 'A', weight: 1 },
 *     { value: 'B', weight: 3 },
 *     { value: 'C', weight: 6 }
 * ];
 * const weightedRandom = new WeightedRandom(items);
 * console.log(weightedRandom.random());
 */
export class WeightRandom<T> {
    private items: { value: T; weight: number }[];
    private cumulativeWeights: number[];

    constructor(items: { value: T; weight: number }[]) {
        this.items = items;
        this.cumulativeWeights = this.computeCumulativeWeights(items);
    }

    private computeCumulativeWeights(items: { value: T; weight: number }[]): number[] {
        const cumulativeWeights: number[] = [];
        let sum = 0;
        for (const item of items) {
            sum += item.weight;
            cumulativeWeights.push(sum);
        }
        return cumulativeWeights;
    }

    public random(): T | null {
        if (this.items.length === 0) return null;

        const totalWeight = this.cumulativeWeights[this.cumulativeWeights.length - 1];
        if (totalWeight === 0) return null;

        const randomValue = randomRangeInt(0, totalWeight - 1);

        for (let i = 0; i < this.cumulativeWeights.length; i++) {
            if (randomValue < this.cumulativeWeights[i]) {
                return this.items[i].value;
            }
        }
        return this.items[this.items.length - 1].value;
    }
}

function randomRangeInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
}
