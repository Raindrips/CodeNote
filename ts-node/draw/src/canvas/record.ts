(function () {
    // TypeScript 代码
    interface KeyEvent {
        key: string;
        type: 'down' | 'up';
        time: number;
    }

    class KeyRecorder {
        private events: KeyEvent[] = [];
        private isRecording: boolean = false;
        private startTime: number = 0;
        private logElement: HTMLElement;

        constructor() {
            this.logElement = document.getElementById('log')!;
            this.setupButtons();
            this.setupListeners();
        }

        private setupButtons() {
            document
                .getElementById('startRecord')!
                .addEventListener('click', () => this.startRecording());
            document
                .getElementById('stopRecord')!
                .addEventListener('click', () => this.stopRecording());
            document
                .getElementById('replay')!
                .addEventListener('click', () => this.replay());
            document
                .getElementById('clear')!
                .addEventListener('click', () => this.clear());
        }

        private setupListeners() {
            document.addEventListener('keydown', (e) =>
                this.handleKeyEvent(e, 'down'),
            );
            document.addEventListener('keyup', (e) =>
                this.handleKeyEvent(e, 'up'),
            );
        }

        private handleKeyEvent(event: KeyboardEvent, type: 'down' | 'up') {
            if (!this.isRecording) return;

            const time = performance.now() - this.startTime;
            const keyEvent: KeyEvent = {
                key: event.key,
                type,
                time,
            };

            this.events.push(keyEvent);
            this.logEvent(keyEvent);
        }

        private logEvent(event: KeyEvent) {
            const log = `${event.type === 'down' ? '按下' : '松开'} ${
                event.key
            } 在 ${event.time.toFixed(2)}ms`;
            const div = document.createElement('div');
            div.textContent = log;
            this.logElement.appendChild(div);
            this.logElement.scrollTop = this.logElement.scrollHeight;
        }

        private startRecording() {
            if (this.isRecording) return;

            this.isRecording = true;
            this.startTime = performance.now();
            this.events = [];
            this.logElement.innerHTML = '开始记录...\n';
            console.log('开始记录');
        }

        private stopRecording() {
            this.isRecording = false;
            this.logElement.innerHTML += '记录结束\n';
            console.log('停止记录');
        }

        private async replay() {
            if (this.events.length === 0) {
                this.logElement.innerHTML = '没有记录的事件可重播\n';
                return;
            }

            this.logElement.innerHTML = '开始重播...\n';
            const replayStart = performance.now();

            for (const event of this.events) {
                const delay =
                    event.time - (performance.now() - replayStart);
                if (delay > 0) {
                    await new Promise((resolve) =>
                        setTimeout(resolve, delay),
                    );
                }
                this.logEvent(event);
            }

            this.logElement.innerHTML += '重播结束\n';
        }

        private clear() {
            this.events = [];
            this.isRecording = false;
            this.logElement.innerHTML = '已清除\n';
        }
    }

    // 初始化
    const recorder = new KeyRecorder();
})();
