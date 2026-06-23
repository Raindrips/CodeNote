export type ErrorHandler = (
    type: string,
    path: string,
    msg: string,
) => void;

export class ModuleManager {
    private static _modules = new Map<string, any>();

    private static _errorHandler: ErrorHandler = (type, path, msg) => {
        console.warn(`[ModuleManager][${type}] ${path}\n${msg}`);
    };

    /**
     * 设置错误处理器
     */
    public static setErrorHandler(handler: ErrorHandler): void {
        this._errorHandler = handler;
    }

    /**
     * 注册模块
     */
    public static register(name: string, module: any): void {
        this._modules.set(name, module);
    }

    /**
     * 注销模块
     */
    public static unregister(name: string): void {
        this._modules.delete(name);
    }

    /**
     * 获取模块
     */
    public static getModule<T = any>(name: string): T | null {
        return this._modules.get(name) ?? null;
    }

    /**
     * 调用函数
     */
    public static call<T = any>(path: string, ...args: any[]): T | null {
        const result = this.find(path);

        if (!result) {
            this.error('call', path, 'path not found');
            return null;
        }

        if (typeof result.value !== 'function') {
            this.error('call', path, 'target is not function');
            return null;
        }

        return result.value.apply(result.parent, args);
    }

    /**
     * 获取属性
     */
    public static get<T = any>(path: string): T | null {
        const result = this.find(path);

        if (!result) {
            this.error('get', path, 'path not found');
            return null;
        }

        return result.value as T;
    }

    /**
     * 设置属性
     */
    public static set(path: string, value: any): boolean {
        const result = this.find(path);

        if (!result) {
            this.error('set', path, 'path not found');
            return false;
        }

        result.parent[result.key] = value;

        return true;
    }

    private static find(path: string): {
        parent: any;
        key: string;
        value: any;
    } | null {
        const parts = path.split('.');

        if (parts.length === 0) {
            return null;
        }

        const moduleName = parts[0];

        let current = this._modules.get(moduleName);

        if (!current) {
            return null;
        }

        let parent = null;

        for (let i = 1; i < parts.length; i++) {
            const key = parts[i];

            parent = current;

            if (!(key in current)) {
                return null;
            }

            current = current[key];
        }

        return {
            parent,
            key: parts[parts.length - 1],
            value: current,
        };
    }

    private static error(type: string, path: string, msg: string): void {
        this._errorHandler(type, path, msg);
    }
}
