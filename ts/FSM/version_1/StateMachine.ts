namespace base_1 {
    export enum TransitionState {
        padding,
        success,
        error,
    }

    type STATE = number | string;

    export interface ITransitionFn {
        (trans: ITransition): void | Promise<void>;
    }

    export interface IStateEvent {
        onUpdate(dt: number): void;
        onEnter(): TransitionState;
        onExit(): void;
    }

    export interface ITransition {
        from: STATE;
        event: string;
        to: STATE;
        transitionEvent?: ITransitionFn;
    }
    export function Transition(
        from: STATE,
        event: string,
        to: STATE,
        transitionEvent?: ITransitionFn,
    ) {
        return {
            from,
            event,
            to,
            transitionEvent,
        };
    }

    export class StateMachine {
        protected transitionMap: {
            [key: string]: ITransition;
        } = {};

        constructor(
            protected _current: STATE,
            transitions: ITransition[] = [],
        ) {
            this.addTransitions(transitions);
        }

        addTransition(transition: ITransition) {
            this.transitionMap[this.getKey(transition)] = transition;
        }

        addTransitions(transitions: ITransition[]) {
            for (const trans of transitions) {
                this.addTransition(trans);
            }
        }

        /**发送事件 */
        async emit(event: string) {
            if (!this.can(event)) {
                return false;
            }
            const transition = this.transitionMap[this.getKeySelf(event)];
            this._current = transition.to;
            try {
                await transition.transitionEvent?.(transition);
            } catch (err) {
                console.warn('StateMachine.emit()', event, err);
                return false;
            }
            return true;
        }

        can(event: string) {
            if (this.transitionMap[this.getKeySelf(event)] !== undefined) {
                return true;
            }
            return false;
        }

        current(): STATE {
            return this._current;
        }

        private getKey(transition: ITransition) {
            return String(transition.from) + '_' + transition.event;
        }
        private getKeySelf(event: string) {
            return String(this._current) + '_' + event;
        }
    }

    function wait(time: number) {
        return new Promise<void>((r) => setTimeout(r, time));
    }

    function test() {
        const t = Transition;
        const sfm = new StateMachine('green', [
            t('green', 'error', 'red', () => {
                console.log('OnError green to red ');
            }),
            t('red', 'reset', 'green', async () => {
                await wait(2000);
                console.log('onReset red to green');
            }),
        ]);
        console.log('current', sfm.current());
        console.log('reset', sfm.emit('reset'));

        console.log('current', sfm.current());

        console.log('error');
        sfm.emit('error');

        console.log('current', sfm.current());
        console.log('emit reset');
        sfm.emit('reset');
        console.log('current', sfm.current());
    }

    test();
}
