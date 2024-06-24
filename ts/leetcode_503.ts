
function removeDuplicates(sortedArr: number[]): number[] {
    if (sortedArr.length === 0) {
        return [];
    }
    let uniqueIndex = 0;

    for (let i = 1; i < sortedArr.length; i++) {
        if (sortedArr[i] !== sortedArr[uniqueIndex]) {
            uniqueIndex++;
            sortedArr[uniqueIndex] = sortedArr[i];
        }
    }
    return sortedArr.slice(0, uniqueIndex + 1);
}

function findNext(nums: number[], i: number) {
    let next = (i + 1) % nums.length;
    while (next != i) {
        if (nums[next] > nums[i]) {
            return nums[next];
        }
        next = (next + 1) % nums.length;
    }
    return -1;
}

function nextGreaterElements(nums: number[]): number[] {
    let result: number[] = [];
    for(let i=0;i<nums.length;i++){
        result.push(findNext(nums,i));
    }
    return result;
};


let result = nextGreaterElements([5,4,3,2,1]);
console.log(result);