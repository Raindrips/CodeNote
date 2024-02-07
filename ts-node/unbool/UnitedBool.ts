
export class UnitedBool {
    private deaultVal: boolean;
    private val: boolean;

    private channelVals: { [channel: number]: boolean };

    constructor(val: boolean) {
        this.deaultVal = val;
        this.val = val;

        this.channelVals = {};
    }

    getVal(): boolean {
        return this.val;
    }

    getDefaultVal(): boolean {
        return this.deaultVal;
    }

    setVal(channel: number, val: boolean) {
        this.channelVals[channel] = val;
        this.updateVal();
    }
    private updateVal() {
        for (const channel in this.channelVals) {
            if (this.channelVals[channel] != this.deaultVal) {
                this.val = this.channelVals[channel];
                return;
            }
        }

        this.val = this.deaultVal;
    }
}