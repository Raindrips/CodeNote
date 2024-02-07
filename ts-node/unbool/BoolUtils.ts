
export class BitSet {
    channelMap: Map<number, boolean>;

    constructor() {
        this.channelMap = new Map<number, boolean>();
    }

    set(channel: number, val: boolean) {
        this.channelMap.set(channel, val);
    }

    one(val: Boolean) {
        for (const pair of this.channelMap) {
            if (pair[1] == val) {
                return true;
            }
        }
        return false;
    }

    // true   all true return true
    // false  all false return true
    all(val: Boolean) {
        for (const pair of this.channelMap) {
            if (pair[1] != val) {
                return false;
            }
        }
        return true;
    }

    print() {
        for (const pair of this.channelMap) {
            console.log(pair)
        }
    }
}