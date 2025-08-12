function subtractSortedArrays(a: number[], b: number[]): number[] {
    const result: number[] = [];
    let i = 0; // pointer for a
    let j = 0; // pointer for b

    while (i < a.length && j < b.length) {
        if (a[i] < b[j]) {
            result.push(a[i]);
            i++;
        } else if (a[i] > b[j]) {
            j++; // b[j] not in a
        } else {
            // equal, skip a[i]
            i++;
            j++;
        }
    }

    // push remaining elements in a
    while (i < a.length) {
        result.push(a[i++]);
    }

    return result;
}

(() => {
    const a = [1, 3, 5, 7, 9];
    const b = [3, 7];
    const c = [6, 7];

    const result = subtractSortedArrays(a, b); // [1, 5, 9]
    console.log(result);
    const result2 = subtractSortedArrays(a, c); // [1,3, 5, 9]
    console.log(result2);
})();
