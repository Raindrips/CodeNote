class MaxHeap<T> {
    private heap: T[] = [];
    private indexMap: Map<T, number> = new Map();

    constructor(private compareFn: (a: T, b: T) => number) {}

    // 向堆中插入元素
    insert(item: T): void {
        this.heap.push(item);
        this.indexMap.set(item, this.heap.length - 1);
        this.heapifyUp(this.heap.length - 1);
    }

    // 删除任意元素
    delete(num: T): boolean {
        const index = this.indexMap.get(num);
        if (index === undefined) return false; // 找不到该元素

        const lastIndex = this.heap.length - 1;
        const lastElement = this.heap[lastIndex];

        // 交换要删除的元素和堆末尾元素
        this.heap[index] = lastElement;
        this.indexMap.set(lastElement, index);

        // 删除堆末尾元素
        this.heap.pop();
        this.indexMap.delete(num);

        // 重新调整堆
        this.heapifyDown(index);
        return true;
    }

    // 删除堆顶元素
    deleteMax(): boolean {
        if (this.heap.length === 0) return false; // 如果堆为空，返回false

        const lastIndex = this.heap.length - 1;
        const lastElement = this.heap[lastIndex];

        // 将堆顶元素替换为堆尾元素
        this.heap[0] = lastElement;
        this.indexMap.set(lastElement, 0);

        // 删除堆尾元素
        this.heap.pop();
        this.indexMap.delete(this.heap[lastIndex]);

        // 重新调整堆
        this.heapifyDown(0);
        return true;
    }

    // 获取堆顶元素
    peek(): T | null {
        return this.heap.length > 0 ? this.heap[0] : null;
    }

    // 堆化上移操作
    private heapifyUp(index: number): void {
        const element = this.heap[index];
        let currentIndex = index;

        // 上移直到找到合适位置
        while (currentIndex > 0) {
            const parentIndex = Math.floor((currentIndex - 1) / 2);
            const parent = this.heap[parentIndex];

            if (this.compareFn(element, parent) <= 0) break;

            this.heap[currentIndex] = parent;
            this.indexMap.set(parent, currentIndex);

            currentIndex = parentIndex;
        }
        this.heap[currentIndex] = element;
        this.indexMap.set(element, currentIndex);
    }

    public size() {
        return this.heap.length;
    }

    // 堆化下移操作
    private heapifyDown(index: number): void {
        const length = this.heap.length;
        const element = this.heap[index];
        let currentIndex = index;

        while (currentIndex < length) {
            let leftChildIndex = 2 * currentIndex + 1;
            let rightChildIndex = 2 * currentIndex + 2;
            let largestIndex = currentIndex;

            if (
                leftChildIndex < length &&
                this.compareFn(
                    this.heap[leftChildIndex],
                    this.heap[largestIndex],
                ) > 0
            ) {
                largestIndex = leftChildIndex;
            }

            if (
                rightChildIndex < length &&
                this.compareFn(
                    this.heap[rightChildIndex],
                    this.heap[largestIndex],
                ) > 0
            ) {
                largestIndex = rightChildIndex;
            }

            if (largestIndex === currentIndex) break;

            // Swap
            const tmp = this.heap[currentIndex];
            this.heap[currentIndex] = this.heap[largestIndex];
            this.heap[largestIndex] = tmp;
            this.indexMap.set(this.heap[currentIndex], currentIndex);
            this.indexMap.set(this.heap[largestIndex], largestIndex);

            currentIndex = largestIndex;
        }
    }
}

function compareFn(a: Food, b: Food) {
    return a.rating - b.rating;
}

type Food = { food: string; cuisines: string; rating: number };
class FoodRatings {
    foodMap: { [key: string]: Food } = {};
    cuisineMap: { [key: string]: MaxHeap<Food> } = {};
    constructor(foods: string[], cuisines: string[], ratings: number[]) {
        for (let i = 0; i < foods.length; i++) {}
        for (let i = 0; i < foods.length; i++) {
            if (!this.cuisineMap[cuisines[i]]) {
                this.cuisineMap[cuisines[i]] = new MaxHeap<Food>(
                    compareFn,
                );
            }
            const foodPair: Food = {
                food: foods[i],
                cuisines: cuisines[i],
                rating: ratings[i],
            };
            this.foodMap[foods[i]] = foodPair;
            this.cuisineMap[cuisines[i]].insert(foodPair);
        }
    }

    changeRating(food: string, newRating: number): void {
        this.cuisineMap[this.foodMap[food].cuisines].delete(
            this.foodMap[food],
        );
        this.foodMap[food].rating = newRating;
        this.cuisineMap[this.foodMap[food].cuisines].insert(
            this.foodMap[food],
        );
    }

    highestRated(cuisine: string): string {
        let v = this.cuisineMap[cuisine].peek()!.food ?? '';
        return v;
    }
}

/**
 * Your FoodRatings object will be instantiated and called as such:
 * var obj = new FoodRatings(foods, cuisines, ratings)
 * obj.changeRating(food,newRating)
 * var param_2 = obj.highestRated(cuisine)
 */

let obj: FoodRatings;
function exec(cmds: any, args: any) {
    switch (cmds) {
        case 'FoodRatings':
            const foods: string[] = args[0],
                cuisines: string[] = args[1],
                ratings: number[] = args[2];
            obj = new FoodRatings(foods, cuisines, ratings);
            return null;
        case 'highestRated':
            return obj.highestRated(args[0]);
        case 'changeRating':
            return obj.changeRating(args[0], args[1]);
    }
}

function test(cmds: any[], args: any[]) {
    for (let i = 0; i < cmds.length; i++) {
        console.log(exec(cmds[i], args[i]));
    }
}

test(
    [
        'FoodRatings',
        'highestRated',
        'highestRated',
        'changeRating',
        'highestRated',
        'changeRating',
        'highestRated',
    ],
    [
        [
            ['kimchi', 'miso', 'sushi', 'moussaka', 'ramen', 'bulgogi'],
            [
                'korean',
                'japanese',
                'japanese',
                'greek',
                'japanese',
                'korean',
            ],
            [9, 12, 8, 15, 14, 7],
        ],
        ['korean'],
        ['japanese'],
        ['sushi', 16],
        ['japanese'],
        ['ramen', 16],
        ['japanese'],
    ],
);
