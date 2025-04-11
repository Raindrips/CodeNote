
class WeightedRandom<T> {
    private items: { value: T, weight: number }[];
    private cumulativeWeights: number[];

    constructor(items: { value: T, weight: number }[]) {
        this.items = items;
        this.cumulativeWeights = this.computeCumulativeWeights(items);
    }

    private computeCumulativeWeights(items: { value: T, weight: number }[]): number[] {
        const cumulativeWeights: number[] = [];
        let sum = 0;

        for (const item of items) {
            sum += item.weight;
            cumulativeWeights.push(sum);
        }

        return cumulativeWeights;
    }

    public random(): T {
        const randomValue = Math.random() * this.cumulativeWeights[this.cumulativeWeights.length - 1];

        for (let i = 0; i < this.cumulativeWeights.length; i++) {
            if (randomValue < this.cumulativeWeights[i]) {
                return this.items[i].value;
            }
        }

        // Fallback to the last item (shouldn't really happen if the logic is correct)
        return this.items[this.items.length - 1].value;
    }

}

// 示例用法
const items = [
    { value: 'A', weight: 1 },
    { value: 'B', weight: 3 },
    { value: 'C', weight: 6 }
];

const weightedRandom = new WeightedRandom(items);

console.log(weightedRandom.random());
console.log(weightedRandom.random());
console.log(weightedRandom.random());

