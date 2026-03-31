import { createReactive, ReactiveOptions } from './JsonProxy';
import { getValuePath, setValuePath } from './PathHelper';

export class ViewModel<T extends object> {
    /** 激活状态, 将会通过 director.emit 发送值变动的信号, 适合需要屏蔽的情况 */
    public active: boolean = true;

    /** 是否激活根路径回调通知, 不激活的情况下 只能监听末端路径值来判断是否变化 */
    public emitToRootPath: boolean = false;

    $data: T;
    constructor(
        public data: T,
        private tag: string,
        callBack: ReactiveOptions,
    ) {
        this.$data = createReactive(data, callBack);
    }

    public getTag() {
        return this.tag;
    }

    public setValue<T>(path: string, value: T) {
        if (!setValuePath(this.data, path, value)) {
            console.log(`设置失败 path:${path} value:${value}`);
        }
    }

    public getValue<T = undefined>(path: string, defaultValue?: T) {
        getValuePath(this.data, path, defaultValue);
    }
}
