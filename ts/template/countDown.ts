class CountDown {
    private static readonly EPSILON: number = 1e-10; // 小误差阈值
    private currentTime: number = 0;
    private targetTime: number = 0;
    private isPaused: boolean = false;
    private time: number = 0;

    constructor() {}

    start(time: number) {
        this.time = time;
        this.currentTime = time;
        this.isPaused = false;
    }

    //获取总时间
    getTime() {
        return this.time;
    }

    //获取倒计时
    getCountTime() {
        return this.currentTime;
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
        this.currentTime = 0;
        if (this.onComplete) {
            this.onComplete(); // 调用完成回调
        }
    }

    // 倒计时更新，deltaTime 为时间间隔（秒）
    update(deltaTime: number) {
        if (this.isPaused || this.currentTime <= 0) return;

        this.currentTime -= deltaTime;

        if (this.currentTime <= 0 || this.currentTime < CountDown.EPSILON) {
            this.currentTime = 0;
        }
        this.onDown(this.currentTime);
        if (this.currentTime <= 0) {
            this.onComplete();
        }
    }

    onComplete = () => {};
    onDown = (t: number) => {};
}

(function() {
    let countDown = new CountDown();

    let loop = true;
    countDown.onComplete = () => {
        console.log('onComplete');
        loop = false;
    };

    countDown.onDown = (t) => {
        console.log('onDown', t);
    };

    countDown.start(10);

    function count() {
        countDown.update(0.01);
        if (loop) {
            setTimeout(count, 10);
        }
    }
    count();
})()

