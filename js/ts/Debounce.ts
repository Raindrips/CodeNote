export class Debounce {
    private timer: number | null = null;
    private readonly delay: number;

    constructor(delay: number) {
        this.delay = delay; // 毫秒延迟
    }

    /** 包装函数，只有停止调用 delay 毫秒后才触发 */
    run(fn: () => void): void {
        if (this.timer !== null) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
            fn();
            this.timer = null;
        }, this.delay) as unknown as number;
    }
}

(() => {
    // 创建一个防抖器，延迟 500ms
    const debounce = new Debounce(500);

    function logMessage() {
        console.log('触发时间:', Date.now());
    }

    // 高频调用
    document.addEventListener('keyup', () => {
        debounce.run(logMessage);
    });
})();
