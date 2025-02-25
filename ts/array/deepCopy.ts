function deepCloneArray<T>(arr: T[]): T[] {
    // 如果输入不是数组，直接返回
    if (!Array.isArray(arr)) {
        throw new Error('Input is not an array');
    }

    // 递归复制数组的每个元素
    return arr.map((item) => {
        if (Array.isArray(item)) {
            // 如果元素是数组，递归调用深复制
            return deepCloneArray(item);
        } else if (typeof item === 'object' && item !== null) {
            // 如果元素是对象，递归调用深复制对象
            return deepCloneObject(item);
        } else {
            // 基本类型直接返回
            return item;
        }
    });
}

function deepCloneObject(obj: any): any {
    const clonedObj = {} as any;
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            if (Array.isArray(value)) {
                // 如果值是数组，递归调用深复制数组
                clonedObj[key] = deepCloneArray(value);
            } else if (typeof value === 'object' && value !== null) {
                // 如果值是对象，递归调用深复制对象
                clonedObj[key] = deepCloneObject(value);
            } else {
                // 基本类型直接复制
                clonedObj[key] = value;
            }
        }
    }
    return clonedObj;
}

// 示例用法
const originalArray = [[1, 2, 3], [4, 5, 6], { a: 7, b: [8, 9] }];

const clonedArray = deepCloneArray(originalArray);
console.log(clonedArray); // 输出: [[1, 2, 3], [4, 5, 6], { a: 7, b: [8, 9] }]
console.log(clonedArray === originalArray); // 输出: false
console.log(clonedArray[2] === originalArray[2]); // 输出: false
