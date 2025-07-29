function simulateDrop(mask: number[]): number[] {
  const n = mask.length;
  const retained: number[] = [];
  const removed: number[] = [];

  // Step 1: 拆分保留与被移除的索引
  for (let i = 0; i < n; i++) {
    if (mask[i] !== 1) {
      retained.push(i);
    } else {
      removed.push(i);
    }
  }

  // Step 2: 构建最终结果
  const result: number[] = [];

  // 填充 retained 在底部（倒着插入）
  const reversedRetained = [...retained].reverse();

  for (let i = 0; i < n; i++) {
    if (reversedRetained.length > 0) {
      // 优先使用保留的，模拟掉落到底部
      result.push(reversedRetained.pop()!);
    } else {
      // 用被删除的从顶部补足
      result.push(removed.shift()!);
    }
  }

  return result;
}


console.log(simulateDrop([0,1,2,3])); // [0,1,2,3]
console.log(simulateDrop([0,0,1,0])); // [0,1,3,2]
console.log(simulateDrop([1,1,0,0])); // [2,3,0,1]
console.log(simulateDrop([1,1,1,1])); // [0,1,2,3]
console.log(simulateDrop([0,0,1,1])); // [0,1,2,3]