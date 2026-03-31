/**
 * @version 1.5
 */
export interface MessageData {
    name: string;
    data: any;
}

export enum TargetType {
    /** 父窗口 */
    parent,
    /** 自身 */
    self,
    /** 子窗口 */
    child,
    /** 顶部窗口 */
    top,
}
export interface MessageArgs {
    /** 目标窗口类型 */
    targetType: TargetType;

    /** 消息数据 */
    message: MessageData;

    /** 是否是原生环境 */
    isNative?: boolean;

    iframeName?: string;

    webView?: any;
}
export class MessagePipe {
    private listeners: { [name: string]: ((data: any) => void)[] } = {};

    private isNative: boolean = false;
    private isBrowser: boolean = false;

    /**
     *
     * @param isNative
     */
    constructor(isBrowser: boolean = true, isNative?: boolean) {
        const w: any = globalThis;
        if (w) {
            w.addEventListener('message', (event: MessageEvent) => this.receiveMessage(event));
        }
        if (isNative != undefined) {
            this.isNative = isNative;
        } else if (w.cocos || w.ReactNativeWebView) {
            this.isNative = true;
        }
        this.isBrowser = isBrowser;
    }

    /**
     * 发送消息到目标窗口
     * @param targetWindow - 目标窗口对象 (例如: window.opener 或其他已知窗口)
     * @param name - 消息名称
     * @param data - 发送的数据
     */
    public sendMessage(messageArgs: MessageArgs) {
        let target: any = window;

        try {
            switch (messageArgs.targetType) {
                case TargetType.parent:
                    target = window.parent;
                    break;
                case TargetType.self:
                    target = window;
                    break;
                case TargetType.child:
                    if (this.isBrowser) {
                        const iframe = document.getElementById(messageArgs.iframeName!) as HTMLIFrameElement;
                        target = iframe.contentWindow;
                    } else {
                        target = messageArgs.webView.nativeWebView.contentWindow;
                    }
                    break;
                case TargetType.top:
                    target = window.top;
                    break;
                default:
                    throw new Error('targetType is invalid');
            }
            const message: MessageData = messageArgs.message;
            target.postMessage(message, '*');
        } catch (e) {
            console.log('sendMessage error', e);
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
            this.listeners[message.name].forEach((callback) => callback(message.data));
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
// function test() {
//     const pipe = new MessagePipe();

//     pipe.onMessage("message1", data => {
//         console.log("收到消息 message1:", data);
//     });

//     // 获取父窗口代理对象
//     const parent = window.parent;

//     // 发送消息
//     pipe.sendMessage(parent, "message1", {
//         someData: "发送消息 message1",
//     });

//     // 获取子窗口代理对象
//     const iframe = document.getElementById("myIframe") as any;
//     const iframeWindow = iframe.contentWindow;
// }
