function unique(array: number[]) {
    if (array.length <= 1) {
        return array;
    }
    let arr=array.slice();
    let slow = 0; // 慢指针，指向当前不重复元素的位置
    for (let fast = 1; fast < arr.length; fast++) {
      
        if (arr[fast] !== arr[slow]) {
            slow++;
            arr[slow] = arr[fast];
        }
       
    }
    arr.length= slow + 1
    return arr;
}

let array=[1,2,3,4,4,5,5,5,5,6,6,6,7,8,8]


let arr=unique(array);
console.log(array);
console.log(arr);