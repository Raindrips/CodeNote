type Constructor<T> = new (...args: any[]) => T;

class VariableStore implements Iterable<[string, any]> {
    private _store = new Map<string, any>();

    // 设置变量
    set<T>(key: string, value: T): void {
        this._store.set(key, value);
    }

    // 获取变量 - Plan B: 明确类型构造函数
    get<T>(key: string): T | undefined {
        const value = this._store.get(key);
        if (value === undefined) return undefined;
        return value;
    }

    // 删除变量
    remove(key: string): void {
        this._store.delete(key);
    }

    // 清空变量
    clear(): void {
        this._store.clear();
    }

    // 获取变量数量
    get size(): number {
        return this._store.size;
    }

    // 可枚举键值对
    [Symbol.iterator](): Iterator<[string, any]> {
        return this._store[Symbol.iterator]();
    }

    // 支持 for...in（枚举变量名）
    *keys(): IterableIterator<string> {
        for (const key of this._store.keys()) {
            yield key;
        }
    }

    // 支持 for...of（键值对）
    *entries(): IterableIterator<[string, any]> {
        yield* this._store.entries();
    }

    // 序列化
    save(): string {
        return JSON.stringify(Object.fromEntries(this._store));
    }

    // 反序列化（仅支持 JSON 兼容类型）
    load(json: string): void {
        try {
            const obj = JSON.parse(json);
            this._store.clear();
            for (const [key, value] of Object.entries(obj)) {
                this._store.set(key, value);
            }
        } catch (e) {
            console.error('Invalid JSON:', e);
        }
    }
}
