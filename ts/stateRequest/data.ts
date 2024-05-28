
interface KeyObject {
    [index: string]: number | undefined;
}

interface IStateData {
    success?: number;
    error_ex?: number;
    error_code?: number;
    fail?: number;

}

export class StateData {

    data: IStateData = {};

    public getData(key: keyof IStateData): number {
        return this.data[key] != undefined ? this.data[key]! : 0;
    }

    public get count() {
        const success = this.getData('success');
        const error_ex = this.getData('error_ex');
        const error_code = this.getData('error_code');
        const fail = this.getData('fail');
        const count = success + error_ex + error_code + fail;
        return count;
    }

    setData(key: keyof IStateData, value: number): void {
        if (!this.data[key]) {
            this.data[key] = 0;
        }
    }

    public addSuccess() {
        const key = 'success';
        this.setData(key, this.getData(key) + 1);
    }

    public addErrorException() {
        const key = 'error_ex';
        this.setData(key, this.getData(key) + 1);
    }

    public addErrorCode() {
        const key = 'error_code';
        this.setData(key, this.getData(key) + 1);
    }

    public addFail() {
        const key = 'fail';
        this.setData(key, this.getData(key) + 1);
    }

    clone() {
        const self: StateData = new StateData();
        for (const key in self.data) {
            self.data[key] += this.data[key];
        }
        return self;
    }

    addOther(other: StateData) {
        const self: StateData = this.clone();

        for (const key in self) {
            self.data[key] += other.data[key];
        }
        return self;
    }

    reset() {
        for (const key in this.data) {
            this.data[key] = 0;
        }
    }

    parseVal() {
        let obj: { [key: string]: any } = {}
        for (let val in this) {
            if (this[val]) {
                obj[val] = this[val];
            }
        }
        return obj;
    }
}