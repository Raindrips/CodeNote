(() => {
    interface CountdownItem {
        startTime: number;
        endTime: number;
    }

    class CustomCountSystem {
        private timers = new Map<number, CountdownItem>();
        private idSeed = 1;

        // 启动倒计时
        start(startTime: number, endTime: number): number {
            if (startTime > endTime) {
                console.error(
                    `[CountdownSystem] Invalid time range: startTime(${startTime}) > endTime(${endTime})`,
                );
                return -1;
            }

            const id = this.idSeed++;
            this.timers.set(id, { startTime, endTime });
            return id;
        }

        // 结束倒计时
        stop(id: number): void {
            if (!this.timers.has(id)) {
                console.error(
                    `[CountdownSystem] stop failed, invalid id: ${id}`,
                );
                return;
            }
            this.timers.delete(id);
        }

        // 获取剩余时间
        getRemaining(id: number, currentTime: number): number {
            const item = this.timers.get(id);
            if (!item) {
                console.error(
                    `[CountdownSystem] getRemaining failed, invalid id: ${id}`,
                );
                return -1;
            }

            const remaining = item.endTime - currentTime;
            return remaining > 0 ? remaining : 0;
        }

        // 获取总时长
        getDuration(id: number): number {
            const item = this.timers.get(id);
            if (!item) {
                return -1;
            }

            return item.endTime - item.startTime;
        }
    }

    function test() {
        const system = new CustomCountSystem();

        // 假设这是你自己的逻辑时间
        let t = 100;

        // 创建倒计时：100 → 160
        const id = system.start(100, 160);

        // 推进时间
        t = 120;
        console.log(system.getRemaining(id, t)); // 40

        t = 160;
        console.log(system.getRemaining(id, t)); // 0

        console.log(system.getDuration(id)); // 60

        system.stop(id);
        console.log(system.getRemaining(id, t)); // -1
    }
    test();
})();
