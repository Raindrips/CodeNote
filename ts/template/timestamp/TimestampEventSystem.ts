/** 时间戳事件定义 */
export type TimerEvent = {
  /** 触发时间(单位自定) */
  time: number;
  /** 事件标识或回调名称 */
  event: string;
};

/**
 * 时间戳事件系统
 * 处理基于时间轴的事件触发，支持事件覆盖机制
 */
export class TimestampEventSystem {
  private events: TimerEvent[] = [];
  private lastIndex: number = -1;

  /**
   * 设置并按时间升序排序事件数组
   * @param events 原始事件数组
   */
  public setEvents(events: TimerEvent[]): void {
    this.events = [...events].sort((a, b) => a.time - b.time);
    this.lastIndex = -1;
  }

  /**
   * 运行系统，检查并执行当前时间点应触发的事件
   * @param currentTime 当前时间戳
   * @param callback 执行事件的回调函数
   */
  public update(currentTime: number, callback: (eventName: string) => void): void {
    let bestIndex = -1;

    // 从上次执行的位置之后开始检索
    for (let i = this.lastIndex + 1; i < this.events.length; i++) {
      if (this.events[i].time <= currentTime) {
        bestIndex = i;
      } else {
        // 由于已排序，遇到大于当前时间的即可停止
        break;
      }
    }

    // 如果找到了满足条件的事件，只执行最后（最新）的一个
    if (bestIndex !== -1) {
      const targetEvent = this.events[bestIndex].event;
      this.lastIndex = bestIndex; // 之前的事件标记为已执行/被覆盖
      callback(targetEvent);
    }
  }

  /**
   * 重置执行状态，使事件可以重新从头开始触发
   */
  public reset(): void {
    this.lastIndex = -1;
  }
}