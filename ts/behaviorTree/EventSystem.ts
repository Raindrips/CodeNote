/**
 * 事件类型定义
 */
export interface BehaviorTreeEvent {
    type: string;
    data?: any;
}

/**
 * 事件监听器类型
 */
export type EventListener = (event: BehaviorTreeEvent) => void;

/**
 * 简单的事件系统
 */
export class EventSystem {
    private static instance: EventSystem;
    private listeners: Map<string, EventListener[]> = new Map();

    public static getInstance(): EventSystem {
        if (!EventSystem.instance) {
            EventSystem.instance = new EventSystem();
        }
        return EventSystem.instance;
    }

    public addEventListener(
        eventType: string,
        listener: EventListener,
    ): void {
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, []);
        }
        this.listeners.get(eventType)!.push(listener);
    }

    public removeEventListener(
        eventType: string,
        listener: EventListener,
    ): void {
        const eventListeners = this.listeners.get(eventType);
        if (eventListeners) {
            const index = eventListeners.indexOf(listener);
            if (index > -1) {
                eventListeners.splice(index, 1);
            }
        }
    }

    public dispatchEvent(event: BehaviorTreeEvent): void {
        const eventListeners = this.listeners.get(event.type);
        if (eventListeners) {
            eventListeners.forEach((listener) => listener(event));
        }
    }
}
