/**
 * @version 1.5
 */
export interface MessageData {
    name: string;
    data: any;
}
export class MessagePipe {
    private listeners: { [name: string]: ((data: any) => void)[] } = {};

    constructor() {
        const targetWindow = globalThis;
        if (targetWindow) {
            targetWindow.addEventListener('message', (event) =>
                this.receiveMessage(event),
            );
        } else {
            console.warn(new Error('targetWindow is null'));
        }
    }

    /**
     * 发送消息到目标窗口
     * @param targetWindow - 目标窗口对象 (例如: window.opener 或其他已知窗口)
     * @param name - 消息名称
     * @param data - 发送的数据
     */
    public sendMessage(
        targetWindow: Window | WindowProxy,
        name: string,
        data: any,
    ) {
        // 非App环境
        try {
            const appWindow: any = window;
            if (appWindow['ReactNativeWebView']) {
                //APP环境
                appWindow.ReactNativeWebView.postMessage(name);
            } else {
                let target = window.top ? window.top : targetWindow;
                if (target) {
                    // '*' 表示允许所有域接收
                    const message: MessageData = { name, data };
                    target.postMessage(message, '*');
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * 注册消息接收的处理函数
     * @param name - 消息名称
     * @param callback - 消息处理函数
     */
    public onMessage(name: string, callback: (data: any) => void) {
        if (!this.listeners[name]) {
            this.listeners[name] = [];
        }
        this.listeners[name].push(callback);
    }

    /**
     * 接收消息并调用已注册的处理函数
     * @param event - 传递的事件对象
     */
    private receiveMessage(event: MessageEvent) {
        const message: MessageData = event.data;
        console.log(this.listeners);
        if (this.listeners[message.name]) {
            this.listeners[message.name].forEach((callback) =>
                callback(message.data),
            );
        }
    }

    getParent(): WindowProxy {
        try {
            return window.parent || window.opener;
        } finally {
            return null!;
        }
    }
}

//使用示例
function test() {
    const pipe = new MessagePipe();

    pipe.onMessage('message1', (data) => {
        console.log('收到消息 message1:', data);
    });

    // 获取父窗口代理对象
    const parent = window.parent;

    // 发送消息
    pipe.sendMessage(parent, 'message1', {
        someData: '发送消息 message1',
    });

    // 获取子窗口代理对象
    const iframe = document.getElementById('myIframe') as any;
    const iframeWindow = iframe.contentWindow;
}
