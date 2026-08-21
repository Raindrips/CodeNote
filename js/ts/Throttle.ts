// 节流器,限制每秒执行次数
export class Throttle {
    private lastTime: number = 0;
    private readonly interval: number;

    constructor(interval: number) {
        this.interval = interval; // 毫秒间隔
    }

    /** 包装函数，保证高频调用时只触发一次 */
    run(fn: () => void): void {
        const now = Date.now();
        if (now - this.lastTime >= this.interval) {
            this.lastTime = now;
            fn();
        }
    }
}

//Test
(() => {
    // 创建一个节流器，间隔 1000ms
    const throttle = new Throttle(1000);

    function logMessage() {
        console.log('触发时间:', Date.now());
    }

    // 高频调用
    setInterval(() => {
        throttle.run(logMessage);
    }, 50);
})();
