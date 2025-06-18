(() => {
    function divideArray(nums: number[], k: number): number[][] {
        let n = nums.length;
        nums.sort((a, b) => a - b);
        let arr: number[][] = [];
        for (let i = 0; i < n; i += 3) {
            if (nums[i + 2] - nums[i] > k) {
                return [];
            }
            arr.push(nums.slice(i, i + 3));
        }
        return arr;
    }

    function test(){
        console.log(divideArray([1, 2, 3, 4, 5, 6], 2)); // [[1,2,3],[4,5,6]]
        console.log(divideArray([1, 2, 3, 7, 8, 9], 2)); // []
        console.log(divideArray([1, 2, 3, 7, 9, 11], 2)); // [[1,3,5],[7,9,11]]
    }
    test();
})();
