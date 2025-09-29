/**
 * 深度展开
 * @param input 数组 
 * @returns 返回展开的数组
 */
function flattenDeep<T>(input: any[]): T[] {
    const result: T[] = [];

    for (const item of input) {
        if (Array.isArray(item)) {
            result.push(...flattenDeep<T>(item));
        } else {
            result.push(item);
        }
    }

    return result;
}


