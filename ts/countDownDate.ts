class CountDownDate {
    private static readonly EPSILON: number = 1e-10; // 小误差阈值
    private currentTime: number = 0;
    private targetTime: number = 0;
    private isPaused: boolean = false;
    private time: number = 0;
    private dateFn = Date.now;
    private onComplete = () => {};
    constructor() {}

    start(time: number) {
        this.time = time;
        this.currentTime = this.dateFn();
        this.targetTime = this.dateFn() + time * 1000;
        this.isPaused = false;
    }

    //获取总时间
    getTime() {
        return this.time;
    }

    //获取倒计时
    getCountTime() {
        if (this.isPaused) {
            return 0;
        }
        this.currentTime = this.dateFn();
        const diff = this.targetTime - this.currentTime;
        if (diff < 0) {
            this.isPaused = true;
            this.stop();
            return 0;
        }
        return diff / 1000;
    }

    reset() {
        this.currentTime = this.time;
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }

    stop() {
        this.isPaused = true;
        if (this.onComplete) {
            this.onComplete(); // 调用完成回调
        }
    }

    setComplete(fn: () => void) {
        this.onComplete = fn;
    }

    setDateFn(fn: () => number) {
        this.dateFn = fn;
    }
}

//TEST
(function () {
    let loop = true;
    const countDown = new CountDownDate();
    countDown.setDateFn(performance.now);

    //回调
    countDown.setComplete(() => {
        console.log('end');
        loop = false;
    });
    //计时时间
    countDown.start(3.5);

    function count() {
        if (loop) {
            //获取倒数计
            console.log(countDown.getCountTime());
            setTimeout(count, 1);
        }
    }
    count();
})();
