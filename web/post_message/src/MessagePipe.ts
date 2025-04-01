/**
 * @version 1.2
 * @author yun_jian
 */

export interface MessageData {
    name: string;
    data: any;
}
export class MessagePipe {
    private listeners: { [name: string]: ((data: any) => void)[] } = {};

    constructor() {
        const targetWindow = window;
        if (!targetWindow) {
            throw new Error('无法获取目标窗口对象');
        }
        targetWindow.addEventListener('message', (event) =>
            this.receiveMessage(event),
        );
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
        if (!targetWindow) {
            throw new Error('发送失败,无法获取目标窗口对象');
        }

        if ('ReactNativeWebView' in targetWindow) {
            console.log('发送数据 app环境');
            //APP环境
            const appWindow: any = window;
            appWindow.ReactNativeWebView.postMessage(name);
        } else {
            // 非App环境 '*' 表示允许所有域接收
            const message: MessageData = { name, data };
            targetWindow.postMessage(message, '*');
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
        if (this.listeners[message.name]) {
            this.listeners[message.name].forEach((callback) =>
                callback(message.data),
            );
        }
    }

    /**
     * 获取父窗口的代理对象
     */
    getParent(): WindowProxy {
        return window.parent || window.opener;
    }
}

//使用示例
function test() {
    const pipe = new MessagePipe();

    pipe.onMessage('message1', (data) => {
        console.log('收到消息 message1:', data);
    });

    pipe.sendMessage(pipe.getParent(), 'message1', {
        someData: '发送消息 message1',
    });
}
