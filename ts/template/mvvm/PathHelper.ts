/**
 * 获取json对象路径
 */
export function getValuePath<T>(
    obj: any,
    path: string,
    defaultValue: T,
): T {
    let current: any = obj;
    const keys = path.split('.'); // 将路径字符串按 . 分割成数组

    for (const key of keys) {
        if (current && typeof current === 'object') {
            if (Array.isArray(current) && !isNaN(Number(key))) {
                // 若当前对象是数组且路径片段是数字，则按索引访问
                current = current[Number(key)];
            } else if (key in current) {
                // 若当前对象是普通对象，则按属性访问
                current = current[key as keyof typeof current];
            } else {
                // 属性不存在时返回 defaultValue
                return defaultValue;
            }
        } else {
            // 当前对象不是对象或数组时，返回 defaultValue
            return defaultValue;
        }
    }
    return current;
}

/**
 * 设置路径值,路径长度小于2无法完成赋值
 * @returns 成功为true
 */
export function setValuePath<T>(obj: any, path: string, value: T) {
    let current: any = obj;
    const keys = path.split('.');

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (current && typeof current === 'object') {
            if (
                (Array.isArray(current) && !isNaN(Number(key))) ||
                key in current
            ) {
                if (i == keys.length - 1) {
                    current[key] = value;
                } else {
                    current = current[key];
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    return current;
}
