(() => {
    function solution(inputArray: number[][]): number {
        let obj: { [key: string]: number } = {};
        inputArray.forEach((arr2, i) => {
            const [left, right] = arr2;
            for (let j = left; j < right; j++) {
                obj[j] = 1;
            }
        });
        console.log(obj);
        return Object.keys(obj).length;
    }

    function main() {
        //  You can add more test cases here
        const testArray1: number[][] = [
            [1, 4],
            [7, 10],
            [3, 5],
        ];
        const testArray2: number[][] = [
            [1, 2],
            [6, 10],
            [11, 15],
        ];

        console.log(solution(testArray1) === 7);
        console.log(solution(testArray2) === 9);
    }

    main();
})();
