(() => {
    interface CountdownItem {
        endTime: number; // 毫秒时间戳
    }

    class CountdownSystem {
        private timers = new Map<number, CountdownItem>();
        private idSeed = 1;

        // 启动倒计时（duration: 毫秒）
        start(duration: number): number {
            const id = this.idSeed++;
            const endTime = Date.now() + duration;

            this.timers.set(id, { endTime });
            return id;
        }

        // 结束倒计时
        stop(id: number): void {
            this.timers.delete(id);
        }

        // 获取剩余时间（毫秒）
        getRemaining(id: number): number {
            const item = this.timers.get(id);
            if (!item) return -1;

            const remaining = item.endTime - Date.now();
            return remaining > 0 ? remaining : 0;
        }
    }
})();
