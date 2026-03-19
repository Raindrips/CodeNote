/**
 * @version 1.6
 */
export interface MessageData {
    name: string;
    data: any;
}

/**
 * 基础通信类：负责底层的监听与发送
 */
export class MessagePipe {
    private listeners: { [name: string]: ((data: any) => void)[] } = {};

    constructor() {
        if (typeof globalThis !== 'undefined') {
            globalThis.addEventListener('message', (event) => this.receiveMessage(event));
        }
    }

    public sendMessage(targetWindow: Window | WindowProxy | null, name: string, data: any) {
        if (!targetWindow) return;
        try {
            // 排除 ReactNative 环境
            if ((window as any)['ReactNativeWebView']) return;
            
            const message: MessageData = { name, data };
            targetWindow.postMessage(message, '*');
        } catch (e) {
            console.error('MessagePipe Send Error:', e);
        }
    }

    public onMessage(name: string, callback: (data: any) => void) {
        if (!this.listeners[name]) this.listeners[name] = [];
        this.listeners[name].push(callback);
    }

    private receiveMessage(event: MessageEvent) {
        const message: MessageData = event.data;
        if (message && this.listeners[message.name]) {
            this.listeners[message.name].forEach((cb) => cb(message.data));
        }
    }
}

/**
 * 增强组合类：负责异步握手和状态同步
 */
export class AsyncMessagePipe {
    private pipe: MessagePipe;
    private isReady: boolean = false;
    private readonly PING_EVENT = '__ready_ping__';
    private readonly PONG_EVENT = '__ready_pong__';

    constructor() {
        this.pipe = new MessagePipe();
        // 自动响应握手信号
        this.pipe.onMessage(this.PING_EVENT, () => {
            // 收到 ping，回传 pong
            this.pipe.sendMessage(window.opener || window.parent, this.PONG_EVENT, true);
        });
    }

    /**
     * 等待目标窗口就绪
     * @param target 目标窗口
     * @param timeout 超时时间
     */
    public async waitForReady(target: Window | WindowProxy, timeout = 5000): Promise<void> {
        return new Promise((resolve, reject) => {
            const timer = setInterval(() => {
                this.pipe.sendMessage(target, this.PING_EVENT, {});
            }, 200); // 每200ms嗅探一次

            const onPong = () => {
                this.isReady = true;
                clearInterval(timer);
                clearTimeout(failSafe);
                resolve();
            };

            this.pipe.onMessage(this.PONG_EVENT, onPong);

            const failSafe = setTimeout(() => {
                clearInterval(timer);
                reject(new Error('Wait for target window timeout'));
            }, timeout);
        });
    }

    /**
     * 安全发送：等待就绪后再发送数据
     */
    public async sendAsync(target: Window | WindowProxy, name: string, data: any) {
        if (!this.isReady) {
            await this.waitForReady(target);
        }
        this.pipe.sendMessage(target, name, data);
    }

    // 暴露原始监听方法
    public on(name: string, callback: (data: any) => void) {
        this.pipe.onMessage(name, callback);
    }
}