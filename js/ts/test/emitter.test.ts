import { EventEmitter } from "./EventEmitter";

// 定义事件映射类型
type EventMap = {
    userLogin: { username: string; time: Date };
    dataLoaded: { items: string[] };
    error: { message: string; code?: number };
};

// 使用示例
const emitter = new EventEmitter<EventMap>();

// 注册事件
emitter.on('userLogin', (data) => {
    console.log(`User ${data.username} 用户登陆: ${data.time}`);
});

emitter.on('error', (err) => {
    console.error(`Error: ${err.message} (错误代码: ${err.code ?? 'N/A'})`);
});

// 触发事件
emitter.emit('userLogin', { username: 'Alice', time: new Date() });
emitter.emit('error', { message: 'Something went wrong' });
