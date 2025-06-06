(() => {
    function maxCandies(
        status: number[],
        candies: number[],
        keys: number[][],
        containedBoxes: number[][],
        initialBoxes: number[],
    ): number {
        return bfs(status, candies, keys, containedBoxes, initialBoxes);
    }

    function bfs(
        status: number[],
        candies: number[],
        keys: number[][],
        containedBoxes: number[][],
        initialBoxes: number[],
    ) {
        let candy = 0;
        let boxSet = new Set<number>();
        let keySet = new Set<number>();
        let openBox: number[] = [];

        const addBox = (box: number) => {
            if (keySet.has(box)) {
                openBox.push(box);
                keySet.delete(box);
            } else {
                boxSet.add(box);
            }
        };
        const addKey = (key: number) => {
            if (boxSet.has(key)) {
                openBox.push(key);
                boxSet.delete(key);
            } else {
                keySet.add(key);
            }
        };

        for (let i = 0; i < status.length; i++) {
            if (status[i] == 1) {
                addKey(i);
            }
        }
        initialBoxes.forEach((value) => addBox(value));

        while (openBox.length > 0) {
            // 打开盒子
            let i = openBox.pop()!;
            //拿糖果
            candy += candies[i];
            //探索新盒子
            for (let j = 0; j < keys[i].length; j++) {
                addKey(keys[i][j]);
            }
            // 获取钥匙
            for (let j = 0; j < containedBoxes[i].length; j++) {
                addBox(containedBoxes[i][j]);
            }
        }

        return candy;
    }

    function test(
        status: number[],
        candies: number[],
        keys: number[][],
        containedBoxes: number[][],
        initialBoxes: number[],
    ) {
        console.log(
            maxCandies(
                status,
                candies,
                keys,
                containedBoxes,
                initialBoxes,
            ),
        );
    }

    test(
        [1, 0, 1, 0],
        [7, 5, 4, 100],
        [[], [], [1], []],
        [[1, 2], [3], [], []],
        [0],
    );

    test(
        [1, 0, 1, 0],
        [7, 5, 4, 100],
        [[], [], [1], []],
        [[1, 2], [3], [], []],
        [0],
    );

    test(
        [1, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1],
        [[1, 2, 3, 4, 5], [], [], [], [], []],
        [[1, 2, 3, 4, 5], [], [], [], [], []],
        [0],
    );

    test([1, 1, 1], [100, 1, 100], [[], [0, 2], []], [[], [], []], [1]);

    test(
        [1, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1],
        [[1, 2, 3, 4, 5], [], [], [], [], []],
        [[1, 2, 3, 4, 5], [], [], [], [], []],
        [0],
    );

    test([1], [100], [], [], []);

    test([1, 1, 1], [2, 3, 2], [[], [], []], [[], [], []], [2, 1, 0]);
})();
