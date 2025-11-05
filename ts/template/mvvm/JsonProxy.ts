// 修改格式
export type ChangePayload = {
    old: any;
    new: any;
    path: string;
};

let __REACTIVE_DEBUG__ = true;

// 修改回调
export type ReactiveOptions = (data: ChangePayload) => void;

const isObject = (val: any) => val && typeof val === 'object';

const formatPath = (base: string, key: string | symbol): string => {
    if (typeof key === 'symbol') return base;
    return /^[a-zA-Z_$][\w$]*$/.test(key)
        ? base
            ? `${base}.${key}`
            : `${key}`
        : `${base}[${JSON.stringify(key)}]`;
};

export function createReactive<T extends object>(
    obj: T,
    onChange: ReactiveOptions,
    path: string = '',
): T {
    const handler: ProxyHandler<any> = {
        get(target, key, receiver) {
            const value = Reflect.get(target, key, receiver);
            const fullPath = formatPath(path, key);

            if (__REACTIVE_DEBUG__) {
                console.log(`[GET] ${fullPath} =>`, value);
            }

            // 自动代理嵌套对象
            if (isObject(value)) {
                return createReactive(value, onChange, fullPath);
            }

            // 劫持数组方法
            if (
                Array.isArray(target) &&
                typeof value === 'function' &&
                typeof key === 'string'
            ) {
                const mutatingMethods = [
                    'push',
                    'pop',
                    'shift',
                    'unshift',
                    'splice',
                    'sort',
                    'reverse',
                ];
                if (mutatingMethods.includes(key)) {
                    return function (...args: any[]) {
                        const old = [...target];
                        const result = value.apply(target, args);
                        const newVal = [...target];
                        onChange({ old, new: newVal, path });
                        if (__REACTIVE_DEBUG__) {
                            console.log(`[ARRAY MUTATE] ${path}:`, {
                                old,
                                newVal,
                            });
                        }
                        return result;
                    };
                }
            }

            return value;
        },

        set(target, key, value, receiver) {
            const oldValue = target[key];
            const fullPath = formatPath(path, key);
            const result = Reflect.set(target, key, value, receiver);

            if (oldValue !== value) {
                onChange({ old: oldValue, new: value, path: fullPath });
                if (__REACTIVE_DEBUG__) {
                    console.log(`[SET] ${fullPath}:`, {
                        oldValue,
                        value,
                    });
                }
            }

            return result;
        },

        deleteProperty(target, key) {
            const oldValue = target[key];
            const fullPath = formatPath(path, key);
            const result = Reflect.deleteProperty(target, key);

            onChange({ old: oldValue, new: undefined, path: fullPath });
            if (__REACTIVE_DEBUG__) {
                console.log(
                    `[DELETE] ${{
                        oldValue,
                        fullPath,
                    }}`,
                );
            }

            return result;
        },
    };

    return new Proxy(obj, handler);
}
