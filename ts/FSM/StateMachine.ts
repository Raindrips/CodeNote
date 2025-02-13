export enum TransitionState {
    padding,
    success,
    error,
}

type STATE = number | string;

export interface ITransitionFn {
    (): TransitionState | void;
}

export interface ITransitionEvent {
    onUpdate(): void;
    onEnter(): TransitionState;
    onExit(): void;
}

export interface ITransition {
    from: STATE;
    event: string;
    to: STATE;
    transitionEvent?: ITransitionFn | ITransitionEvent;
}

export class StateMachine {
    protected transitionMap: { [key: STATE]: ITransition } = {};

    constructor(protected _current: STATE) {}

    addTransition(transition: ITransition) {
        this.transitionMap[transition.from] = transition;
    }

    /**发送事件 */
    emit(event: string) {
        if (!this.can(event)) {
            return false;
        }
        const transition = this.transitionMap[this._current];
        //TODO
        // transition.transitionEvent

        this._current = transition.to;
    }

    update(dt: number) {
        const transition = this.transitionMap[this._current];
        // if (
        //     transition.transitionEvent &&
        //     // transition.transitionEvent['']
        // ) {
        // }
    }

    can(event: string) {
        return this.transitionMap[this._current].event === event;
    }
}

function test() {
    const sfm = new StateMachine(0);
}

let a: ITransitionFn | ITransitionEvent;
a = function () {
    return;
};
