/** 允许的状态/事件基础类型 */
export type StateKey = string | number;
export type EventKey = string | number;

/** 单条状态迁移规则 */
export interface Transition<STATE extends StateKey, EVENT extends EventKey> {
    from: STATE;
    event: EVENT;
    to: STATE;
}

/** 生命周期回调集合(集中在 StateMachine 上,而不是每个事件) */
export interface StateMachineHooks<STATE extends StateKey, EVENT extends EventKey> {
    /** 进入某个状态时触发 */
    onEnter?: (state: STATE, from: STATE | null, event: EVENT | null) => void;
    /** 离开某个状态时触发 */
    onExit?: (state: STATE, to: STATE, event: EVENT) => void;
    /** 收到事件时触发(无论是否发生迁移) */
    onEvent?: (event: EVENT, current: STATE, next: STATE | null) => void;
}

/** 构造参数 */
export interface StateMachineOptions<STATE extends StateKey, EVENT extends EventKey> {
    initial: STATE;
    transitions: ReadonlyArray<Transition<STATE, EVENT>>;
    hooks?: StateMachineHooks<STATE, EVENT>;
}

/**
 * 轻量级状态机
 *
 * @example
 * type S = 'idle' | 'loading' | 'done'
 * type E = 'fetch' | 'success' | 'reset'
 *
 * const sm = new StateMachine<S, E>({
 *   initial: 'idle',
 *   transitions: [
 *     { from: 'idle',    event: 'fetch',   to: 'loading' },
 *     { from: 'loading', event: 'success', to: 'done'    },
 *     { from: 'done',    event: 'reset',   to: 'idle'    },
 *   ],
 *   hooks: {
 *     onEnter: (s, from, ev) => console.log(`enter ${String(s)} from ${String(from)} by ${String(ev)}`),
 *     onExit:  (s, to, ev)   => console.log(`exit  ${String(s)} -> ${String(to)} by ${String(ev)}`),
 *     onEvent: (ev, cur, nx) => console.log(`event ${String(ev)}: ${String(cur)} -> ${String(nx)}`),
 *   },
 * })
 *
 * sm.sendEvent('fetch')   // idle -> loading
 * sm.sendEvent('success') // loading -> done
 * sm.currentState()       // 'done'
 * sm.reset()              // 回到 'idle'
 */
export class StateMachine<STATE extends StateKey, EVENT extends EventKey> {
    private readonly initial: STATE;
    private readonly hooks: StateMachineHooks<STATE, EVENT>;
    /** 二级 Map: from -> event -> to,用于 O(1) 查找 */
    private readonly table: Map<STATE, Map<EVENT, STATE>>;
    private state: STATE;

    public constructor(options: StateMachineOptions<STATE, EVENT>) {
        this.initial = options.initial;
        this.state = options.initial;
        this.hooks = options.hooks ?? {};
        this.table = new Map();

        for (const t of options.transitions) {
            let row = this.table.get(t.from);
            if (!row) {
                row = new Map<EVENT, STATE>();
                this.table.set(t.from, row);
            }
            row.set(t.event, t.to);
        }

        // 初始进入
        this.hooks.onEnter?.(this.state, null, null);
    }

    /** 获取当前状态 */
    public currentState(): STATE {
        return this.state;
    }

    /**
     * 发送事件,触发可能的状态迁移。
     * @returns 是否发生了迁移
     */
    public sendEvent(event: EVENT): boolean {
        const row = this.table.get(this.state);
        const next: STATE | undefined = row?.get(event);

        // 无论是否迁移,先触发 onEvent
        this.hooks.onEvent?.(event, this.state, next ?? null);

        if (next === undefined) {
            return false;
        }

        const prev = this.state;
        this.hooks.onExit?.(prev, next, event);
        this.state = next;
        this.hooks.onEnter?.(next, prev, event);
        return true;
    }

    /** 重置到初始状态(会触发 onExit 与 onEnter) */
    public reset(): void {
        if (this.state !== this.initial) {
            const prev = this.state;
            // //reset 是一次“虚拟”迁移,没有事件,这里用 null 表达
            // this.hooks.onEvent?.(null as unknown as EVENT, prev, this.initial)
            this.hooks.onExit?.(prev, this.initial, null as unknown as EVENT);
            this.state = this.initial;
            this.hooks.onEnter?.(this.initial, prev, null);
        }
    }

    /** 判断在当前状态下事件是否可被处理 */
    public canHandle(event: EVENT): boolean {
        return this.table.get(this.state)?.has(event) ?? false;
    }
}
