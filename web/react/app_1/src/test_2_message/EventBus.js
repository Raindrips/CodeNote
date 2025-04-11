
//使用事件管理器进行操作
class EventBus
{
    event = {}

    on(eventName, cb)
    {
        if (this.event[eventName]) {
            this.event[eventName].push(cb);
        }
        else {
            this.event[eventName] = [cb];
        }
    }

    off(eventName)
    {
        if (this.event[eventName]) {
            delete this.event[eventName];
        }
    }

    emit(eventName, ...params)
    {
        if (this.event[eventName]) {
            this.event[eventName].forEach(cb =>
            {
                cb(...params);
            });
        }
    }
}

const eventBus = new EventBus();
export default eventBus;