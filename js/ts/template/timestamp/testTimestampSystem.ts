import { TimestampEventSystem, TimerEvent } from './TimestampEventSystem';

const events: TimerEvent[] = [
  { time: 1000, event: "START_GAME" },
  { time: 5000, event: "SPAWN_BOSS" },
  { time: 3000, event: "PLAY_MUSIC" }, // 乱序输入测试
  { time: 8000, event: "END_GAME" }
];

const timerSystem = new TimestampEventSystem();
timerSystem.setEvents(events);

const onEventTrigger = (name: string) => console.log(`Triggered: ${name}`);

// 模拟正常流逝
timerSystem.update(1500, onEventTrigger); // 触发 START_GAME

// 模拟时间跳跃 (从1500直接跳到6000)
// 此时 3000(PLAY_MUSIC) 和 5000(SPAWN_BOSS) 都超过了
// 根据需求：只执行 5000 的事件，3000 的被覆盖
timerSystem.update(6000, onEventTrigger); // 触发 SPAWN_BOSS

// 再次更新相同时间或稍大一点但未到下个阈值的时间
timerSystem.update(7000, onEventTrigger); // 无触发

// 达到最后一个
timerSystem.update(8500, onEventTrigger); // 触发 END_GAME

// 重置测试
timerSystem.reset();
timerSystem.update(2000, onEventTrigger); // 重新触发 START_GAME