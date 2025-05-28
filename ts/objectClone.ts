/**
 * 对对象进行深拷贝，带有最大深度限制。
 * 不处理循环引用，如果存在循环引用可能导致栈溢出。
 *
 * @param obj 要拷贝的对象。
 * @param maxDepth 最大拷贝深度，默认为 Infinity (无深度限制)。
 * @param currentDepth 当前递归深度，内部使用。
 * @returns 拷贝后的新对象。
 */
function deepCopyLimited<T>(
    obj: T,
    maxDepth: number = Infinity,
    currentDepth: number = 0,
): T {
    // 基本类型或 null/undefined 直接返回
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    // 超过最大深度，返回原引用 (浅拷贝)
    if (currentDepth >= maxDepth) {
        return obj;
    }

    // 处理日期对象
    if (obj instanceof Date) {
        return new Date(obj.getTime()) as T;
    }

    // 处理正则表达式
    if (obj instanceof RegExp) {
        return new RegExp(obj) as T;
    }

    // 初始化拷贝对象
    const copy: any = Array.isArray(obj) ? [] : {};

    // 递归拷贝属性
    for (const key in obj) {
        // 确保是对象自身的属性，而不是原型链上的
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            copy[key] = deepCopyLimited(
                obj[key],
                maxDepth,
                currentDepth + 1,
            );
        }
    }

    return copy as T;
}

// --- 示例用法 ---

(() => {
    function test() {
        const originalData = {
            a: 1,
            b: {
                c: 2,
                d: {
                    e: 3,
                    f: [4, 5, { g: 6 }],
                },
            },
            h: new Date(),
            i: /test/g,
        };
        console.log('--- 带有最大深度限制的深拷贝 ---');

        // 默认无深度限制的深拷贝
        const copyFull = deepCopyLimited(originalData);
        copyFull.b.d.e = 99;
        copyFull.b.d.f[2] = 100;
        console.log(
            '原始数据 (修改深拷贝后):',
            JSON.stringify(originalData, null, 2),
        );
        console.log(
            '拷贝数据 (无深度限制):',
            JSON.stringify(copyFull, null, 2),
        );
        // 可以看到原始数据没有被修改

        // 限制深度为 1
        const copyDepth1 = deepCopyLimited(originalData, 1);
        if (typeof copyDepth1.b === 'object' && copyDepth1.b !== null) {
            copyDepth1.b.c = 88; // 这一层是深拷贝，可以修改
            // 尝试修改更深层的属性 (这里会影响原始数据，因为拷贝到这层就是浅拷贝了)
            if (
                typeof originalData.b === 'object' &&
                originalData.b !== null
            ) {
                copyDepth1.b.d.e = 77; // 这会影响 originalData.b.d.e
            }
        }
        console.log(
            '拷贝数据 (深度1):',
            JSON.stringify(copyDepth1, null, 2),
        );
        console.log(
            '原始数据 (修改深度1拷贝后):',
            JSON.stringify(originalData, null, 2),
        );
        // 注意：原始数据中 b.d.e 已经被修改为 77，因为在深度1时 b.d 仍然是原始引用。

        // 限制深度为 2
        const copyDepth2 = deepCopyLimited(originalData, 2);
        if (typeof copyDepth2.b === 'object' && copyDepth2.b !== null) {
            if (
                typeof copyDepth2.b.d === 'object' &&
                copyDepth2.b.d !== null
            ) {
                copyDepth2.b.d.e = 66; // 这一层是深拷贝，可以修改
            }
        }
        console.log(
            '拷贝数据 (深度2):',
            JSON.stringify(copyDepth2, null, 2),
        );
        console.log(
            '原始数据 (修改深度2拷贝后):',
            JSON.stringify(originalData, null, 2),
        );
        // 此时 originalData.b.d.e 应该回到了 77，因为深度2拷贝是基于修改后的 originalData。
        // 这也再次说明了浅拷贝在达到深度限制时对原始对象的影响。
    }
    test();
})();

/**
 * 对对象进行深拷贝，能够处理循环引用。
 * 使用 WeakMap 来避免内存泄漏，因为它只对对象的弱引用。
 *
 * @param obj 要拷贝的对象。
 * @param hash 一个 WeakMap，用于存储已拷贝过的对象及其副本，内部使用。
 * @returns 拷贝后的新对象。
 */
function deepCopySafe<T>(obj: T, hash = new WeakMap<object, object>()): T {
  // 1. 基本类型或 null/undefined 直接返回
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 2. 处理日期对象
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  // 3. 处理正则表达式
  if (obj instanceof RegExp) {
    return new RegExp(obj) as T;
  }

  // 4. 处理循环引用：如果该对象已被拷贝过，直接返回其副本
  if (hash.has(obj)) {
    return hash.get(obj) as T;
  }

  // 5. 初始化拷贝对象 (数组或普通对象)
  const copy: any = Array.isArray(obj) ? [] : {};

  // 6. 将当前对象及其副本存入 WeakMap，以便处理后续的循环引用
  // 这一步必须在递归之前完成，否则如果内部属性引用了自身，会再次进入 deepCopySafe，
  // 而此时 hash 中还没有当前的 obj，从而导致循环引用检测失败。
  hash.set(obj, copy);

  // 7. 递归拷贝属性
  for (const key in obj) {
    // 确保是对象自身的属性，而不是原型链上的
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copy[key] = deepCopySafe(obj[key], hash);
    }
  }

  return copy as T;
}

// --- 示例用法 ---
console.log("\n--- 能够处理循环引用的深拷贝 ---");

const objWithCircularRef: any = {};
const otherObj: any = {
  name: "Nested Object"
};
objWithCircularRef.a = 1;
objWithCircularRef.b = {
  c: 2,
  d: otherObj
};
objWithCircularRef.self = objWithCircularRef; // 循环引用
otherObj.parent = objWithCircularRef.b; // 另一个循环引用

const copiedCircularObj = deepCopySafe(objWithCircularRef);

console.log("原始对象 (包含循环引用):", objWithCircularRef);
console.log("拷贝对象 (处理循环引用):", copiedCircularObj);

// 验证拷贝后的对象是否是独立的
copiedCircularObj.a = 100;
if (typeof copiedCircularObj.b === 'object' && copiedCircularObj.b !== null) {
    copiedCircularObj.b.c = 200;
}

console.log("\n--- 验证深拷贝的独立性 ---");
console.log("原始对象.a:", objWithCircularRef.a);       // 1
console.log("拷贝对象.a:", copiedCircularObj.a);       // 100

if (typeof objWithCircularRef.b === 'object' && objWithCircularRef.b !== null) {
    console.log("原始对象.b.c:", objWithCircularRef.b.c); // 2
}
if (typeof copiedCircularObj.b === 'object' && copiedCircularObj.b !== null) {
    console.log("拷贝对象.b.c:", copiedCircularObj.b.c); // 200
}

// 验证循环引用是否正确处理
console.log("拷贝对象.self === 拷贝对象:", copiedCircularObj.self === copiedCircularObj); // true
console.log("拷贝对象.b.d.parent === 拷贝对象.b:", copiedCircularObj.b.d.parent === copiedCircularObj.b); // true
console.log("原始对象.self === 原始对象:", objWithCircularRef.self === objWithCircularRef); // true