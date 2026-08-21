export class FreeTimer {
    // 预先声明并分配变量，避免运行时动态添加属性
    private _startTime: number = 0;
    private _pauseStartTime: number = 0;
    private _paused: boolean = false;

    constructor() {
        this.start();
    }
    //计时开始
    public start(): void {
        this._startTime = performance.now();
        this._pauseStartTime = 0;
        this._paused = false;
    }

    //计算时间差
    public diff(): number {
        if (this._startTime === 0) return 0;
        if (this._paused) {
            return this._pauseStartTime - this._startTime;
        }
        return performance.now() - this._startTime;
    }

    //暂停时间
    public pause(): void {
        if (this._paused) return;
        this._pauseStartTime = performance.now();
        this._paused = true;
    }

    //恢复暂停 并返回暂停的时间差
    resume(): number {
        if (!this._paused) return 0;
        const now = performance.now();
        const pauseDuration = now - this._pauseStartTime;
        // 将暂停的时间偏移加到_startTime上，使diff()跳过暂停时段
        this._startTime += pauseDuration;
        this._pauseStartTime = 0;
        this._paused = false;
        return pauseDuration;
    }

    /** 直接设置已过时间（用于快照恢复） */
    setElapsed(ms: number): void {
        this._startTime = performance.now() - ms;
        this._pauseStartTime = 0;
        this._paused = false;
    }
}
