import { ChangePayload, ReactiveOptions } from './JsonProxy';
import { ViewModel } from './ViewModel';

class VMManager {
    private _mvMap: Map<string, ViewModel<any>> = new Map<
        string,
        ViewModel<any>
    >();

    private _mvCall: Map<string, ReactiveOptions> = new Map<
        string,
        ReactiveOptions
    >();

    /**
     * 绑定一个数据，并且可以由VM所管理（绑定的数据只能是JSON对象类型）
     * @param data 需要绑定的数据
     * @param tag 对应该数据的标签(用于识别为哪个VM，不允许重复)
     * @param activeRootObject 激活主路径通知，可能会有性能影响，一般不使用
     */
    add<T extends object>(
        data: T,
        tag: string = 'global',
        call: ReactiveOptions,
    ) {
        let vm = new ViewModel<T>(data, tag, call);
        let has = this._mvMap.get(tag);
        if (tag.includes('.')) {
            console.error('cant write . in tag:', tag);
            return;
        }
        if (has) {
            console.error('already set VM tag:' + tag);
            return;
        }
        this._mvMap.set(tag, vm);
        this._mvCall.set(tag, call);
        return vm;
    }

    /**
     * 移除并且销毁 VM 对象
     * @param tag
     */
    remove(tag: string) {
        this._mvMap.delete(tag);
        this._mvCall.delete(tag);
    }

    /**
     * 获取绑定的数据
     * @param tag 数据tag
     */
    get<T extends object>(tag: string): ViewModel<T> | undefined {
        let res = this._mvMap.get(tag);
        return res;
    }

    /**
     * 通过全局路径,而不是 VM 对象来 设置值
     * @param path - 全局取值路径
     * @param value - 需要增加的值
     */
    addPathValue(path: string, value: any) {
        path = path.trim(); //防止空格,自动剔除
        let rs = path.split('.');
        if (rs.length < 2) {
            console.error('Cant find path:' + path);
        }
        let vm = this.get(rs[0]);
        if (!vm) {
            console.error('Cant Set VM:' + rs[0]);
            return;
        }

        let resPath = rs.slice(1).join('.');
        vm.setValue(resPath, vm.getValue(resPath) + value);
    }

    /**
     * 通过全局路径,而不是 VM 对象来 获取值
     * @param path - 全局取值路径
     * @param def - 如果取不到值的返回的默认值
     */
    getPathValue(path: string, def?: any): any {
        path = path.trim(); // 防止空格,自动剔除

        if (path === '') return '';

        let rs = path.split('.');
        if (rs.length < 2) {
            console.error('Get Value Cant find path:' + path);
            return;
        }
        let vm = this.get(rs[0]);
        if (!vm) {
            console.error('Cant Get VM:' + rs[0]);
            return;
        }
        return vm.getValue(rs.slice(1).join('.'), def);
    }

    /**
     * 通过全局路径,而不是 VM 对象来 设置值
     * @param path - 全局取值路径
     * @param value - 需要设置的值
     */
    setPathValue(path: string, value: any) {
        path = path.trim(); // 防止空格,自动剔除
        let rs = path.split('.');
        if (rs.length < 2) {
            console.error('Set Value Cant find path:' + path);
            return;
        }
        let vm = this.get(rs[0]);
        if (!vm) {
            console.error('Cant Set VM:' + rs[0]);
            return;
        }
        vm.setValue(rs.slice(1).join('.'), value);
    }

    /** 冻结所有标签的 VM，视图将不会受到任何信息 */
    inactive(): void {
        this._mvMap.forEach((mv) => {
            mv.active = false;
        });
    }

    /** 激活所有标签的 VM*/
    active(): void {
        this._mvMap.forEach((mv) => {
            mv.active = false;
        });
    }
}

export const VM = new VMManager();
