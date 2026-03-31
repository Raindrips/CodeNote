// 定义 fixedUpdate 函数接口
interface FixedUpdateFunction {
    (frame: number): void;
}

class FixedTimeStep {
    // 固定的帧率（每秒执行次数）
    private fixedFrameRate: number = 50;
    // 固定时间步长（秒）
    private fixedDeltaTime: number = 1 / 50;
    // 累积时间
    private accumulatedTime: number = 0;

    constructor(frameRate: number = 50) {
        this.fixedFrameRate = frameRate;
        this.fixedDeltaTime = 1 / frameRate;
    }

    // 主更新函数
    executeUpdate(deltaTime: number, fixedCallback: FixedUpdateFunction) {
        // 累积经过的时间
        this.accumulatedTime += deltaTime;

        // 计算需要执行的固定步数
        let frameCount = 0;
        while (this.accumulatedTime >= this.fixedDeltaTime) {
            // 执行 fixedUpdate
            fixedCallback(frameCount);
            this.accumulatedTime -= this.fixedDeltaTime;
            frameCount++;
        }
    }

    // 重置累积时间
    reset() {
        this.accumulatedTime = 0;
    }

    // 获取当前固定的时间步长
    getFixedDeltaTime(): number {
        return this.fixedDeltaTime;
    }
}

// 使用示例
class GameLoop {
    private fixedTimeStep: FixedTimeStep;
    private lastTime: number = 0;
    private frameCounter: number = 0;

    constructor() {
        this.fixedTimeStep = new FixedTimeStep(50); // 每秒50次固定更新
    }

    // 模拟的主循环
    start() {
        this.lastTime = performance.now() / 1000; // 转换为秒
        this.gameLoop();
    }

    private gameLoop = () => {
        const currentTime = performance.now() / 1000;
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // 执行固定更新
        this.fixedTimeStep.executeUpdate(deltaTime, (frame: number) => {
            this.frameCounter++;
            console.log(
                `Fixed Update - Frame: ${this.frameCounter} frame:${frame}`,
            );
        });

        // 模拟不同的刷新率
        requestAnimationFrame(this.gameLoop);
    };
}

const game = new GameLoop();
game.start();
