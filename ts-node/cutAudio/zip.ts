export function ZipArray<T>(arr: T[]): (T | [number, T])[] {
    let result: (T | [number, T])[] = [];
    let count = 1;

    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
            count++;
        } else {
            if (count > 1) {
                result.push([count, arr[i]]);
            } else {
                result.push(arr[i]);
            }
            count = 1;
        }
    }

    // 处理最后一个元素  
    if (count > 1) {
        result.push([count, arr[arr.length - 1]]);
    } else {
        result.push(arr[arr.length - 1]);
    }

    return result;
}

// const arr = [1, 2, 2, 2, 1, 3, 3, 4, 5];
// const zip = ZipArray(arr)
// console.log(zip);