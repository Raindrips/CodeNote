export class StateData {
    public success = 0;
    public error_ex = 0;
    public error_code = 0;
    public fail = 0;

    [index: string]: any;

    public get count() {
        const count = this.success + this.error_ex + this.error_code + this.fail;
        return count;
    }

    public addSuccess() {
        this.success++;
    }

    public addErrorException() {
        this.error_ex++;
    }

    public addErrorCode() {
        this.error_code++;
    }

    public addFail() {
        this.fail++;
    }

    clone() {
        const self: StateData = new StateData();
        for (let val in self) {
            self[val] += this[val];
        }
        return self;
    }

    addOther(other: StateData) {
        const self: StateData = this.clone();

        for (let val in self) {
            self[val] += other[val];
        }
        return self;
    }

    reset() {
        this.error_code = 0;
        this.error_ex = 0;
        this.fail = 0;
        this.success = 0;
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