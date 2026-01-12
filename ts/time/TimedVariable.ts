interface TimedVariableOptions<T> {
    target: { value: T }; // 外部变量的容器引用
    setTo: T; // 起始设置值
    resetTo: T; // 时间结束后设置为的值
    duration: number; // 持续时间（秒）
    autoStart?: boolean; // 是否创建后自动启动
    onStart?: () => void; // 可选：开始回调
    onComplete?: () => void; // 可选：完成回调
}

class TimedVariable<T> {
    private timer: any = null;
    private active = false;

    private target: { value: T };
    private setTo: T;
    private resetTo: T;
    private duration: number;

    private onStart?: () => void;
    private onComplete?: () => void;

    constructor(options: TimedVariableOptions<T>) {
        this.target = options.target;
        this.setTo = options.setTo;
        this.resetTo = options.resetTo;
        this.duration = options.duration * 1000;
        this.onStart = options.onStart;
        this.onComplete = options.onComplete;

        if (options.autoStart) {
            this.start();
        }
    }

    start() {
        this.cancel(); // 先取消现有计时

        this.target.value = this.setTo;
        this.active = true;

        this.onStart?.();

        this.timer = setTimeout(() => {
            this.active = false;
            this.target.value = this.resetTo;
            this.timer = null;
            this.onComplete?.();
        }, this.duration);
    }

    reset() {
        if (this.active) {
            this.start();
        }
    }

    finish() {
        if (this.active) {
            clearTimeout(this.timer);
            this.timer = null;
            this.active = false;
            this.target.value = this.resetTo;
            this.onComplete?.();
        }
    }

    cancel() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.active = false;
    }

    isActive(): boolean {
        return this.active;
    }
}
