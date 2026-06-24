// =============================================================================
// 状态机核心类型定义
// =============================================================================

/**
 * 状态机事件接口
 */
export interface StateMachineEvent {
  type: string;
  data?: any;
}

/**
 * 条件函数类型
 */
export type ConditionFunction = () => boolean;

/**
 * 状态转换配置
 */
export interface StateTransition {
  from: string;
  to: string;
  event?: string;
  condition?: ConditionFunction;
  guard?: ConditionFunction; // 额外的守护条件
}

/**
 * 状态配置接口
 */
export interface StateConfig {
  name: string;
  onEnter?: () => void;
  onExit?: () => void;
  onUpdate?: (deltaTime: number) => void;
  subStateMachine?: StateMachine; // 嵌套子状态机
}

/**
 * 状态机配置接口
 */
export interface StateMachineConfig {
  initialState: string;
  states: StateConfig[];
  transitions: StateTransition[];
  context?: Record<string, any>; // 上下文数据
}

// =============================================================================
// 状态机核心实现
// =============================================================================

/**
 * 有限状态机类
 */
export class StateMachine {
  private currentState: string;
  private states: Map<string, StateConfig> = new Map();
  private transitions: StateTransition[] = [];
  private context: Record<string, any> = {};
  private eventQueue: StateMachineEvent[] = [];
  private isProcessingEvent: boolean = false;
  private parentStateMachine?: StateMachine;
  
  // 事件监听器
  private listeners: Map<string, ((event: StateMachineEvent) => void)[]> = new Map();

  constructor(config: StateMachineConfig) {
    // 初始化状态
    config.states.forEach(state => {
      this.states.set(state.name, state);
      // 设置子状态机的父引用
      if (state.subStateMachine) {
        state.subStateMachine.parentStateMachine = this;
      }
    });
    
    this.transitions = config.transitions;
    this.context = config.context || {};
    this.currentState = config.initialState;
    
    // 进入初始状态
    this.enterState(config.initialState);
  }

  /**
   * 获取当前状态
   */
  getCurrentState(): string {
    return this.currentState;
  }

  /**
   * 获取当前状态的完整路径（包括嵌套状态）
   */
  getCurrentStatePath(): string[] {
    const path = [this.currentState];
    const currentStateConfig = this.states.get(this.currentState);
    
    if (currentStateConfig?.subStateMachine) {
      const subPath = currentStateConfig.subStateMachine.getCurrentStatePath();
      path.push(...subPath);
    }
    
    return path;
  }

  /**
   * 获取上下文数据
   */
  getContext(): Record<string, any> {
    return this.context;
  }

  /**
   * 设置上下文数据
   */
  setContext(key: string, value: any): void {
    this.context[key] = value;
  }

  /**
   * 发送事件
   */
  sendEvent(event: StateMachineEvent): void {
    this.eventQueue.push(event);
    
    if (!this.isProcessingEvent) {
      this.processEvents();
    }
  }

  /**
   * 处理事件队列
   */
  private processEvents(): void {
    this.isProcessingEvent = true;
    
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift()!;
      this.handleEvent(event);
    }
    
    this.isProcessingEvent = false;
  }

  /**
   * 处理单个事件
   */
  private handleEvent(event: StateMachineEvent): void {
    // 首先让当前状态的子状态机处理事件
    const currentStateConfig = this.states.get(this.currentState);
    if (currentStateConfig?.subStateMachine) {
      currentStateConfig.subStateMachine.sendEvent(event);
      // 如果子状态机处理了事件，可能不需要继续处理
      // 这里可以根据需要添加更复杂的逻辑
    }

    // 查找匹配的转换
    const transition = this.findTransition(event);
    if (transition) {
      this.executeTransition(transition);
    }

    // 触发事件监听器
    this.notifyListeners(event);
  }

  /**
   * 查找匹配的状态转换
   */
  private findTransition(event: StateMachineEvent): StateTransition | null {
    return this.transitions.find(transition => {
      // 检查起始状态
      if (transition.from !== this.currentState && transition.from !== '*') {
        return false;
      }

      // 检查事件类型
      if (transition.event && transition.event !== event.type) {
        return false;
      }

      // 检查条件
      if (transition.condition && !transition.condition()) {
        return false;
      }

      // 检查守护条件
      if (transition.guard && !transition.guard()) {
        return false;
      }

      return true;
    }) || null;
  }

  /**
   * 执行状态转换
   */
  private executeTransition(transition: StateTransition): void {
    const fromState = this.currentState;
    const toState = transition.to;

    if (fromState === toState) {
      return; // 无需转换
    }

    this.exitState(fromState);
    this.currentState = toState;
    this.enterState(toState);
  }

  /**
   * 进入状态
   */
  private enterState(stateName: string): void {
    const state = this.states.get(stateName);
    if (state) {
      state.onEnter?.();
      // 如果有子状态机，启动它
      if (state.subStateMachine) {
        state.subStateMachine.start();
      }
    }
  }

  /**
   * 退出状态
   */
  private exitState(stateName: string): void {
    const state = this.states.get(stateName);
    if (state) {
      // 如果有子状态机，停止它
      if (state.subStateMachine) {
        state.subStateMachine.stop();
      }
      state.onExit?.();
    }
  }

  /**
   * 更新状态机（游戏循环中调用）
   */
  update(deltaTime: number): void {
    // 检查基于条件的转换
    this.checkConditionTransitions();
    
    // 更新当前状态
    const currentStateConfig = this.states.get(this.currentState);
    if (currentStateConfig) {
      currentStateConfig.onUpdate?.(deltaTime);
      
      // 更新子状态机
      if (currentStateConfig.subStateMachine) {
        currentStateConfig.subStateMachine.update(deltaTime);
      }
    }
  }

  /**
   * 检查基于条件的状态转换
   */
  private checkConditionTransitions(): void {
    const conditionTransition = this.transitions.find(transition => {
      return (transition.from === this.currentState || transition.from === '*') &&
             !transition.event && // 基于条件的转换不依赖事件
             transition.condition && 
             transition.condition() &&
             (!transition.guard || transition.guard());
    });

    if (conditionTransition) {
      this.executeTransition(conditionTransition);
    }
  }

  /**
   * 启动状态机
   */
  start(): void {
    this.enterState(this.currentState);
  }

  /**
   * 停止状态机
   */
  stop(): void {
    this.exitState(this.currentState);
  }

  /**
   * 强制转换到指定状态
   */
  forceTransition(stateName: string): void {
    if (this.states.has(stateName)) {
      this.exitState(this.currentState);
      this.currentState = stateName;
      this.enterState(stateName);
    }
  }

  /**
   * 添加事件监听器
   */
  addEventListener(eventType: string, listener: (event: StateMachineEvent) => void): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(listener);
  }

  /**
   * 移除事件监听器
   */
  removeEventListener(eventType: string, listener: (event: StateMachineEvent) => void): void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * 通知监听器
   */
  private notifyListeners(event: StateMachineEvent): void {
    const listeners = this.listeners.get(event.type) || [];
    listeners.forEach(listener => listener(event));
  }

  /**
   * 检查是否可以转换到指定状态
   */
  canTransitionTo(stateName: string, eventType?: string): boolean {
    return this.transitions.some(transition => {
      return (transition.from === this.currentState || transition.from === '*') &&
             transition.to === stateName &&
             (!eventType || transition.event === eventType) &&
             (!transition.condition || transition.condition()) &&
             (!transition.guard || transition.guard());
    });
  }

  /**
   * 获取当前状态的可能转换
   */
  getPossibleTransitions(): string[] {
    return this.transitions
      .filter(transition => {
        return (transition.from === this.currentState || transition.from === '*') &&
               (!transition.condition || transition.condition()) &&
               (!transition.guard || transition.guard());
      })
      .map(transition => transition.to);
  }
}

// =============================================================================
// 状态机构建器（可选的便利类）
// =============================================================================

/**
 * 状态机构建器，提供链式API来创建状态机
 */
export class StateMachineBuilder {
  private config: StateMachineConfig;

  constructor(initialState: string) {
    this.config = {
      initialState,
      states: [],
      transitions: [],
      context: {}
    };
  }

  /**
   * 添加状态
   */
  addState(config: StateConfig): StateMachineBuilder {
    this.config.states.push(config);
    return this;
  }

  /**
   * 添加转换
   */
  addTransition(transition: StateTransition): StateMachineBuilder {
    this.config.transitions.push(transition);
    return this;
  }

  /**
   * 设置上下文
   */
  setContext(context: Record<string, any>): StateMachineBuilder {
    this.config.context = { ...this.config.context, ...context };
    return this;
  }

  /**
   * 构建状态机
   */
  build(): StateMachine {
    return new StateMachine(this.config);
  }
}