import {
    StateMachine,
    StateMachineBuilder,
    StateMachineEvent,
    StateConfig,
    StateTransition,
} from './state-machine';
(() => {
    // =============================================================================
    // 测试用例1: 基础状态机 - 游戏角色状态
    // =============================================================================

    interface PlayerContext {
        health: number;
        energy: number;
        hasWeapon: boolean;
        enemyNearby: boolean;
    }

    function createPlayerStateMachine(): StateMachine {
        const context: PlayerContext = {
            health: 100,
            energy: 100,
            hasWeapon: true,
            enemyNearby: false,
        };

        return (
            new StateMachineBuilder('idle')
                .setContext(context)
                .addState({
                    name: 'idle',
                    onEnter: () => console.log('Player enters idle state'),
                    onUpdate: (dt) => {
                        // 恢复能量
                        const ctx = context;
                        ctx.energy = Math.min(100, ctx.energy + dt * 10);
                    },
                    onExit: () => console.log('Player exits idle state'),
                })
                .addState({
                    name: 'moving',
                    onEnter: () => console.log('Player starts moving'),
                    onUpdate: (dt) => {
                        // 消耗能量
                        const ctx = context;
                        ctx.energy = Math.max(0, ctx.energy - dt * 5);
                    },
                    onExit: () => console.log('Player stops moving'),
                })
                .addState({
                    name: 'attacking',
                    onEnter: () => console.log('Player starts attacking'),
                    onExit: () => console.log('Player stops attacking'),
                })
                .addState({
                    name: 'dead',
                    onEnter: () => console.log('Player died'),
                    onExit: () => console.log('Player respawned'),
                })
                // 事件驱动的转换
                .addTransition({
                    from: 'idle',
                    to: 'moving',
                    event: 'move',
                })
                .addTransition({
                    from: 'moving',
                    to: 'idle',
                    event: 'stop',
                })
                .addTransition({
                    from: 'idle',
                    to: 'attacking',
                    event: 'attack',
                })
                .addTransition({
                    from: 'moving',
                    to: 'attacking',
                    event: 'attack',
                })
                .addTransition({
                    from: 'attacking',
                    to: 'idle',
                    event: 'attack_finish',
                })

                // 条件驱动的转换
                .addTransition({
                    from: '*',
                    to: 'dead',
                    condition: () => context.health <= 0,
                })
                .addTransition({
                    from: 'dead',
                    to: 'idle',
                    event: 'respawn',
                    condition: () => context.health > 0,
                })

                // 带守护条件的转换
                .addTransition({
                    from: 'idle',
                    to: 'attacking',
                    event: 'auto_attack',
                    condition: () => context.enemyNearby,
                    guard: () => context.hasWeapon && context.energy > 20,
                })
                .build()
        );
    }

    // =============================================================================
    // 测试用例2: 嵌套状态机 - AI行为树状态
    // =============================================================================

    function createAIBehaviorStateMachine(): StateMachine {
        // 创建巡逻子状态机
        const patrolSubStateMachine = new StateMachineBuilder('walking')
            .addState({
                name: 'walking',
                onEnter: () => console.log('  AI starts walking patrol'),
                onUpdate: (dt) => console.log(`  AI walking... ${dt}s`),
                onExit: () => console.log('  AI stops walking'),
            })
            .addState({
                name: 'waiting',
                onEnter: () => console.log('  AI waits at patrol point'),
                onUpdate: (dt) => console.log(`  AI waiting... ${dt}s`),
                onExit: () => console.log('  AI stops waiting'),
            })
            .addTransition({
                from: 'walking',
                to: 'waiting',
                event: 'reach_point',
            })
            .addTransition({
                from: 'waiting',
                to: 'walking',
                event: 'wait_complete',
            })
            .build();

        // 创建战斗子状态机
        const combatSubStateMachine = new StateMachineBuilder(
            'approaching',
        )
            .addState({
                name: 'approaching',
                onEnter: () => console.log('  AI approaches target'),
                onExit: () => console.log('  AI stops approaching'),
            })
            .addState({
                name: 'fighting',
                onEnter: () => console.log('  AI starts fighting'),
                onUpdate: (dt) => console.log(`  AI fighting... ${dt}s`),
                onExit: () => console.log('  AI stops fighting'),
            })
            .addState({
                name: 'retreating',
                onEnter: () => console.log('  AI retreats'),
                onExit: () => console.log('  AI stops retreating'),
            })
            .addTransition({
                from: 'approaching',
                to: 'fighting',
                event: 'in_range',
            })
            .addTransition({
                from: 'fighting',
                to: 'retreating',
                event: 'low_health',
            })
            .addTransition({
                from: 'retreating',
                to: 'approaching',
                event: 'health_recovered',
            })
            .build();

        // 主状态机
        return new StateMachineBuilder('patrol')
            .addState({
                name: 'patrol',
                onEnter: () => console.log('AI enters patrol mode'),
                onExit: () => console.log('AI exits patrol mode'),
                subStateMachine: patrolSubStateMachine,
            })
            .addState({
                name: 'combat',
                onEnter: () => console.log('AI enters combat mode'),
                onExit: () => console.log('AI exits combat mode'),
                subStateMachine: combatSubStateMachine,
            })
            .addState({
                name: 'alert',
                onEnter: () => console.log('AI becomes alert'),
                onUpdate: (dt) => console.log(`AI scanning... ${dt}s`),
                onExit: () => console.log('AI stops being alert'),
            })
            .addTransition({
                from: 'patrol',
                to: 'alert',
                event: 'suspicious_sound',
            })
            .addTransition({
                from: 'alert',
                to: 'patrol',
                event: 'all_clear',
            })
            .addTransition({
                from: 'alert',
                to: 'combat',
                event: 'enemy_spotted',
            })
            .addTransition({
                from: 'combat',
                to: 'patrol',
                event: 'enemy_defeated',
            })
            .build();
    }

    // =============================================================================
    // 测试用例3: 游戏场景状态管理
    // =============================================================================

    interface GameContext {
        score: number;
        lives: number;
        level: number;
        isPaused: boolean;
    }

    function createGameStateMachine(): StateMachine {
        const gameContext: GameContext = {
            score: 0,
            lives: 3,
            level: 1,
            isPaused: false,
        };

        return (
            new StateMachineBuilder('menu')
                .setContext(gameContext)
                .addState({
                    name: 'menu',
                    onEnter: () => console.log('Showing main menu'),
                    onExit: () => console.log('Hiding main menu'),
                })
                .addState({
                    name: 'playing',
                    onEnter: () =>
                        console.log(`Starting level ${gameContext.level}`),
                    onUpdate: (dt) => {
                        if (!gameContext.isPaused) {
                            gameContext.score += Math.floor(dt * 10);
                        }
                    },
                    onExit: () => console.log('Stopping gameplay'),
                })
                .addState({
                    name: 'paused',
                    onEnter: () => {
                        gameContext.isPaused = true;
                        console.log('Game paused');
                    },
                    onExit: () => {
                        gameContext.isPaused = false;
                        console.log('Game unpaused');
                    },
                })
                .addState({
                    name: 'game_over',
                    onEnter: () =>
                        console.log(
                            `Game Over! Final score: ${gameContext.score}`,
                        ),
                    onExit: () => console.log('Restarting game'),
                })
                .addState({
                    name: 'level_complete',
                    onEnter: () => {
                        gameContext.level++;
                        console.log(
                            `Level ${
                                gameContext.level - 1
                            } completed! Next level: ${gameContext.level}`,
                        );
                    },
                })
                // 转换定义
                .addTransition({
                    from: 'menu',
                    to: 'playing',
                    event: 'start_game',
                })
                .addTransition({
                    from: 'playing',
                    to: 'paused',
                    event: 'pause',
                })
                .addTransition({
                    from: 'paused',
                    to: 'playing',
                    event: 'resume',
                })
                .addTransition({
                    from: 'paused',
                    to: 'menu',
                    event: 'quit_to_menu',
                })
                .addTransition({
                    from: 'playing',
                    to: 'level_complete',
                    event: 'level_complete',
                })
                .addTransition({
                    from: 'level_complete',
                    to: 'playing',
                    event: 'next_level',
                })
                .addTransition({
                    from: 'playing',
                    to: 'game_over',
                    condition: () => gameContext.lives <= 0,
                })
                .addTransition({
                    from: 'game_over',
                    to: 'menu',
                    event: 'restart',
                })
                .build()
        );
    }

    // =============================================================================
    // 测试执行函数
    // =============================================================================

    /**
     * 测试基础状态机功能
     */
    function testBasicStateMachine(): void {
        console.log('=== Testing Basic State Machine ===');

        const playerSM = createPlayerStateMachine();
        const context = playerSM.getContext() as PlayerContext;

        console.log('Initial state:', playerSM.getCurrentState());

        // 测试事件驱动转换
        playerSM.sendEvent({ type: 'move' });
        console.log('After move event:', playerSM.getCurrentState());

        playerSM.sendEvent({ type: 'attack' });
        console.log('After attack event:', playerSM.getCurrentState());

        playerSM.sendEvent({ type: 'attack_finish' });
        console.log(
            'After attack_finish event:',
            playerSM.getCurrentState(),
        );

        // 测试条件驱动转换
        context.health = 0;
        playerSM.update(0.016); // 模拟游戏帧更新
        console.log('After health = 0:', playerSM.getCurrentState());

        // 测试复活
        context.health = 100;
        playerSM.sendEvent({ type: 'respawn' });
        console.log('After respawn:', playerSM.getCurrentState());

        // 测试守护条件
        context.enemyNearby = true;
        context.hasWeapon = true;
        context.energy = 50;
        playerSM.sendEvent({ type: 'auto_attack' });
        console.log(
            'After auto_attack (with weapon and energy):',
            playerSM.getCurrentState(),
        );

        console.log(
            'Possible transitions:',
            playerSM.getPossibleTransitions(),
        );
        console.log('');
    }

    /**
     * 测试嵌套状态机
     */
    function testNestedStateMachine(): void {
        console.log('=== Testing Nested State Machine ===');

        const aiSM = createAIBehaviorStateMachine();

        console.log('Initial state path:', aiSM.getCurrentStatePath());

        // 模拟AI行为
        aiSM.update(0.016);

        // 巡逻中的子状态转换
        const patrolState = aiSM.getContext();
        aiSM.sendEvent({ type: 'reach_point' });
        console.log('After reach_point:', aiSM.getCurrentStatePath());

        aiSM.sendEvent({ type: 'wait_complete' });
        console.log('After wait_complete:', aiSM.getCurrentStatePath());

        // 主状态转换
        aiSM.sendEvent({ type: 'suspicious_sound' });
        console.log('After suspicious_sound:', aiSM.getCurrentStatePath());

        aiSM.sendEvent({ type: 'enemy_spotted' });
        console.log('After enemy_spotted:', aiSM.getCurrentStatePath());

        // 战斗子状态转换
        aiSM.sendEvent({ type: 'in_range' });
        console.log('After in_range:', aiSM.getCurrentStatePath());

        aiSM.update(0.016);

        aiSM.sendEvent({ type: 'enemy_defeated' });
        console.log('After enemy_defeated:', aiSM.getCurrentStatePath());

        console.log('');
    }

    /**
     * 测试游戏状态管理
     */
    function testGameStateMachine(): void {
        console.log('=== Testing Game State Machine ===');

        const gameSM = createGameStateMachine();
        const context = gameSM.getContext() as GameContext;

        console.log('Initial state:', gameSM.getCurrentState());

        // 开始游戏
        gameSM.sendEvent({ type: 'start_game' });
        console.log('After start_game:', gameSM.getCurrentState());

        // 模拟游戏运行
        gameSM.update(1.0); // 1秒
        console.log('Score after 1 second:', context.score);

        // 暂停游戏
        gameSM.sendEvent({ type: 'pause' });
        console.log('After pause:', gameSM.getCurrentState());
        gameSM.update(1.0); // 暂停时分数不增加
        console.log('Score after pause:', context.score);

        // 继续游戏
        gameSM.sendEvent({ type: 'resume' });
        console.log('After resume:', gameSM.getCurrentState());

        // 完成关卡
        gameSM.sendEvent({ type: 'level_complete' });
        console.log('After level_complete:', gameSM.getCurrentState());
        console.log('Current level:', context.level);

        gameSM.sendEvent({ type: 'next_level' });
        console.log('After next_level:', gameSM.getCurrentState());

        // 测试游戏结束条件
        context.lives = 0;
        gameSM.update(0.016);
        console.log('After lives = 0:', gameSM.getCurrentState());

        console.log('');
    }

    /**
     * 测试事件监听器
     */
    function testEventListeners(): void {
        console.log('=== Testing Event Listeners ===');

        const sm = createPlayerStateMachine();

        // 添加事件监听器
        sm.addEventListener('move', (event) => {
            console.log('Event listener: Move event received', event);
        });

        sm.addEventListener('attack', (event) => {
            console.log('Event listener: Attack event received', event);
        });

        // 发送事件
        sm.sendEvent({
            type: 'move',
            data: { direction: 'north', speed: 5 },
        });
        sm.sendEvent({ type: 'attack', data: { damage: 25 } });

        console.log('');
    }

    /**
     * 运行所有测试
     */
    function runAllTests(): void {
        testBasicStateMachine();
        testNestedStateMachine();
        testGameStateMachine();
        testEventListeners();

        console.log('All tests completed!');
    }

    // 如果作为主模块运行，执行测试
    runAllTests();
})();
