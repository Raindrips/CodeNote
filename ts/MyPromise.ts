export type Executor<T> = (resolve: (value: T) => void, reject: (reason: any) => void) => void;

export class MyPromise<T> {
    private _onResolve: ((value: T) => void) | null = null;
    private _onReject: ((reason: any) => void) | null = null;
    private _isResolved: boolean = false;
    private _isRejected: boolean = false;
    private _value!: T;
    private _reason!: any;

    constructor(executor: Executor<T>) {
        try {
            executor(this.resolve.bind(this), this.reject.bind(this));
        } catch (error) {
            this.reject(error);
        }
    }

    private resolve(value: T) {
        this._isResolved = true;
        this._value = value;
        if (this._onResolve) {
            this._onResolve(value);
        }
    }

    private reject(reason: any) {
        this._isRejected = true;
        this._reason = reason;
        if (this._onReject) {
            this._onReject(reason);
        }
    }

    then(onResolve: (value: T) => void) {
        if (this._isResolved) {
            onResolve(this._value);
        } else {
            this._onResolve = onResolve;
        }
        return this;
    }

    catch(onReject: (reason: any) => void) {
        if (this._isRejected) {
            onReject(this._reason);
        } else {
            this._onReject = onReject;
        }
        return this;
    }
}


