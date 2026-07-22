using System;
using System.Collections.Generic;

/// <summary>
/// 单条状态迁移规则
/// </summary>
public struct Transition<TState, TEvent>
{
    public TState From;
    public TEvent Event;
    public TState To;

    public Transition(TState from, TEvent @event, TState to)
    {
        From = from;
        Event = @event;
        To = to;
    }
}

/// <summary>
/// 生命周期回调集合 (集中在 StateMachine 上)
/// 注意：因为 TState 和 TEvent 可能是值类型(如 enum)，
/// 所以原本 TS 里的 null，在 C# 中用 default(T) 表示。
/// </summary>
public class StateMachineHooks<TState, TEvent>
{
    /// <summary> 进入某个状态时触发 (state, from, event) </summary>
    public Action<TState, TState, TEvent> OnEnter;
    
    /// <summary> 离开某个状态时触发 (state, to, event) </summary>
    public Action<TState, TState, TEvent> OnExit;
    
    /// <summary> 收到事件时触发 (event, current, next) </summary>
    public Action<TEvent, TState, TState> OnEvent;
}

/// <summary>
/// 构造参数
/// </summary>
public class StateMachineOptions<TState, TEvent>
{
    public TState Initial { get; set; }
    public IEnumerable<Transition<TState, TEvent>> Transitions { get; set; }
    public StateMachineHooks<TState, TEvent> Hooks { get; set; }
}

/// <summary>
/// 轻量级状态机
/// </summary>
public class StateMachine<TState, TEvent>
{
    private readonly TState _initial;
    private readonly StateMachineHooks<TState, TEvent> _hooks;
    
    // 二级 Dictionary: from -> event -> to, 用于 O(1) 查找
    private readonly Dictionary<TState, Dictionary<TEvent, TState>> _table;
    
    public TState CurrentState { get; private set; }

    public StateMachine(StateMachineOptions<TState, TEvent> options)
    {
        _initial = options.Initial;
        CurrentState = options.Initial;
        _hooks = options.Hooks ?? new StateMachineHooks<TState, TEvent>();
        _table = new Dictionary<TState, Dictionary<TEvent, TState>>();

        if (options.Transitions != null)
        {
            foreach (var t in options.Transitions)
            {
                if (!_table.TryGetValue(t.From, out var row))
                {
                    row = new Dictionary<TEvent, TState>();
                    _table[t.From] = row;
                }
                row[t.Event] = t.To;
            }
        }

        // 初始进入 (C# 中缺失的值用 default 传递)
        _hooks.OnEnter?.Invoke(CurrentState, default, default);
    }

    /// <summary>
    /// 发送事件,触发可能的状态迁移。
    /// </summary>
    /// <returns>是否发生了迁移</returns>
    public bool SendEvent(TEvent @event)
    {
        _table.TryGetValue(CurrentState, out var row);
        
        bool hasNext = row != null && row.TryGetValue(@event, out var next);

        // 无论是否迁移,先触发 onEvent
        _hooks.OnEvent?.Invoke(@event, CurrentState, hasNext ? next : default);

        if (!hasNext)
        {
            return false;
        }

        var prev = CurrentState;
        _hooks.OnExit?.Invoke(prev, next, @event);
        CurrentState = next;
        _hooks.OnEnter?.Invoke(next, prev, @event);
        
        return true;
    }

    /// <summary>
    /// 重置到初始状态(会触发 onExit 与 onEnter)
    /// </summary>
    public void Reset()
    {
        // 避免装箱的默认比较器
        if (!EqualityComparer<TState>.Default.Equals(CurrentState, _initial))
        {
            var prev = CurrentState;
            // reset 是一次“虚拟”迁移,没有事件,这里用 default 表达
            _hooks.OnEvent?.Invoke(default, prev, _initial);
            _hooks.OnExit?.Invoke(prev, _initial, default);
            CurrentState = _initial;
            _hooks.OnEnter?.Invoke(_initial, prev, default);
        }
    }

    /// <summary>
    /// 判断在当前状态下事件是否可被处理
    /// </summary>
    public bool CanHandle(TEvent @event)
    {
        return _table.TryGetValue(CurrentState, out var row) && row.ContainsKey(@event);
    }
}